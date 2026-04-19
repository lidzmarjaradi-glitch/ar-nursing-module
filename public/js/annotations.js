// ═══════════════════════════════════════════════════════
// annotations.js — Model-specific annotations & material fixes
// ═══════════════════════════════════════════════════════
//
// ANNOTATION MAPPING TYPES
// ────────────────────────
// Each model's labels are classified into one of four mapping types,
// stored on model.userData.annotationAccuracy after annotation build:
//
// 1. MESH-BASED ("mesh")
//    All labels map directly to named geometry meshes in the glTF file.
//    The organPartKey is assigned by matching mesh/parent names in Phase 1.
//    Used when: the 3D model has individually named parts (e.g., liver has
//    separate meshes for gallbladder, hepatic artery, portal vein, etc.)
//    Examples: liver (5 named meshes), eye (3 named meshes for sclera/iris/cornea)
//
// 2. PARTIAL ("partial")
//    Some labels map to real geometry meshes; the rest are placed on invisible
//    anchor spheres at computed anatomical positions.
//    Used when: the model has some named parts but not enough to cover all
//    educational labels (e.g., spine has vertebral body + disc meshes but
//    needs anchors for spinous process, facet joint, etc.)
//
// 3. EDUCATIONAL / APPROXIMATE ("approximate")
//    ALL labels are placed on invisible anchor spheres at approximate
//    anatomical positions relative to the model's bounding box.
//    Used when: the model is a single mesh or has no individually named parts.
//    UI shows: "⚠ Labels at approximate positions for educational reference"
//    plus a viewer-area banner informing the user of the limitation.
//
// 4. CUSTOM ("custom")
//    Model-specific annotation logic that uses specialized algorithms:
//    - Heart: groups meshes by HEART_PART_TO_GROUP mapping, merges bounding boxes
//    - Lungs: UMCG callout system with 7 numbered regions
//    - Kidney: geometry-based anchor computation (poles, hilum, lateral border)
//    - Brain: Sketchfab annotation number extraction from mesh names
//    - Syringe: procedural part-by-part mesh tagging
//    - Neuron: procedural geometry with built-in part keys
//    Set via modelConfig[id].annotationPath = 'custom'
//    UI shows: "✓ Custom annotation mapping (X geometry + Y computed)"
//
// ANNOTATION PIPELINE
// ───────────────────
// buildNewModelGltfAnnotations(model, modelId):
//   Phase 1 — Attempt to map glTF mesh names → organPartKey via model-specific rules
//   Phase 2 — For any unmapped keys, create invisible anchor spheres at
//             anatomicalPositions (per-model fractional offsets from bounding box)
//   Final  — Count direct vs. anchor mappings → set annotationAccuracy
//

// ─── Kidney ───

function applyKidneyConceptSafeMaterials(model) {
    model.traverse((child) => {
        if (!child.isMesh || !child.geometry) return;
        const geom = child.geometry;
        geom.computeBoundingBox();
        geom.computeBoundingSphere();
        child.frustumCulled = false;
        const orig = child.material;
        const mats = Array.isArray(orig) ? orig : [orig];
        let map = null;
        for (let i = 0; i < mats.length; i++) {
            const m = mats[i];
            if (m && m.map) {
                map = m.map;
                break;
            }
        }
        child.material = new THREE.MeshPhongMaterial({
            map: map,
            color: map ? 0xffffff : 0xc09088,
            side: THREE.DoubleSide,
            shininess: 18,
            specular: 0x333333
        });
    });
}

/** Local-space anchor points on the kidney mesh for viewer-only 1–5 labels (glTF has no Sketchfab hotspots). */
function computeKidneyConceptAnchorPositions(geometry) {
    const pos = geometry.attributes.position;
    if (!pos) return null;
    const tmp = new THREE.Vector3();
    let minY = Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < pos.count; i++) {
        tmp.fromBufferAttribute(pos, i);
        minY = Math.min(minY, tmp.y);
        maxY = Math.max(maxY, tmp.y);
    }
    const yRange = maxY - minY;
    let yLo = minY + 0.28 * yRange;
    let yHi = minY + 0.72 * yRange;
    const collectBand = (lo, hi) => {
        const idx = [];
        for (let i = 0; i < pos.count; i++) {
            tmp.fromBufferAttribute(pos, i);
            if (tmp.y >= lo && tmp.y <= hi) idx.push(i);
        }
        return idx;
    };
    let band = collectBand(yLo, yHi);
    if (band.length === 0) {
        yLo = minY + 0.08 * yRange;
        yHi = maxY - 0.08 * yRange;
        band = collectBand(yLo, yHi);
    }
    if (band.length === 0) {
        band = [];
        for (let i = 0; i < pos.count; i++) band.push(i);
    }
    let iSuper = 0;
    let iInf = 0;
    let ys = -Infinity;
    let yi = Infinity;
    for (let i = 0; i < pos.count; i++) {
        tmp.fromBufferAttribute(pos, i);
        if (tmp.y > ys) {
            ys = tmp.y;
            iSuper = i;
        }
        if (tmp.y < yi) {
            yi = tmp.y;
            iInf = i;
        }
    }
    let bestLat = -Infinity;
    let iLat = band[0];
    let bestHil = Infinity;
    let iHil = band[0];
    let bestZ = -Infinity;
    let iZout = band[0];
    for (let j = 0; j < band.length; j++) {
        const vi = band[j];
        tmp.fromBufferAttribute(pos, vi);
        if (tmp.x > bestLat) {
            bestLat = tmp.x;
            iLat = vi;
        }
        if (tmp.x < bestHil) {
            bestHil = tmp.x;
            iHil = vi;
        }
        if (tmp.z > bestZ) {
            bestZ = tmp.z;
            iZout = vi;
        }
    }
    const out = {
        superior: new THREE.Vector3(),
        inferior: new THREE.Vector3(),
        lateral: new THREE.Vector3(),
        hilum: new THREE.Vector3(),
        outer: new THREE.Vector3()
    };
    out.superior.fromBufferAttribute(pos, iSuper);
    out.inferior.fromBufferAttribute(pos, iInf);
    out.lateral.fromBufferAttribute(pos, iLat);
    out.hilum.fromBufferAttribute(pos, iHil);
    out.outer.fromBufferAttribute(pos, iZout);
    return out;
}

function buildKidneyConceptAnnotations(model) {
    if (!heartCss2DRenderer || typeof THREE.CSS2DObject === 'undefined') return;
    const scrap = [];
    model.traverse((ch) => {
        if (ch.isCSS2DObject && ch.userData.isKidneyCssLabel) scrap.push(ch);
        if (ch.isMesh && ch.userData.isKidneyHitMarker) scrap.push(ch);
    });
    scrap.forEach((o) => {
        if (o.parent) o.parent.remove(o);
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
            const ms = Array.isArray(o.material) ? o.material : [o.material];
            ms.forEach((m) => m && m.dispose && m.dispose());
        }
    });

    let kidneyMesh = null;
    let bestVc = 0;
    model.traverse((ch) => {
        if (!ch.isMesh || !ch.geometry || !ch.geometry.attributes.position) return;
        const vc = ch.geometry.attributes.position.count;
        if (ch.name === 'Object_5' && vc > 100) {
            kidneyMesh = ch;
            bestVc = vc;
        }
    });
    if (!kidneyMesh) {
        model.traverse((ch) => {
            if (!ch.isMesh || !ch.geometry || !ch.geometry.attributes.position) return;
            const vc = ch.geometry.attributes.position.count;
            if (vc > bestVc) {
                bestVc = vc;
                kidneyMesh = ch;
            }
        });
    }
    if (!kidneyMesh || !kidneyMesh.geometry) return;

    const anchors = computeKidneyConceptAnchorPositions(kidneyMesh.geometry);
    if (!anchors) return;

    const geom = kidneyMesh.geometry;
    geom.computeBoundingBox();
    const gbox = geom.boundingBox;
    if (!gbox) return;
    const geomCenter = new THREE.Vector3();
    gbox.getCenter(geomCenter);
    const gsize = new THREE.Vector3();
    gbox.getSize(gsize);
    const localMax = Math.max(gsize.x, gsize.y, gsize.z, 1e-6);

    const keys = ['kid_ann_1', 'kid_ann_2', 'kid_ann_3', 'kid_ann_4', 'kid_ann_5'];
    const anchorKeys = ['superior', 'inferior', 'lateral', 'hilum', 'outer'];

    const outwardAlong = localMax * 0.12;
    for (let i = 0; i < keys.length; i++) {
        const anchor = anchors[anchorKeys[i]].clone();
        const dir = anchor.clone().sub(geomCenter);
        if (dir.lengthSq() < 1e-12) dir.set(0, 1, 0);
        dir.normalize();
        const tagPos = anchor.clone().addScaledVector(dir, outwardAlong);

        const hitR = Math.max(localMax * 0.1, 0.03);
        const geoS = new THREE.SphereGeometry(hitR, 14, 14);
        const matS = new THREE.MeshPhongMaterial({
            color: 0x2a9d8f,
            transparent: true,
            opacity: 0.04,
            depthWrite: false
        });
        const sphere = new THREE.Mesh(geoS, matS);
        sphere.userData.isKidneyHitMarker = true;
        sphere.userData.organPartKey = keys[i];
        const det = KIDNEY_MESH_DETAILS[keys[i]];
        if (det) sphere.userData.structureName = det.legendLabel;
        sphere.position.copy(tagPos);
        kidneyMesh.add(sphere);
    }
}

// ─── Lungs ───

function applyLungUmcgSafeMaterials(model) {
    const palette = [0xd07060, 0xc85848, 0xe08070, 0xb85040, 0xe89880, 0xc86858, 0xf0a090];
    let pi = 0;
    model.traverse((child) => {
        if (!child.isMesh || !child.geometry) return;
        const geom = child.geometry;
        // GLTF COLOR_0 is often RGBA (itemSize 4); Phong + vertexColors can mis-handle it in r128.
        const colAttr = geom.attributes.color;
        if (colAttr && colAttr.itemSize === 4 && colAttr.array) {
            const n = colAttr.count;
            const src = colAttr.array;
            const rgb = new Float32Array(n * 3);
            for (let i = 0; i < n; i++) {
                rgb[i * 3] = src[i * 4];
                rgb[i * 3 + 1] = src[i * 4 + 1];
                rgb[i * 3 + 2] = src[i * 4 + 2];
            }
            geom.setAttribute('color', new THREE.BufferAttribute(rgb, 3));
        }
        geom.computeBoundingBox();
        geom.computeBoundingSphere();
        child.frustumCulled = false;
        const useVc = !!(geom.attributes.color && geom.attributes.color.array && geom.attributes.color.array.length);
        const base = palette[pi % palette.length];
        pi += 1;
        const mat = new THREE.MeshBasicMaterial({
            vertexColors: useVc,
            color: useVc ? 0xffffff : base,
            side: THREE.DoubleSide
        });
        child.material = Array.isArray(child.material) ? child.material.map(() => mat.clone()) : mat;
    });
}

function buildLungUmcgFromGltf(model) {
    lungMeshDetailsRuntime = {};
    const all = [];
    model.traverse((c) => {
        if (c.isMesh) all.push(c);
    });
    const first = (arr) => arr[0];
    const n25 = all.filter((m) => /normaal25/.test(m.name));
    const n6 = all.filter((m) => /normaal6_normaal6_0/.test(m.name));
    const n5 = all.filter((m) => /normaal5/.test(m.name) && !/normaal6/.test(m.name));
    const n4 = all.filter((m) => /normaal4/.test(m.name));
    const ll = all.filter((m) => /linkerlong3/.test(m.name));
    const ordered = [
        first(n25),
        n6[0],
        n6[1],
        n6[2],
        first(n5),
        first(n4),
        first(ll)
    ].filter(Boolean);
    if (ordered.length !== 7) {
        console.warn('UMCG heart-lungs: expected 7 meshes, found ' + ordered.length + '. Check glTF.');
    }
    for (let i = 0; i < ordered.length && i < 7; i++) {
        const mesh = ordered[i];
        const key = 'umcg_hl_' + (i + 1);
        const src = UMCG_HEART_LUNG_CALLOUTS[key];
        if (!src) continue;
        mesh.userData.organPartKey = key;
        mesh.userData.structureName = src.legendLabel;
        lungMeshDetailsRuntime[key] = Object.assign({}, src, {
            title: 'Region ' + (i + 1) + ' — ' + src.title
        });
    }
}

function addLungCss2DLabels(model) {
    if (!heartCss2DRenderer || typeof THREE.CSS2DObject === 'undefined') return;
    const scrap = [];
    model.traverse((child) => {
        if (child.isCSS2DObject && child.userData.isLungCssLabel) scrap.push(child);
    });
    scrap.forEach((o) => { if (o.parent) o.parent.remove(o); });
    model.updateMatrixWorld(true);
    model.traverse((child) => {
        if (!child.isMesh) return;
        const mk = /^umcg_hl_(\d+)$/.exec(child.userData.organPartKey || '');
        if (!mk) return;
        child.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(child);
        if (box.isEmpty()) return;
        const centerWorld = new THREE.Vector3();
        box.getCenter(centerWorld);
        const size = new THREE.Vector3();
        box.getSize(size);
        const div = document.createElement('div');
        div.className = 'heart-annotation-label';
        div.textContent = mk[1];
        const label = new THREE.CSS2DObject(div);
        label.userData.isLungCssLabel = true;
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

// ─── Heart ───

function applyHeartVertexColorMaterials(model) {
    model.traverse((child) => {
        if (!child.isMesh || !child.geometry || !child.geometry.attributes.color) return;
        const orig = child.material;
        const mats = Array.isArray(orig) ? orig : [orig];
        const newMats = mats.map((mat) => {
            if (!mat) return mat;
            const m = mat.clone();
            m.vertexColors = true;
            m.needsUpdate = true;
            return m;
        });
        child.material = newMats.length === 1 ? newMats[0] : newMats;
    });
}

// Optional: small embedded number meshes in the Sketchfab heart export.
// We keep them hidden and use the screen-space overlay instead so all labels stay readable.
function markHeartNumberLabelMeshes(model) {
    model.traverse((child) => {
        if (!child.isMesh || !child.geometry) return;
        const geom = child.geometry;
        if (!geom.boundingBox) geom.computeBoundingBox();
        const s = new THREE.Vector3();
        geom.boundingBox.getSize(s);
        const vol = s.x * s.y * s.z;
        const maxDim = Math.max(s.x, s.y, s.z);
        const vc = geom.attributes.position ? geom.attributes.position.count : 0;
        const isMarker = vol < 0.005 && maxDim < 0.22 && vc < 25000;
        child.userData.isHeartNumberMarker = isMarker;
        if (isMarker) {
            child.userData.structureName = 'Numbered anatomy label';
            child.visible = false;
        }
    });
}

// ─── GLTF Mesh Maps ───

const LIVER_GLTF_MESH_MAP = {
    'liver': 'right_lobe', 'gallbladder': 'gallbladder',
    'hepatic artery': 'hepatic_artery', 'portal vein': 'portal_vein',
    'inferior vena cava': 'bile_duct'
};
const EYE_GLTF_MESH_MAP = {
    'sclera': 'sclera', 'iris': 'iris', 'eye_eye': 'vitreous'
};
// Stomach has Object_0..6 — assign by sorted Y position
// Tooth — group by dental region
// Spine — group by vertebral region
// Skin — Object_0..169 — annotation only

/**
 * For 6 new models: assign organPartKey to GLTF meshes by name matching,
 * then create invisible annotation spheres for any unmapped keys so all
 * interactive features (labels, guided tour, quiz, click) work.
 */
function buildNewModelGltfAnnotations(model, modelId) {
    const detailsMap = getMeshDetailsMap(modelId);
    if (!detailsMap) return;
    const meta = MESH_LEGEND_META[modelId];
    const allKeys = (meta && meta.order) ? meta.order : Object.keys(detailsMap);
    const assignedKeys = new Set();

    // --- Phase 1: try to map GLTF mesh names to organPartKeys ---
    if (modelId === 'liver') {
        // Liver GLTF: 5 named meshes → direct mapping for accurate highlighting
        // liver001 (body), gallbladder002, hepatic_artery001, portal_vein001, inferior_vena_cava001
        model.traverse((child) => {
            if (!child.isMesh) return;
            const pn = child.parent ? child.parent.name.toLowerCase() : '';
            let key = null;
            if (pn.includes('gallbladder') && !assignedKeys.has('gallbladder')) key = 'gallbladder';
            else if (pn.includes('hepatic_artery') && !assignedKeys.has('hepatic_artery')) key = 'hepatic_artery';
            else if (pn.includes('portal_vein') && !assignedKeys.has('portal_vein')) key = 'portal_vein';
            else if (pn.includes('inferior_vena_cava') && !assignedKeys.has('bile_duct')) key = 'bile_duct';
            else if (pn.includes('liver') && !assignedKeys.has('right_lobe')) key = 'right_lobe';
            if (key) {
                child.userData.organPartKey = key;
                child.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                assignedKeys.add(key);
            }
        });
        // Remaining lobe labels anchored on the liver body mesh
        model.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(model);
        const c = new THREE.Vector3(); box.getCenter(c);
        const s = new THREE.Vector3(); box.getSize(s);
        const lobeAnchors = {
            left_lobe: { x: -0.30, y: 0.05, z: 0.15 },
            caudate_lobe: { x: -0.05, y: 0.15, z: -0.20 },
            quadrate_lobe: { x: -0.12, y: -0.08, z: 0.22 }
        };
        const hitR = Math.max(s.x, s.y, s.z) * 0.05;
        for (const key of allKeys) {
            if (assignedKeys.has(key)) continue;
            const a = lobeAnchors[key]; if (!a) continue;
            const posW = new THREE.Vector3(c.x + a.x * s.x, c.y + a.y * s.y, c.z + a.z * s.z);
            model.worldToLocal(posW);
            const geo = new THREE.SphereGeometry(hitR, 8, 8);
            const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0, depthWrite: false });
            const sphere = new THREE.Mesh(geo, mat);
            sphere.position.copy(posW);
            sphere.userData.organPartKey = key;
            sphere.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
            sphere.userData.isAnnotationHitMarker = true;
            model.add(sphere);
            assignedKeys.add(key);
        }
    } else if (modelId === 'eye') {
        // Eye GLTF: 3 named meshes (sclera, iris, eye/cornea) → direct + 5 anchored
        model.traverse((child) => {
            if (!child.isMesh || child.userData.isAnnotationHitMarker) return;
            const pn = child.parent ? child.parent.name.toLowerCase() : '';
            if (pn === 'sclera' && !assignedKeys.has('sclera')) {
                child.userData.organPartKey = 'sclera';
                child.userData.structureName = detailsMap['sclera'] ? detailsMap['sclera'].legendLabel : 'sclera';
                assignedKeys.add('sclera');
            } else if (pn === 'iris' && !assignedKeys.has('iris')) {
                child.userData.organPartKey = 'iris';
                child.userData.structureName = detailsMap['iris'] ? detailsMap['iris'].legendLabel : 'iris';
                assignedKeys.add('iris');
            } else if (pn === 'eye' && !assignedKeys.has('cornea')) {
                child.userData.organPartKey = 'cornea';
                child.userData.structureName = detailsMap['cornea'] ? detailsMap['cornea'].legendLabel : 'cornea';
                assignedKeys.add('cornea');
            }
        });
        // Remaining 5 labels at anatomical positions relative to eye geometry
        model.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(model);
        const c = new THREE.Vector3(); box.getCenter(c);
        const s = new THREE.Vector3(); box.getSize(s);
        const eyeAnchors = {
            pupil: { x: 0.00, y: -0.05, z: 0.40 },
            lens: { x: 0.00, y: 0.00, z: 0.15 },
            retina: { x: 0.00, y: 0.10, z: -0.30 },
            optic_nerve: { x: 0.00, y: -0.15, z: -0.45 },
            vitreous: { x: 0.15, y: -0.15, z: -0.05 }
        };
        const hitR = Math.max(s.x, s.y, s.z) * 0.06;
        for (const key of allKeys) {
            if (assignedKeys.has(key)) continue;
            const a = eyeAnchors[key]; if (!a) continue;
            const posW = new THREE.Vector3(c.x + a.x * s.x, c.y + a.y * s.y, c.z + a.z * s.z);
            model.worldToLocal(posW);
            const geo = new THREE.SphereGeometry(hitR, 8, 8);
            const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0, depthWrite: false });
            const sphere = new THREE.Mesh(geo, mat);
            sphere.position.copy(posW);
            sphere.userData.organPartKey = key;
            sphere.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
            sphere.userData.isAnnotationHitMarker = true;
            model.add(sphere);
            assignedKeys.add(key);
        }
    } else if (modelId === 'stomach') {
        // Sort Object_N meshes by vertical position (Y), assign to keys in order
        const meshes = [];
        model.traverse((child) => {
            if (!child.isMesh) return;
            child.updateMatrixWorld(true);
            if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
            const wc = new THREE.Vector3();
            child.geometry.boundingBox.getCenter(wc);
            child.localToWorld(wc);
            meshes.push({ mesh: child, y: wc.y });
        });
        meshes.sort((a, b) => b.y - a.y); // top to bottom
        const stomachOrder = ['cardia', 'fundus', 'body', 'lesser_curvature', 'greater_curvature', 'pylorus', 'rugae', 'sphincter'];
        meshes.forEach((item, i) => {
            if (i < stomachOrder.length) {
                const key = stomachOrder[i];
                item.mesh.userData.organPartKey = key;
                item.mesh.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                assignedKeys.add(key);
            }
        });
    } else if (modelId === 'tooth') {
        // Group tooth meshes: lower jaw = root area, upper jaw = crown area, etc.
        const toothGroupMap = {
            'll1': 'root', 'll2': 'root', 'll3': 'root_canal', 'll4': 'root_canal',
            'll5': 'cementum', 'll7': 'cementum', 'll8': 'gingiva',
            'blinn10': 'gingiva', 'mandible': 'root',
            'ul1': 'crown', 'blinn14': 'enamel', 'blinn15': 'enamel',
            'blinn16': 'dentin', 'blinn17': 'dentin',
            'blinn18': 'crown', 'blinn19': 'pulp', 'blinn20': 'pulp'
        };
        model.traverse((child) => {
            if (!child.isMesh) return;
            const n = child.name.toLowerCase();
            for (const [pattern, key] of Object.entries(toothGroupMap)) {
                if (n.includes(pattern)) {
                    child.userData.organPartKey = key;
                    child.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                    assignedKeys.add(key);
                    break;
                }
            }
        });
    } else if (modelId === 'spine') {
        // Spine GLTF: 134 meshes with named vertebrae — map representative vertebrae to labels
        // Each label gets ONE representative vertebra for accurate highlight on click
        model.traverse((child) => {
            if (!child.isMesh) return;
            const n = child.name;
            let key = null;
            // Intervertebral discs mesh → disc
            if (n.includes('Intervertabral_Discs') && !assignedKeys.has('disc')) key = 'disc';
            // Representative vertebrae for each structural feature
            else if (n.includes('_L03_') && !assignedKeys.has('vertebral_body')) key = 'vertebral_body';
            else if (n.includes('_T08_') && !assignedKeys.has('spinous_process')) key = 'spinous_process';
            else if (n.includes('_T05_') && !assignedKeys.has('transverse_process')) key = 'transverse_process';
            else if (n.includes('_C05_') && !assignedKeys.has('spinal_canal')) key = 'spinal_canal';
            else if (n.includes('_L01_') && !assignedKeys.has('pedicle')) key = 'pedicle';
            else if (n.includes('_T01_') && !assignedKeys.has('lamina')) key = 'lamina';
            else if (n.includes('Sacrum') && !assignedKeys.has('facet_joint')) key = 'facet_joint';
            if (key) {
                child.userData.organPartKey = key;
                child.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                assignedKeys.add(key);
            }
        });
    } else if (modelId === 'hip_joint') {
        // HumanX hip model: Femur_2 (femur bone), Brackets_3 (hardware), Hipbone combined_4 (pelvis)
        const hipMeshMap = {
            'Object_4': 'femoral_head',     // Femur mesh — assign femoral structures
            'Object_6': 'joint_capsule',    // Brackets/ligaments mesh
            'Object_8': 'acetabulum',       // Hipbone part 1
            'Object_9': 'ilium'             // Hipbone part 2
        };
        model.traverse((child) => {
            if (!child.isMesh) return;
            const key = hipMeshMap[child.name];
            if (key) {
                child.userData.organPartKey = key;
                child.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                assignedKeys.add(key);
            }
        });
        // Place remaining hip structures via anchors on the new focused model
        model.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(model);
        const c = new THREE.Vector3(); box.getCenter(c);
        const s = new THREE.Vector3(); box.getSize(s);
        const hipAnchors = {
            femoral_neck: { x: 0.05, y: -0.15, z: 0.05 },
            greater_trochanter: { x: 0.25, y: -0.20, z: 0.00 },
            labrum: { x: -0.05, y: 0.05, z: 0.10 },
            ligament_teres: { x: 0.00, y: -0.05, z: 0.05 }
        };
        const hitR = Math.max(s.x, s.y, s.z) * 0.04;
        for (const key of allKeys) {
            if (assignedKeys.has(key)) continue;
            const a = hipAnchors[key];
            if (!a) continue;
            const posW = new THREE.Vector3(c.x + a.x * s.x, c.y + a.y * s.y, c.z + a.z * s.z);
            model.worldToLocal(posW);
            const geo = new THREE.SphereGeometry(hitR, 8, 8);
            const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0, depthWrite: false });
            const sphere = new THREE.Mesh(geo, mat);
            sphere.position.copy(posW);
            sphere.userData.organPartKey = key;
            sphere.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
            sphere.userData.isAnnotationHitMarker = true;
            model.add(sphere);
            assignedKeys.add(key);
        }
    } else if (modelId === 'skull') {
        // UMCG sagittal skull model: individually named bone meshes
        const skullMeshMap = {
            'Frontal_bone1': 'frontal_bone',
            'Left_parietal_bone': 'parietal_bone',
            'Left_temporal_bone': 'temporal_bone',
            'Occipital_bone1': 'occipital_bone',
            'Sphenoid_bone': 'sphenoid_bone',
            'Left_zygomatic_bone': 'zygomatic_bone',
            'Ethmoid2': 'maxilla',
            'PM3D_Cube3D12': 'mandible'
        };
        model.traverse((child) => {
            if (!child.isMesh) return;
            const key = skullMeshMap[child.name];
            if (key) {
                child.userData.organPartKey = key;
                child.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                assignedKeys.add(key);
            }
        });
    } else if (modelId === 'skin') {
        // Skin has 170 generic Object_N meshes — sort by vertical position, assign in bands
        const meshes = [];
        model.traverse((child) => {
            if (!child.isMesh) return;
            child.updateMatrixWorld(true);
            if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
            const wc = new THREE.Vector3();
            child.geometry.boundingBox.getCenter(wc);
            child.localToWorld(wc);
            meshes.push({ mesh: child, y: wc.y });
        });
        meshes.sort((a, b) => b.y - a.y); // top to bottom
        const skinKeys = ['epidermis', 'dermis', 'hypodermis', 'hair_follicle', 'sweat_gland', 'sebaceous_gland', 'blood_vessel', 'nerve_ending'];
        if (meshes.length > 0) {
            const bandSize = Math.ceil(meshes.length / skinKeys.length);
            meshes.forEach((item, i) => {
                const ki = Math.min(Math.floor(i / bandSize), skinKeys.length - 1);
                const key = skinKeys[ki];
                item.mesh.userData.organPartKey = key;
                item.mesh.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                assignedKeys.add(key);
            });
        }
    } else if (modelId === 'spinal_cord') {
        // Spinal Cord GLTF: 83+ meshes — map mesh GROUPS to anatomical labels for accurate highlighting
        // Groups: pia-cauda→white matter, arachnoidmater/dura→meninges, c6001→gray matter, etc.
        model.traverse((child) => {
            if (!child.isMesh) return;
            const pn = child.parent ? child.parent.name : '';
            // Map mesh groups to anatomical structures
            if (/^pia-cauda/i.test(pn) && !child.userData.organPartKey) {
                child.userData.organPartKey = 'white_matter';
                child.userData.structureName = detailsMap['white_matter'] ? detailsMap['white_matter'].legendLabel : 'white_matter';
                assignedKeys.add('white_matter');
            } else if (/^arachnoidmater/i.test(pn) && !child.userData.organPartKey) {
                child.userData.organPartKey = 'meninges_cord';
                child.userData.structureName = detailsMap['meninges_cord'] ? detailsMap['meninges_cord'].legendLabel : 'meninges_cord';
                assignedKeys.add('meninges_cord');
            } else if (/^dura/i.test(pn) && !child.userData.organPartKey) {
                child.userData.organPartKey = 'meninges_cord';
                child.userData.structureName = detailsMap['meninges_cord'] ? detailsMap['meninges_cord'].legendLabel : 'meninges_cord';
                assignedKeys.add('meninges_cord');
            } else if (/^c6001/i.test(pn) && !child.userData.organPartKey) {
                child.userData.organPartKey = 'gray_matter';
                child.userData.structureName = detailsMap['gray_matter'] ? detailsMap['gray_matter'].legendLabel : 'gray_matter';
                assignedKeys.add('gray_matter');
            } else if (/^L1001/i.test(pn) && !child.userData.organPartKey) {
                child.userData.organPartKey = 'central_canal';
                child.userData.structureName = detailsMap['central_canal'] ? detailsMap['central_canal'].legendLabel : 'central_canal';
                assignedKeys.add('central_canal');
            } else if (/^L-\d/i.test(pn) && !child.userData.organPartKey) {
                // Left nerve roots → dorsal root (sensory afferents)
                child.userData.organPartKey = 'dorsal_root';
                child.userData.structureName = detailsMap['dorsal_root'] ? detailsMap['dorsal_root'].legendLabel : 'dorsal_root';
                assignedKeys.add('dorsal_root');
            } else if (/^R-\d/i.test(pn) && !child.userData.organPartKey) {
                // Right nerve roots → ventral root (motor efferents)
                child.userData.organPartKey = 'ventral_root';
                child.userData.structureName = detailsMap['ventral_root'] ? detailsMap['ventral_root'].legendLabel : 'ventral_root';
                assignedKeys.add('ventral_root');
            }
        });
        // Remaining labels (dorsal_horn, ventral_horn) → anchor at C6 cross-section with offsets
        model.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(model);
        const ctr = new THREE.Vector3(); box.getCenter(ctr);
        const sz = new THREE.Vector3(); box.getSize(sz);
        let c6Center = null;
        model.traverse((child) => {
            if (child.name && /c6001/i.test(child.parent ? child.parent.name : '') && !c6Center) {
                child.updateMatrixWorld(true);
                const b = new THREE.Box3().setFromObject(child);
                c6Center = new THREE.Vector3(); b.getCenter(c6Center);
            }
        });
        if (!c6Center) c6Center = new THREE.Vector3(ctr.x, ctr.y + sz.y * 0.3, ctr.z);
        const latOff = sz.x * 0.04;
        const hornAnchors = {
            dorsal_horn: new THREE.Vector3(c6Center.x, c6Center.y, c6Center.z - latOff * 2),
            ventral_horn: new THREE.Vector3(c6Center.x, c6Center.y, c6Center.z + latOff * 2)
        };
        const hitR = Math.max(sz.x, sz.y, sz.z) * 0.02;
        for (const key of allKeys) {
            if (assignedKeys.has(key)) continue;
            const posW = hornAnchors[key];
            if (!posW) continue;
            const localPos = posW.clone();
            model.worldToLocal(localPos);
            const geo = new THREE.SphereGeometry(hitR, 8, 8);
            const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0, depthWrite: false });
            const sphere = new THREE.Mesh(geo, mat);
            sphere.position.copy(localPos);
            sphere.userData.organPartKey = key;
            sphere.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
            sphere.userData.isAnnotationHitMarker = true;
            model.add(sphere);
            assignedKeys.add(key);
        }
    } else if (modelId === 'adrenal_gland') {
        // Model contains kidneys, ureters, bladder AND the adrenal glands.
        // All 8 labels are for adrenal gland structures — focus on gland meshes only.
        model.updateMatrixWorld(true);
        const glandBox = new THREE.Box3();
        model.traverse((child) => {
            if (!child.isMesh) return;
            const n = child.name.toLowerCase();
            if (n.includes('gland')) { child.updateMatrixWorld(true); glandBox.expandByObject(child); }
        });
        if (glandBox.isEmpty()) glandBox.setFromObject(model);
        const gc = new THREE.Vector3(); glandBox.getCenter(gc);
        const gs = new THREE.Vector3(); glandBox.getSize(gs);
        const gAnchors = {
            zona_glomerulosa: { x: -0.30, y: 0.20, z: 0.25 },
            zona_fasciculata: { x: -0.15, y: 0.00, z: 0.30 },
            zona_reticularis: { x: 0.05, y: -0.20, z: 0.25 },
            adrenal_medulla: { x: 0.25, y: 0.00, z: 0.15 },
            cortex_outer: { x: 0.30, y: 0.25, z: 0.10 },
            capsule_adrenal: { x: 0.00, y: 0.40, z: 0.00 },
            adrenal_vein: { x: 0.00, y: -0.35, z: -0.15 },
            chromaffin_cells: { x: 0.20, y: -0.15, z: -0.20 }
        };
        const gHitR = Math.max(gs.x, gs.y, gs.z, 0.01) * 0.10;
        for (const key of allKeys) {
            const a = gAnchors[key]; if (!a) continue;
            const posW = new THREE.Vector3(gc.x + a.x * gs.x, gc.y + a.y * gs.y, gc.z + a.z * gs.z);
            model.worldToLocal(posW);
            const geo = new THREE.SphereGeometry(gHitR, 8, 8);
            const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0, depthWrite: false });
            const sphere = new THREE.Mesh(geo, mat);
            sphere.position.copy(posW);
            sphere.userData.organPartKey = key;
            sphere.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
            sphere.userData.isAnnotationHitMarker = true;
            model.add(sphere);
            assignedKeys.add(key);
        }
    } else if (modelId === 'bladder') {
        // Bladder GLTF: 9 meshes — map by parent name (spheres=body, cylinders=tubes)
        model.updateMatrixWorld(true);
        const meshInfos = [];
        model.traverse((child) => {
            if (!child.isMesh) return;
            child.updateMatrixWorld(true);
            if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
            const wc = new THREE.Vector3();
            child.geometry.boundingBox.getCenter(wc);
            child.localToWorld(wc);
            const pn = child.parent ? child.parent.name.toLowerCase() : '';
            meshInfos.push({ mesh: child, pos: wc, parent: pn });
        });
        // Separate spheres (body parts) and cylinders (tubes)
        const spheres = meshInfos.filter(m => m.parent.includes('sphere'));
        const cylinders = meshInfos.filter(m => m.parent.includes('cylinder'));
        // Spheres sorted top→bottom: dome, detrusor, mucosa
        spheres.sort((a, b) => b.pos.y - a.pos.y);
        const sphereKeys = ['dome', 'detrusor', 'mucosa_bladder'];
        spheres.forEach((s, i) => {
            if (i < sphereKeys.length && !assignedKeys.has(sphereKeys[i])) {
                s.mesh.userData.organPartKey = sphereKeys[i];
                s.mesh.userData.structureName = detailsMap[sphereKeys[i]] ? detailsMap[sphereKeys[i]].legendLabel : sphereKeys[i];
                assignedKeys.add(sphereKeys[i]);
            }
        });
        // Cylinders sorted top→bottom: ureters/orifice at top, urethra/sphincters at bottom
        cylinders.sort((a, b) => b.pos.y - a.pos.y);
        const cylKeys = ['ureteral_orifice', 'trigone', 'neck', 'internal_sphincter', 'external_sphincter'];
        cylinders.forEach((c, i) => {
            if (i < cylKeys.length && !assignedKeys.has(cylKeys[i])) {
                c.mesh.userData.organPartKey = cylKeys[i];
                c.mesh.userData.structureName = detailsMap[cylKeys[i]] ? detailsMap[cylKeys[i]].legendLabel : cylKeys[i];
                assignedKeys.add(cylKeys[i]);
            }
        });
    } else if (modelId === 'gallbladder_organ') {
        // "肝臟、膽囊" (Liver & Gallbladder) by 10930903MandyHo (CC BY 4.0)
        // Single mesh Object_2 — all 8 labels placed via anatomicalPositions fallback below.
    } else if (modelId === 'catheter') {
        // Named catheter parts: map to anatomy
        model.traverse((child) => {
            if (!child.isMesh) return;
            const n = child.name.toLowerCase();
            let key = null;
            if (n.includes('needle') || n.includes('object001')) key = 'catheter_tip';
            else if (n.includes('cylinder003')) key = 'collection_bag';
            else if (n.includes('cylinder001')) key = 'balloon';
            else if (n.includes('line001')) key = 'catheter_shaft';
            else if (n.includes('line002')) key = 'drainage_lumen';
            else if (n.includes('line003')) key = 'inflation_lumen';
            else if (n.includes('line004')) key = 'drainage_port';
            else if (n.includes('line005')) key = 'balloon_port';
            if (key && !assignedKeys.has(key)) {
                child.userData.organPartKey = key;
                child.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                assignedKeys.add(key);
            }
        });
    } else if (modelId === 'small_intestine') {
        // Tunntarm = small intestine, Tjocktarm = large intestine (Swedish)
        model.traverse((child) => {
            if (!child.isMesh) return;
            const n = child.name.toLowerCase();
            let key = null;
            if (n.includes('tunntarm')) key = 'jejunum';
            else if (n.includes('tjocktarm') && !assignedKeys.has('ileocecal_valve')) key = 'ileocecal_valve';
            else if (n.includes('tjocktarm') && !assignedKeys.has('mesentery')) key = 'mesentery';
            if (key && !assignedKeys.has(key)) {
                child.userData.organPartKey = key;
                child.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                assignedKeys.add(key);
            }
        });
    } else if (modelId === 'human_cell') {
        // Named organelle meshes: Sphere, Icosphere, BezierCurve, Roundcube
        model.traverse((child) => {
            if (!child.isMesh) return;
            const n = child.name.toLowerCase();
            let key = null;
            if (n === 'icosphere_0' || n === 'icosphere') key = 'cell_membrane';
            else if (n.includes('roundcube.000') || n.includes('roundcube000')) key = 'mitochondria';
            else if (n.includes('beziercurve_0') || (n.includes('beziercurve') && !n.includes('002'))) key = 'endoplasmic_reticulum';
            else if (n.includes('beziercurve.002') || n.includes('beziercurve002')) key = 'golgi_apparatus';
            else if (n.includes('sphere.001') || n.includes('sphere001')) key = 'nucleus';
            else if (n.includes('roundcube.001') || n.includes('roundcube001')) key = 'ribosome';
            else if (n.includes('icosphere.002') || n.includes('icosphere002')) key = 'lysosome';
            if (key && !assignedKeys.has(key)) {
                child.userData.organPartKey = key;
                child.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                assignedKeys.add(key);
            }
        });
    } else if (modelId === 'urinary_system') {
        // 26 meshes, labels focus on urinary structures. Sort by Y to map superior→inferior.
        const meshes = [];
        model.traverse((child) => {
            if (!child.isMesh) return;
            child.updateMatrixWorld(true);
            if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
            const wc = new THREE.Vector3();
            child.geometry.boundingBox.getCenter(wc);
            child.localToWorld(wc);
            meshes.push({ mesh: child, y: wc.y, x: wc.x });
        });
        meshes.sort((a, b) => b.y - a.y);
        // Top meshes → kidneys/adrenal, bottom → bladder/urethra
        const usOrder = ['adrenal', 'kidney_cortex', 'kidney_medulla', 'renal_pelvis', 'renal_artery', 'ureter', 'bladder_urinary', 'urethra'];
        const bandSize = Math.max(1, Math.ceil(meshes.length / usOrder.length));
        meshes.forEach((item, i) => {
            const ki = Math.min(Math.floor(i / bandSize), usOrder.length - 1);
            const key = usOrder[ki];
            if (!item.mesh.userData.organPartKey) {
                item.mesh.userData.organPartKey = key;
                item.mesh.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                assignedKeys.add(key);
            }
        });
    } else if (modelId === 'male_reproductive') {
        // 51 meshes in named parent groups — group-based mapping for accuracy
        model.updateMatrixWorld(true);
        const groups = {};
        model.traverse((child) => {
            if (!child.isMesh) return;
            const pn = child.parent ? child.parent.name : 'unknown';
            if (!groups[pn]) groups[pn] = { meshes: [], box: new THREE.Box3() };
            groups[pn].meshes.push(child);
            child.updateMatrixWorld(true);
            groups[pn].box.expandByObject(child);
        });
        // Sort groups by Y position (top→bottom) for spatial mapping
        const groupList = Object.entries(groups).map(([name, data]) => {
            const gc = new THREE.Vector3(); data.box.getCenter(gc);
            return { name, meshes: data.meshes, center: gc };
        });
        groupList.sort((a, b) => b.center.y - a.center.y);
        // Map sorted groups to male reproductive structures
        const mrOrder = ['seminal_vesicle', 'vas_deferens', 'prostate', 'urethra_male', 'penis_structure', 'epididymis', 'testis', 'scrotum'];
        const bandSz = Math.max(1, Math.ceil(groupList.length / mrOrder.length));
        groupList.forEach((group, gi) => {
            const ki = Math.min(Math.floor(gi / bandSz), mrOrder.length - 1);
            const key = mrOrder[ki];
            group.meshes.forEach(mesh => {
                if (!mesh.userData.organPartKey) {
                    mesh.userData.organPartKey = key;
                    mesh.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                    assignedKeys.add(key);
                }
            });
        });
    } else if (modelId === 'female_reproductive') {
        // 3 meshes — map by vertex count (largest=uterus) and position for tubes/cervix
        const meshInfos = [];
        model.traverse((child) => {
            if (!child.isMesh) return;
            child.updateMatrixWorld(true);
            if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
            const wc = new THREE.Vector3();
            child.geometry.boundingBox.getCenter(wc);
            child.localToWorld(wc);
            const vc = child.geometry.attributes.position ? child.geometry.attributes.position.count : 0;
            meshInfos.push({ mesh: child, pos: wc, vc: vc });
        });
        // Largest mesh → uterus body
        meshInfos.sort((a, b) => b.vc - a.vc);
        if (meshInfos.length >= 1) {
            meshInfos[0].mesh.userData.organPartKey = 'uterus_body';
            meshInfos[0].mesh.userData.structureName = detailsMap['uterus_body'] ? detailsMap['uterus_body'].legendLabel : 'uterus_body';
            assignedKeys.add('uterus_body');
        }
        // Remaining by Y position: higher → fallopian tube, lower → cervix
        const remaining = meshInfos.slice(1);
        remaining.sort((a, b) => b.pos.y - a.pos.y);
        if (remaining.length >= 1) {
            remaining[0].mesh.userData.organPartKey = 'fallopian_tube';
            remaining[0].mesh.userData.structureName = detailsMap['fallopian_tube'] ? detailsMap['fallopian_tube'].legendLabel : 'fallopian_tube';
            assignedKeys.add('fallopian_tube');
        }
        if (remaining.length >= 2) {
            remaining[1].mesh.userData.organPartKey = 'cervix';
            remaining[1].mesh.userData.structureName = detailsMap['cervix'] ? detailsMap['cervix'].legendLabel : 'cervix';
            assignedKeys.add('cervix');
        }
    } else if (modelId === 'large_intestine') {
        // 9 meshes in two groups (some near origin, some offset).
        // Assign the larger/offset meshes to colon segments by position.
        const meshes = [];
        model.traverse((child) => {
            if (!child.isMesh) return;
            child.updateMatrixWorld(true);
            if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
            const wc = new THREE.Vector3();
            child.geometry.boundingBox.getCenter(wc);
            child.localToWorld(wc);
            const vc = child.geometry.attributes.position ? child.geometry.attributes.position.count : 0;
            meshes.push({ mesh: child, x: wc.x, y: wc.y, z: wc.z, vc: vc });
        });
        // Sort by Y to distribute along the colon path (cecum bottom-right → rectum bottom-center)
        meshes.sort((a, b) => b.y - a.y);
        const liOrder = ['transverse_colon', 'ascending_colon', 'descending_colon', 'cecum', 'sigmoid_colon', 'rectum', 'appendix', 'anal_canal'];
        const liBandSz = Math.max(1, Math.ceil(meshes.length / liOrder.length));
        meshes.forEach((item, i) => {
            const ki = Math.min(Math.floor(i / liBandSz), liOrder.length - 1);
            const key = liOrder[ki];
            if (!item.mesh.userData.organPartKey) {
                item.mesh.userData.organPartKey = key;
                item.mesh.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                assignedKeys.add(key);
            }
        });
    } else if (modelId === 'ear') {
        // New model: single mesh (Object_0) — all labels placed via Phase 2 anatomical positions
        // No mesh-to-key mapping needed
    } else if (modelId === 'muscular_system') {
        // Named meshes: body_low (main body), Eye2/Eye3 (eyes)
        model.traverse((child) => {
            if (!child.isMesh) return;
            const n = child.name.toLowerCase();
            if (n.includes('body_low')) {
                child.userData.organPartKey = 'abdominals';
                child.userData.structureName = detailsMap['abdominals'] ? detailsMap['abdominals'].legendLabel : 'abdominals';
                assignedKeys.add('abdominals');
            }
        });
    } else if (modelId === 'knee_joint') {
        // Named meshes: Bone_Low (bone), Mash_Low (meniscus), Transparenty_Low (ligaments)
        model.traverse((child) => {
            if (!child.isMesh) return;
            const n = child.name.toLowerCase();
            let key = null;
            if (n.includes('bone_low')) key = 'femur_condyle';
            else if (n.includes('mash_low')) key = 'meniscus';
            else if (n.includes('transparenty')) key = 'acl';
            if (key && !assignedKeys.has(key)) {
                child.userData.organPartKey = key;
                child.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                assignedKeys.add(key);
            }
        });
    } else if (modelId === 'shoulder_joint') {
        // Named meshes: pCube10_bone (bones), polySurface1_muscules (muscles)
        model.traverse((child) => {
            if (!child.isMesh) return;
            const n = child.name.toLowerCase();
            let key = null;
            if (n.includes('bone')) key = 'humeral_head';
            else if (n.includes('muscul')) key = 'rotator_cuff';
            if (key && !assignedKeys.has(key)) {
                child.userData.organPartKey = key;
                child.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                assignedKeys.add(key);
            }
        });
    } else if (modelId === 'inner_ear') {
        // 10 Object_N meshes — sort by position to map to cochlea, vestibule, canals, etc.
        const meshes = [];
        model.traverse((child) => {
            if (!child.isMesh) return;
            child.updateMatrixWorld(true);
            if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
            const wc = new THREE.Vector3();
            child.geometry.boundingBox.getCenter(wc);
            child.localToWorld(wc);
            meshes.push({ mesh: child, x: wc.x, y: wc.y, z: wc.z });
        });
        // Sort by Z then Y for inner ear anatomy (cochlea inferior, canals superior)
        meshes.sort((a, b) => (b.z - a.z) || (b.y - a.y));
        const ieOrder = ['semicircular_canals', 'endolymph', 'vestibule', 'oval_window', 'round_window', 'cochlea', 'organ_corti', 'auditory_nerve'];
        const ieBandSz = Math.max(1, Math.ceil(meshes.length / ieOrder.length));
        meshes.forEach((item, i) => {
            const ki = Math.min(Math.floor(i / ieBandSz), ieOrder.length - 1);
            const key = ieOrder[ki];
            if (!item.mesh.userData.organPartKey) {
                item.mesh.userData.organPartKey = key;
                item.mesh.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                assignedKeys.add(key);
            }
        });
    } else if (modelId === 'thyroid') {
        // 15 Object_N meshes — sort by X to distinguish left/right lobes
        const meshes = [];
        model.traverse((child) => {
            if (!child.isMesh) return;
            child.updateMatrixWorld(true);
            if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
            const wc = new THREE.Vector3();
            child.geometry.boundingBox.getCenter(wc);
            child.localToWorld(wc);
            meshes.push({ mesh: child, x: wc.x, y: wc.y });
        });
        meshes.sort((a, b) => a.x - b.x);
        const thOrder = ['left_lobe_thyroid', 'parafollicular_cells', 'isthmus', 'pyramidal_lobe', 'follicular_cells', 'thyroid_vessels', 'parathyroid', 'right_lobe_thyroid'];
        const thBandSz = Math.max(1, Math.ceil(meshes.length / thOrder.length));
        meshes.forEach((item, i) => {
            const ki = Math.min(Math.floor(i / thBandSz), thOrder.length - 1);
            const key = thOrder[ki];
            if (!item.mesh.userData.organPartKey) {
                item.mesh.userData.organPartKey = key;
                item.mesh.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                assignedKeys.add(key);
            }
        });
    } else if (modelId === 'lymph_node') {
        // Many PM3D_Sphere meshes — group by distance from center for cortex→medulla layering
        model.updateMatrixWorld(true);
        const lnBox = new THREE.Box3().setFromObject(model);
        const lnCenter = new THREE.Vector3(); lnBox.getCenter(lnCenter);
        const meshes = [];
        model.traverse((child) => {
            if (!child.isMesh) return;
            child.updateMatrixWorld(true);
            if (!child.geometry.boundingBox) child.geometry.computeBoundingBox();
            const wc = new THREE.Vector3();
            child.geometry.boundingBox.getCenter(wc);
            child.localToWorld(wc);
            const dist = wc.distanceTo(lnCenter);
            meshes.push({ mesh: child, dist: dist });
        });
        meshes.sort((a, b) => a.dist - b.dist);
        const lnOrder = ['medulla_lymph', 'germinal_center', 'paracortex', 'cortex_lymph', 'hilum_lymph', 'afferent_vessel', 'efferent_vessel', 'capsule_lymph'];
        const lnBandSz = Math.max(1, Math.ceil(meshes.length / lnOrder.length));
        meshes.forEach((item, i) => {
            const ki = Math.min(Math.floor(i / lnBandSz), lnOrder.length - 1);
            const key = lnOrder[ki];
            if (!item.mesh.userData.organPartKey) {
                item.mesh.userData.organPartKey = key;
                item.mesh.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                assignedKeys.add(key);
            }
        });
    } else if (modelId === 'pituitary') {
        // Limbic System model with descriptive parent node names containing structure IDs
        model.traverse((child) => {
            if (!child.isMesh) return;
            // Walk up parent chain looking for descriptive node name
            let node = child.parent;
            let pn = '';
            while (node) {
                if (node.name && node.name.length > 20) { pn = node.name.toLowerCase(); break; }
                node = node.parent;
            }
            let key = null;
            if (pn.includes('hypothalamus_and_pituitary')) key = 'hypothalamus_pituitary';
            else if (pn.includes('optic_chiasm')) key = 'optic_chiasm_pit';
            else if (pn.includes('thalamus') && !pn.includes('stria')) key = 'thalamus';
            else if (pn.includes('mammillary_bodies')) key = 'mammillary_bodies';
            else if (pn.includes('hippocampus')) key = 'hippocampus';
            else if (pn.includes('amygdala')) key = 'amygdala';
            else if (pn.includes('pineal_gland')) key = 'pineal_gland';
            else if (pn.includes('brain_stem') || pn.includes('pons')) key = 'brain_stem_pit';
            if (key) {
                child.userData.organPartKey = key;
                child.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
                assignedKeys.add(key);
            }
        });
    }

    // --- Phase 2: create invisible annotation spheres for unmapped keys ---
    const missingKeys = allKeys.filter(k => !assignedKeys.has(k));

    // Track annotation accuracy before potential early return
    let directCount = 0, anchorCount = 0;
    const directKeysSet = new Set(), anchorKeysSet = new Set();
    model.traverse((child) => {
        if (!child.isMesh) return;
        if (child.userData.isAnnotationHitMarker) anchorKeysSet.add(child.userData.organPartKey);
        else if (child.userData.organPartKey) directKeysSet.add(child.userData.organPartKey);
    });
    directCount = directKeysSet.size;
    anchorCount = anchorKeysSet.size;

    if (missingKeys.length === 0) {
        const total = directCount + anchorCount;
        const cfg = modelConfig[modelId];
        const isCustomPath = cfg && cfg.annotationPath === 'custom';
        model.userData.annotationAccuracy = total > 0
            ? (isCustomPath ? 'custom' : directCount === total ? 'mesh' : directCount > 0 ? 'partial' : 'approximate')
            : 'none';
        model.userData.directMeshCount = directCount;
        model.userData.anchorCount = anchorCount;
        return;
    }

    // Compute model bounding box
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z, 0.01);

    // Model-specific anatomical positions for annotation spheres
    // Values are fractions of bounding box size from center (-0.5 to 0.5)
    const anatomicalPositions = {
        liver: {
            right_lobe: { x: 0.30, y: 0.05, z: 0.15 },
            left_lobe: { x: -0.35, y: 0.10, z: 0.20 },
            caudate_lobe: { x: -0.10, y: 0.25, z: -0.25 },
            quadrate_lobe: { x: -0.15, y: -0.15, z: 0.25 },
            gallbladder: { x: 0.15, y: -0.20, z: 0.30 },
            hepatic_artery: { x: 0.05, y: -0.05, z: -0.10 },
            portal_vein: { x: 0.10, y: 0.00, z: -0.20 },
            bile_duct: { x: 0.20, y: -0.10, z: -0.05 }
        },
        eye: {
            sclera: { x: 0.30, y: 0.10, z: 0.00 },
            cornea: { x: 0.00, y: 0.00, z: 0.45 },
            iris: { x: 0.00, y: 0.10, z: 0.35 },
            pupil: { x: 0.00, y: 0.00, z: 0.38 },
            lens: { x: 0.00, y: 0.00, z: 0.15 },
            retina: { x: 0.00, y: 0.05, z: -0.35 },
            optic_nerve: { x: 0.00, y: -0.10, z: -0.48 },
            vitreous: { x: 0.20, y: -0.05, z: -0.10 }
        },
        skull: {
            frontal_bone: { x: 0.00, y: 0.30, z: 0.35 },
            parietal_bone: { x: 0.20, y: 0.35, z: -0.05 },
            temporal_bone: { x: 0.35, y: 0.00, z: -0.05 },
            occipital_bone: { x: 0.00, y: 0.10, z: -0.40 },
            sphenoid_bone: { x: -0.20, y: 0.05, z: 0.10 },
            mandible: { x: 0.00, y: -0.40, z: 0.20 },
            maxilla: { x: 0.00, y: -0.10, z: 0.35 },
            zygomatic_bone: { x: 0.30, y: -0.05, z: 0.25 }
        },
        knee_joint: {
            femur_condyle: { x: 0.00, y: 0.30, z: 0.10 },
            tibia_plateau: { x: 0.00, y: -0.10, z: 0.10 },
            patella: { x: 0.00, y: 0.10, z: 0.40 },
            acl: { x: 0.05, y: 0.05, z: 0.00 },
            pcl: { x: -0.05, y: 0.05, z: -0.10 },
            meniscus: { x: 0.20, y: 0.00, z: 0.05 },
            mcl: { x: -0.35, y: 0.05, z: 0.00 },
            lcl: { x: 0.35, y: 0.05, z: 0.00 }
        },
        shoulder_joint: {
            humeral_head: { x: 0.00, y: -0.10, z: 0.00 },
            glenoid: { x: -0.20, y: 0.05, z: -0.10 },
            rotator_cuff: { x: 0.15, y: 0.25, z: -0.10 },
            acromion: { x: 0.00, y: 0.35, z: 0.05 },
            clavicle: { x: 0.30, y: 0.30, z: 0.15 },
            labrum_shoulder: { x: -0.15, y: 0.00, z: 0.10 },
            biceps_tendon: { x: 0.10, y: -0.25, z: 0.20 },
            deltoid: { x: 0.30, y: 0.05, z: 0.15 }
        },
        hand: {
            carpals: { x: 0.00, y: 0.30, z: 0.00 },
            metacarpals: { x: 0.00, y: 0.10, z: 0.00 },
            proximal_phalanx: { x: 0.05, y: -0.10, z: 0.00 },
            middle_phalanx: { x: 0.05, y: -0.25, z: 0.00 },
            distal_phalanx: { x: 0.05, y: -0.40, z: 0.00 },
            scaphoid: { x: -0.20, y: 0.30, z: 0.05 },
            lunate: { x: 0.15, y: 0.35, z: 0.05 },
            thumb: { x: -0.35, y: 0.05, z: 0.05 }
        },
        foot: {
            calcaneus: { x: 0.00, y: 0.00, z: -0.35 },
            talus: { x: 0.00, y: 0.15, z: -0.20 },
            navicular: { x: -0.10, y: 0.10, z: -0.05 },
            cuboid: { x: 0.15, y: 0.00, z: 0.00 },
            metatarsals_foot: { x: 0.00, y: 0.00, z: 0.20 },
            phalanges_foot: { x: 0.00, y: 0.00, z: 0.40 },
            arch: { x: -0.15, y: -0.10, z: 0.05 },
            cuneiforms: { x: -0.10, y: 0.05, z: 0.10 }
        },
        pelvis: {
            ilium_pelvis: { x: 0.30, y: 0.25, z: 0.00 },
            ischium: { x: 0.20, y: -0.30, z: -0.05 },
            pubis: { x: 0.00, y: -0.20, z: 0.30 },
            sacrum_pelvis: { x: 0.00, y: 0.15, z: -0.30 },
            coccyx: { x: 0.00, y: -0.10, z: -0.35 },
            acetabulum_pelvis: { x: 0.30, y: -0.10, z: 0.10 },
            pubic_symphysis: { x: 0.00, y: -0.25, z: 0.25 },
            pelvic_inlet: { x: -0.25, y: 0.05, z: 0.05 }
        },
        muscular_system: {
            pectoralis: { x: 0.15, y: 0.25, z: 0.20 },
            biceps: { x: 0.35, y: 0.10, z: 0.10 },
            quadriceps: { x: 0.15, y: -0.25, z: 0.15 },
            deltoid_muscle: { x: 0.40, y: 0.25, z: 0.00 },
            trapezius: { x: 0.00, y: 0.35, z: -0.15 },
            abdominals: { x: 0.00, y: 0.00, z: 0.20 },
            gastrocnemius: { x: 0.10, y: -0.40, z: -0.10 },
            latissimus: { x: -0.25, y: 0.15, z: -0.10 }
        },
        esophagus: {
            esophagus_tube: { x: 0.00, y: 0.42, z: 0.05 },
            stomach_organ: { x: 0.05, y: 0.10, z: 0.10 },
            liver_organ: { x: -0.20, y: 0.05, z: 0.05 },
            gallbladder_organ: { x: -0.15, y: -0.05, z: 0.10 },
            small_intestine_tract: { x: 0.00, y: -0.20, z: 0.10 },
            large_intestine_tract: { x: 0.15, y: -0.35, z: 0.05 }
        },
        small_intestine: {
            duodenum: { x: 0.25, y: 0.30, z: 0.05 },
            jejunum: { x: -0.15, y: 0.10, z: 0.10 },
            ileum: { x: 0.10, y: -0.15, z: 0.10 },
            villi: { x: -0.30, y: 0.25, z: 0.00 },
            plicae_circulares: { x: 0.30, y: 0.00, z: 0.05 },
            mesentery: { x: 0.00, y: 0.00, z: -0.25 },
            ileocecal_valve: { x: 0.20, y: -0.30, z: 0.00 },
            brunner_glands: { x: 0.30, y: 0.35, z: -0.05 }
        },
        large_intestine: {
            cecum: { x: 0.30, y: -0.30, z: 0.05 },
            ascending_colon: { x: 0.35, y: -0.05, z: 0.00 },
            transverse_colon: { x: 0.00, y: 0.25, z: 0.05 },
            descending_colon: { x: -0.35, y: -0.05, z: 0.00 },
            sigmoid_colon: { x: -0.20, y: -0.30, z: 0.05 },
            rectum: { x: 0.00, y: -0.40, z: -0.10 },
            appendix: { x: 0.25, y: -0.40, z: 0.10 },
            anal_canal: { x: 0.00, y: -0.45, z: 0.00 }
        },
        pancreas: {
            head_pancreas: { x: 0.30, y: 0.00, z: 0.05 },
            body_pancreas: { x: 0.00, y: 0.05, z: 0.00 },
            tail_pancreas: { x: -0.35, y: 0.05, z: -0.05 },
            pancreatic_duct: { x: 0.10, y: -0.10, z: 0.05 },
            islets_langerhans: { x: -0.15, y: 0.10, z: 0.10 },
            uncinate_process: { x: 0.30, y: -0.20, z: 0.00 },
            common_bile_duct_pancreas: { x: 0.35, y: 0.20, z: 0.05 },
            ampulla_vater: { x: 0.25, y: -0.05, z: 0.10 }
        },
        tongue: {
            dorsum: { x: 0.00, y: 0.10, z: 0.00 },
            ventral_surface: { x: 0.00, y: -0.10, z: 0.05 },
            taste_buds: { x: 0.00, y: 0.10, z: -0.25 },
            frenulum: { x: 0.00, y: -0.15, z: 0.25 },
            intrinsic_muscles: { x: 0.15, y: 0.00, z: 0.10 },
            extrinsic_muscles: { x: -0.15, y: 0.00, z: 0.30 },
            lingual_tonsil: { x: 0.00, y: 0.05, z: -0.40 },
            papillae: { x: 0.15, y: 0.10, z: -0.10 }
        },
        larynx: {
            epiglottis: { x: 0.00, y: 0.40, z: 0.15 },
            thyroid_cartilage: { x: 0.00, y: 0.20, z: 0.25 },
            cricoid_cartilage: { x: 0.00, y: -0.05, z: 0.15 },
            vocal_cords: { x: 0.00, y: 0.10, z: 0.05 },
            tracheal_rings: { x: 0.00, y: -0.30, z: 0.10 },
            arytenoid: { x: 0.15, y: 0.10, z: -0.10 },
            glottis: { x: 0.00, y: 0.15, z: 0.00 },
            cricothyroid_membrane: { x: 0.00, y: 0.05, z: 0.25 }
        },
        diaphragm: {
            central_tendon: { x: 0.00, y: 0.10, z: 0.00 },
            right_crus: { x: 0.20, y: -0.15, z: -0.25 },
            left_crus: { x: -0.20, y: -0.15, z: -0.25 },
            aortic_hiatus: { x: 0.00, y: -0.10, z: -0.30 },
            esophageal_hiatus: { x: 0.05, y: 0.00, z: -0.15 },
            caval_opening: { x: 0.15, y: 0.10, z: 0.05 },
            costal_part: { x: 0.35, y: -0.05, z: 0.10 },
            sternal_part: { x: 0.00, y: 0.00, z: 0.35 }
        },
        bladder: {
            detrusor: { x: 0.20, y: 0.10, z: 0.10 },
            trigone: { x: 0.00, y: -0.15, z: -0.10 },
            ureteral_orifice: { x: 0.15, y: -0.05, z: -0.20 },
            internal_sphincter: { x: 0.00, y: -0.35, z: 0.00 },
            external_sphincter: { x: 0.00, y: -0.42, z: 0.05 },
            dome: { x: 0.00, y: 0.35, z: 0.05 },
            neck: { x: 0.00, y: -0.25, z: 0.05 },
            mucosa_bladder: { x: -0.20, y: 0.05, z: 0.15 }
        },
        urinary_system: {
            kidney_cortex: { x: 0.25, y: 0.30, z: 0.00 },
            kidney_medulla: { x: -0.25, y: 0.30, z: 0.00 },
            renal_pelvis: { x: 0.15, y: 0.20, z: 0.10 },
            ureter: { x: 0.10, y: 0.00, z: 0.05 },
            bladder_urinary: { x: 0.00, y: -0.30, z: 0.10 },
            urethra: { x: 0.00, y: -0.42, z: 0.05 },
            renal_artery: { x: -0.15, y: 0.25, z: 0.10 },
            adrenal: { x: 0.20, y: 0.40, z: 0.05 }
        },
        adrenal_gland: {
            zona_glomerulosa: { x: 0.20, y: 0.30, z: 0.10 },
            zona_fasciculata: { x: 0.20, y: 0.10, z: 0.10 },
            zona_reticularis: { x: 0.15, y: -0.10, z: 0.05 },
            adrenal_medulla: { x: 0.00, y: 0.00, z: 0.00 },
            cortex_outer: { x: -0.25, y: 0.20, z: 0.05 },
            capsule_adrenal: { x: 0.00, y: 0.40, z: 0.00 },
            adrenal_vein: { x: -0.15, y: -0.25, z: 0.10 },
            chromaffin_cells: { x: 0.00, y: -0.15, z: -0.10 }
        },
        male_reproductive: {
            testis: { x: 0.15, y: -0.35, z: 0.10 },
            epididymis: { x: 0.20, y: -0.25, z: -0.10 },
            vas_deferens: { x: 0.10, y: -0.05, z: 0.00 },
            seminal_vesicle: { x: -0.15, y: 0.10, z: -0.15 },
            prostate: { x: 0.00, y: 0.00, z: 0.15 },
            urethra_male: { x: 0.00, y: -0.15, z: 0.20 },
            penis_structure: { x: 0.00, y: -0.20, z: 0.30 },
            scrotum: { x: 0.00, y: -0.40, z: 0.15 }
        },
        female_reproductive: {
            ovary: { x: 0.35, y: 0.10, z: 0.00 },
            fallopian_tube: { x: 0.25, y: 0.30, z: 0.00 },
            uterus_body: { x: 0.00, y: 0.10, z: 0.05 },
            cervix: { x: 0.00, y: -0.15, z: 0.00 },
            vagina: { x: 0.00, y: -0.35, z: 0.05 },
            endometrium: { x: -0.10, y: 0.05, z: 0.10 },
            myometrium: { x: 0.15, y: 0.00, z: -0.10 },
            broad_ligament: { x: -0.30, y: 0.15, z: -0.05 }
        },
        inner_ear: {
            cochlea: { x: -0.15, y: -0.15, z: 0.15 },
            vestibule: { x: 0.00, y: 0.00, z: 0.00 },
            semicircular_canals: { x: 0.05, y: 0.30, z: -0.10 },
            oval_window: { x: 0.25, y: 0.05, z: 0.15 },
            round_window: { x: 0.25, y: -0.10, z: 0.10 },
            organ_corti: { x: -0.25, y: -0.20, z: 0.05 },
            auditory_nerve: { x: -0.30, y: -0.05, z: -0.15 },
            endolymph: { x: 0.10, y: 0.20, z: 0.05 }
        },
        thyroid: {
            right_lobe_thyroid: { x: 0.25, y: 0.00, z: 0.10 },
            left_lobe_thyroid: { x: -0.25, y: 0.00, z: 0.10 },
            isthmus: { x: 0.00, y: -0.10, z: 0.20 },
            pyramidal_lobe: { x: 0.05, y: 0.30, z: 0.10 },
            follicular_cells: { x: 0.15, y: 0.15, z: 0.00 },
            parafollicular_cells: { x: -0.15, y: 0.15, z: 0.00 },
            parathyroid: { x: 0.20, y: 0.05, z: -0.20 },
            thyroid_vessels: { x: 0.00, y: 0.35, z: -0.05 }
        },
        pituitary: {
            hypothalamus_pituitary: { x: 0.00, y: -0.15, z: 0.20 },
            optic_chiasm_pit: { x: 0.00, y: -0.20, z: 0.30 },
            thalamus: { x: 0.20, y: 0.10, z: 0.00 },
            mammillary_bodies: { x: 0.00, y: -0.25, z: 0.10 },
            hippocampus: { x: -0.25, y: -0.10, z: -0.10 },
            amygdala: { x: -0.25, y: -0.20, z: 0.10 },
            pineal_gland: { x: 0.00, y: 0.15, z: -0.20 },
            brain_stem_pit: { x: 0.00, y: -0.30, z: -0.15 }
        },
        lymph_node: {
            cortex_lymph: { x: 0.20, y: 0.20, z: 0.10 },
            paracortex: { x: 0.10, y: 0.00, z: 0.05 },
            medulla_lymph: { x: -0.10, y: -0.10, z: 0.00 },
            germinal_center: { x: 0.15, y: 0.15, z: 0.15 },
            afferent_vessel: { x: 0.30, y: 0.30, z: 0.00 },
            efferent_vessel: { x: -0.25, y: -0.25, z: 0.05 },
            hilum_lymph: { x: -0.30, y: -0.15, z: -0.10 },
            capsule_lymph: { x: 0.00, y: 0.35, z: 0.00 }
        },
        ear: {
            pinna: { x: 0.30, y: 0.15, z: 0.10 },
            ear_canal: { x: 0.10, y: 0.00, z: 0.00 },
            tympanic_membrane: { x: -0.05, y: 0.00, z: 0.00 },
            malleus: { x: -0.15, y: 0.10, z: 0.05 },
            incus: { x: -0.20, y: 0.10, z: -0.05 },
            stapes: { x: -0.25, y: 0.05, z: -0.05 },
            eustachian_tube: { x: -0.15, y: -0.25, z: 0.10 },
            mastoid: { x: 0.20, y: -0.20, z: -0.15 }
        },
        blood_cells: {
            rbc: { x: 0.00, y: 0.25, z: 0.15 },
            neutrophil: { x: 0.25, y: 0.10, z: 0.00 },
            lymphocyte: { x: -0.25, y: 0.10, z: 0.00 },
            monocyte: { x: 0.00, y: -0.05, z: 0.20 },
            eosinophil: { x: 0.25, y: -0.15, z: -0.10 },
            basophil: { x: -0.25, y: -0.15, z: -0.10 },
            platelet: { x: 0.10, y: -0.30, z: 0.10 },
            plasma: { x: -0.10, y: -0.30, z: 0.10 }
        },
        human_cell: {
            nucleus: { x: 0.00, y: 0.00, z: 0.00 },
            mitochondria: { x: 0.25, y: 0.10, z: 0.10 },
            endoplasmic_reticulum: { x: -0.20, y: 0.15, z: 0.05 },
            golgi_apparatus: { x: 0.15, y: -0.15, z: 0.10 },
            cell_membrane: { x: 0.00, y: 0.40, z: 0.00 },
            ribosome: { x: -0.15, y: -0.10, z: -0.15 },
            lysosome: { x: 0.20, y: -0.20, z: -0.10 },
            cytoplasm: { x: -0.30, y: -0.05, z: 0.15 }
        },
        dna: {
            double_helix: { x: 0.00, y: 0.35, z: 0.10 },
            base_pairs: { x: 0.00, y: 0.15, z: 0.00 },
            sugar_phosphate: { x: 0.20, y: 0.00, z: 0.10 },
            adenine: { x: 0.15, y: -0.10, z: 0.05 },
            thymine: { x: -0.15, y: -0.10, z: 0.05 },
            guanine: { x: 0.15, y: -0.25, z: 0.05 },
            cytosine: { x: -0.15, y: -0.25, z: 0.05 },
            hydrogen_bonds: { x: 0.00, y: -0.35, z: 0.00 }
        },
        iv_setup: {
            iv_bag: { x: 0.00, y: 0.40, z: 0.05 },
            drip_chamber: { x: 0.00, y: 0.25, z: 0.10 },
            roller_clamp: { x: 0.00, y: 0.10, z: 0.10 },
            tubing: { x: 0.10, y: 0.00, z: 0.05 },
            y_port: { x: 0.15, y: -0.05, z: 0.05 },
            cannula: { x: 0.00, y: -0.35, z: 0.10 },
            flow_regulator: { x: -0.10, y: 0.05, z: 0.10 },
            spike: { x: 0.00, y: 0.35, z: -0.10 }
        },
        catheter: {
            catheter_tip: { x: 0.00, y: -0.40, z: 0.05 },
            balloon: { x: 0.00, y: -0.30, z: 0.10 },
            drainage_lumen: { x: 0.05, y: -0.10, z: 0.05 },
            inflation_lumen: { x: -0.05, y: 0.00, z: 0.05 },
            drainage_port: { x: 0.10, y: 0.30, z: 0.05 },
            balloon_port: { x: -0.10, y: 0.35, z: 0.05 },
            catheter_shaft: { x: 0.00, y: 0.10, z: 0.00 },
            collection_bag: { x: 0.15, y: 0.40, z: 0.10 }
        },
        gallbladder_organ: {
            gb_fundus: { x: 0.00, y: -0.30, z: 0.15 },
            gb_body: { x: 0.00, y: 0.00, z: 0.10 },
            gb_neck: { x: 0.00, y: 0.25, z: 0.05 },
            cystic_duct: { x: 0.10, y: 0.35, z: 0.00 },
            gb_mucosa: { x: -0.15, y: -0.15, z: 0.15 },
            gb_serosa: { x: 0.15, y: 0.10, z: 0.15 },
            hepatic_surface: { x: 0.00, y: 0.10, z: -0.20 },
            gb_artery: { x: -0.10, y: 0.30, z: -0.05 }
        }
    };

    const hitR = maxDim * 0.08;
    const modelPositions = anatomicalPositions[modelId];
    missingKeys.forEach((key, i) => {
        let pos;
        if (modelPositions && modelPositions[key]) {
            // Use anatomically correct position (fractions of bounding box size)
            const mp = modelPositions[key];
            pos = new THREE.Vector3(
                center.x + mp.x * size.x,
                center.y + mp.y * size.y,
                center.z + mp.z * size.z
            );
        } else {
            // Generic fallback: distribute around model
            const angle = (i / missingKeys.length) * Math.PI * 2;
            const r = maxDim * 0.3;
            const yOff = (i / missingKeys.length - 0.5) * size.y * 0.6;
            pos = new THREE.Vector3(
                center.x + Math.cos(angle) * r,
                center.y + yOff,
                center.z + Math.sin(angle) * r
            );
        }
        const geo = new THREE.SphereGeometry(hitR, 8, 8);
        const mat = new THREE.MeshBasicMaterial({
            transparent: true, opacity: 0.0, depthWrite: false
        });
        const sphere = new THREE.Mesh(geo, mat);
        model.worldToLocal(pos);
        sphere.position.copy(pos);
        sphere.userData.organPartKey = key;
        sphere.userData.structureName = detailsMap[key] ? detailsMap[key].legendLabel : key;
        sphere.userData.isAnnotationHitMarker = true;
        model.add(sphere);
    });

    // Recount after Phase 2 added spheres for missing keys
    anchorCount += missingKeys.length;
    const total = directCount + anchorCount;
    const cfg = modelConfig[modelId];
    const isCustomPath = cfg && cfg.annotationPath === 'custom';
    model.userData.annotationAccuracy = total > 0
        ? (isCustomPath ? 'custom' : directCount === total ? 'mesh' : directCount > 0 ? 'partial' : 'approximate')
        : 'none';
    model.userData.directMeshCount = directCount;
    model.userData.anchorCount = anchorCount;
}

// Load external GLTF model
