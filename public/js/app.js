// ═══════════════════════════════════════════════════════
// app.js — Application entry point, model loading & initialization
// ═══════════════════════════════════════════════════════
//
// ACCURACY DISPLAY SYSTEM
// ───────────────────────
// After each model loads, the annotation accuracy classification
// (mesh / custom / partial / approximate / none) is displayed in two ways:
//
// 1. Legend panel note (#annotationAccuracyNote) — small text below the
//    legend heading showing the mapping type and counts.
//
// 2. Viewer banner (#accuracyBanner) — only shown for 'approximate' models.
//    A dismissible floating banner informing the user that label positions
//    are approximate and intended for educational reference.
//
// See annotations.js header for full mapping type definitions.
//

function loadModel(modelId) {
    brainMeshDetailsRuntime = null;
    lungMeshDetailsRuntime = null;
    // Reset interaction mode when changing models
    if (currentInteractionMode !== 'explore') {
        switchMode('explore');
    }
    // Remove existing model
    if (organMesh) {
        clearHeartCss2DLabels();
        scene.remove(organMesh);
    }

    // Check if STL model
    if (modelConfig[modelId] && modelConfig[modelId].type === 'stl') {
        loadSTLModel(modelId, (model) => {
            if (model) {
                organMesh = model;
                scene.add(organMesh);
                finalizeModelLoad(modelId);
            } else {
                organMesh = createOrganGeometry(modelId, true);
                if (organMesh) scene.add(organMesh);
                finalizeModelLoad(modelId);
            }
        });
    }
    // Check if external GLTF model
    else if (modelConfig[modelId] && modelConfig[modelId].type === 'external') {
        loadExternalModel(modelId, (model) => {
            if (model) {
                organMesh = model;
                scene.add(organMesh);
                finalizeModelLoad(modelId);
            } else {
                organMesh = createOrganGeometry(modelId, true);
                if (organMesh) scene.add(organMesh);
                finalizeModelLoad(modelId);
            }
        });
    } else {
        // Create procedural model
        organMesh = createOrganGeometry(modelId);
        if (organMesh) scene.add(organMesh);
        finalizeModelLoad(modelId);
    }
}

function finalizeModelLoad(modelId) {
    try {
        _doFinalizeModelLoad(modelId);
    } catch (err) {
        console.error('finalizeModelLoad error:', err);
    } finally {
        // Always hide the loading overlay, even if post-processing throws
        const ov = document.getElementById('loadingOverlay');
        if (ov) ov.classList.add('hidden');
    }
}

function _doFinalizeModelLoad(modelId) {
    stopAutoRotate();
    resetOrbitView();

    // Update current model ID
    currentModelId = modelId;

    // Ensure annotationAccuracy is set for custom-path models that bypass
    // buildNewModelGltfAnnotations (heart, lungs, kidney, brain, syringe, neuron)
    if (organMesh && !organMesh.userData.annotationAccuracy) {
        const cfg = modelConfig[modelId];
        if (cfg && cfg.annotationPath === 'custom') {
            let dc = 0, ac = 0;
            organMesh.traverse((child) => {
                if (!child.isMesh) return;
                if (child.userData.isAnnotationHitMarker) ac++;
                else if (child.userData.organPartKey) dc++;
            });
            organMesh.userData.annotationAccuracy = 'custom';
            organMesh.userData.directMeshCount = dc;
            organMesh.userData.anchorCount = ac;
        }
    }

    // Update info panel
    const modelData = modelsData.find(m => m.id === modelId);
    if (modelData) {
        document.getElementById('infoTitle').textContent = modelData.name;
        const _peekName = document.getElementById('infoPeekName');
        if (_peekName) _peekName.textContent = modelData.name;
        const _peekBadge = document.getElementById('infoPeekBadge');
        if (_peekBadge) _peekBadge.textContent = modelData.keyStructures && modelData.keyStructures.length ? modelData.keyStructures.length + ' structures' : '';
        document.getElementById('infoDescription').textContent = modelData.description;
        document.getElementById('infoClinical').textContent = modelData.clinicalRelevance;

        const structuresGrid = document.getElementById('structuresGrid');
        structuresGrid.innerHTML = modelData.keyStructures.map(s =>
            `<div class="structure-item" onclick="onStructureClick('${s}')">${s}</div>`
        ).join('');

        const heartLegend = document.getElementById('heartMeshLegend');
        const heartScroll = document.getElementById('heartPartsScroll');
        const legendHeading = document.getElementById('organMeshLegendHeading');
        const legendNote = document.getElementById('organMeshLegendNote');
        const partMap = getMeshDetailsMap(modelId);
        const legendMeta = MESH_LEGEND_META[modelId];
        const cfg = modelConfig[modelId];
        const hidePartLegend = cfg && cfg.partLegend === false;
        if (!hidePartLegend && partMap && legendMeta && heartLegend && heartScroll && legendHeading && legendNote) {
            const keys = meshLegendKeys(modelId);
            if (keys.length === 0) {
                heartLegend.classList.add('hidden');
            } else {
                heartLegend.classList.remove('hidden');
                legendHeading.textContent = legendMeta.heading;
                legendNote.textContent = legendMeta.note;
                // Show annotation accuracy note
                const accNote = document.getElementById('annotationAccuracyNote');
                if (accNote && organMesh) {
                    const acc = organMesh.userData.annotationAccuracy;
                    if (acc === 'mesh') {
                        accNote.textContent = '\u2713 Labels attached to anatomical geometry';
                        accNote.style.display = '';
                    } else if (acc === 'custom') {
                        const dc = organMesh.userData.directMeshCount || 0;
                        const ac = organMesh.userData.anchorCount || 0;
                        accNote.textContent = '\u2713 Custom annotation mapping (' + dc + ' geometry + ' + ac + ' computed)';
                        accNote.style.display = '';
                    } else if (acc === 'partial') {
                        const dc = organMesh.userData.directMeshCount || 0;
                        const ac = organMesh.userData.anchorCount || 0;
                        accNote.textContent = '\u2713 ' + dc + '/' + (dc + ac) + ' labels on geometry; rest at computed positions';
                        accNote.style.display = '';
                    } else if (acc === 'approximate') {
                        accNote.textContent = '\u26A0 Labels at approximate positions for educational reference';
                        accNote.style.display = '';
                    } else {
                        accNote.style.display = 'none';
                    }
                    // Show/hide the educational accuracy banner for approximate/partial models
                    const banner = document.getElementById('accuracyBanner');
                    if (banner) {
                        if (acc === 'approximate') {
                            banner.style.display = '';
                        } else {
                            banner.style.display = 'none';
                        }
                    }
                }
                heartScroll.innerHTML = keys.map((k, idx) => {
                    const d = partMap[k];
                    let short = modelId === 'heart'
                        ? d.title.replace(/^Part \d+ — /, '')
                        : (d.legendLabel || d.title);
                    let colKey = k;
                    if (modelId === 'brain') {
                        const ann = brainSketchfabAnnotationNumber(k);
                        if (ann != null) {
                            colKey = '#' + ann;
                        }
                    } else if (modelId === 'lungs') {
                        const ann = lungUmcgAnnotationNumber(k);
                        if (ann != null) {
                            colKey = '#' + ann;
                            short = d.title.replace(/^Region \d+ — /, '') || short;
                        }
                    } else if (modelId === 'kidney') {
                        const ann = kidneyConceptAnnotationNumber(k);
                        if (ann != null) {
                            colKey = '#' + ann;
                            short = d.legendLabel || short;
                        }
                    } else if (['syringe', 'liver', 'stomach', 'eye', 'tooth', 'spine', 'skin'].includes(modelId) || getMeshDetailsMap(modelId)) {
                        colKey = '#' + (idx + 1);
                    }
                    return `<div class="structure-item organ-part-item" data-organ-part-key="${k}" role="button" tabindex="0"><strong>${colKey}</strong> — ${short}</div>`;
                }).join('');
                heartScroll.querySelectorAll('.organ-part-item').forEach((el) => {
                    const k = el.getAttribute('data-organ-part-key');
                    el.addEventListener('click', () => onOrganPartClick(k));
                    el.addEventListener('keydown', (ev) => {
                        if (ev.key === 'Enter' || ev.key === ' ') {
                            ev.preventDefault();
                            onOrganPartClick(k);
                        }
                    });
                });
            }
        } else if (heartLegend) {
            heartLegend.classList.add('hidden');
            // Also hide accuracy banner when no legend panel
            const banner = document.getElementById('accuracyBanner');
            if (banner) banner.style.display = 'none';
        }
    }

    // Hide any open tooltip
    hideTooltip();

    // Show interaction hint
    showInteractionHint();

    // Update active card in grid panel & trigger button
    document.querySelectorAll('.model-card').forEach(card => {
        card.classList.toggle('active', card.dataset.model === modelId);
    });
    // Update trigger button
    const modelData2 = modelsData.find(m => m.id === modelId);
    if (modelData2) {
        const te = document.getElementById('triggerEmoji');
        const tn = document.getElementById('triggerName');
        if (te) te.textContent = organEmojis[modelId] || '🔬';
        if (tn) tn.textContent = modelData2.name;
    }

    // Hide loading
    document.getElementById('loadingOverlay').classList.add('hidden');

    // Create screen-space labels for all models with collision avoidance
    if (organMesh) {
        addScreenSpaceLabels(organMesh, modelId);
    }

    updateHeartLabelsToggleVisibility();
}  // end _doFinalizeModelLoad

// ====== MODE SYSTEM CORE ======

/** Get the world-space center of a mesh matching the given organPartKey */

// ─── Helpers ───

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || window.innerWidth <= 768;
}

// Model panel open/close
function toggleModelPanel() {
    const overlay = document.getElementById('modelOverlay');
    const trigger = document.getElementById('modelTrigger');
    const isOpen = overlay.classList.contains('open');
    overlay.classList.toggle('open', !isOpen);
    trigger.classList.toggle('open', !isOpen);
}
function closeModelPanel() {
    document.getElementById('modelOverlay').classList.remove('open');
    document.getElementById('modelTrigger').classList.remove('open');
}
function openModelPanel() {
    document.getElementById('modelOverlay').classList.add('open');
    document.getElementById('modelTrigger').classList.add('open');
}

// ─── Initialization ───

async function init() {
    // Info panel is now a bottom sheet — always visible (collapsed by default).
    // Restore expanded state from preference.
    const _savedPref = (() => { try { return localStorage.getItem('infoPanelVisible'); } catch (e) { return null; } })();
    const _panel = document.getElementById('infoPanel');
    const _tbtn = document.getElementById('toggleInfo');
    const _mobile = isMobileDevice();
    // Always show the peek strip; only restore expanded if pref was set
    _panel.classList.remove('hidden');
    const _panelExpanded = _savedPref === '1' || (_savedPref == null && !_mobile);
    if (_panelExpanded) {
        _panel.classList.add('expanded');
    } else {
        _panel.classList.remove('expanded');
    }
    if (_tbtn) {
        _tbtn.classList.remove('panel-open');
        _tbtn.title = 'Hide information panel';
    }
    document.body.classList.remove('panel-open');
    viewOffsetTarget = 0;
    viewOffsetCurrent = 0;

    // Load models data
    try {
        // Wire up accuracy banner dismiss button
        const _bannerClose = document.getElementById('accuracyBannerClose');
        if (_bannerClose) {
            _bannerClose.addEventListener('click', () => {
                const b = document.getElementById('accuracyBanner');
                if (b) b.style.display = 'none';
            });
        }

        const response = await fetch('/api/models');
        modelsData = await response.json();

        // Model categories for the grid panel
        const MODEL_CATEGORIES = {
            'Head & Neck': ['skull', 'brain', 'eye', 'tooth', 'ear', 'inner_ear', 'tongue', 'larynx', 'thyroid', 'pituitary'],
            'Chest & Spine': ['heart', 'lungs', 'spine', 'spinal_cord', 'diaphragm'],
            'Abdomen & Organs': ['esophagus', 'liver', 'stomach', 'pancreas', 'gallbladder_organ', 'kidney', 'adrenal_gland', 'small_intestine', 'large_intestine'],
            'Pelvis & Urinary': ['bladder', 'urinary_system', 'male_reproductive', 'female_reproductive', 'pelvis'],
            'Musculoskeletal': ['shoulder_joint', 'hip_joint', 'knee_joint', 'foot', 'hand', 'muscular_system', 'skin'],
            'Cells & Equipment': ['blood_cells', 'human_cell', 'dna', 'lymph_node', 'neuron', 'syringe', 'iv_setup', 'catheter']
        };
        const modelMap = {};
        modelsData.forEach(m => { modelMap[m.id] = m; });

        // Populate categorized grid panel
        const catContainer = document.getElementById('modelCategories');
        let catHTML = '';
        for (const [catName, ids] of Object.entries(MODEL_CATEGORIES)) {
            const available = ids.filter(id => modelMap[id]);
            if (!available.length) continue;
            catHTML += `<div class="model-category">
                <div class="model-category-label">${catName}</div>
                <div class="model-grid">
                    ${available.map(id => {
                const m = modelMap[id];
                const shortName = m.name.replace(/Reproductive System$/, 'Reproductive');
                return `<div class="model-card" data-model="${id}">
                            <span class="card-emoji">${organEmojis[id] || '🔬'}</span>
                            ${shortName}
                        </div>`;
            }).join('')}
                </div>
            </div>`;
        }
        catContainer.innerHTML = catHTML;

        // Add click handlers to cards
        document.querySelectorAll('.model-card').forEach(card => {
            card.addEventListener('click', () => {
                closeModelPanel();
                document.getElementById('loadingOverlay').classList.remove('hidden');
                setTimeout(() => loadModel(card.dataset.model), 100);
            });
        });

        // Escape key closes panel
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModelPanel();
        });

        // Check URL params for initial model (default to first model in list)
        const urlParams = new URLSearchParams(window.location.search);
        const DEFAULT_MODEL = 'skull';
        const rawModel = urlParams.get('model') || '';
        const isValidModel = rawModel && modelConfig[rawModel];
        let initialModel;

        if (!rawModel) {
            // No param at all — use default silently
            initialModel = DEFAULT_MODEL;
        } else if (!isValidModel) {
            // Invalid param — show message, redirect to default after brief delay
            initialModel = DEFAULT_MODEL;
            const lt = document.getElementById('loadingText');
            const ls = document.getElementById('loadingSub');
            if (lt) lt.textContent = 'Model not found';
            if (ls) ls.textContent = `"${rawModel}" is not a valid model. Loading default…`;
            // Clean the URL so the bad param doesn't linger
            history.replaceState({}, '', `${window.location.pathname}?model=${DEFAULT_MODEL}`);
            // Brief pause so the user sees the message (800ms), then proceed
            await new Promise(resolve => setTimeout(resolve, 800));
        } else {
            initialModel = rawModel;
        }

        // Initialize scene and load first model
        initScene();
        applyCameraViewOffset();  // apply initial panel offset
        loadModel(initialModel);

    } catch (error) {
        console.error('Failed to initialize:', error);
        document.getElementById('loadingOverlay').innerHTML = `
            <p style="color: white;">Failed to load. Please refresh the page.</p>
        `;
    }
}

// Handle structure click from info panel
function onStructureClick(structureName) {
    if (!structureInfo[currentModelId] || !structureInfo[currentModelId][structureName]) {
        return;
    }

    document.querySelectorAll('.organ-part-item').forEach((item) => item.classList.remove('highlighted'));

    // Show tooltip at center of screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    showTooltip(structureName, centerX - 150, centerY - 100);

    // Highlight the structure
    highlightStructure(structureName);

    stopAutoRotate();
}

// Show interaction hint
function showInteractionHint() {
    // Remove any existing hint
    const existingHint = document.querySelector('.interaction-hint');
    if (existingHint) {
        existingHint.remove();
    }

    // Create new hint
    const hint = document.createElement('div');
    hint.className = 'interaction-hint';
    hint.textContent = '👆 Click on structures to learn more!';
    document.body.appendChild(hint);

    // Remove after animation
    setTimeout(() => {
        if (hint.parentNode) {
            hint.remove();
        }
    }, 3000);
}

// Start
init();
