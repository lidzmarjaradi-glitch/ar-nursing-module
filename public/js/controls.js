// ═══════════════════════════════════════════════════════
// controls.js — User interaction, click handlers & highlighting
// ═══════════════════════════════════════════════════════

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
    document.querySelectorAll('.organ-part-item').forEach((el) => {
        el.classList.toggle('highlighted', el.getAttribute('data-organ-part-key') === meshKey);
    });
    document.querySelectorAll('.heart-screen-label').forEach((el) => {
        el.classList.toggle('active', el.getAttribute('data-part-key') === String(meshKey));
    });
}

function highlightOrganPartByKey(meshKey) {
    removeHighlight();
    if (!organMesh) return;

    let highlightBB = new THREE.Box3();
    let hasHighlight = false;

    organMesh.traverse((child) => {
        if (!child.isMesh || child.userData.organPartKey !== meshKey) return;
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
            if (mat && mat.emissive) {
                mat.emissive = new THREE.Color(0x2a9d8f);
                mat.emissiveIntensity = 0.45;
            } else if (mat && child.userData.isAnnotationHitMarker) {
                // Anchor sphere: make semi-visible with highlight color
                mat.color = new THREE.Color(0x2a9d8f);
                mat.opacity = 0.25;
                mat.needsUpdate = true;
            }
        });
        highlightedMeshes.push(child);

        // Add wireframe outline
        const edges = new THREE.EdgesGeometry(child.geometry, 30);
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x00ffcc,
            linewidth: 1,
            transparent: true,
            opacity: 0.7,
            depthTest: true
        });
        const outline = new THREE.LineSegments(edges, lineMat);
        outline.position.copy(child.position);
        outline.rotation.copy(child.rotation);
        outline.scale.copy(child.scale);
        outline.updateMatrix();
        outline.matrixAutoUpdate = false;
        outline.matrix.copy(child.matrix);
        outline.matrixWorld.copy(child.matrixWorld);
        child.parent.add(outline);
        highlightOutlines.push(outline);

        // Expand bounding box
        child.updateMatrixWorld(true);
        const cb = new THREE.Box3().setFromObject(child);
        highlightBB.union(cb);
        hasHighlight = true;
    });

    // Add pulsing ring indicator at center of highlighted area
    // Uses a unit-radius ring; scaled each frame based on camera distance
    // so the circle looks the same size on screen regardless of model scale.
    if (hasHighlight) {
        const center = new THREE.Vector3();
        highlightBB.getCenter(center);

        const ringGeo = new THREE.RingGeometry(0.85, 1.0, 48);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x00ffcc,
            transparent: true,
            opacity: 0.35,
            side: THREE.DoubleSide,
            depthTest: false
        });
        highlightRing = new THREE.Mesh(ringGeo, ringMat);
        highlightRing.position.copy(center);
        highlightRing.renderOrder = 999;
        scene.add(highlightRing);
        highlightPulseTime = 0;
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

    // Position tooltip
    tooltip.style.left = Math.min(x + 20, window.innerWidth - 320) + 'px';
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

    // Highlight in info panel
    const structureItems = document.querySelectorAll('.structure-item');
    structureItems.forEach(item => {
        if (item.textContent === structureName) {
            item.classList.add('highlighted');
        }
    });

    // Highlight 3D object (visual feedback)
    if (organMesh) {
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x2a9d8f,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });

        // Create highlight effect
        organMesh.children.forEach((child, index) => {
            if (child.userData.structureName === structureName || index === 0) {
                const mats = Array.isArray(child.material) ? child.material : [child.material];
                mats.forEach((mat) => {
                    if (mat && mat.emissive) {
                        mat.emissive = new THREE.Color(0x2a9d8f);
                        mat.emissiveIntensity = 0.3;
                    }
                });
                highlightedMeshes.push(child);
            }
        });
    }
}

// Remove highlight
function removeHighlight() {
    document.querySelectorAll('.structure-item').forEach(item => {
        item.classList.remove('highlighted');
    });
    document.querySelectorAll('.organ-part-item').forEach(item => {
        item.classList.remove('highlighted');
    });
    document.querySelectorAll('.heart-screen-label').forEach((el) => {
        el.classList.remove('active');
    });

    highlightedMeshes.forEach((mesh) => {
        if (!mesh.material) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
            if (mat && mat.emissive) {
                mat.emissive = new THREE.Color(0x000000);
                mat.emissiveIntensity = 0;
            } else if (mat && mesh.userData.isAnnotationHitMarker) {
                // Restore anchor sphere to invisible
                mat.opacity = 0.0;
                mat.needsUpdate = true;
            }
        });
    });
    highlightedMeshes = [];

    // Remove wireframe outlines
    highlightOutlines.forEach(o => {
        if (o.parent) o.parent.remove(o);
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
    });
    highlightOutlines = [];

    // Remove pulsing ring
    if (highlightRing) {
        scene.remove(highlightRing);
        if (highlightRing.geometry) highlightRing.geometry.dispose();
        if (highlightRing.material) highlightRing.material.dispose();
        highlightRing = null;
    }
}
