// ═══════════════════════════════════════════════════════
// controls.js — User interaction, click handlers & highlighting
// ═══════════════════════════════════════════════════════

// ─── Highlight performance cache ──────────────────────────────────────────────
// new THREE.EdgesGeometry(mesh.geometry, 30) on complex meshes takes 100–1000ms.
// Cache the EdgesGeometry + LineSegments per mesh UUID so they are built ONCE
// per model load, then re-attached/detached on every subsequent highlight call.
// Cleared and disposed in clearHighlightCaches() when a new model loads.
const _highlightCache = new Map();  // meshUUID → { edges: EdgesGeometry, outline: LineSegments }
let _highlightLineMat = null;        // one shared LineBasicMaterial for all outlines
let _highlightRingGeo = null;        // cached RingGeometry (model-independent)
let _highlightRingMat = null;        // cached ring MeshBasicMaterial

// Tracked highlighted DOM elements — lets removeHighlight skip querySelectorAll.
let _highlightedStructureItems = [];  // .structure-item elements that have .highlighted
let _highlightedOrganPartItems = [];  // .organ-part-item elements that have .highlighted
// Version counter — incremented by removeHighlight so pending rAF outline builds
// can detect that the highlight has already been cleared and abort.
let _highlightVersion = 0;

/** Dispose all cached highlight geometries. Must be called before removing organMesh from scene. */
function clearHighlightCaches() {
    // Detach any active outlines so their parent pointers are gone before disposal
    highlightOutlines.forEach(o => { if (o.parent) o.parent.remove(o); });
    highlightOutlines = [];
    _highlightCache.forEach(({ edges }) => { if (edges) edges.dispose(); });
    _highlightCache.clear();
    _highlightedStructureItems = [];
    _highlightedOrganPartItems = [];
}

/**
 * Pre-warm the EdgesGeometry cache for every annotated mesh in the current model.
 * Runs mesh-by-mesh with setTimeout(0) between each so it never blocks the main thread.
 * Called 500ms after finalizeModelLoad so the viewer is already interactive.
 */
function prewarmHighlightCacheAsync() {
    if (!organMesh) return;
    if (!_highlightLineMat) {
        _highlightLineMat = new THREE.LineBasicMaterial({
            color: 0x00ffcc, linewidth: 1, transparent: true, opacity: 0.7, depthTest: true
        });
    }
    const meshes = [];
    organMesh.traverse((child) => {
        if (child.isMesh && child.userData.organPartKey && !_highlightCache.has(child.uuid)) {
            meshes.push(child);
        }
    });
    if (meshes.length === 0) return;
    let i = 0;
    function buildNext() {
        if (i >= meshes.length) return;
        const child = meshes[i++];
        if (_highlightCache.has(child.uuid)) { setTimeout(buildNext, 0); return; }
        const edges = new THREE.EdgesGeometry(child.geometry, 30);
        const outline = new THREE.LineSegments(edges, _highlightLineMat);
        outline.position.copy(child.position);
        outline.rotation.copy(child.rotation);
        outline.scale.copy(child.scale);
        outline.updateMatrix();
        outline.matrixAutoUpdate = false;
        outline.matrix.copy(child.matrix);
        outline.matrixWorld.copy(child.matrixWorld);
        _highlightCache.set(child.uuid, { edges, outline });
        setTimeout(buildNext, 0);
    }
    setTimeout(buildNext, 500);
}

function setupControls() {
    const canvas = renderer.domElement;

    canvas.addEventListener('pointerdown', (e) => {
        if (e.button === 0) {
            orbitClickStart = { x: e.clientX, y: e.clientY };
        }
    });
    canvas.addEventListener('pointercancel', () => { orbitClickStart = null; });
    window.addEventListener('blur', () => { orbitClickStart = null; });

    canvas.addEventListener('pointermove', (e) => {
        if (!organMesh) return;
        if (e.pointerType === 'touch') return;  // no hover on touch — saves CPU
        if (e.buttons & 1) return;
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(organMesh, true);
        canvas.style.cursor = intersects.length > 0 ? 'pointer' : 'grab';
    });

    canvas.addEventListener('wheel', () => stopAutoRotate(), { passive: true });

    document.getElementById('autoRotate').addEventListener('click', () => {
        isAutoRotating = !isAutoRotating;
        document.getElementById('autoRotate').classList.toggle('active', isAutoRotating);
        if (orbitControls) orbitControls.autoRotate = isAutoRotating;
    });

    document.getElementById('resetView').addEventListener('click', () => {
        resetOrbitView();
    });

    document.getElementById('zoomIn').addEventListener('click', () => dollyOrbitCamera(true));

    document.getElementById('zoomOut').addEventListener('click', () => dollyOrbitCamera(false));

    document.getElementById('toggleHeartLabels').addEventListener('click', () => {
        setHeartNumberLabelsVisible(!heartNumberLabelsVisible);
    });

    // Toggle info panel (desktop + mobile, with localStorage)
    const _toggleInfoBtn = document.getElementById('toggleInfo');
    const _infoPanel = document.getElementById('infoPanel');
    _toggleInfoBtn.addEventListener('click', () => {
        // Block toggling info panel while quiz is active and not finished
        if (currentInteractionMode === 'quiz' && !quizFinished) return;
        const willShow = _infoPanel.classList.contains('hidden');
        setInfoPanelVisible(willShow, true);
    });

    canvas.addEventListener('click', (e) => {
        if (!organMesh) return;
        const start = orbitClickStart;
        orbitClickStart = null;
        if (start) {
            const d = Math.hypot(e.clientX - start.x, e.clientY - start.y);
            if (d > 10) return;
        }
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(organMesh, true);
        if (intersects.length > 0) {
            const pick = currentModelId === 'kidney'
                ? resolveKidneyClickTarget(intersects)
                : intersects[0].object;
            handleObjectClick(pick, e);
        }
    });
}

/** Prefer kidney annotation spheres; if ray hits organ surface first, snap to nearest callout (same 3D anchor as CSS2D label). */
function resolveKidneyClickTarget(intersects) {
    if (!intersects || !intersects.length || !organMesh) return intersects[0].object;
    const annHit = intersects.find((h) => {
        const pk = h.object.userData && h.object.userData.organPartKey;
        return pk && /^kid_ann_/.test(pk);
    });
    if (annHit) return annHit.object;

    const pt = intersects[0].point;
    organMesh.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(organMesh);
    const sz = new THREE.Vector3();
    box.getSize(sz);
    const maxSnap = Math.max(sz.x, sz.y, sz.z) * 0.32;

    let best = null;
    let bestD = Infinity;
    organMesh.traverse((ch) => {
        if (!ch.isMesh || !ch.userData || !ch.userData.isKidneyHitMarker) return;
        const pk = ch.userData.organPartKey;
        if (!pk || !/^kid_ann_/.test(pk)) return;
        ch.updateMatrixWorld(true);
        const w = new THREE.Vector3();
        ch.getWorldPosition(w);
        const d = w.distanceTo(pt);
        if (d < bestD) {
            bestD = d;
            best = ch;
        }
    });
    if (best && bestD <= maxSnap) return best;
    return intersects[0].object;
}

// Handle clicks on 3D objects
function handleObjectClick(object, event) {
    const partMap = getMeshDetailsMap(currentModelId);
    const pk = object.userData.organPartKey;

    // Quiz mode: intercept clicks to check answer
    if (currentInteractionMode === 'quiz' && quizAwaitingClick && !quizAnswered) {
        if (partMap && pk != null && partMap[pk]) {
            handleQuizClick(pk);
        }
        return;
    }

    // Guided mode: clicking is informational only, don't show tooltip
    if (currentInteractionMode === 'guided') return;

    if (partMap && pk != null && partMap[pk]) {
        showOrganPartTooltip(pk, event.clientX, event.clientY);
        highlightOrganPartByKey(pk);
        stopAutoRotate();
        return;
    }

    const structureName = object.userData.structureName || getStructureNameFromPosition(object);

    if (structureName && structureInfo[currentModelId] && structureInfo[currentModelId][structureName]) {
        showTooltip(structureName, event.clientX, event.clientY);
        highlightStructure(structureName);
        stopAutoRotate();
    }
}

function showOrganPartTooltip(meshKey, x, y) {
    const map = getMeshDetailsMap(currentModelId);
    const d = map && map[meshKey];
    if (!d) return;
    const tooltip = document.getElementById('interactiveTooltip');
    document.getElementById('tooltipHeader').textContent = d.title;
    document.getElementById('tooltipContent').textContent = d.detail;
    tooltip.style.left = Math.min(x + 20, window.innerWidth - 320) + 'px';
    tooltip.style.top = Math.min(y + 20, window.innerHeight - 200) + 'px';
    tooltip.classList.add('visible');
    currentTooltipStructure = 'ORGAN_PART_' + currentModelId + '_' + meshKey;
    highlightOrganLegendItem(meshKey);
}

function highlightOrganLegendItem(meshKey) {
    // Clear previously tracked items — avoids querySelectorAll in removeHighlight
    _highlightedOrganPartItems.forEach(el => el.classList.remove('highlighted'));
    _highlightedOrganPartItems = [];
    document.querySelectorAll('.organ-part-item').forEach((el) => {
        if (el.getAttribute('data-organ-part-key') === meshKey) {
            el.classList.add('highlighted');
            _highlightedOrganPartItems.push(el);
        }
    });
    // Use cached heartScreenLabelEntries instead of querySelectorAll('.heart-screen-label')
    heartScreenLabelEntries.forEach(e => {
        if (e.labelEl) e.labelEl.classList.toggle('active', e.key === String(meshKey));
    });
}

function highlightOrganPartByKey(meshKey) {
    removeHighlight();
    if (!organMesh) return;
    if (!_highlightLineMat) {
        _highlightLineMat = new THREE.LineBasicMaterial({
            color: 0x00ffcc, linewidth: 1, transparent: true, opacity: 0.7, depthTest: true
        });
    }

    // Capture the version AFTER removeHighlight incremented it.
    // If removeHighlight is called again before the deferred rAF fires,
    // the version will differ and the rAF will abort without touching the scene.
    const myVersion = _highlightVersion;

    let highlightBB = new THREE.Box3();
    let hasHighlight = false;
    const deferredChildren = []; // meshes whose EdgesGeometry isn't cached yet

    organMesh.traverse((child) => {
        if (!child.isMesh || child.userData.organPartKey !== meshKey) return;

        // Clone shared materials before mutating — prevents one highlight from
        // corrupting every other mesh that shares the same material instance.
        if (Array.isArray(child.material)) {
            child.material = child.material.map(m => {
                if (m && !m.userData._isHighlightClone) {
                    const c = m.clone();
                    c.userData._isHighlightClone = true;
                    c.userData._originalMaterial = m;
                    return c;
                }
                return m;
            });
        } else if (child.material && !child.material.userData._isHighlightClone) {
            const orig = child.material;
            const c = orig.clone();
            c.userData._isHighlightClone = true;
            c.userData._originalMaterial = orig;
            child.material = c;
        }

        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
            if (mat && mat.emissive) {
                // Save original emissive so removeHighlight can restore it (not zero it)
                if (mat.userData._savedEmissiveColor === undefined) {
                    mat.userData._savedEmissiveColor = mat.emissive.getHex();
                    mat.userData._savedEmissiveIntensity = mat.emissiveIntensity;
                }
                // Use .set() — never replace the Color object reference
                mat.emissive.set(0x2a9d8f);
                mat.emissiveIntensity = 0.45;
                mat.needsUpdate = true;
            } else if (mat && child.userData.isAnnotationHitMarker) {
                // Anchor sphere: make semi-visible with highlight color
                if (mat.userData._savedColor === undefined) {
                    mat.userData._savedColor = mat.color.getHex();
                    mat.userData._savedOpacity = mat.opacity;
                }
                // Use .set() — never replace the Color object reference
                mat.color.set(0x2a9d8f);
                mat.opacity = 0.25;
                mat.needsUpdate = true;
            }
        });
        highlightedMeshes.push(child);

        // Attach cached outline immediately; queue uncached for next-frame build
        const cached = _highlightCache.get(child.uuid);
        if (cached) {
            child.parent.add(cached.outline);
            highlightOutlines.push(cached.outline);
        } else {
            deferredChildren.push(child);
        }

        // Expand bounding box
        child.updateMatrixWorld(true);
        const cb = new THREE.Box3().setFromObject(child);
        highlightBB.union(cb);
        hasHighlight = true;
    });

    // Ring indicator — always immediate (uses cached geometry + material)
    if (hasHighlight) {
        const center = new THREE.Vector3();
        highlightBB.getCenter(center);

        // Reuse cached ring geometry + material — no new WebGL resources per highlight
        if (!_highlightRingGeo) _highlightRingGeo = new THREE.RingGeometry(0.85, 1.0, 48);
        if (!_highlightRingMat) _highlightRingMat = new THREE.MeshBasicMaterial({
            color: 0x00ffcc, transparent: true, opacity: 0.35,
            side: THREE.DoubleSide, depthTest: false
        });
        highlightRing = new THREE.Mesh(_highlightRingGeo, _highlightRingMat);
        highlightRing.position.copy(center);
        highlightRing.renderOrder = 999;
        scene.add(highlightRing);
        highlightPulseTime = 0;
    }

    // Build uncached wireframe outlines in the next animation frame.
    // This keeps mode switches instant — emissive + ring appear on this frame,
    // outline appears on the next frame (≤16ms later, imperceptible to users).
    if (deferredChildren.length > 0) {
        requestAnimationFrame(() => {
            // Abort if the highlight has been cleared since we queued this work
            if (_highlightVersion !== myVersion) return;
            deferredChildren.forEach((child) => {
                if (!child.parent) return; // model was unloaded
                let cached = _highlightCache.get(child.uuid);
                if (!cached) {
                    const edges = new THREE.EdgesGeometry(child.geometry, 30);
                    const outline = new THREE.LineSegments(edges, _highlightLineMat);
                    outline.position.copy(child.position);
                    outline.rotation.copy(child.rotation);
                    outline.scale.copy(child.scale);
                    outline.updateMatrix();
                    outline.matrixAutoUpdate = false;
                    outline.matrix.copy(child.matrix);
                    outline.matrixWorld.copy(child.matrixWorld);
                    cached = { edges, outline };
                    _highlightCache.set(child.uuid, cached);
                }
                child.parent.add(cached.outline);
                highlightOutlines.push(cached.outline);
            });
        });
    }
}

function onOrganPartClick(meshKey) {
    const map = getMeshDetailsMap(currentModelId);
    if (!map || !map[meshKey]) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    showOrganPartTooltip(meshKey, cx - 150, cy - 100);
    highlightOrganPartByKey(meshKey);
    const row = document.querySelector(`.organ-part-item[data-organ-part-key="${meshKey}"]`);
    if (row) row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    stopAutoRotate();
}

// Get structure name based on object type or position
function getStructureNameFromPosition(object) {
    if (!currentModelId || !modelsData) return null;

    const modelData = modelsData.find(m => m.id === currentModelId);
    if (!modelData) return null;

    // Simple heuristic based on object color or position
    // This is a simplified version - in production, you'd tag objects during creation
    const structures = modelData.keyStructures;
    const objectIndex = organMesh.children.indexOf(object);

    if (objectIndex >= 0 && objectIndex < structures.length) {
        return structures[objectIndex];
    }

    return structures[0]; // Default to first structure
}

// Show interactive tooltip
function showTooltip(structureName, x, y) {
    const tooltip = document.getElementById('interactiveTooltip');
    const header = document.getElementById('tooltipHeader');
    const content = document.getElementById('tooltipContent');

    header.textContent = structureName;
    content.textContent = structureInfo[currentModelId][structureName] || 'Information not available.';

    // Position tooltip — clamped to viewport with padding for narrow phones
    const tipW = Math.min(300, window.innerWidth - 24);
    tooltip.style.left = Math.min(x + 20, window.innerWidth - tipW - 12) + 'px';
    tooltip.style.top = Math.min(y + 20, window.innerHeight - 200) + 'px';

    tooltip.classList.add('visible');
    currentTooltipStructure = structureName;
}

// Hide tooltip
function hideTooltip() {
    document.getElementById('interactiveTooltip').classList.remove('visible');
    removeHighlight();
    currentTooltipStructure = null;
}

// Highlight structure
function highlightStructure(structureName) {
    // Remove previous highlight
    removeHighlight();

    // Highlight in info panel — track matched items so removeHighlight avoids querySelectorAll
    document.querySelectorAll('.structure-item').forEach(item => {
        if (item.textContent === structureName) {
            item.classList.add('highlighted');
            _highlightedStructureItems.push(item);
        }
    });

    // Highlight 3D object (visual feedback)
    if (organMesh) {
        // Create highlight effect — only match explicit structureName, no index fallback
        let matched = false;
        organMesh.children.forEach((child) => {
            if (child.userData.structureName === structureName) {
                matched = true;

                // Clone shared materials before mutating
                if (Array.isArray(child.material)) {
                    child.material = child.material.map(m => {
                        if (m && !m.userData._isHighlightClone) {
                            const c = m.clone();
                            c.userData._isHighlightClone = true;
                            c.userData._originalMaterial = m;
                            return c;
                        }
                        return m;
                    });
                } else if (child.material && !child.material.userData._isHighlightClone) {
                    const orig = child.material;
                    const c = orig.clone();
                    c.userData._isHighlightClone = true;
                    c.userData._originalMaterial = orig;
                    child.material = c;
                }

                const mats = Array.isArray(child.material) ? child.material : [child.material];
                mats.forEach((mat) => {
                    if (mat && mat.emissive) {
                        // Save original emissive so removeHighlight can restore it (not zero it)
                        if (mat.userData._savedEmissiveColor === undefined) {
                            mat.userData._savedEmissiveColor = mat.emissive.getHex();
                            mat.userData._savedEmissiveIntensity = mat.emissiveIntensity;
                        }
                        // Use .set() — never replace the Color object reference
                        mat.emissive.set(0x2a9d8f);
                        mat.emissiveIntensity = 0.3;
                        mat.needsUpdate = true;
                    }
                });
                highlightedMeshes.push(child);
            }
        });
        if (!matched) {
            console.warn('[highlightStructure] No mesh found with structureName:', structureName);
        }
    }
}

// Remove highlight
function removeHighlight() {
    _highlightVersion++; // cancels any pending deferred outline builds
    // Use tracked arrays — avoids 3× querySelectorAll on every call
    _highlightedStructureItems.forEach(el => el.classList.remove('highlighted'));
    _highlightedStructureItems = [];
    _highlightedOrganPartItems.forEach(el => el.classList.remove('highlighted'));
    _highlightedOrganPartItems = [];
    heartScreenLabelEntries.forEach(e => { if (e.labelEl) e.labelEl.classList.remove('active'); });

    highlightedMeshes.forEach((mesh) => {
        if (!mesh.material) return;

        // If we cloned the material(s) during highlight, dispose the clone(s) and restore originals.
        // This guarantees no mutated state leaks back to any shared material.
        if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map(mat => {
                if (mat && mat.userData._isHighlightClone && mat.userData._originalMaterial) {
                    mat.dispose();
                    return mat.userData._originalMaterial;
                }
                // Fallback: restore emissive in place if somehow uncloned
                if (mat && mat.emissive) {
                    _restoreEmissive(mat);
                }
                return mat;
            });
        } else {
            const mat = mesh.material;
            if (mat && mat.userData._isHighlightClone && mat.userData._originalMaterial) {
                mesh.material = mat.userData._originalMaterial;
                mat.dispose();
            } else if (mat && mat.emissive) {
                // Fallback: restore emissive in place if somehow uncloned
                _restoreEmissive(mat);
                if (mat && mesh.userData.isAnnotationHitMarker) {
                    _restoreAnchorSphere(mat);
                }
            }
        }
    });
    highlightedMeshes = [];

    // Detach wireframe outlines — do NOT dispose, they are cached in _highlightCache for reuse
    highlightOutlines.forEach(o => { if (o.parent) o.parent.remove(o); });
    highlightOutlines = [];

    // Remove pulsing ring from scene — do NOT dispose geometry/material (they are cached)
    if (highlightRing) {
        scene.remove(highlightRing);
        highlightRing = null;
    }
}

function _restoreEmissive(mat) {
    if (mat.userData._savedEmissiveColor !== undefined) {
        mat.emissive.set(mat.userData._savedEmissiveColor);
        mat.emissiveIntensity = mat.userData._savedEmissiveIntensity;
        delete mat.userData._savedEmissiveColor;
        delete mat.userData._savedEmissiveIntensity;
    } else {
        mat.emissive.set(0x000000);
        mat.emissiveIntensity = 0;
    }
    mat.needsUpdate = true;
}

function _restoreAnchorSphere(mat) {
    if (mat.userData._savedColor !== undefined) {
        mat.color.set(mat.userData._savedColor);
        mat.opacity = mat.userData._savedOpacity;
        delete mat.userData._savedColor;
        delete mat.userData._savedOpacity;
    } else {
        mat.opacity = 0.0;
    }
    mat.needsUpdate = true;
}
