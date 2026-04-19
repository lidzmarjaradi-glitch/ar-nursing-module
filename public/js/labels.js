// ═══════════════════════════════════════════════════════
// labels.js — Screen-space labels, collision avoidance & visibility
// ═══════════════════════════════════════════════════════

function clearHeartCss2DLabels() {
    clearHeartScreenSpaceLabels();
    if (!organMesh) return;
    const toRemove = [];
    organMesh.traverse((child) => {
        if (child.isCSS2DObject && (child.userData.isHeartCssLabel || child.userData.isBrainCssLabel || child.userData.isLungCssLabel || child.userData.isKidneyCssLabel)) {
            toRemove.push(child);
        }
        if (child.isMesh && child.userData.isKidneyHitMarker) {
            toRemove.push(child);
        }
    });
    toRemove.forEach((obj) => {
        if (obj.parent) obj.parent.remove(obj);
        if (obj.userData.isKidneyHitMarker && obj.geometry) {
            obj.geometry.dispose();
            const ms = Array.isArray(obj.material) ? obj.material : [obj.material];
            ms.forEach((m) => m && m.dispose && m.dispose());
        }
    });
}

function getHeartOverlayElements() {
    return {
        overlay: document.getElementById('heartAnnotationOverlay'),
        svg: document.getElementById('heartAnnotationSvg'),
        labelsHost: document.getElementById('heartAnnotationLabels')
    };
}

function clearHeartScreenSpaceLabels() {
    heartScreenLabelEntries = [];
    const { overlay, svg, labelsHost } = getHeartOverlayElements();
    if (svg) svg.innerHTML = '';
    if (labelsHost) labelsHost.innerHTML = '';
    if (overlay) {
        overlay.classList.add('hidden');
        overlay.setAttribute('aria-hidden', 'true');
    }
}

function syncHeartScreenSpaceLabelVisibility() {
    const { overlay } = getHeartOverlayElements();
    if (!overlay) return;
    const isActive = heartNumberLabelsVisible && heartScreenLabelEntries.length > 0;
    overlay.classList.toggle('hidden', !isActive);
    overlay.setAttribute('aria-hidden', isActive ? 'false' : 'true');
}

function projectWorldToScreen(worldPoint, rect) {
    const p = worldPoint.clone().project(camera);
    return {
        x: ((p.x + 1) * 0.5) * rect.width,
        y: ((1 - p.y) * 0.5) * rect.height,
        z: p.z
    };
}

/**
 * Force-based collision avoidance for screen-space labels.
 * Zoom-aware: zoomed out → compact/clustered, zoomed in → spread/readable.
 * Each label has an anchor (projected 3D point) and a smoothed current position.
 */

// Zoom-adaptive spacing constants
const LABEL_DIST_ZOOMED_OUT = 16;   // px – allow tight packing when far
const LABEL_DIST_ZOOMED_IN = 36;   // px – force readable gaps when close
const LABEL_DIST_DEFAULT = 28;   // px – at default camera distance
const ZOOM_DEFAULT_DIST = 5;    // default camera distance (world units)
const LABEL_LERP_SPEED = 0.18; // per-frame smoothing (0 = frozen, 1 = instant)

// Per-model spacing multipliers for dense/clustered label models
const DENSE_MODEL_SPACING = {
    brain: 1.45,
    blood_cells: 1.4,
    inner_ear: 1.35,
    human_cell: 1.3,
    small_intestine: 1.25,
    large_intestine: 1.25,
    dna: 1.3
};

/** Compute 0→1 zoom factor: 0 = fully zoomed out, 1 = fully zoomed in */
function getZoomFactor() {
    if (!camera || !orbitControls) return 0.5;
    const camDist = camera.position.length(); // distance from origin
    // Map [maxDistance … minDistance] → [0 … 1]
    const range = VIEW_ZOOM.max - VIEW_ZOOM.min;
    if (range < 0.01) return 0.5;
    return Math.max(0, Math.min(1, (VIEW_ZOOM.max - camDist) / range));
}

function resolveHeartLabelCollisions(labels, rect) {
    const pad = 14;
    const minX = pad;
    const maxX = rect.width - pad;
    const minY = 70;
    const maxY = rect.height - 110;
    const n = labels.length;

    // ---- Zoom-adaptive parameters ----
    const zf = getZoomFactor(); // 0 = zoomed out, 1 = zoomed in
    const spacingMul = (currentModelId && DENSE_MODEL_SPACING[currentModelId]) || 1.0;
    const minDist = (LABEL_DIST_ZOOMED_OUT + (LABEL_DIST_ZOOMED_IN - LABEL_DIST_ZOOMED_OUT) * zf) * spacingMul;

    // Reset positions to anchors each frame so the layout tracks rotation
    for (let i = 0; i < n; i++) {
        labels[i].cx = labels[i].anchorX;
        labels[i].cy = labels[i].anchorY;
    }

    // Measure anchor-space density: count how many anchor pairs are within minDist
    let crowded = 0;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const dx = labels[i].anchorX - labels[j].anchorX;
            const dy = labels[i].anchorY - labels[j].anchorY;
            if (Math.sqrt(dx * dx + dy * dy) < minDist) crowded++;
        }
    }
    // Dense clusters need more iterations and weaker spring to allow spreading
    const maxPairs = n * (n - 1) / 2;
    const densityRatio = maxPairs > 0 ? crowded / maxPairs : 0;
    const dense = densityRatio > 0.25;

    // Zoom scales iterations: more when zoomed in (must resolve), fewer when out
    const baseIter = dense ? 80 : 30;
    const iterations = Math.round(baseIter * (0.4 + 0.6 * zf)); // 40%-100% of base
    // Spring: stronger when zoomed out (keep compact), weaker when zoomed in (spread)
    const baseSpring = dense ? 0.005 : 0.04;
    const springK = baseSpring * (1.5 - zf); // 1.5× at zf=0, 0.5× at zf=1

    for (let iter = 0; iter < iterations; iter++) {
        const strength = 0.5 * (1 - iter / iterations) + 0.25;
        for (let i = 0; i < n; i++) {
            const a = labels[i];
            let fx = 0, fy = 0;

            for (let j = 0; j < n; j++) {
                if (i === j) continue;
                const b = labels[j];
                let dx = a.cx - b.cx;
                let dy = a.cy - b.cy;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < minDist) {
                    if (dist < 0.1) {
                        const angle = (i * 2.399 + j * 0.618) % (Math.PI * 2);
                        dx = Math.cos(angle);
                        dy = Math.sin(angle);
                        dist = 0.1;
                    }
                    const push = (minDist - dist) * 0.5 * strength;
                    fx += (dx / dist) * push;
                    fy += (dy / dist) * push;
                }
            }

            // Gentle spring back toward anchor
            const sx = a.anchorX - a.cx;
            const sy = a.anchorY - a.cy;
            fx += sx * springK;
            fy += sy * springK;

            a.cx += fx;
            a.cy += fy;

            // Clamp to viewport
            a.cx = Math.max(minX, Math.min(maxX, a.cx));
            a.cy = Math.max(minY, Math.min(maxY, a.cy));
        }
    }
}

// ---------- Universal screen-space label helper ----------
function _pushScreenLabel(key, text, title, mesh, localCenter, svg, labelsHost) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'heart-screen-label';
    btn.textContent = text;
    btn.setAttribute('data-part-key', key);
    btn.setAttribute('title', title);
    btn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        onOrganPartClick(key);
    });
    labelsHost.appendChild(btn);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('class', 'heart-screen-label-line');
    svg.appendChild(line);
    heartScreenLabelEntries.push({
        key, mesh, localCenter: localCenter.clone(), labelEl: btn, lineEl: line,
        cx: 0, cy: 0, anchorX: 0, anchorY: 0
    });
}

// Screen-space overlay with force-based collision avoidance for ALL models.
function addScreenSpaceLabels(model, modelId) {
    clearHeartScreenSpaceLabels();
    const { svg, labelsHost } = getHeartOverlayElements();
    if (!svg || !labelsHost) return;
    const seen = new Set();
    model.updateMatrixWorld(true);

    if (modelId === 'heart') {
        // Collect all meshes per group, then place one label at each group's combined center
        const groupMeshes = {};
        model.traverse((child) => {
            if (!child.isMesh || !child.geometry) return;
            const match = /^Object_(\d+)$/.exec(child.name);
            if (!match) return;
            const oldKey = String(Number(match[1]) - 2);
            const groupKey = HEART_PART_TO_GROUP[oldKey];
            if (!groupKey || !HEART_MESH_DETAILS[groupKey]) return;
            if (!groupMeshes[groupKey]) groupMeshes[groupKey] = [];
            groupMeshes[groupKey].push(child);
        });
        const order = MESH_LEGEND_META.heart.order || Object.keys(groupMeshes);
        let labelNum = 1;
        order.forEach((groupKey) => {
            const meshes = groupMeshes[groupKey];
            if (!meshes || seen.has(groupKey)) return;
            seen.add(groupKey);
            // Use the first mesh as anchor and compute combined center
            const combinedBox = new THREE.Box3();
            meshes.forEach((m) => {
                if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
                const b = m.geometry.boundingBox.clone();
                b.applyMatrix4(m.matrixWorld);
                combinedBox.union(b);
            });
            const worldCenter = new THREE.Vector3();
            combinedBox.getCenter(worldCenter);
            // Convert back to first mesh local space for label placement
            const anchor = meshes[0];
            const lc = worldCenter.clone().applyMatrix4(anchor.matrixWorld.clone().invert());
            _pushScreenLabel(groupKey, String(labelNum), HEART_MESH_DETAILS[groupKey].title, anchor, lc, svg, labelsHost);
            labelNum++;
        });
    } else if (modelId === 'brain') {
        model.traverse((child) => {
            if (!child.isMesh || !child.geometry) return;
            const ann = brainSketchfabAnnotationNumber(child.name);
            if (ann == null || seen.has(ann)) return;
            seen.add(ann);
            child.updateMatrixWorld(true);
            const box = new THREE.Box3().setFromObject(child);
            if (box.isEmpty()) return;
            const cw = new THREE.Vector3(); box.getCenter(cw);
            const sz = new THREE.Vector3(); box.getSize(sz);
            const bump = Math.max(sz.x, sz.y, sz.z) * 0.1;
            const dir = cw.clone();
            if (dir.lengthSq() < 1e-12) dir.set(0, 1, 0); else dir.normalize();
            const bw = cw.clone().addScaledVector(dir, bump);
            const lp = bw.clone(); child.worldToLocal(lp);
            const det = brainMeshDetailsRuntime ? brainMeshDetailsRuntime[child.name] : null;
            const title = det ? det.title : 'Region ' + ann;
            _pushScreenLabel(child.name, String(ann), title, child, lp, svg, labelsHost);
        });
    } else if (modelId === 'lungs') {
        model.traverse((child) => {
            if (!child.isMesh) return;
            const mk = /^umcg_hl_(\d+)$/.exec(child.userData.organPartKey || '');
            if (!mk || seen.has(mk[0])) return;
            seen.add(mk[0]);
            child.updateMatrixWorld(true);
            const box = new THREE.Box3().setFromObject(child);
            if (box.isEmpty()) return;
            const cw = new THREE.Vector3(); box.getCenter(cw);
            const sz = new THREE.Vector3(); box.getSize(sz);
            const bump = Math.max(sz.x, sz.y, sz.z) * 0.1;
            const dir = cw.clone();
            if (dir.lengthSq() < 1e-12) dir.set(0, 1, 0); else dir.normalize();
            const bw = cw.clone().addScaledVector(dir, bump);
            const lp = bw.clone(); child.worldToLocal(lp);
            const key = child.userData.organPartKey;
            const det = lungMeshDetailsRuntime ? lungMeshDetailsRuntime[key] : null;
            const title = det ? det.title : 'Region ' + mk[1];
            _pushScreenLabel(key, mk[1], title, child, lp, svg, labelsHost);
        });
    } else if (modelId === 'kidney') {
        // Find the main kidney mesh
        let kidneyMesh = null; let bestVc = 0;
        model.traverse((ch) => {
            if (!ch.isMesh || !ch.geometry || !ch.geometry.attributes.position) return;
            const vc = ch.geometry.attributes.position.count;
            if (ch.name === 'Object_5' && vc > 100) { kidneyMesh = ch; bestVc = vc; }
        });
        if (!kidneyMesh) {
            model.traverse((ch) => {
                if (!ch.isMesh || !ch.geometry || !ch.geometry.attributes.position) return;
                const vc = ch.geometry.attributes.position.count;
                if (vc > bestVc) { bestVc = vc; kidneyMesh = ch; }
            });
        }
        if (kidneyMesh && kidneyMesh.geometry) {
            const anchors = computeKidneyConceptAnchorPositions(kidneyMesh.geometry);
            if (anchors) {
                const geom = kidneyMesh.geometry;
                geom.computeBoundingBox();
                const gbox = geom.boundingBox;
                if (gbox) {
                    const gc = new THREE.Vector3(); gbox.getCenter(gc);
                    const gs = new THREE.Vector3(); gbox.getSize(gs);
                    const lm = Math.max(gs.x, gs.y, gs.z, 1e-6);
                    const keys = ['kid_ann_1', 'kid_ann_2', 'kid_ann_3', 'kid_ann_4', 'kid_ann_5'];
                    const akeys = ['superior', 'inferior', 'lateral', 'hilum', 'outer'];
                    const oa = lm * 0.12;
                    for (let i = 0; i < keys.length; i++) {
                        const a = anchors[akeys[i]].clone();
                        const d = a.clone().sub(gc);
                        if (d.lengthSq() < 1e-12) d.set(0, 1, 0); d.normalize();
                        const tp = a.clone().addScaledVector(d, oa);
                        const det = KIDNEY_MESH_DETAILS[keys[i]];
                        const title = det ? det.title : 'Part ' + (i + 1);
                        _pushScreenLabel(keys[i], String(i + 1), title, kidneyMesh, tp, svg, labelsHost);
                    }
                }
            }
        }
    } else if (modelId === 'syringe') {
        const partOrder = ['barrel', 'flange', 'grips', 'graduations', 'plunger', 'luer', 'needle_hub', 'needle_shaft', 'bevel', 'medication', 'bubbles'];
        model.traverse((child) => {
            if (!child.isMesh) return;
            const pk = child.userData.organPartKey;
            if (!pk || seen.has(pk)) return;
            seen.add(pk);
            child.updateMatrixWorld(true);
            if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
            const lc = new THREE.Vector3();
            child.geometry.boundingBox.getCenter(lc);
            const idx = partOrder.indexOf(pk);
            const labelNum = idx >= 0 ? idx + 1 : seen.size;
            const det = SYRINGE_MESH_DETAILS[pk];
            const title = det ? det.title : pk;
            _pushScreenLabel(pk, String(labelNum), title, child, lc, svg, labelsHost);
        });
    } else if (getMeshDetailsMap(modelId) && !['heart', 'lungs', 'kidney', 'brain', 'syringe'].includes(modelId)) {
        const detailsMap = getMeshDetailsMap(modelId);
        const meta = MESH_LEGEND_META[modelId];
        const partOrder = (meta && meta.order) ? meta.order : (detailsMap ? Object.keys(detailsMap) : []);
        model.traverse((child) => {
            if (!child.isMesh) return;
            const pk = child.userData.organPartKey;
            if (!pk || seen.has(pk)) return;
            seen.add(pk);
            child.updateMatrixWorld(true);
            if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
            const lc = new THREE.Vector3();
            child.geometry.boundingBox.getCenter(lc);
            const idx = partOrder.indexOf(pk);
            const labelNum = idx >= 0 ? idx + 1 : seen.size;
            const det = detailsMap ? detailsMap[pk] : null;
            const title = det ? det.title : pk;
            _pushScreenLabel(pk, String(labelNum), title, child, lc, svg, labelsHost);
        });
    }

    syncHeartScreenSpaceLabelVisibility();
    // seed initial positions
    if (renderer && camera) {
        const rect = renderer.domElement.getBoundingClientRect();
        heartScreenLabelEntries.forEach((e) => {
            const wp = e.mesh.localToWorld(e.localCenter.clone());
            const sp = projectWorldToScreen(wp, rect);
            e.anchorX = sp.x; e.anchorY = sp.y;
            e.cx = sp.x; e.cy = sp.y;
        });
    }
    updateHeartScreenSpaceLabels();
}

// Legacy alias so existing callers still work
function addHeartCss2DLabels(model) { addScreenSpaceLabels(model, 'heart'); }

function updateHeartScreenSpaceLabels() {
    const { overlay, svg } = getHeartOverlayElements();
    if (!overlay) return;
    const isActive = heartNumberLabelsVisible && organMesh && renderer && heartScreenLabelEntries.length > 0;
    overlay.classList.toggle('hidden', !isActive);
    overlay.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    if (!isActive) return;

    const rect = renderer.domElement.getBoundingClientRect();

    // Keep SVG coordinate space in sync with pixel size
    if (svg) {
        svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
        svg.setAttribute('width', rect.width);
        svg.setAttribute('height', rect.height);
    }

    // Project each label's 3D anchor to screen space
    heartScreenLabelEntries.forEach((entry) => {
        entry.mesh.updateMatrixWorld(true);
        const worldPoint = entry.mesh.localToWorld(entry.localCenter.clone());
        const sp = projectWorldToScreen(worldPoint, rect);
        entry.anchorX = sp.x;
        entry.anchorY = sp.y;
    });

    // Run force-based collision resolution
    resolveHeartLabelCollisions(heartScreenLabelEntries, rect);

    // Smooth lerp: blend previous display position toward resolved position
    const lerp = LABEL_LERP_SPEED;
    heartScreenLabelEntries.forEach((entry) => {
        // Initialize smoothed positions on first frame
        if (entry.smoothX == null) { entry.smoothX = entry.cx; entry.smoothY = entry.cy; }
        entry.smoothX += (entry.cx - entry.smoothX) * lerp;
        entry.smoothY += (entry.cy - entry.smoothY) * lerp;
    });

    // Position DOM elements using smoothed coordinates
    heartScreenLabelEntries.forEach((entry) => {
        entry.labelEl.style.left = `${entry.smoothX}px`;
        entry.labelEl.style.top = `${entry.smoothY}px`;

        // Leader line from anchor to label (only if displaced noticeably)
        const dx = entry.smoothX - entry.anchorX;
        const dy = entry.smoothY - entry.anchorY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 8) {
            entry.lineEl.setAttribute('d',
                `M ${entry.anchorX.toFixed(1)} ${entry.anchorY.toFixed(1)} L ${entry.smoothX.toFixed(1)} ${entry.smoothY.toFixed(1)}`
            );
            entry.lineEl.style.display = '';
        } else {
            entry.lineEl.style.display = 'none';
        }
    });
}

/** Floating 1–12 callouts on each regional mesh (Object_2 … Object_13), aligned with the Cheroske Sketchfab model. */
function addBrainCss2DLabels(model) {
    if (!heartCss2DRenderer || typeof THREE.CSS2DObject === 'undefined') return;
    const scrap = [];
    model.traverse((child) => {
        if (child.isCSS2DObject && child.userData.isBrainCssLabel) scrap.push(child);
    });
    scrap.forEach((o) => { if (o.parent) o.parent.remove(o); });
    model.updateMatrixWorld(true);
    model.traverse((child) => {
        if (!child.isMesh || !child.geometry) return;
        const ann = brainSketchfabAnnotationNumber(child.name);
        if (ann == null) return;
        // Cheroske glTF reuses one BufferGeometry on multiple meshes; geometry.boundingBox
        // is identical for all → labels stack. Use per-mesh world AABB instead.
        child.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(child);
        if (box.isEmpty()) return;
        const centerWorld = new THREE.Vector3();
        box.getCenter(centerWorld);
        const size = new THREE.Vector3();
        box.getSize(size);
        const div = document.createElement('div');
        div.className = 'heart-annotation-label';
        div.textContent = String(ann);
        const label = new THREE.CSS2DObject(div);
        label.userData.isBrainCssLabel = true;
        label.visible = heartNumberLabelsVisible;
        const bump = Math.max(size.x, size.y, size.z) * 0.1;
        const dir = centerWorld.clone();
        if (dir.lengthSq() < 1e-12) dir.set(0, 1, 0);
        else dir.normalize();
        const bumpedWorld = centerWorld.clone().addScaledVector(dir, bump);
        const localPos = bumpedWorld.clone();
        child.worldToLocal(localPos);
        label.position.copy(localPos);
        child.add(label);
    });
}

/** Scale+center so max axis ≈ targetMax (world units). Fixes Sketchfab glTFs whose root matrix is already tiny. */

// ─── Fit model to view ───

function fitObjectToMaxDimension(root, targetMax) {
    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxD = Math.max(size.x, size.y, size.z);
    if (maxD < 1e-9) return;
    root.scale.multiplyScalar(targetMax / maxD);
    root.updateMatrixWorld(true);
    const box2 = new THREE.Box3().setFromObject(root);
    const c = new THREE.Vector3();
    box2.getCenter(c);
    root.position.sub(c);
}

/** Sketchfab KHR_materials_pbrSpecularGlossiness: replace with Phong + diffuse map (Three r128); keeps emissive highlights. */

// ─── Heart label visibility ───

function setHeartNumberLabelsVisible(visible) {
    heartNumberLabelsVisible = visible;
    if (!organMesh) return;
    // Hide embedded 3D number markers for heart model
    if (currentModelId === 'heart') {
        organMesh.traverse((child) => {
            if (child.isMesh && child.userData.isHeartNumberMarker) {
                child.visible = false;
            }
        });
    }
    // Screen-space overlay handles visibility for ALL models
    syncHeartScreenSpaceLabelVisibility();
    updateHeartScreenSpaceLabels();
    const btn = document.getElementById('toggleHeartLabels');
    if (btn) {
        btn.classList.toggle('labels-off', !visible);
        btn.classList.toggle('active', visible);
        btn.setAttribute('aria-pressed', visible ? 'true' : 'false');
        if (currentModelId === 'heart') {
            btn.title = visible
                ? 'Hide numbered reference labels on the heart'
                : 'Show numbered reference labels on the heart';
        } else if (currentModelId === 'brain') {
            btn.title = visible
                ? 'Hide region numbers (1–12) on the brain model'
                : 'Show region numbers (1–12) on the brain model';
        } else if (currentModelId === 'lungs') {
            btn.title = visible
                ? 'Hide region numbers (1–7) on the heart–lungs model'
                : 'Show region numbers (1–7) on the heart–lungs model';
        } else if (currentModelId === 'kidney') {
            btn.title = visible
                ? 'Hide teaching numbers (1–5) on the kidney model'
                : 'Show teaching numbers (1–5) on the kidney model';
        } else if (currentModelId === 'syringe') {
            btn.title = visible
                ? 'Hide part numbers (1–11) on the syringe model'
                : 'Show part numbers (1–11) on the syringe model';
        } else {
            btn.title = 'Show or hide numbered labels on the model';
        }
    }
}

function updateHeartLabelsToggleVisibility() {
    const btn = document.getElementById('toggleHeartLabels');
    if (!btn) return;
    const show = !!getMeshDetailsMap(currentModelId);
    btn.classList.toggle('visible', show);
    if (show) {
        btn.classList.toggle('labels-off', !heartNumberLabelsVisible);
        btn.classList.toggle('active', heartNumberLabelsVisible);
        btn.setAttribute('aria-pressed', heartNumberLabelsVisible ? 'true' : 'false');
        if (currentModelId === 'heart') {
            btn.title = heartNumberLabelsVisible
                ? 'Hide numbered reference labels on the heart'
                : 'Show numbered reference labels on the heart';
        } else if (currentModelId === 'brain') {
            btn.title = heartNumberLabelsVisible
                ? 'Hide Sketchfab-style region numbers (1–12) on the brain'
                : 'Show region numbers 1–12 on the brain (Cheroske Sketchfab model)';
        } else if (currentModelId === 'lungs') {
            btn.title = heartNumberLabelsVisible
                ? 'Hide region numbers (1–7) on the heart–lungs model'
                : 'Show region numbers 1–7 (UMCG healthy heart and lungs)';
        } else if (currentModelId === 'kidney') {
            btn.title = heartNumberLabelsVisible
                ? 'Hide teaching numbers (1–5) on the kidney (Ginjal concept)'
                : 'Show teaching numbers (1–5) on the kidney (viewer callouts; not from Sketchfab export)';
        } else if (currentModelId === 'syringe') {
            btn.title = heartNumberLabelsVisible
                ? 'Hide part numbers (1–11) on the syringe'
                : 'Show part numbers (1–11) on the syringe';
        } else {
            const name = currentModelId.replace(/_/g, ' ');
            btn.title = heartNumberLabelsVisible
                ? 'Hide numbered labels on the ' + name
                : 'Show numbered labels on the ' + name;
        }
    }
}

// ===== GLTF mesh-name → organPartKey mappings for new Sketchfab models =====
