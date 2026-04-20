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

// Sketchfab heart uses ONE shared material for all meshes but vertex colors (COLOR_0) for vessels + numbers.
// A single MeshStandardMaterial with vertexColors:false makes digits disappear — clone per mesh and enable vertexColors.

// ─── External model loader ───

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
}

function loadExternalModel(modelId, onComplete) {
    const config = modelConfig[modelId];
    if (!config || config.type !== 'external') {
        onComplete(null);
        return;
    }

    // Timeout: if model hasn't loaded in 120 s, show error + retry
    const TIMEOUT_MS = 120000;
    let timeoutId = setTimeout(() => {
        showLoadingError('Model is taking too long to load. Try refreshing the page.');
    }, TIMEOUT_MS);

    const loader = new THREE.GLTFLoader();
    loader.load(
        config.path,
        (gltf) => {
            clearTimeout(timeoutId);
            const model = gltf.scene;
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

            if (modelId === 'heart') {
                applyHeartVertexColorMaterials(model);
            }
            // UMCG glTF uses KHR_materials_pbrSpecularGlossiness; Three r128 often renders those as invisible/black.
            // Replace with Phong + vertex colors (COLOR_0 → geometry.attributes.color) so the mesh always draws.
            if (modelId === 'lungs') {
                applyLungUmcgSafeMaterials(model);
            }
            if (modelId === 'kidney') {
                applyKidneyConceptSafeMaterials(model);
            }
            // Liver GLTF has very dark PBR materials — replace with balanced Phong materials
            if (modelId === 'liver') {
                model.traverse((child) => {
                    if (!child.isMesh) return;
                    child.frustumCulled = false;
                    child.material = new THREE.MeshPhongMaterial({
                        color: 0x421C1C,
                        shininess: 10,
                        specular: 0x1a0a0a,
                        emissive: 0x050101,
                        side: THREE.DoubleSide
                    });
                });
            }
            // UMCG sagittal skull: same SpecGloss issue — replace with Phong + vertex colors
            if (modelId === 'skull') {
                model.traverse((child) => {
                    if (!child.isMesh) return;
                    child.frustumCulled = false;
                    const hasVertexColors = child.geometry && child.geometry.attributes && child.geometry.attributes.color;
                    child.material = new THREE.MeshPhongMaterial({
                        vertexColors: hasVertexColors,
                        color: hasVertexColors ? 0xffffff : 0xd4c4a8,
                        shininess: 20,
                        specular: 0x222222,
                        emissive: 0x0a0a08,
                        side: THREE.DoubleSide
                    });
                });
            }
            // IV Setup: very dark materials against dark background — boost brightness
            if (modelId === 'iv_setup') {
                model.traverse((child) => {
                    if (!child.isMesh) return;
                    child.frustumCulled = false;
                    if (child.material) {
                        const oldMat = child.material;
                        const baseColor = oldMat.color ? oldMat.color.clone() : new THREE.Color(0x888888);
                        // Lighten the color
                        baseColor.r = Math.min(1, baseColor.r * 1.6 + 0.15);
                        baseColor.g = Math.min(1, baseColor.g * 1.6 + 0.15);
                        baseColor.b = Math.min(1, baseColor.b * 1.6 + 0.15);
                        child.material = new THREE.MeshPhongMaterial({
                            color: baseColor,
                            shininess: 40,
                            specular: 0x333333,
                            emissive: new THREE.Color(baseColor.r * 0.1, baseColor.g * 0.1, baseColor.b * 0.1),
                            side: THREE.DoubleSide,
                            transparent: oldMat.transparent || false,
                            opacity: oldMat.opacity != null ? oldMat.opacity : 1.0
                        });
                    }
                });
            }

            // Tag all meshes with structure names and organ-part keys (tooltips + legend)
            model.traverse((child) => {
                if (child.isMesh) {
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
                }
            });

            if (modelId === 'brain') {
                buildBrainMeshRuntimeFromGltf(model);
            }

            if (modelId === 'lungs') {
                buildLungUmcgFromGltf(model);
                fitObjectToMaxDimension(model, 4);
            }

            if (modelId === 'kidney') {
                fitObjectToMaxDimension(model, 3.2);
                buildKidneyConceptAnnotations(model);
            }

            if (modelId === 'heart') {
                markHeartNumberLabelMeshes(model);
            }

            // Normalize size for newly added Sketchfab models
            const fitModels = {
                liver: 3.5, stomach: 3.5, eye: 3, tooth: 3.5, spine: 4, skin: 3.5,
                skull: 3.5, hip_joint: 3.5, knee_joint: 3.5, shoulder_joint: 3.5, hand: 3.5, foot: 3.5,
                pelvis: 3.5, muscular_system: 4, esophagus: 3.5, small_intestine: 3.5, large_intestine: 3.5,
                pancreas: 3.5, tongue: 3.5, larynx: 3.5, diaphragm: 3.5, bladder: 3.5, urinary_system: 3.5,
                adrenal_gland: 3.5, male_reproductive: 3.5, female_reproductive: 3.5, spinal_cord: 3.5,
                inner_ear: 3.5, thyroid: 3.5, pituitary: 3.5, lymph_node: 3.5, ear: 3.5,
                blood_cells: 3.5, human_cell: 3.5, dna: 3.5, iv_setup: 3.5, catheter: 3.5, gallbladder_organ: 3.5
            };
            if (fitModels[modelId]) {
                fitObjectToMaxDimension(model, fitModels[modelId]);
            }

            // Build mesh annotations for Sketchfab models (organPartKey, labels, hit markers)
            if (getMeshDetailsMap(modelId) && !['heart', 'lungs', 'kidney', 'brain'].includes(modelId)) {
                buildNewModelGltfAnnotations(model, modelId);
            }

            // Screen-space labels created in finalizeModelLoad for all models

            onComplete(model);
        },
        (progress) => {
            const loaded = progress.loaded || 0;
            const total = progress.total || 0;
            if (total > 0) {
                const pct = Math.round(loaded / total * 100);
                const mb = (loaded / 1048576).toFixed(1);
                const totalMb = (total / 1048576).toFixed(1);
                if (pct >= 100) {
                    setLoadingState('Processing 3D model…', 'Finalising geometry and materials — please wait');
                } else {
                    setLoadingState(`Loading 3D Model… ${pct}%`, `${mb} / ${totalMb} MB`);
                }
            } else {
                // No Content-Length — show bytes only
                const mb = (loaded / 1048576).toFixed(1);
                setLoadingState('Loading 3D Model…', `${mb} MB downloaded`);
            }
        },
        (error) => {
            clearTimeout(timeoutId);
            console.error('Error loading model:', error);
            showLoadingError('Could not load the 3D model file.');
            // Fall back to procedural shape so the viewer stays functional
            onComplete(createOrganGeometry(modelId, true));
        }
    );
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
        if (meshName.toLowerCase().includes(key)) {
            return modelMapping[key];
        }
    }
    return modelMapping.default || 'Structure';
}
