// ═══════════════════════════════════════════════════════
// loader.js — Model loading (GLTF, STL & procedural dispatch)
// ═══════════════════════════════════════════════════════

function createOrganGeometry(modelId, forceProcedural) {
    // Check if model should be loaded externally
    if (!forceProcedural && modelConfig[modelId] && (modelConfig[modelId].type === 'external' || modelConfig[modelId].type === 'stl')) {
        return null; // Will be loaded asynchronously
    }

    // Create procedural 3D models based on organ type
    let mesh;

    switch (modelId) {
        case 'heart':
            mesh = createHeart();
            break;
        case 'lungs':
            mesh = createLungs();
            break;
        case 'kidney':
            mesh = createKidney();
            break;
        case 'brain':
            mesh = createBrain();
            break;
        case 'syringe':
            mesh = createSyringe();
            break;
        case 'liver':
            mesh = createLiver();
            break;
        case 'stomach':
            mesh = createStomach();
            break;
        case 'eye':
            mesh = createEye();
            break;
        case 'tooth':
            mesh = createTooth();
            break;
        case 'spine':
            mesh = createSpine();
            break;
        case 'skin':
            mesh = createSkin();
            break;
        case 'neuron':
            mesh = createNeuron();
            break;
        default:
            const geometry = new THREE.SphereGeometry(1, 32, 32);
            const material = new THREE.MeshPhongMaterial({ color: 0xe63946 });
            mesh = new THREE.Mesh(geometry, material);
    }

    return mesh;
}

// Load external STL model
function loadSTLModel(modelId, onComplete) {
    const config = modelConfig[modelId];
    if (!config || config.type !== 'stl') {
        onComplete(null);
        return;
    }

    const loader = new THREE.STLLoader();
    loader.load(
        config.path,
        (geometry) => {
            const material = new THREE.MeshStandardMaterial({
                color: config.color || 0xe63946,
                roughness: 0.7,
                metalness: 0.1
            });
            const model = new THREE.Mesh(geometry, material);
            const sc = config.scale != null ? config.scale : 1;
            model.scale.set(sc, sc, sc);
            model.updateMatrixWorld(true);
            // Center in world space after scale (position.sub(geomCenter) is wrong when scale ≠ 1).
            const box = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            box.getCenter(center);
            model.position.sub(center);
            model.userData.structureName = 'Heart Structure';
            onComplete(model);
        },
        (progress) => {
            if (progress.total > 0) {
                const pct = Math.round(progress.loaded / progress.total * 100);
                const mb = (progress.loaded / 1048576).toFixed(1);
                const totalMb = (progress.total / 1048576).toFixed(1);
                if (pct >= 100) {
                    setLoadingState('Processing 3D model…', 'Finalising geometry — please wait');
                } else {
                    setLoadingState(`Loading 3D Model… ${pct}%`, `${mb} / ${totalMb} MB`);
                }
            }
        },
        (error) => {
            console.error('Error loading STL model:', error);
            showLoadingError('Could not load the 3D model file.');
            onComplete(createOrganGeometry(modelId, true));
        }
    );
}

// Sketchfab heart: ONE shared material but vertex colors (COLOR_0) for vessels + number labels.
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
    const dots = document.querySelector('.loading-dots');
    const retry = document.getElementById('loadingRetry');
    if (spinner) spinner.style.borderTopColor = '#e63946';
    if (dots) dots.style.display = 'none';
    if (retry) retry.classList.remove('hidden');
    setLoadingProgress('error');
}

// Update the CSS progress bar.
// pct: 0-100 = real fill %, -1 = shimmer (CSS-driven, survives JS blocking), 'error' = red full
function setLoadingProgress(pct) {
    const fill = document.getElementById('loadingProgressFill');
    if (!fill) return;
    if (pct === 'error') {
        fill.classList.remove('parsing');
        fill.classList.add('error');
        fill.style.width = '100%';
    } else if (pct < 0) {
        fill.classList.remove('error');
        fill.classList.add('parsing'); // CSS shimmer — runs on compositor, never freezes
        fill.style.width = '';
    } else {
        fill.classList.remove('parsing', 'error');
        fill.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }
}

// ─── In-memory parsed-scene cache ───
// Stores a clean clone of gltf.scene BEFORE any material overrides or
// annotation spheres are added.  On repeat loads we clone this instead
// of re-downloading and re-parsing the binary.
const _gltfRawCache = {};

// ─── Draco loader — initialised once, shared across all model loads ───
let _dracoLoader = null;
if (typeof THREE.DRACOLoader !== 'undefined') {
    _dracoLoader = new THREE.DRACOLoader();
    _dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    _dracoLoader.preload(); // fetch decoder WASM in background now
}

// ─── External GLTF loader ───

function loadExternalModel(modelId, onComplete) {
    const config = modelConfig[modelId];
    if (!config || config.type !== 'external') { onComplete(null); return; }

    // Reset progress bar for each load
    setLoadingProgress(0);

    // Cache hit — skip network + parse, just clone + process
    if (_gltfRawCache[modelId]) {
        setLoadingState('Loading from cache...', 'Cloning scene data...');
        setLoadingProgress(-1);
        requestAnimationFrame(() => {
            _processGltfScene(modelId, config, _gltfRawCache[modelId].clone(true), onComplete);
        });
        return;
    }

    // First load: download + Draco decode + build scene
    const TIMEOUT_MS = 120000;
    let timeoutId = setTimeout(() => {
        showLoadingError('Model is taking too long to load. Try refreshing the page.');
    }, TIMEOUT_MS);

    const loader = new THREE.GLTFLoader();
    if (_dracoLoader) loader.setDRACOLoader(_dracoLoader);

    loader.load(
        config.path,
        (gltf) => {
            clearTimeout(timeoutId);
            // Draco decode is complete by the time onLoad fires.
            // _processGltfScene will update text to 'Building scene...'.
            const rawScene = gltf.scene;
            _processGltfScene(modelId, config, rawScene.clone(true), (model) => {
                onComplete(model);
                // Store clean clone in background after first render
                setTimeout(() => { _gltfRawCache[modelId] = rawScene.clone(true); }, 200);
            });
        },
        (progress) => {
            const loaded = progress.loaded || 0;
            const total  = progress.total  || 0;
            if (total > 0) {
                const pct     = Math.min(100, Math.round(loaded / total * 100));
                const mb      = (loaded / 1048576).toFixed(1);
                const totalMb = (total  / 1048576).toFixed(1);
                if (pct >= 100) {
                    // Download done — Draco decode now running (JS blocks here).
                    // CSS shimmer keeps the UI visually active through this phase.
                    setLoadingState('Decoding geometry...', 'Decompressing 3D data — please wait...');
                    setLoadingProgress(-1);
                } else {
                    setLoadingState('Downloading model...  ' + pct + '%', mb + ' MB of ' + totalMb + ' MB');
                    setLoadingProgress(pct * 0.85); // 0-85% for download; 85-100% for decode+build
                }
            } else {
                // No Content-Length — show raw bytes
                const mb = (loaded / 1048576).toFixed(1);
                setLoadingState('Downloading model...', mb + ' MB downloaded');
                setLoadingProgress(-1);
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
    setLoadingState('Building scene...', 'Preparing materials \u0026 annotations...');
    setLoadingProgress(-1); // keep shimmer while materials/annotations are built
    if (modelId === 'lungs' || modelId === 'kidney') {
        model.scale.set(1, 1, 1);
    } else {
        const sc = config.scale != null ? config.scale : 1;
        model.scale.set(sc, sc, sc);
    }
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);
    model.position.sub(center);

    if (modelId === 'heart') applyHeartVertexColorMaterials(model);
    if (modelId === 'lungs') applyLungUmcgSafeMaterials(model);
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
                const oldKey = String(Number(mm[1]) - 2);
                const groupKey = HEART_PART_TO_GROUP[oldKey];
                if (groupKey && HEART_MESH_DETAILS[groupKey]) {
                    child.userData.organPartKey = groupKey;
                    child.userData.structureName = HEART_MESH_DETAILS[groupKey].title;
                }
            }
        } else if (modelId === 'kidney') {
            const kk = KIDNEY_GLTF_MESH_TO_KEY[child.name];
            if (kk) {
                child.userData.organPartKey = kk;
                child.userData.structureName = KIDNEY_MESH_DETAILS[kk].legendLabel;
            }
        }
    });

    if (modelId === 'brain') buildBrainMeshRuntimeFromGltf(model);
    if (modelId === 'lungs') { buildLungUmcgFromGltf(model); fitObjectToMaxDimension(model, 4); }
    if (modelId === 'kidney') { fitObjectToMaxDimension(model, 3.2); buildKidneyConceptAnnotations(model); }
    if (modelId === 'heart') markHeartNumberLabelMeshes(model);

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

    setLoadingProgress(100); // scene fully built
    onComplete(model);
}

// Map mesh names from GLTF to anatomical structures
function getStructureFromMeshName(meshName, modelId) {
    const mappings = {
        heart: {
            'ventricle': 'Left Ventricle',
            'atrium': 'Atrium',
            'aorta': 'Aorta',
            'default': 'Heart Structure'
        }
    };
    const modelMapping = mappings[modelId] || {};
    for (const key in modelMapping) {
        if (meshName.toLowerCase().includes(key)) return modelMapping[key];
    }
    return modelMapping.default || 'Structure';
}
