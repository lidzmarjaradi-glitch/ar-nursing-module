// One-time script: rewrites loader.js with in-memory model cache
const fs = require('fs');
const path = require('path');

const loaderPath = path.join(__dirname, '..', 'public', 'js', 'loader.js');
const src = fs.readFileSync(loaderPath, 'utf8');

// Keep everything up to (not including) the Sketchfab comment
const MARKER = '// Sketchfab heart uses ONE shared material';
const markerIdx = src.indexOf(MARKER);
if (markerIdx === -1) { console.error('Marker not found - loader.js may already be fixed'); process.exit(1); }

const head = src.substring(0, markerIdx);

const tail = `// Sketchfab heart: ONE shared material but vertex colors (COLOR_0) for vessels + number labels.
// Clone per mesh and enable vertexColors so digit meshes stay visible.

// ─── Loading state helpers ───

function setLoadingState(text, sub) {
    const lt = document.getElementById('loadingText');
    const ls = document.getElementById('loadingSub');
    if (lt) lt.textContent = text;
    if (ls) ls.textContent = sub || '';
}

function showLoadingError(msg) {
    setLoadingState('Failed to load model', msg || 'Check your connection and retry.');
    const spinner = document.getElementById('loadingSpinner');
    const dots   = document.querySelector('.loading-dots');
    const retry  = document.getElementById('loadingRetry');
    if (spinner) spinner.style.borderTopColor = '#e63946';
    if (dots)   dots.style.display = 'none';
    if (retry)  retry.classList.remove('hidden');
}

// ─── In-memory parsed-scene cache ───
// Stores a clean clone of gltf.scene BEFORE any material overrides or
// annotation spheres are added.  On repeat loads we clone this instead
// of re-downloading and re-parsing the binary.
const _gltfRawCache = {};

// ─── External GLTF loader ───

function loadExternalModel(modelId, onComplete) {
    const config = modelConfig[modelId];
    if (!config || config.type !== 'external') { onComplete(null); return; }

    // Cache hit — skip network + parse, just clone + process
    if (_gltfRawCache[modelId]) {
        setLoadingState('Loading 3D Model...', 'Preparing from cache...');
        // One rAF so the overlay text paints before the CPU-heavy clone
        requestAnimationFrame(() => {
            _processGltfScene(modelId, config, _gltfRawCache[modelId].clone(true), onComplete);
        });
        return;
    }

    // First load: download + parse
    const TIMEOUT_MS = 120000;
    let timeoutId = setTimeout(() => {
        showLoadingError('Model is taking too long to load. Try refreshing the page.');
    }, TIMEOUT_MS);

    const loader = new THREE.GLTFLoader();
    loader.load(
        config.path,
        (gltf) => {
            clearTimeout(timeoutId);
            // Cache raw scene before ANY mutations
            _gltfRawCache[modelId] = gltf.scene.clone(true);
            _processGltfScene(modelId, config, gltf.scene, onComplete);
        },
        (progress) => {
            const loaded = progress.loaded || 0;
            const total  = progress.total  || 0;
            if (total > 0) {
                const pct     = Math.round(loaded / total * 100);
                const mb      = (loaded / 1048576).toFixed(1);
                const totalMb = (total  / 1048576).toFixed(1);
                if (pct >= 100) {
                    setLoadingState('Processing 3D model...', 'Finalising geometry and materials - please wait');
                } else {
                    setLoadingState('Loading 3D Model... ' + pct + '%', mb + ' / ' + totalMb + ' MB');
                }
            } else {
                setLoadingState('Loading 3D Model...', (loaded / 1048576).toFixed(1) + ' MB downloaded');
            }
        },
        (error) => {
            clearTimeout(timeoutId);
            console.error('Error loading model:', error);
            showLoadingError('Could not load the 3D model file.');
            onComplete(createOrganGeometry(modelId, true));
        }
    );
}

// ─── Post-download scene processing ───
// Takes a raw (or cloned-raw) THREE.Group and applies:
//   material overrides, userData tags, annotation builders, size normalisation.
function _processGltfScene(modelId, config, model, onComplete) {
    if (modelId === 'lungs' || modelId === 'kidney') {
        model.scale.set(1, 1, 1);
    } else {
        const sc = config.scale != null ? config.scale : 1;
        model.scale.set(sc, sc, sc);
    }
    model.updateMatrixWorld(true);
    const box    = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);
    model.position.sub(center);

    if (modelId === 'heart')  applyHeartVertexColorMaterials(model);
    if (modelId === 'lungs')  applyLungUmcgSafeMaterials(model);
    if (modelId === 'kidney') applyKidneyConceptSafeMaterials(model);

    if (modelId === 'liver') {
        model.traverse((child) => {
            if (!child.isMesh) return;
            child.frustumCulled = false;
            child.material = new THREE.MeshPhongMaterial({
                color: 0x421C1C, shininess: 10, specular: 0x1a0a0a,
                emissive: 0x050101, side: THREE.DoubleSide
            });
        });
    }
    if (modelId === 'skull') {
        model.traverse((child) => {
            if (!child.isMesh) return;
            child.frustumCulled = false;
            const hasVC = child.geometry && child.geometry.attributes && child.geometry.attributes.color;
            child.material = new THREE.MeshPhongMaterial({
                vertexColors: hasVC, color: hasVC ? 0xffffff : 0xd4c4a8,
                shininess: 20, specular: 0x222222, emissive: 0x0a0a08, side: THREE.DoubleSide
            });
        });
    }
    if (modelId === 'iv_setup') {
        model.traverse((child) => {
            if (!child.isMesh || !child.material) return;
            child.frustumCulled = false;
            const oldMat = child.material;
            const bc = oldMat.color ? oldMat.color.clone() : new THREE.Color(0x888888);
            bc.r = Math.min(1, bc.r * 1.6 + 0.15);
            bc.g = Math.min(1, bc.g * 1.6 + 0.15);
            bc.b = Math.min(1, bc.b * 1.6 + 0.15);
            child.material = new THREE.MeshPhongMaterial({
                color: bc, shininess: 40, specular: 0x333333,
                emissive: new THREE.Color(bc.r * 0.1, bc.g * 0.1, bc.b * 0.1),
                side: THREE.DoubleSide,
                transparent: oldMat.transparent || false,
                opacity: oldMat.opacity != null ? oldMat.opacity : 1.0
            });
        });
    }

    // Tag meshes with structure names and organ-part keys
    model.traverse((child) => {
        if (!child.isMesh) return;
        child.userData.structureName = getStructureFromMeshName(child.name, modelId);
        if (modelId === 'heart') {
            const mm = /^Object_(\d+)$/.exec(child.name);
            if (mm) {
                const oldKey  = String(Number(mm[1]) - 2);
                const groupKey = HEART_PART_TO_GROUP[oldKey];
                if (groupKey && HEART_MESH_DETAILS[groupKey]) {
                    child.userData.organPartKey   = groupKey;
                    child.userData.structureName  = HEART_MESH_DETAILS[groupKey].title;
                }
            }
        } else if (modelId === 'kidney') {
            const kk = KIDNEY_GLTF_MESH_TO_KEY[child.name];
            if (kk) {
                child.userData.organPartKey  = kk;
                child.userData.structureName = KIDNEY_MESH_DETAILS[kk].legendLabel;
            }
        }
    });

    if (modelId === 'brain')  buildBrainMeshRuntimeFromGltf(model);
    if (modelId === 'lungs')  { buildLungUmcgFromGltf(model); fitObjectToMaxDimension(model, 4); }
    if (modelId === 'kidney') { fitObjectToMaxDimension(model, 3.2); buildKidneyConceptAnnotations(model); }
    if (modelId === 'heart')  markHeartNumberLabelMeshes(model);

    const fitModels = {
        liver: 3.5, stomach: 3.5, eye: 3, tooth: 3.5, spine: 4, skin: 3.5,
        skull: 3.5, hip_joint: 3.5, knee_joint: 3.5, shoulder_joint: 3.5, hand: 3.5, foot: 3.5,
        pelvis: 3.5, muscular_system: 4, esophagus: 3.5, small_intestine: 3.5, large_intestine: 3.5,
        pancreas: 3.5, tongue: 3.5, larynx: 3.5, diaphragm: 3.5, bladder: 3.5, urinary_system: 3.5,
        adrenal_gland: 3.5, male_reproductive: 3.5, female_reproductive: 3.5, spinal_cord: 3.5,
        inner_ear: 3.5, thyroid: 3.5, pituitary: 3.5, lymph_node: 3.5, ear: 3.5,
        blood_cells: 3.5, human_cell: 3.5, dna: 3.5, iv_setup: 3.5, catheter: 3.5, gallbladder_organ: 3.5
    };
    if (fitModels[modelId]) fitObjectToMaxDimension(model, fitModels[modelId]);

    if (getMeshDetailsMap(modelId) && !['heart', 'lungs', 'kidney', 'brain'].includes(modelId)) {
        buildNewModelGltfAnnotations(model, modelId);
    }

    onComplete(model);
}

// Map mesh names from GLTF to anatomical structures
function getStructureFromMeshName(meshName, modelId) {
    const mappings = {
        heart: {
            'ventricle': 'Left Ventricle',
            'atrium':    'Atrium',
            'aorta':     'Aorta',
            'default':   'Heart Structure'
        }
    };
    const modelMapping = mappings[modelId] || {};
    for (const key in modelMapping) {
        if (meshName.toLowerCase().includes(key)) return modelMapping[key];
    }
    return modelMapping.default || 'Structure';
}
`;

fs.writeFileSync(loaderPath, head + tail, 'utf8');

const verify = fs.readFileSync(loaderPath, 'utf8');
console.log('Lines:', verify.split('\n').length);
console.log('Has _gltfRawCache:', verify.includes('_gltfRawCache'));
console.log('Has _processGltfScene:', verify.includes('function _processGltfScene'));
console.log('Has duplicate inline code:', verify.includes('_processGltfScene(modelId, config, gltf.scene, onComplete);\n            if (modelId'));
console.log('Done.');
