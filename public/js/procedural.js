// ═══════════════════════════════════════════════════════
// procedural.js — Procedural 3D model generation functions
// ═══════════════════════════════════════════════════════

function createHeart() {
    const group = new THREE.Group();

    // Create realistic heart shape with proper anatomy
    // Left Ventricle (main pumping chamber - largest and most muscular)
    const leftVentricleGeom = new THREE.SphereGeometry(0.6, 32, 32);
    leftVentricleGeom.scale(0.8, 1.1, 0.7);
    const leftVentricleMat = new THREE.MeshStandardMaterial({
        color: 0x8B0000,
        roughness: 0.7,
        metalness: 0.1
    });
    const leftVentricle = new THREE.Mesh(leftVentricleGeom, leftVentricleMat);
    leftVentricle.position.set(-0.2, -0.3, 0);
    leftVentricle.userData.structureName = 'Left Ventricle';
    group.add(leftVentricle);

    // Right Ventricle (smaller, wraps around left)
    const rightVentricleGeom = new THREE.SphereGeometry(0.55, 32, 32);
    rightVentricleGeom.scale(0.7, 1.0, 0.6);
    const rightVentricleMat = new THREE.MeshStandardMaterial({
        color: 0xA52A2A,
        roughness: 0.7,
        metalness: 0.1
    });
    const rightVentricle = new THREE.Mesh(rightVentricleGeom, rightVentricleMat);
    rightVentricle.position.set(0.35, -0.25, 0.15);
    rightVentricle.userData.structureName = 'Right Ventricle';
    group.add(rightVentricle);

    // Left Atrium (upper left chamber)
    const leftAtriumGeom = new THREE.SphereGeometry(0.35, 32, 32);
    leftAtriumGeom.scale(0.9, 0.8, 0.8);
    const atriumMat = new THREE.MeshStandardMaterial({
        color: 0xB22222,
        roughness: 0.6,
        metalness: 0.15
    });
    const leftAtrium = new THREE.Mesh(leftAtriumGeom, atriumMat);
    leftAtrium.position.set(-0.35, 0.5, -0.1);
    leftAtrium.userData.structureName = 'Left Atrium';
    group.add(leftAtrium);

    // Right Atrium (upper right chamber)
    const rightAtriumGeom = new THREE.SphereGeometry(0.35, 32, 32);
    rightAtriumGeom.scale(0.85, 0.75, 0.85);
    const rightAtrium = new THREE.Mesh(rightAtriumGeom, atriumMat.clone());
    rightAtrium.position.set(0.4, 0.45, 0);
    rightAtrium.userData.structureName = 'Right Atrium';
    group.add(rightAtrium);

    // Aorta (main artery - curves upward and backward)
    const aortaCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.6, 0),
        new THREE.Vector3(-0.1, 0.9, -0.1),
        new THREE.Vector3(-0.15, 1.2, -0.25),
        new THREE.Vector3(-0.1, 1.4, -0.4)
    ]);
    const aortaGeom = new THREE.TubeGeometry(aortaCurve, 20, 0.12, 16, false);
    const arterialMat = new THREE.MeshStandardMaterial({
        color: 0xDC143C,
        roughness: 0.5,
        metalness: 0.2
    });
    const aorta = new THREE.Mesh(aortaGeom, arterialMat);
    aorta.userData.structureName = 'Aorta';
    group.add(aorta);

    // Pulmonary Artery (goes to lungs)
    const pulmonaryCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.2, 0.5, 0.1),
        new THREE.Vector3(0.15, 0.8, 0.15),
        new THREE.Vector3(0, 1.0, 0.2),
        new THREE.Vector3(-0.15, 1.1, 0.25)
    ]);
    const pulmonaryGeom = new THREE.TubeGeometry(pulmonaryCurve, 20, 0.1, 16, false);
    const pulmonaryMat = new THREE.MeshStandardMaterial({
        color: 0xB22222,
        roughness: 0.5,
        metalness: 0.2
    });
    const pulmonary = new THREE.Mesh(pulmonaryGeom, pulmonaryMat);
    pulmonary.userData.structureName = 'Pulmonary Artery';
    group.add(pulmonary);

    // Aortic arch branches
    const branch1Geom = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 12);
    const branch1 = new THREE.Mesh(branch1Geom, arterialMat.clone());
    branch1.position.set(-0.15, 1.3, -0.35);
    branch1.rotation.z = 0.4;
    branch1.rotation.x = 0.3;
    group.add(branch1);

    // Coronary arteries (on heart surface)
    const coronaryGeom = new THREE.TorusGeometry(0.45, 0.03, 12, 32, Math.PI * 1.5);
    const coronaryMat = new THREE.MeshStandardMaterial({
        color: 0xFF6347,
        roughness: 0.4,
        metalness: 0.3
    });
    const coronary = new THREE.Mesh(coronaryGeom, coronaryMat);
    coronary.rotation.x = Math.PI / 2;
    coronary.position.set(0, 0.1, 0);
    group.add(coronary);

    // Apex of heart (pointed bottom)
    const apexGeom = new THREE.ConeGeometry(0.25, 0.4, 32);
    const apex = new THREE.Mesh(apexGeom, leftVentricleMat.clone());
    apex.position.set(-0.1, -0.9, 0.05);
    apex.rotation.z = 0.15;
    group.add(apex);

    return group;
}

function createLungs() {
    const group = new THREE.Group();

    // Right lung (has 3 lobes - larger than left)
    const rightLungMat = new THREE.MeshStandardMaterial({
        color: 0xFFB6C1,
        roughness: 0.8,
        metalness: 0.05,
        transparent: true,
        opacity: 0.95
    });

    // Right upper lobe
    const rightUpperGeom = new THREE.SphereGeometry(0.5, 32, 32);
    rightUpperGeom.scale(0.7, 0.9, 0.55);
    const rightUpper = new THREE.Mesh(rightUpperGeom, rightLungMat);
    rightUpper.position.set(0.55, 0.5, 0);
    rightUpper.userData.structureName = 'Alveoli';
    group.add(rightUpper);

    // Right middle lobe
    const rightMiddleGeom = new THREE.SphereGeometry(0.35, 32, 32);
    rightMiddleGeom.scale(0.8, 0.7, 0.6);
    const rightMiddle = new THREE.Mesh(rightMiddleGeom, rightLungMat.clone());
    rightMiddle.position.set(0.65, -0.05, 0.15);
    group.add(rightMiddle);

    // Right lower lobe
    const rightLowerGeom = new THREE.SphereGeometry(0.55, 32, 32);
    rightLowerGeom.scale(0.65, 1.1, 0.5);
    const rightLower = new THREE.Mesh(rightLowerGeom, rightLungMat.clone());
    rightLower.position.set(0.6, -0.7, 0);
    group.add(rightLower);

    // Left lung (has 2 lobes - cardiac notch for heart)
    const leftLungMat = new THREE.MeshStandardMaterial({
        color: 0xFFC0CB,
        roughness: 0.8,
        metalness: 0.05,
        transparent: true,
        opacity: 0.95
    });

    // Left upper lobe
    const leftUpperGeom = new THREE.SphereGeometry(0.48, 32, 32);
    leftUpperGeom.scale(0.65, 0.95, 0.5);
    const leftUpper = new THREE.Mesh(leftUpperGeom, leftLungMat);
    leftUpper.position.set(-0.55, 0.45, 0);
    leftUpper.userData.structureName = 'Pleura';
    group.add(leftUpper);

    // Left lower lobe (with cardiac notch)
    const leftLowerGeom = new THREE.SphereGeometry(0.5, 32, 32);
    leftLowerGeom.scale(0.6, 1.0, 0.45);
    const leftLower = new THREE.Mesh(leftLowerGeom, leftLungMat.clone());
    leftLower.position.set(-0.6, -0.5, 0);
    group.add(leftLower);

    // Cardiac notch (indentation for heart)
    const notchGeom = new THREE.SphereGeometry(0.25, 16, 16);
    const notchMat = new THREE.MeshBasicMaterial({
        color: 0x0d1b2a,
        transparent: true,
        opacity: 0.8
    });
    const notch = new THREE.Mesh(notchGeom, notchMat);
    notch.position.set(-0.35, -0.2, 0.3);
    notch.scale.set(0.8, 1.2, 0.6);
    group.add(notch);

    // Trachea (windpipe with cartilage rings)
    const tracheaMat = new THREE.MeshStandardMaterial({
        color: 0xF4A460,
        roughness: 0.7,
        metalness: 0.1
    });
    const tracheaGeom = new THREE.CylinderGeometry(0.09, 0.1, 1.0, 20);
    const trachea = new THREE.Mesh(tracheaGeom, tracheaMat);
    trachea.position.set(0, 1.2, 0);
    trachea.userData.structureName = 'Trachea';
    group.add(trachea);

    // Tracheal rings (cartilage)
    for (let i = 0; i < 8; i++) {
        const ringGeom = new THREE.TorusGeometry(0.11, 0.015, 8, 20, Math.PI * 1.8);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0xD2B48C });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.position.set(0, 1.65 - i * 0.12, 0);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
    }

    // Primary bronchi
    const bronchiMat = new THREE.MeshStandardMaterial({
        color: 0xE9967A,
        roughness: 0.6,
        metalness: 0.15
    });

    // Right main bronchus (shorter, wider, more vertical)
    const rightBronchusGeom = new THREE.CylinderGeometry(0.07, 0.065, 0.5, 16);
    const rightBronchus = new THREE.Mesh(rightBronchusGeom, bronchiMat);
    rightBronchus.position.set(0.25, 0.6, 0.05);
    rightBronchus.rotation.z = -0.5;
    rightBronchus.userData.structureName = 'Bronchi';
    group.add(rightBronchus);

    // Left main bronchus (longer, narrower, more horizontal)
    const leftBronchusGeom = new THREE.CylinderGeometry(0.06, 0.055, 0.6, 16);
    const leftBronchus = new THREE.Mesh(leftBronchusGeom, bronchiMat.clone());
    leftBronchus.position.set(-0.28, 0.55, 0.05);
    leftBronchus.rotation.z = 0.6;
    leftBronchus.userData.structureName = 'Bronchioles';
    group.add(leftBronchus);

    // Secondary bronchi (lobar bronchi)
    const secondaryGeom = new THREE.CylinderGeometry(0.04, 0.035, 0.3, 12);
    const secondary1 = new THREE.Mesh(secondaryGeom, bronchiMat.clone());
    secondary1.position.set(0.5, 0.3, 0.1);
    secondary1.rotation.z = -0.8;
    group.add(secondary1);

    const secondary2 = new THREE.Mesh(secondaryGeom, bronchiMat.clone());
    secondary2.position.set(-0.5, 0.2, 0.1);
    secondary2.rotation.z = 0.9;
    group.add(secondary2);

    // Diaphragm (dome-shaped muscle)
    const diaphragmGeom = new THREE.SphereGeometry(1.1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const diaphragmMat = new THREE.MeshStandardMaterial({
        color: 0xCD5C5C,
        roughness: 0.9,
        metalness: 0.0,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    const diaphragm = new THREE.Mesh(diaphragmGeom, diaphragmMat);
    diaphragm.position.set(0, -1.3, 0);
    diaphragm.rotation.x = Math.PI;
    diaphragm.userData.structureName = 'Diaphragm';
    group.add(diaphragm);

    return group;
}

function createKidney() {
    const group = new THREE.Group();

    // Main kidney body (bean-shaped)
    const kidneyBodyGeom = new THREE.SphereGeometry(0.7, 32, 32);
    kidneyBodyGeom.scale(0.65, 1.0, 0.55);
    const cortexMat = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.85,
        metalness: 0.05
    });
    const kidneyBody = new THREE.Mesh(kidneyBodyGeom, cortexMat);
    kidneyBody.userData.structureName = 'Renal Cortex';
    group.add(kidneyBody);

    // Renal hilum (indentation where vessels enter)
    const hilumGeom = new THREE.SphereGeometry(0.25, 16, 16);
    hilumGeom.scale(1.2, 0.8, 0.6);
    const hilumMat = new THREE.MeshBasicMaterial({
        color: 0x2F1F0F,
        transparent: true,
        opacity: 0.9
    });
    const hilum = new THREE.Mesh(hilumGeom, hilumMat);
    hilum.position.set(0.5, 0, 0);
    group.add(hilum);

    // Renal medulla (inner tissue - pyramids)
    const medullaMat = new THREE.MeshStandardMaterial({
        color: 0xA0522D,
        roughness: 0.8,
        metalness: 0.05,
        transparent: true,
        opacity: 0.85
    });

    // Renal pyramids (cone-shaped structures)
    for (let i = 0; i < 5; i++) {
        const pyramidGeom = new THREE.ConeGeometry(0.12, 0.25, 8);
        const pyramid = new THREE.Mesh(pyramidGeom, medullaMat.clone());
        const angle = (i / 5) * Math.PI - Math.PI / 2;
        pyramid.position.set(
            Math.cos(angle) * 0.25,
            Math.sin(angle) * 0.35,
            0
        );
        pyramid.rotation.z = angle - Math.PI / 2;
        pyramid.userData.structureName = 'Renal Medulla';
        group.add(pyramid);
    }

    // Renal pelvis (funnel collecting urine)
    const pelvisGeom = new THREE.ConeGeometry(0.18, 0.35, 16);
    const pelvisMat = new THREE.MeshStandardMaterial({
        color: 0xDAA520,
        roughness: 0.7,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9
    });
    const pelvis = new THREE.Mesh(pelvisGeom, pelvisMat);
    pelvis.position.set(0.45, 0, 0);
    pelvis.rotation.z = -Math.PI / 2;
    pelvis.userData.structureName = 'Renal Pelvis';
    group.add(pelvis);

    // Calyces (cup-like structures collecting urine from pyramids)
    for (let i = 0; i < 5; i++) {
        const calyxGeom = new THREE.CylinderGeometry(0.04, 0.06, 0.12, 12);
        const calyx = new THREE.Mesh(calyxGeom, pelvisMat.clone());
        const angle = (i / 5) * Math.PI - Math.PI / 2;
        calyx.position.set(
            Math.cos(angle) * 0.3 + 0.1,
            Math.sin(angle) * 0.35,
            0
        );
        calyx.rotation.z = angle;
        group.add(calyx);
    }

    // Ureter (tube to bladder)
    const ureterCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.6, -0.05, 0),
        new THREE.Vector3(0.75, -0.3, 0),
        new THREE.Vector3(0.8, -0.7, 0.05),
        new THREE.Vector3(0.75, -1.1, 0.1)
    ]);
    const ureterGeom = new THREE.TubeGeometry(ureterCurve, 20, 0.04, 12, false);
    const ureterMat = new THREE.MeshStandardMaterial({
        color: 0xF5DEB3,
        roughness: 0.8,
        metalness: 0.05
    });
    const ureter = new THREE.Mesh(ureterGeom, ureterMat);
    ureter.userData.structureName = 'Ureter';
    group.add(ureter);

    // Renal artery (red - brings blood to kidney)
    const arteryCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.9, 0.15, 0),
        new THREE.Vector3(0.7, 0.13, 0),
        new THREE.Vector3(0.5, 0.08, 0.05)
    ]);
    const arteryGeom = new THREE.TubeGeometry(arteryCurve, 16, 0.045, 12, false);
    const arteryMat = new THREE.MeshStandardMaterial({
        color: 0xDC143C,
        roughness: 0.5,
        metalness: 0.2
    });
    const artery = new THREE.Mesh(arteryGeom, arteryMat);
    artery.userData.structureName = 'Renal Artery';
    group.add(artery);

    // Renal vein (blue - takes blood away)
    const veinCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.5, -0.08, -0.05),
        new THREE.Vector3(0.7, -0.1, -0.03),
        new THREE.Vector3(0.9, -0.12, 0)
    ]);
    const veinGeom = new THREE.TubeGeometry(veinCurve, 16, 0.05, 12, false);
    const veinMat = new THREE.MeshStandardMaterial({
        color: 0x4169E1,
        roughness: 0.5,
        metalness: 0.2
    });
    const vein = new THREE.Mesh(veinGeom, veinMat);
    group.add(vein);

    // Nephrons (microscopic filtering units - represented symbolically)
    const nephronGeom = new THREE.TorusKnotGeometry(0.08, 0.025, 32, 8, 2, 3);
    const nephronMat = new THREE.MeshStandardMaterial({
        color: 0xCD853F,
        roughness: 0.7,
        metalness: 0.1,
        transparent: true,
        opacity: 0.75
    });
    const nephron = new THREE.Mesh(nephronGeom, nephronMat);
    nephron.position.set(-0.15, 0.25, 0.15);
    nephron.scale.set(0.8, 0.8, 0.8);
    nephron.userData.structureName = 'Nephrons';
    group.add(nephron);

    // Renal capsule (outer protective layer)
    const capsuleGeom = new THREE.SphereGeometry(0.72, 32, 32);
    capsuleGeom.scale(0.65, 1.0, 0.55);
    const capsuleMat = new THREE.MeshStandardMaterial({
        color: 0xD2691E,
        roughness: 0.9,
        metalness: 0.0,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    });
    const capsule = new THREE.Mesh(capsuleGeom, capsuleMat);
    group.add(capsule);

    return group;
}

function createBrain() {
    const group = new THREE.Group();

    // Define lobe colors matching anatomical diagram
    const frontalColor = 0xE89CB5; // Pink
    const parietalColor = 0xE8D85C; // Yellow
    const temporalColor = 0x7FB87F; // Green
    const occipitalColor = 0x9B8FB8; // Purple
    const cerebellumColor = 0xB8B8B8; // Gray

    // Base cerebrum shape (larger main structure) - parietal lobe base
    const cerebrumMat = new THREE.MeshStandardMaterial({
        color: parietalColor,
        roughness: 0.9,
        metalness: 0.0
    });

    const cerebrumGeom = new THREE.SphereGeometry(0.95, 48, 48);
    cerebrumGeom.scale(1.25, 0.9, 1.1);
    const cerebrum = new THREE.Mesh(cerebrumGeom, cerebrumMat);
    cerebrum.position.set(0, 0.3, 0);
    cerebrum.userData.structureName = 'Cerebrum';
    group.add(cerebrum);

    // Deep longitudinal fissure (separates hemispheres)
    const fissureGeom = new THREE.BoxGeometry(0.12, 1.2, 1.7);
    const fissureMat = new THREE.MeshStandardMaterial({
        color: 0x3A2A2F,
        roughness: 1.0,
        metalness: 0.0
    });
    const fissure = new THREE.Mesh(fissureGeom, fissureMat);
    fissure.position.set(0, 0.35, 0);
    group.add(fissure);

    // FRONTAL LOBE (Pink) - front of brain
    const frontalMat = new THREE.MeshStandardMaterial({
        color: frontalColor,
        roughness: 0.9,
        metalness: 0.0
    });

    const frontalLeftGeom = new THREE.SphereGeometry(0.7, 32, 32);
    frontalLeftGeom.scale(0.85, 0.9, 0.8);
    const frontalLeft = new THREE.Mesh(frontalLeftGeom, frontalMat);
    frontalLeft.position.set(-0.38, 0.35, 0.75);
    frontalLeft.userData.structureName = 'Frontal Lobe';
    group.add(frontalLeft);

    const frontalRight = new THREE.Mesh(frontalLeftGeom, frontalMat.clone());
    frontalRight.position.set(0.38, 0.35, 0.75);
    group.add(frontalRight);

    // PARIETAL LOBE (Yellow) - top/middle of brain
    const parietalMat = new THREE.MeshStandardMaterial({
        color: parietalColor,
        roughness: 0.9,
        metalness: 0.0
    });

    const parietalLeftGeom = new THREE.SphereGeometry(0.65, 32, 32);
    parietalLeftGeom.scale(0.8, 0.85, 0.9);
    const parietalLeft = new THREE.Mesh(parietalLeftGeom, parietalMat);
    parietalLeft.position.set(-0.35, 0.55, 0.1);
    group.add(parietalLeft);

    const parietalRight = new THREE.Mesh(parietalLeftGeom, parietalMat.clone());
    parietalRight.position.set(0.35, 0.55, 0.1);
    group.add(parietalRight);

    // TEMPORAL LOBE (Green) - sides of brain
    const temporalMat = new THREE.MeshStandardMaterial({
        color: temporalColor,
        roughness: 0.9,
        metalness: 0.0
    });

    const temporalLeftGeom = new THREE.SphereGeometry(0.6, 32, 32);
    temporalLeftGeom.scale(0.75, 0.95, 0.85);
    const temporalLeft = new THREE.Mesh(temporalLeftGeom, temporalMat);
    temporalLeft.position.set(-0.85, -0.1, 0.2);
    temporalLeft.userData.structureName = 'Temporal Lobe';
    group.add(temporalLeft);

    const temporalRight = new THREE.Mesh(temporalLeftGeom, temporalMat.clone());
    temporalRight.position.set(0.85, -0.1, 0.2);
    group.add(temporalRight);

    // OCCIPITAL LOBE (Purple) - back of brain
    const occipitalMat = new THREE.MeshStandardMaterial({
        color: occipitalColor,
        roughness: 0.9,
        metalness: 0.0
    });

    const occipitalGeom = new THREE.SphereGeometry(0.6, 32, 32);
    occipitalGeom.scale(1.0, 0.85, 0.7);
    const occipital = new THREE.Mesh(occipitalGeom, occipitalMat);
    occipital.position.set(0, 0.25, -0.85);
    occipital.userData.structureName = 'Occipital Lobe';
    group.add(occipital);

    // Create realistic gyri (brain folds) with colored lobes
    function createGyri() {
        // Frontal lobe gyri (Pink)
        for (let i = 0; i < 6; i++) {
            const gyrusGeom = new THREE.TorusGeometry(
                0.18 + Math.random() * 0.12,
                0.035 + Math.random() * 0.015,
                8,
                18,
                Math.PI * 1.4
            );
            const gyrus = new THREE.Mesh(gyrusGeom, frontalMat.clone());
            gyrus.position.set(
                (Math.random() - 0.5) * 1.5,
                0.35 + Math.random() * 0.25,
                0.65 + Math.random() * 0.35
            );
            gyrus.rotation.set(
                Math.random() * 0.6,
                Math.random() * Math.PI,
                Math.random() * 0.4
            );
            group.add(gyrus);
        }

        // Parietal lobe gyri (Yellow) - top
        for (let i = 0; i < 7; i++) {
            const gyrusGeom = new THREE.TorusGeometry(
                0.16 + Math.random() * 0.11,
                0.03 + Math.random() * 0.015,
                8,
                18,
                Math.PI * 1.3
            );
            const gyrus = new THREE.Mesh(gyrusGeom, parietalMat.clone());
            gyrus.position.set(
                (Math.random() - 0.5) * 1.4,
                0.55 + Math.random() * 0.25,
                -0.1 + Math.random() * 0.5
            );
            gyrus.rotation.set(
                Math.random() * 0.5,
                Math.random() * Math.PI,
                Math.random() * 0.4
            );
            group.add(gyrus);
        }

        // Temporal lobe gyri (Green) - sides
        for (let side of [-1, 1]) {
            for (let i = 0; i < 5; i++) {
                const gyrusGeom = new THREE.TorusGeometry(
                    0.14 + Math.random() * 0.09,
                    0.028 + Math.random() * 0.012,
                    8,
                    16,
                    Math.PI * 1.2
                );
                const gyrus = new THREE.Mesh(gyrusGeom, temporalMat.clone());
                gyrus.position.set(
                    side * (0.85 + Math.random() * 0.25),
                    -0.1 + Math.random() * 0.35,
                    0.15 + Math.random() * 0.3
                );
                gyrus.rotation.set(
                    Math.random() * 0.5,
                    side * Math.PI / 2 + Math.random() * 0.4,
                    side * 0.3
                );
                group.add(gyrus);
            }
        }

        // Occipital lobe gyri (Purple) - back
        for (let i = 0; i < 6; i++) {
            const gyrusGeom = new THREE.TorusGeometry(
                0.15 + Math.random() * 0.1,
                0.032 + Math.random() * 0.014,
                8,
                16,
                Math.PI * 1.25
            );
            const gyrus = new THREE.Mesh(gyrusGeom, occipitalMat.clone());
            gyrus.position.set(
                (Math.random() - 0.5) * 1.2,
                0.2 + Math.random() * 0.35,
                -0.8 + Math.random() * 0.3
            );
            gyrus.rotation.set(
                Math.random() * 0.5,
                Math.random() * Math.PI,
                Math.random() * 0.4
            );
            group.add(gyrus);
        }
    }
    createGyri();

    // Sulci (grooves between gyri) - darker lines
    const sulcusMat = new THREE.MeshStandardMaterial({
        color: 0x2A2A2A,
        roughness: 1.0,
        metalness: 0.0
    });

    // Major sulci - dark grooves
    for (let i = 0; i < 12; i++) {
        const sulcusGeom = new THREE.TorusGeometry(
            0.18 + Math.random() * 0.13,
            0.012 + Math.random() * 0.008,
            6,
            14,
            Math.PI * (0.7 + Math.random() * 0.5)
        );
        const sulcus = new THREE.Mesh(sulcusGeom, sulcusMat);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.65;
        sulcus.position.set(
            Math.sin(phi) * Math.cos(theta) * 1.05,
            Math.cos(phi) * 0.8 + 0.25,
            Math.sin(phi) * Math.sin(theta) * 1.0
        );
        sulcus.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI
        );
        group.add(sulcus);
    }

    // CEREBELLUM (Gray) - smaller, wrinkled structure at bottom-back
    const cerebellumMat = new THREE.MeshStandardMaterial({
        color: cerebellumColor,
        roughness: 0.92,
        metalness: 0.0
    });

    // Cerebellum base
    const cerebellumGeom = new THREE.SphereGeometry(0.5, 32, 32);
    cerebellumGeom.scale(1.1, 0.65, 0.9);
    const cerebellum = new THREE.Mesh(cerebellumGeom, cerebellumMat);
    cerebellum.position.set(0, -0.6, -0.55);
    cerebellum.userData.structureName = 'Cerebellum';
    group.add(cerebellum);

    // Cerebellar folia (tight horizontal grooves)
    for (let i = 0; i < 12; i++) {
        const foliaGeom = new THREE.TorusGeometry(
            0.35 + i * 0.03,
            0.015,
            6,
            20,
            Math.PI * 1.8
        );
        const folia = new THREE.Mesh(foliaGeom, cerebellumMat.clone());
        folia.position.set(0, -0.6 + (i - 6) * 0.04, -0.5);
        folia.rotation.x = Math.PI / 2;
        folia.rotation.z = Math.PI;
        group.add(folia);
    }

    // Brain stem (connects to spinal cord) - darker gray
    const stemMat = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.88,
        metalness: 0.0
    });

    const brainStemGeom = new THREE.CylinderGeometry(0.2, 0.24, 0.7, 24);
    const brainStem = new THREE.Mesh(brainStemGeom, stemMat);
    brainStem.position.set(0, -1.0, -0.35);
    brainStem.rotation.x = 0.25;
    brainStem.userData.structureName = 'Brain Stem';
    group.add(brainStem);

    return group;
}

function createSyringe() {
    const group = new THREE.Group();

    // Barrel (transparent cylinder with realistic glass appearance)
    const barrelGeom = new THREE.CylinderGeometry(0.16, 0.16, 2.2, 32);
    const barrelMat = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.3,
        shininess: 100,
        specular: 0x888888
    });
    const barrel = new THREE.Mesh(barrelGeom, barrelMat);
    barrel.userData.structureName = 'Barrel';
    barrel.userData.organPartKey = 'barrel';
    group.add(barrel);

    // Barrel flange (top rim)
    const flangeGeom = new THREE.CylinderGeometry(0.22, 0.18, 0.08, 32);
    const flangeMat = new THREE.MeshStandardMaterial({
        color: 0xEEEEEE,
        roughness: 0.3,
        metalness: 0.05
    });
    const flange = new THREE.Mesh(flangeGeom, flangeMat);
    flange.position.set(0, 1.14, 0);
    flange.userData.organPartKey = 'flange';
    group.add(flange);

    // Finger grips (wings on flange)
    const gripGeom = new THREE.BoxGeometry(0.5, 0.06, 0.12);
    const gripMat = new THREE.MeshStandardMaterial({
        color: 0xDDDDDD,
        roughness: 0.4
    });
    const grip1 = new THREE.Mesh(gripGeom, gripMat);
    grip1.position.set(0, 1.14, 0);
    grip1.userData.organPartKey = 'grips';
    group.add(grip1);

    const grip2 = new THREE.Mesh(gripGeom, gripMat.clone());
    grip2.position.set(0, 1.14, 0);
    grip2.rotation.y = Math.PI / 2;
    grip2.userData.organPartKey = 'grips';
    group.add(grip2);

    // Graduation marks (measurement lines)
    const markMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    for (let i = 0; i <= 10; i++) {
        const y = 0.9 - i * 0.2;
        const markGeom = new THREE.BoxGeometry(0.19, 0.015, 0.005);
        const mark = new THREE.Mesh(markGeom, markMat.clone());
        mark.position.set(0, y, 0.165);
        mark.userData.structureName = 'Graduation Marks';
        mark.userData.organPartKey = 'graduations';
        group.add(mark);

        // Volume numbers
        if (i % 2 === 0) {
            const numberGeom = new THREE.BoxGeometry(0.08, 0.06, 0.005);
            const number = new THREE.Mesh(numberGeom, markMat.clone());
            number.position.set(0.12, y, 0.165);
            number.userData.organPartKey = 'graduations';
            group.add(number);
        }
    }

    // Plunger rod (the push rod)
    const plungerRodGeom = new THREE.CylinderGeometry(0.025, 0.025, 1.5, 16);
    const plungerRodMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.6,
        metalness: 0.3
    });
    const plungerRod = new THREE.Mesh(plungerRodGeom, plungerRodMat);
    plungerRod.position.set(0, 1.0, 0);
    plungerRod.userData.organPartKey = 'plunger';
    group.add(plungerRod);

    // Rubber plunger tip (creates seal)
    const plungerTipGeom = new THREE.CylinderGeometry(0.155, 0.145, 0.15, 32);
    const plungerTipMat = new THREE.MeshStandardMaterial({
        color: 0x2C2C2C,
        roughness: 0.95,
        metalness: 0.0
    });
    const plungerTip = new THREE.Mesh(plungerTipGeom, plungerTipMat);
    plungerTip.position.set(0, 0.25, 0);
    plungerTip.userData.structureName = 'Plunger';
    plungerTip.userData.organPartKey = 'plunger';
    group.add(plungerTip);

    // Plunger handle (thumb rest)
    const handleGeom = new THREE.CylinderGeometry(0.28, 0.32, 0.12, 32);
    const handleMat = new THREE.MeshStandardMaterial({
        color: 0x3A5FCD,
        roughness: 0.5,
        metalness: 0.1
    });
    const handle = new THREE.Mesh(handleGeom, handleMat);
    handle.position.set(0, 1.75, 0);
    handle.userData.organPartKey = 'plunger';
    group.add(handle);

    // Luer lock tip (connection point for needle)
    const luerGeom = new THREE.CylinderGeometry(0.08, 0.12, 0.18, 20);
    const luerMat = new THREE.MeshStandardMaterial({
        color: 0xEEEEEE,
        roughness: 0.3,
        metalness: 0.05
    });
    const luer = new THREE.Mesh(luerGeom, luerMat);
    luer.position.set(0, -1.19, 0);
    luer.userData.organPartKey = 'luer';
    group.add(luer);

    // Needle hub (colored safety cap)
    const hubGeom = new THREE.CylinderGeometry(0.085, 0.065, 0.3, 20);
    const hubMat = new THREE.MeshStandardMaterial({
        color: 0xFF6B35,
        roughness: 0.4,
        metalness: 0.2
    });
    const hub = new THREE.Mesh(hubGeom, hubMat);
    hub.position.set(0, -1.4, 0);
    hub.userData.structureName = 'Needle Hub';
    hub.userData.organPartKey = 'needle_hub';
    group.add(hub);

    // Hub color code ring (indicates gauge)
    const ringGeom = new THREE.TorusGeometry(0.08, 0.015, 10, 20);
    const ring = new THREE.Mesh(ringGeom, hubMat.clone());
    ring.position.set(0, -1.3, 0);
    ring.rotation.x = Math.PI / 2;
    ring.userData.organPartKey = 'needle_hub';
    group.add(ring);

    // Needle shaft (stainless steel)
    const needleGeom = new THREE.CylinderGeometry(0.015, 0.012, 1.2, 16);
    const needleMat = new THREE.MeshStandardMaterial({
        color: 0xC0C0C0,
        roughness: 0.2,
        metalness: 0.9
    });
    const needle = new THREE.Mesh(needleGeom, needleMat);
    needle.position.set(0, -2.15, 0);
    needle.userData.structureName = 'Needle Shaft';
    needle.userData.organPartKey = 'needle_shaft';
    group.add(needle);

    // Bevel (angled tip of needle)
    const bevelGeom = new THREE.ConeGeometry(0.015, 0.08, 8);
    const bevelMat = new THREE.MeshStandardMaterial({
        color: 0xA9A9A9,
        roughness: 0.15,
        metalness: 0.95
    });
    const bevel = new THREE.Mesh(bevelGeom, bevelMat);
    bevel.position.set(0, -2.78, 0);
    bevel.rotation.z = Math.PI * 0.15; // Angled bevel
    bevel.userData.structureName = 'Bevel';
    bevel.userData.organPartKey = 'bevel';
    group.add(bevel);

    // Medication inside (slightly colored liquid)
    const medicationGeom = new THREE.CylinderGeometry(0.148, 0.148, 1.5, 32);
    const medicationMat = new THREE.MeshPhongMaterial({
        color: 0x87CEEB,
        transparent: true,
        opacity: 0.4,
        shininess: 80
    });
    const medication = new THREE.Mesh(medicationGeom, medicationMat);
    medication.position.set(0, -0.1, 0);
    medication.userData.organPartKey = 'medication';
    group.add(medication);

    // Air bubbles (small spheres)
    for (let i = 0; i < 3; i++) {
        const bubbleGeom = new THREE.SphereGeometry(0.02 + Math.random() * 0.02, 8, 8);
        const bubbleMat = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.5,
            shininess: 100
        });
        const bubble = new THREE.Mesh(bubbleGeom, bubbleMat);
        bubble.position.set(
            (Math.random() - 0.5) * 0.1,
            0.5 + Math.random() * 0.4,
            (Math.random() - 0.5) * 0.1
        );
        bubble.userData.organPartKey = 'bubbles';
        group.add(bubble);
    }

    // Rotate syringe to angled position
    group.rotation.z = Math.PI / 6;
    group.rotation.x = Math.PI / 12;

    return group;
}

/* ====================== LIVER ====================== */
function createLiver() {
    const group = new THREE.Group();
    // Helper: deform sphere vertices for organic look
    function organicDeform(geom, amount) {
        const pos = geom.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
            const n = Math.sin(x * 3.7) * Math.cos(z * 2.9) * Math.sin(y * 4.1);
            pos.setXYZ(i, x + n * amount, y + n * amount * 0.5, z + n * amount * 0.7);
        }
        geom.computeVertexNormals();
    }
    const lobeMat = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.4, metalness: 0.02 });

    // Right Lobe – large, wedge-shaped
    const rlGeom = new THREE.SphereGeometry(1.15, 40, 32);
    rlGeom.scale(1.35, 0.5, 1.0);
    organicDeform(rlGeom, 0.04);
    const rl = new THREE.Mesh(rlGeom, lobeMat(0x7B1A1A));
    rl.position.set(-0.2, 0, 0);
    rl.userData.organPartKey = 'right_lobe'; rl.userData.structureName = 'Right Lobe';
    group.add(rl);

    // Left Lobe – thinner, pointed
    const llGeom = new THREE.SphereGeometry(0.75, 36, 28);
    llGeom.scale(1.0, 0.35, 0.8);
    organicDeform(llGeom, 0.03);
    const ll = new THREE.Mesh(llGeom, lobeMat(0x8B2020));
    ll.position.set(1.2, 0.08, -0.05);
    ll.userData.organPartKey = 'left_lobe'; ll.userData.structureName = 'Left Lobe';
    group.add(ll);

    // Caudate Lobe – posterior bulge
    const clGeom = new THREE.SphereGeometry(0.32, 24, 20);
    clGeom.scale(1.1, 0.7, 0.65);
    organicDeform(clGeom, 0.02);
    const cl = new THREE.Mesh(clGeom, lobeMat(0x942B2B));
    cl.position.set(0.35, 0.2, -0.7);
    cl.userData.organPartKey = 'caudate_lobe'; cl.userData.structureName = 'Caudate Lobe';
    group.add(cl);

    // Quadrate Lobe – inferior bump
    const qlGeom = new THREE.SphereGeometry(0.28, 22, 18);
    qlGeom.scale(1.1, 0.55, 0.8);
    organicDeform(qlGeom, 0.02);
    const ql = new THREE.Mesh(qlGeom, lobeMat(0xA03535));
    ql.position.set(0.55, -0.2, 0.4);
    ql.userData.organPartKey = 'quadrate_lobe'; ql.userData.structureName = 'Quadrate Lobe';
    group.add(ql);

    // Gallbladder – pear-shaped (lathe)
    const gbPts = [new THREE.Vector2(0, 0), new THREE.Vector2(0.12, 0.08), new THREE.Vector2(0.14, 0.2), new THREE.Vector2(0.12, 0.35), new THREE.Vector2(0.06, 0.45), new THREE.Vector2(0, 0.5)];
    const gbGeom = new THREE.LatheGeometry(gbPts, 20);
    const gb = new THREE.Mesh(gbGeom, new THREE.MeshStandardMaterial({ color: 0x2E8B57, roughness: 0.35, metalness: 0.03 }));
    gb.position.set(0.45, -0.45, 0.5);
    gb.rotation.x = 0.3;
    gb.userData.organPartKey = 'gallbladder'; gb.userData.structureName = 'Gallbladder';
    group.add(gb);

    // Hepatic Artery – branching red vessel
    const haMat = new THREE.MeshStandardMaterial({ color: 0xBB0000, roughness: 0.35 });
    const haGeom = new THREE.CylinderGeometry(0.04, 0.05, 0.9, 14);
    const ha = new THREE.Mesh(haGeom, haMat);
    ha.position.set(0.1, -0.35, -0.1);
    ha.rotation.z = 0.3; ha.rotation.x = 0.15;
    ha.userData.organPartKey = 'hepatic_artery'; ha.userData.structureName = 'Hepatic Artery';
    group.add(ha);
    // branch
    const hab = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.04, 0.45, 10), haMat.clone());
    hab.position.set(-0.15, -0.2, -0.2); hab.rotation.z = -0.6;
    hab.userData.organPartKey = 'hepatic_artery';
    group.add(hab);

    // Portal Vein – thick blue vessel
    const pvMat = new THREE.MeshStandardMaterial({ color: 0x1B3A6B, roughness: 0.3 });
    const pvGeom = new THREE.CylinderGeometry(0.06, 0.07, 1.0, 14);
    const pv = new THREE.Mesh(pvGeom, pvMat);
    pv.position.set(-0.1, -0.4, -0.05);
    pv.rotation.z = -0.25; pv.rotation.x = -0.1;
    pv.userData.organPartKey = 'portal_vein'; pv.userData.structureName = 'Portal Vein';
    group.add(pv);
    const pvb = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.5, 10), pvMat.clone());
    pvb.position.set(0.2, -0.25, -0.15); pvb.rotation.z = 0.5;
    pvb.userData.organPartKey = 'portal_vein';
    group.add(pvb);

    // Common Bile Duct – olive green
    const bdGeom = new THREE.CylinderGeometry(0.03, 0.035, 0.75, 12);
    const bd = new THREE.Mesh(bdGeom, new THREE.MeshStandardMaterial({ color: 0x6B8E23, roughness: 0.4 }));
    bd.position.set(0.32, -0.5, 0.15);
    bd.rotation.z = 0.15; bd.rotation.x = 0.1;
    bd.userData.organPartKey = 'bile_duct'; bd.userData.structureName = 'Common Bile Duct';
    group.add(bd);

    // Surface detail – falciform ligament ridge
    const flGeom = new THREE.BoxGeometry(0.03, 0.08, 1.4);
    const fl = new THREE.Mesh(flGeom, lobeMat(0x601515));
    fl.position.set(0.7, 0.32, 0);
    group.add(fl);

    group.rotation.x = -0.12;
    return group;
}

/* ====================== STOMACH ====================== */
function createStomach() {
    const group = new THREE.Group();

    // Helper to create lathe-based organic shapes
    function makeLathe(pts, color, segs) {
        const g = new THREE.LatheGeometry(pts, segs || 32);
        return new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.02 }));
    }

    // Body – main J-shaped stomach (lathe of profile)
    const bodyPts = [];
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const r = 0.5 + 0.25 * Math.sin(t * Math.PI) - 0.1 * t;
        bodyPts.push(new THREE.Vector2(r, t * 2.2 - 1.1));
    }
    const bodyGeom = new THREE.LatheGeometry(bodyPts, 36);
    const bod = new THREE.Mesh(bodyGeom, new THREE.MeshStandardMaterial({ color: 0xD16B7A, roughness: 0.42, metalness: 0.02 }));
    bod.rotation.z = 0.2;
    bod.userData.organPartKey = 'body'; bod.userData.structureName = 'Body';
    group.add(bod);

    // Fundus – bulging dome on top-left
    const funGeom = new THREE.SphereGeometry(0.55, 32, 28, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const fun = new THREE.Mesh(funGeom, new THREE.MeshStandardMaterial({ color: 0xBF4D5E, roughness: 0.4 }));
    fun.position.set(-0.35, 0.7, 0);
    fun.userData.organPartKey = 'fundus'; fun.userData.structureName = 'Fundus';
    group.add(fun);

    // Cardia – muscular ring at esophageal junction
    const carGeom = new THREE.TorusGeometry(0.22, 0.1, 16, 28);
    const car = new THREE.Mesh(carGeom, new THREE.MeshStandardMaterial({ color: 0xA83C4A, roughness: 0.38 }));
    car.position.set(0.08, 1.0, 0);
    car.rotation.x = Math.PI / 2;
    car.userData.organPartKey = 'cardia'; car.userData.structureName = 'Cardia';
    group.add(car);
    // Esophageal stub
    const esGeom = new THREE.CylinderGeometry(0.15, 0.18, 0.5, 16);
    const es = new THREE.Mesh(esGeom, new THREE.MeshStandardMaterial({ color: 0xC4606E, roughness: 0.45 }));
    es.position.set(0.08, 1.3, 0);
    es.userData.organPartKey = 'cardia';
    group.add(es);

    // Pylorus – narrowing exit
    const pylPts = [];
    for (let i = 0; i <= 12; i++) {
        const t = i / 12;
        pylPts.push(new THREE.Vector2(0.35 - t * 0.18, t * 0.7));
    }
    const pylGeom = new THREE.LatheGeometry(pylPts, 24);
    const pyl = new THREE.Mesh(pylGeom, new THREE.MeshStandardMaterial({ color: 0xC4707A, roughness: 0.42 }));
    pyl.position.set(0.5, -1.0, 0);
    pyl.rotation.z = -0.5; pyl.rotation.x = 0.1;
    pyl.userData.organPartKey = 'pylorus'; pyl.userData.structureName = 'Pylorus';
    group.add(pyl);

    // Greater Curvature – highlighted ridge along outer wall
    const gcMat = new THREE.MeshStandardMaterial({ color: 0xE85070, roughness: 0.35 });
    const gcGeom = new THREE.TorusGeometry(0.95, 0.05, 10, 40, Math.PI * 1.1);
    const gc = new THREE.Mesh(gcGeom, gcMat);
    gc.position.set(-0.05, -0.05, 0);
    gc.rotation.y = Math.PI / 2; gc.rotation.x = 0.25;
    gc.userData.organPartKey = 'greater_curvature'; gc.userData.structureName = 'Greater Curvature';
    group.add(gc);

    // Lesser Curvature – inner ridge
    const lcGeom = new THREE.TorusGeometry(0.5, 0.045, 10, 32, Math.PI * 0.9);
    const lc = new THREE.Mesh(lcGeom, new THREE.MeshStandardMaterial({ color: 0xAA4555, roughness: 0.4 }));
    lc.position.set(0.28, 0.35, 0);
    lc.rotation.y = -Math.PI / 2; lc.rotation.x = -0.15;
    lc.userData.organPartKey = 'lesser_curvature'; lc.userData.structureName = 'Lesser Curvature';
    group.add(lc);

    // Rugae – 7 wavy internal folds with more visible detail
    const rugMat = new THREE.MeshStandardMaterial({ color: 0xF09090, roughness: 0.55 });
    for (let i = 0; i < 7; i++) {
        const rr = 0.38 - i * 0.02;
        const rGeom = new THREE.TorusGeometry(rr, 0.03, 8, 24, Math.PI * 1.4);
        const rug = new THREE.Mesh(rGeom, rugMat.clone());
        rug.position.set(-0.04 + Math.sin(i) * 0.04, 0.5 - i * 0.16, 0.12);
        rug.rotation.y = Math.PI / 2 + 0.25 * (i % 2 ? 1 : -1);
        rug.rotation.z = (i % 2 ? 0.05 : -0.05);
        rug.userData.organPartKey = 'rugae'; rug.userData.structureName = 'Rugae';
        group.add(rug);
    }

    // Pyloric Sphincter – tight muscular ring
    const sphincGeom = new THREE.TorusGeometry(0.16, 0.07, 16, 24);
    const sphinc = new THREE.Mesh(sphincGeom, new THREE.MeshStandardMaterial({ color: 0x8B3040, roughness: 0.35 }));
    sphinc.position.set(0.9, -1.15, 0);
    sphinc.rotation.y = Math.PI / 3;
    sphinc.userData.organPartKey = 'sphincter'; sphinc.userData.structureName = 'Pyloric Sphincter';
    group.add(sphinc);

    group.rotation.x = 0.1;
    return group;
}

/* ====================== EYE ====================== */
function createEye() {
    const group = new THREE.Group();

    // Sclera – slightly off-white with visible vasculature appearance
    const scGeom = new THREE.SphereGeometry(1.0, 48, 40);
    const sc = new THREE.Mesh(scGeom, new THREE.MeshStandardMaterial({ color: 0xF5F0E8, roughness: 0.3, metalness: 0.01 }));
    sc.userData.organPartKey = 'sclera'; sc.userData.structureName = 'Sclera';
    group.add(sc);

    // Cornea – glossy transparent bulge (more pronounced)
    const coGeom = new THREE.SphereGeometry(0.5, 36, 28, 0, Math.PI * 2, 0, Math.PI * 0.38);
    const co = new THREE.Mesh(coGeom, new THREE.MeshPhongMaterial({
        color: 0xCCEEFF, transparent: true, opacity: 0.3, shininess: 200,
        specular: 0xFFFFFF, reflectivity: 0.8
    }));
    co.position.set(0, 0, 0.85);
    co.userData.organPartKey = 'cornea'; co.userData.structureName = 'Cornea';
    group.add(co);

    // Iris – detailed colored ring with radial texture illusion
    const irGeom = new THREE.RingGeometry(0.16, 0.42, 48, 3);
    // Modulate vertices for fibrous iris appearance
    const irPos = irGeom.attributes.position;
    for (let i = 0; i < irPos.count; i++) {
        const x = irPos.getX(i), y = irPos.getY(i);
        const a = Math.atan2(y, x);
        const r = Math.sqrt(x * x + y * y);
        const wave = 0.005 * Math.sin(a * 24) * (r - 0.16);
        irPos.setX(i, x + wave * Math.cos(a));
        irPos.setY(i, y + wave * Math.sin(a));
    }
    irGeom.computeVertexNormals();
    const ir = new THREE.Mesh(irGeom, new THREE.MeshStandardMaterial({
        color: 0x1B6B8A, roughness: 0.5, metalness: 0.1, side: THREE.DoubleSide
    }));
    ir.position.set(0, 0, 0.93);
    ir.userData.organPartKey = 'iris'; ir.userData.structureName = 'Iris';
    group.add(ir);

    // Iris ring highlight
    const irRing = new THREE.Mesh(
        new THREE.RingGeometry(0.40, 0.43, 48),
        new THREE.MeshStandardMaterial({ color: 0x0D4F6A, roughness: 0.3, side: THREE.DoubleSide })
    );
    irRing.position.set(0, 0, 0.932);
    irRing.userData.organPartKey = 'iris';
    group.add(irRing);

    // Pupil – deep black disc with slight depth
    const puGeom = new THREE.CircleGeometry(0.16, 36);
    const pu = new THREE.Mesh(puGeom, new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9, side: THREE.DoubleSide }));
    pu.position.set(0, 0, 0.935);
    pu.userData.organPartKey = 'pupil'; pu.userData.structureName = 'Pupil';
    group.add(pu);

    // Lens – biconvex with refractive look
    const leGeom = new THREE.SphereGeometry(0.32, 32, 24);
    leGeom.scale(1, 1, 0.45);
    const le = new THREE.Mesh(leGeom, new THREE.MeshPhongMaterial({
        color: 0xFFF5D0, transparent: true, opacity: 0.4,
        shininess: 130, specular: 0xFFFFDD
    }));
    le.position.set(0, 0, 0.58);
    le.userData.organPartKey = 'lens'; le.userData.structureName = 'Lens';
    group.add(le);

    // Retina – rich red inner lining (back portion)
    const reGeom = new THREE.SphereGeometry(0.93, 36, 30, 0, Math.PI * 2, Math.PI * 0.3, Math.PI * 0.6);
    const re = new THREE.Mesh(reGeom, new THREE.MeshStandardMaterial({
        color: 0xAA2020, roughness: 0.65, side: THREE.BackSide
    }));
    re.userData.organPartKey = 'retina'; re.userData.structureName = 'Retina';
    group.add(re);

    // Optic Disc (macula spot)
    const macGeom = new THREE.CircleGeometry(0.1, 20);
    const mac = new THREE.Mesh(macGeom, new THREE.MeshStandardMaterial({ color: 0xFF6644, roughness: 0.6, side: THREE.DoubleSide }));
    mac.position.set(0.15, -0.05, -0.92);
    mac.rotation.y = Math.PI;
    mac.userData.organPartKey = 'retina';
    group.add(mac);

    // Optic Nerve – segmented for realism
    const onMat = new THREE.MeshStandardMaterial({ color: 0xE8C840, roughness: 0.4 });
    for (let i = 0; i < 4; i++) {
        const seg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.11 - i * 0.005, 0.12 - i * 0.005, 0.3, 16),
            onMat.clone()
        );
        seg.position.set(0, 0, -1.1 - i * 0.28);
        seg.rotation.x = Math.PI / 2;
        seg.userData.organPartKey = 'optic_nerve';
        seg.userData.structureName = i === 0 ? 'Optic Nerve' : undefined;
        if (i === 0) seg.userData.structureName = 'Optic Nerve';
        group.add(seg);
    }

    // Vitreous Body – subtle gel fill
    const viGeom = new THREE.SphereGeometry(0.88, 32, 24);
    const vi = new THREE.Mesh(viGeom, new THREE.MeshPhongMaterial({
        color: 0xD8EDFF, transparent: true, opacity: 0.1, shininess: 40
    }));
    vi.userData.organPartKey = 'vitreous'; vi.userData.structureName = 'Vitreous Body';
    group.add(vi);

    // Extraocular muscle stubs (cosmetic detail)
    const emMat = new THREE.MeshStandardMaterial({ color: 0xCC6666, roughness: 0.55 });
    [[-0.7, 0.5], [0.7, 0.5], [0, -0.7], [0, 0.7]].forEach(([ox, oy]) => {
        const em = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.6, 10), emMat.clone());
        em.position.set(ox * 0.6, oy * 0.6, -0.7);
        em.lookAt(0, 0, 0); em.rotateX(Math.PI / 2);
        em.userData.organPartKey = 'sclera';
        group.add(em);
    });

    return group;
}

/* ====================== TOOTH ====================== */
function createTooth() {
    const group = new THREE.Group();

    // Crown – molar shape using lathe with cusps
    const crPts = [];
    for (let i = 0; i <= 16; i++) {
        const t = i / 16;
        const cusp = 0.05 * Math.sin(t * Math.PI * 6);
        const r = 0.5 + cusp + 0.08 * Math.sin(t * Math.PI);
        crPts.push(new THREE.Vector2(r, t * 0.85));
    }
    const crGeom = new THREE.LatheGeometry(crPts, 28);
    const cr = new THREE.Mesh(crGeom, new THREE.MeshStandardMaterial({
        color: 0xFFF5EC, roughness: 0.18, metalness: 0.04
    }));
    cr.position.set(0, 0.3, 0);
    cr.userData.organPartKey = 'crown'; cr.userData.structureName = 'Crown';
    group.add(cr);

    // Enamel – glossy outer shell on crown (semi-transparent for depth)
    const enPts = [];
    for (let i = 0; i <= 12; i++) {
        const t = i / 12;
        enPts.push(new THREE.Vector2(0.54 + 0.06 * Math.sin(t * Math.PI), t * 0.9));
    }
    const enGeom = new THREE.LatheGeometry(enPts, 28);
    const en = new THREE.Mesh(enGeom, new THREE.MeshPhongMaterial({
        color: 0xFFFFFF, transparent: true, opacity: 0.55, shininess: 100,
        specular: 0xDDDDFF, side: THREE.DoubleSide
    }));
    en.position.set(0, 0.28, 0);
    en.userData.organPartKey = 'enamel'; en.userData.structureName = 'Enamel';
    group.add(en);

    // Dentin – warm yellow core
    const dePts = [];
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const r = t < 0.4 ? 0.42 : 0.42 - (t - 0.4) * 0.55;
        dePts.push(new THREE.Vector2(Math.max(0.02, r), t * 2.4 - 0.4));
    }
    const deGeom = new THREE.LatheGeometry(dePts, 24);
    const de = new THREE.Mesh(deGeom, new THREE.MeshStandardMaterial({
        color: 0xE8C878, roughness: 0.45, metalness: 0.01
    }));
    de.position.set(0, 0.15, 0);
    de.userData.organPartKey = 'dentin'; de.userData.structureName = 'Dentin';
    group.add(de);

    // Pulp Chamber – vibrant red, visible through dentin
    const puGeom = new THREE.SphereGeometry(0.18, 20, 16);
    puGeom.scale(0.85, 1.5, 0.85);
    const pu = new THREE.Mesh(puGeom, new THREE.MeshStandardMaterial({
        color: 0xCC1818, roughness: 0.55, emissive: 0x220000
    }));
    pu.position.set(0, 0.55, 0);
    pu.userData.organPartKey = 'pulp'; pu.userData.structureName = 'Pulp Chamber';
    group.add(pu);

    // Root Canals – thin red channels winding through roots
    const rcMat = new THREE.MeshStandardMaterial({ color: 0xDD2828, roughness: 0.5, emissive: 0x110000 });
    [-1, 1].forEach((side, idx) => {
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(side * 0.08, 0.35, 0),
            new THREE.Vector3(side * 0.12, -0.3, 0.03 * side),
            new THREE.Vector3(side * 0.15, -0.9, 0)
        );
        const rcGeom = new THREE.TubeGeometry(curve, 16, 0.035, 10, false);
        const rc = new THREE.Mesh(rcGeom, rcMat.clone());
        rc.userData.organPartKey = 'root_canal';
        if (idx === 0) rc.userData.structureName = 'Root Canal';
        group.add(rc);
    });

    // Roots – two tapered conical roots
    const rtMat = new THREE.MeshStandardMaterial({ color: 0xDCC49E, roughness: 0.5 });
    [-1, 1].forEach((side, idx) => {
        const rtPts = [];
        for (let i = 0; i <= 12; i++) {
            const t = i / 12;
            rtPts.push(new THREE.Vector2(0.22 - t * 0.18, t * 1.3));
        }
        const rtGeom = new THREE.LatheGeometry(rtPts, 16);
        const rt = new THREE.Mesh(rtGeom, rtMat.clone());
        rt.position.set(side * 0.2, -0.35, 0);
        rt.rotation.z = side * 0.1;
        rt.rotation.x = Math.PI;
        rt.userData.organPartKey = 'root';
        if (idx === 0) rt.userData.structureName = 'Root';
        group.add(rt);
    });

    // Cementum – thin yellowish coating on roots
    const ceMat = new THREE.MeshStandardMaterial({ color: 0xC4A870, roughness: 0.55, side: THREE.DoubleSide });
    [-1, 1].forEach((side, idx) => {
        const ceGeom = new THREE.CylinderGeometry(0.12, 0.24, 1.3, 16, 1, true);
        const ce = new THREE.Mesh(ceGeom, ceMat.clone());
        ce.position.set(side * 0.2, -0.95, 0);
        ce.rotation.z = side * 0.1;
        ce.userData.organPartKey = 'cementum';
        if (idx === 0) ce.userData.structureName = 'Cementum';
        group.add(ce);
    });

    // Gingiva – fleshy gum collar around neck
    const giGeom = new THREE.TorusGeometry(0.58, 0.2, 16, 32);
    const gi = new THREE.Mesh(giGeom, new THREE.MeshStandardMaterial({
        color: 0xE85580, roughness: 0.55
    }));
    gi.position.set(0, 0.18, 0);
    gi.rotation.x = Math.PI / 2;
    gi.userData.organPartKey = 'gingiva'; gi.userData.structureName = 'Gingiva';
    group.add(gi);
    // Gum tissue extension
    const giExt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.7, 0.15, 28),
        new THREE.MeshStandardMaterial({ color: 0xDD4470, roughness: 0.6 })
    );
    giExt.position.set(0, 0.05, 0);
    giExt.userData.organPartKey = 'gingiva';
    group.add(giExt);

    return group;
}

/* ====================== SPINE ====================== */
function createSpine() {
    const group = new THREE.Group();
    const boneMat = (c) => new THREE.MeshStandardMaterial({ color: c || 0xF5E6D0, roughness: 0.38, metalness: 0.06 });

    // Build 3 vertebrae for more realistic look
    for (let v = 0; v < 3; v++) {
        const yOff = (1 - v) * 1.1;
        const boneCol = [0xF5E6D0, 0xEEDDC5, 0xF0E0CC][v];

        // Vertebral Body – kidney-shaped (squashed sphere)
        const vbGeom = new THREE.SphereGeometry(0.55, 28, 20);
        vbGeom.scale(1.1, 0.45, 0.9);
        const vb = new THREE.Mesh(vbGeom, boneMat(boneCol));
        vb.position.set(0, yOff, 0.25);
        vb.userData.organPartKey = 'vertebral_body'; vb.userData.structureName = 'Vertebral Body';
        group.add(vb);

        // Pedicles – rounded connectors
        [-1, 1].forEach(side => {
            const pdGeom = new THREE.CylinderGeometry(0.1, 0.12, 0.35, 12);
            const pd = new THREE.Mesh(pdGeom, boneMat(boneCol));
            pd.position.set(side * 0.38, yOff, -0.05);
            pd.rotation.x = Math.PI / 2;
            pd.userData.organPartKey = 'pedicle';
            if (v === 0 && side === -1) pd.userData.structureName = 'Pedicle';
            group.add(pd);
        });

        // Laminae – curved plates connecting to spinous process
        [-1, 1].forEach(side => {
            const laGeom = new THREE.BoxGeometry(0.32, 0.25, 0.08);
            // Round edges
            const la = new THREE.Mesh(laGeom, boneMat(boneCol));
            la.position.set(side * 0.2, yOff, -0.35);
            la.rotation.y = side * 0.45;
            la.userData.organPartKey = 'lamina';
            if (v === 0 && side === -1) la.userData.structureName = 'Lamina';
            group.add(la);
        });

        // Spinous Process – elongated posterior projection
        const spGeom = new THREE.ConeGeometry(0.07, 0.75, 12);
        const sp = new THREE.Mesh(spGeom, boneMat(boneCol));
        sp.position.set(0, yOff - 0.05, -0.72);
        sp.rotation.x = Math.PI / 2 + 0.15;
        sp.userData.organPartKey = 'spinous_process';
        if (v === 0) sp.userData.structureName = 'Spinous Process';
        group.add(sp);

        // Transverse Processes – lateral wings
        [-1, 1].forEach(side => {
            const tpGeom = new THREE.ConeGeometry(0.06, 0.55, 10);
            const tp = new THREE.Mesh(tpGeom, boneMat(boneCol));
            tp.position.set(side * 0.72, yOff, -0.15);
            tp.rotation.z = side * Math.PI / 2;
            tp.userData.organPartKey = 'transverse_process';
            if (v === 0 && side === -1) tp.userData.structureName = 'Transverse Process';
            group.add(tp);
        });

        // Facet Joints – smooth articular surfaces between adjacent vertebrae
        if (v < 2) {
            const fjMat = new THREE.MeshStandardMaterial({ color: 0x5DA8D8, roughness: 0.28, metalness: 0.08 });
            [-1, 1].forEach((side, idx) => {
                const fjGeom = new THREE.SphereGeometry(0.09, 14, 12);
                fjGeom.scale(1.2, 0.8, 1);
                const fj = new THREE.Mesh(fjGeom, fjMat.clone());
                fj.position.set(side * 0.34, yOff - 0.35, -0.3);
                fj.userData.organPartKey = 'facet_joint';
                if (v === 0 && idx === 0) fj.userData.structureName = 'Facet Joint';
                group.add(fj);
            });
        }
    }

    // Spinal Canal – translucent column with cord inside
    const scGeom = new THREE.CylinderGeometry(0.2, 0.2, 3.2, 24);
    const sc = new THREE.Mesh(scGeom, new THREE.MeshPhongMaterial({
        color: 0xFFE8C0, transparent: true, opacity: 0.2, shininess: 30
    }));
    sc.position.set(0, 0, -0.15);
    sc.userData.organPartKey = 'spinal_canal'; sc.userData.structureName = 'Spinal Canal';
    group.add(sc);
    // Spinal cord inside
    const cord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 3.1, 12),
        new THREE.MeshStandardMaterial({ color: 0xF0D090, roughness: 0.5 })
    );
    cord.position.set(0, 0, -0.15);
    cord.userData.organPartKey = 'spinal_canal';
    group.add(cord);

    // Intervertebral Discs – between each pair
    for (let d = 0; d < 2; d++) {
        const yPos = 0.55 - d * 1.1;
        const dGeom = new THREE.CylinderGeometry(0.52, 0.52, 0.2, 28);
        const disc = new THREE.Mesh(dGeom, new THREE.MeshStandardMaterial({
            color: 0x3A7AB5, roughness: 0.6
        }));
        disc.position.set(0, yPos, 0.25);
        disc.userData.organPartKey = 'disc';
        if (d === 0) disc.userData.structureName = 'Intervertebral Disc';
        group.add(disc);

        // Nucleus pulposus – gel center
        const npGeom = new THREE.SphereGeometry(0.22, 20, 16);
        npGeom.scale(1, 0.35, 1);
        const np = new THREE.Mesh(npGeom, new THREE.MeshPhongMaterial({
            color: 0x70B8E0, transparent: true, opacity: 0.55, shininess: 50
        }));
        np.position.set(0, yPos, 0.25);
        np.userData.organPartKey = 'disc';
        group.add(np);
    }

    group.rotation.x = 0.3;
    return group;
}

/* ====================== SKIN ====================== */
function createSkin() {
    const group = new THREE.Group();
    const W = 2.8, D = 1.8;

    // Epidermis – thin top layer with slight wavy surface
    const epGeom = new THREE.BoxGeometry(W, 0.18, D, 32, 1, 1);
    // Add surface wave
    const epPos = epGeom.attributes.position;
    for (let i = 0; i < epPos.count; i++) {
        const x = epPos.getX(i), y = epPos.getY(i), z = epPos.getZ(i);
        if (y > 0) epPos.setY(i, y + 0.02 * Math.sin(x * 3) * Math.cos(z * 2));
    }
    epGeom.computeVertexNormals();
    const ep = new THREE.Mesh(epGeom, new THREE.MeshStandardMaterial({ color: 0xF2C9A3, roughness: 0.5 }));
    ep.position.set(0, 0.92, 0);
    ep.userData.organPartKey = 'epidermis'; ep.userData.structureName = 'Epidermis';
    group.add(ep);

    // Dermis – thicker middle layer, richer pink
    const deGeom = new THREE.BoxGeometry(W, 0.55, D);
    const de = new THREE.Mesh(deGeom, new THREE.MeshStandardMaterial({ color: 0xE88A6A, roughness: 0.45 }));
    de.position.set(0, 0.55, 0);
    de.userData.organPartKey = 'dermis'; de.userData.structureName = 'Dermis';
    group.add(de);

    // Hypodermis – thick fatty base, warmer yellow
    const hyGeom = new THREE.BoxGeometry(W, 0.7, D);
    const hy = new THREE.Mesh(hyGeom, new THREE.MeshStandardMaterial({ color: 0xF5D070, roughness: 0.6 }));
    hy.position.set(0, -0.05, 0);
    hy.userData.organPartKey = 'hypodermis'; hy.userData.structureName = 'Hypodermis';
    group.add(hy);
    // Fat lobules in hypodermis
    for (let i = 0; i < 8; i++) {
        const fb = new THREE.Mesh(
            new THREE.SphereGeometry(0.12 + Math.random() * 0.05, 10, 8),
            new THREE.MeshStandardMaterial({ color: 0xF0C850, roughness: 0.7 })
        );
        fb.position.set(-0.9 + i * 0.26, -0.1 + Math.sin(i) * 0.05, (i % 2 - 0.5) * 0.4);
        fb.scale.y = 0.6;
        fb.userData.organPartKey = 'hypodermis';
        group.add(fb);
    }

    // Hair Follicle – angled shaft with bulb at bottom
    const hfMat = new THREE.MeshStandardMaterial({ color: 0x3A2518, roughness: 0.5 });
    // Follicle tube through layers
    const hfCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-0.6, 1.05, 0),
        new THREE.Vector3(-0.55, 0.5, 0.02),
        new THREE.Vector3(-0.52, -0.05, 0)
    );
    const hfGeom = new THREE.TubeGeometry(hfCurve, 16, 0.035, 10, false);
    const hf = new THREE.Mesh(hfGeom, hfMat);
    hf.userData.organPartKey = 'hair_follicle'; hf.userData.structureName = 'Hair Follicle';
    group.add(hf);
    // Hair bulb
    const hbGeom = new THREE.SphereGeometry(0.07, 12, 10);
    const hb = new THREE.Mesh(hbGeom, new THREE.MeshStandardMaterial({ color: 0x2A1A0E, roughness: 0.6 }));
    hb.position.set(-0.52, -0.05, 0);
    hb.userData.organPartKey = 'hair_follicle';
    group.add(hb);
    // Hair shaft above skin
    const hsCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-0.6, 1.02, 0),
        new THREE.Vector3(-0.58, 1.35, 0.01),
        new THREE.Vector3(-0.52, 1.6, 0)
    );
    const hsGeom = new THREE.TubeGeometry(hsCurve, 10, 0.015, 8, false);
    const hs = new THREE.Mesh(hsGeom, hfMat.clone());
    hs.userData.organPartKey = 'hair_follicle';
    group.add(hs);

    // Sweat Gland – coiled secretory portion + straight duct
    const sgMat = new THREE.MeshStandardMaterial({ color: 0x3D8FCC, roughness: 0.4 });
    // Coiled portion
    const sgPts = [];
    for (let i = 0; i <= 40; i++) {
        const t = i / 40;
        sgPts.push(new THREE.Vector3(
            0.5 + 0.09 * Math.cos(t * Math.PI * 6),
            0.1 + t * 0.15,
            0.05 * Math.sin(t * Math.PI * 6)
        ));
    }
    const sgCurve = new THREE.CatmullRomCurve3(sgPts);
    const sgGeom = new THREE.TubeGeometry(sgCurve, 30, 0.025, 8, false);
    const sg = new THREE.Mesh(sgGeom, sgMat);
    sg.userData.organPartKey = 'sweat_gland'; sg.userData.structureName = 'Sweat Gland';
    group.add(sg);
    // Duct going up through skin
    const sdCurve = new THREE.LineCurve3(new THREE.Vector3(0.5, 0.25, 0), new THREE.Vector3(0.48, 1.05, 0.02));
    const sd = new THREE.Mesh(new THREE.TubeGeometry(sdCurve, 8, 0.018, 8, false), sgMat.clone());
    sd.userData.organPartKey = 'sweat_gland';
    group.add(sd);

    // Sebaceous Gland – grape-like cluster near hair follicle
    const sbMat = new THREE.MeshStandardMaterial({ color: 0xD4A830, roughness: 0.5 });
    const sbPositions = [[0, 0, 0], [0.08, 0.04, 0.03], [-0.06, 0.03, -0.02], [0.03, -0.05, 0.04], [-0.04, 0.06, 0.01]];
    sbPositions.forEach((pos, idx) => {
        const sbGeom = new THREE.SphereGeometry(0.06 + idx * 0.005, 10, 8);
        const sb = new THREE.Mesh(sbGeom, sbMat.clone());
        sb.position.set(-0.42 + pos[0], 0.6 + pos[1], 0.05 + pos[2]);
        sb.userData.organPartKey = 'sebaceous_gland';
        if (idx === 0) sb.userData.structureName = 'Sebaceous Gland';
        group.add(sb);
    });
    // Duct to hair
    const sbDuct = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.02, 0.15, 8),
        sbMat.clone()
    );
    sbDuct.position.set(-0.48, 0.7, 0.02);
    sbDuct.rotation.z = 0.4;
    sbDuct.userData.organPartKey = 'sebaceous_gland';
    group.add(sbDuct);

    // Blood Vessels – arteriole + venule network with branching
    const artMat = new THREE.MeshStandardMaterial({ color: 0xCC2020, roughness: 0.3 });
    const venMat = new THREE.MeshStandardMaterial({ color: 0x2244BB, roughness: 0.35 });
    // Arteriole (wavy path in dermis)
    const artPts = [];
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        artPts.push(new THREE.Vector3(-1.2 + t * 2.4, 0.45 + 0.06 * Math.sin(t * 8), 0.35));
    }
    const artCurve = new THREE.CatmullRomCurve3(artPts);
    const art = new THREE.Mesh(new THREE.TubeGeometry(artCurve, 20, 0.028, 8, false), artMat);
    art.userData.organPartKey = 'blood_vessel'; art.userData.structureName = 'Blood Vessel';
    group.add(art);
    // Capillary branches
    for (let i = 0; i < 4; i++) {
        const cx = -0.8 + i * 0.55;
        const cap = new THREE.Mesh(
            new THREE.CylinderGeometry(0.012, 0.015, 0.35, 8),
            artMat.clone()
        );
        cap.position.set(cx, 0.7, 0.35);
        cap.rotation.z = (i % 2 ? 0.2 : -0.2);
        cap.userData.organPartKey = 'blood_vessel';
        group.add(cap);
    }
    // Venule
    const venPts = [];
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        venPts.push(new THREE.Vector3(-1.2 + t * 2.4, 0.35 + 0.05 * Math.cos(t * 7), -0.35));
    }
    const venCurve = new THREE.CatmullRomCurve3(venPts);
    const ven = new THREE.Mesh(new THREE.TubeGeometry(venCurve, 20, 0.024, 8, false), venMat);
    ven.userData.organPartKey = 'blood_vessel';
    group.add(ven);

    // Nerve Endings – branching tree-like structure
    const neMat = new THREE.MeshStandardMaterial({ color: 0xF0C820, roughness: 0.4, emissive: 0x1A1400 });
    // Main nerve trunk
    const neTrunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.03, 1.1, 10),
        neMat
    );
    neTrunk.position.set(0.9, 0.45, -0.15);
    neTrunk.userData.organPartKey = 'nerve_ending'; neTrunk.userData.structureName = 'Nerve Ending';
    group.add(neTrunk);
    // Branching dendrites near epidermis
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI - Math.PI / 2;
        const brLen = 0.25 + Math.random() * 0.15;
        const br = new THREE.Mesh(
            new THREE.CylinderGeometry(0.008, 0.018, brLen, 6),
            neMat.clone()
        );
        br.position.set(
            0.9 + Math.sin(angle) * 0.1,
            0.85 + Math.cos(angle) * 0.08,
            -0.15 + (i - 2) * 0.06
        );
        br.rotation.z = angle * 0.5;
        br.rotation.x = (i - 2) * 0.15;
        br.userData.organPartKey = 'nerve_ending';
        group.add(br);
    }
    // Free nerve ending dots at surface
    for (let i = 0; i < 3; i++) {
        const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.02, 8, 6),
            neMat.clone()
        );
        dot.position.set(0.85 + i * 0.08, 0.95, -0.15 + i * 0.04);
        dot.userData.organPartKey = 'nerve_ending';
        group.add(dot);
    }

    group.rotation.x = 0.2;
    return group;
}

function createNeuron() {
    const group = new THREE.Group();
    const S = THREE.MeshStandardMaterial;

    /* 1 ── Soma (Cell Body) ─ large sphere */
    const somaMat = new S({ color: 0xC9A0DC, roughness: 0.35, metalness: 0.1 });
    const soma = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 32), somaMat);
    soma.position.set(0, 0, 0);
    soma.userData.organPartKey = 'soma';
    soma.userData.structureName = 'Cell Body (Soma)';
    group.add(soma);

    /* Nucleus inside soma (visual, shares soma key) */
    const nucMat = new S({ color: 0x7B2D8E, roughness: 0.3, metalness: 0.1 });
    const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 24), nucMat);
    nucleus.position.set(0, 0.04, 0);
    nucleus.userData.organPartKey = 'soma';
    group.add(nucleus);

    /* 2 ── Dendrites ─ branching tubes on left side */
    const denMat = new S({ color: 0x8FBC8F, roughness: 0.4, metalness: 0.05 });
    const dendriteDirs = [
        { angle: 0.5, tilt: 0.2 },
        { angle: -0.4, tilt: -0.25 },
        { angle: 0.9, tilt: 0.6 },
        { angle: -0.8, tilt: 0.5 },
        { angle: 0.1, tilt: -0.7 }
    ];
    dendriteDirs.forEach((d) => {
        const len = 0.55 + Math.random() * 0.3;
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.07, len, 8),
            denMat
        );
        trunk.position.set(
            -0.35 - len * 0.4,
            Math.sin(d.angle) * 0.25,
            Math.sin(d.tilt) * 0.25
        );
        trunk.rotation.z = Math.PI / 2 + d.angle * 0.3;
        trunk.rotation.x = d.tilt * 0.3;
        trunk.userData.organPartKey = 'dendrites';
        trunk.userData.structureName = 'Dendrites';
        group.add(trunk);
        // Small branches
        for (let b = 0; b < 3; b++) {
            const br = new THREE.Mesh(
                new THREE.CylinderGeometry(0.012, 0.03, 0.2 + Math.random() * 0.15, 6),
                denMat
            );
            const frac = 0.3 + b * 0.25;
            br.position.set(
                trunk.position.x - frac * 0.3,
                trunk.position.y + (b - 1) * 0.12,
                trunk.position.z + (b - 1) * 0.08
            );
            br.rotation.z = Math.PI / 2 + d.angle * 0.6 + b * 0.3;
            br.userData.organPartKey = 'dendrites';
            group.add(br);
        }
    });

    /* 3 ── Axon Hillock ─ cone transition from soma to axon */
    const hillMat = new S({ color: 0xDEB887, roughness: 0.35, metalness: 0.1 });
    const hillock = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.2, 0.3, 12),
        hillMat
    );
    hillock.position.set(0.42, 0, 0);
    hillock.rotation.z = -Math.PI / 2;
    hillock.userData.organPartKey = 'axon_hillock';
    hillock.userData.structureName = 'Axon Hillock';
    group.add(hillock);

    /* 4 ── Axon ─ long cylinder extending right */
    const axonMat = new S({ color: 0xD2B48C, roughness: 0.35, metalness: 0.05 });
    const axonLen = 3.2;
    const axon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, axonLen, 10),
        axonMat
    );
    axon.position.set(0.55 + axonLen / 2, 0, 0);
    axon.rotation.z = Math.PI / 2;
    axon.userData.organPartKey = 'axon';
    axon.userData.structureName = 'Axon';
    group.add(axon);

    /* 5 ── Myelin Sheath ─ segments wrapping the axon */
    const myMat = new S({ color: 0xFFF8DC, roughness: 0.25, metalness: 0.15, transparent: true, opacity: 0.85 });
    const myelinSegments = 6;
    const segLen = 0.38;
    const gap = 0.12;
    const startX = 0.7;
    for (let i = 0; i < myelinSegments; i++) {
        const cx = startX + i * (segLen + gap) + segLen / 2;
        const myelin = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, segLen, 12),
            myMat
        );
        myelin.position.set(cx, 0, 0);
        myelin.rotation.z = Math.PI / 2;
        myelin.userData.organPartKey = 'myelin_sheath';
        myelin.userData.structureName = 'Myelin Sheath';
        group.add(myelin);
    }

    /* 6 ── Nodes of Ranvier ─ rings at gaps between myelin */
    const nodeMat = new S({ color: 0xFF6347, roughness: 0.3, emissive: 0x200800 });
    for (let i = 1; i < myelinSegments; i++) {
        const nx = startX + i * (segLen + gap) - gap / 2;
        const node = new THREE.Mesh(
            new THREE.TorusGeometry(0.09, 0.02, 8, 16),
            nodeMat
        );
        node.position.set(nx, 0, 0);
        node.rotation.y = Math.PI / 2;
        node.userData.organPartKey = 'nodes_ranvier';
        node.userData.structureName = 'Nodes of Ranvier';
        group.add(node);
    }

    /* 7 ── Axon Terminal ─ branching boutons at the end */
    const termMat = new S({ color: 0x6495ED, roughness: 0.3, metalness: 0.1 });
    const termStartX = 0.55 + axonLen + 0.1;
    const termDirs = [
        { dy: 0.15, dz: 0.1 }, { dy: -0.12, dz: 0.08 },
        { dy: 0.05, dz: -0.12 }, { dy: -0.08, dz: -0.1 },
        { dy: 0.18, dz: -0.05 }
    ];
    termDirs.forEach((t) => {
        const br = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.04, 0.3, 8),
            termMat
        );
        br.position.set(termStartX + 0.15, t.dy, t.dz);
        br.rotation.z = Math.PI / 2 + t.dy * 0.8;
        br.rotation.x = t.dz * 0.8;
        br.userData.organPartKey = 'axon_terminal';
        br.userData.structureName = 'Axon Terminal';
        group.add(br);

        // Synaptic bouton (sphere)
        const bouton = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 10, 10),
            termMat
        );
        bouton.position.set(termStartX + 0.35, t.dy * 1.3, t.dz * 1.3);
        bouton.userData.organPartKey = 'axon_terminal';
        group.add(bouton);
    });

    /* 8 ── Synapse ─ small gap/cleft between terminal boutons and a postsynaptic plate */
    const synMat = new S({ color: 0xFFD700, roughness: 0.3, emissive: 0x1A1400, transparent: true, opacity: 0.7 });
    const postMat = new S({ color: 0xA9A9A9, roughness: 0.4, metalness: 0.1 });
    // Postsynaptic membrane plate
    const postPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.7, 0.5),
        postMat
    );
    postPlate.position.set(termStartX + 0.55, 0, 0);
    postPlate.userData.organPartKey = 'synapse';
    postPlate.userData.structureName = 'Synapse';
    group.add(postPlate);
    // Neurotransmitter dots in cleft
    for (let i = 0; i < 8; i++) {
        const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.018, 8, 6),
            synMat
        );
        dot.position.set(
            termStartX + 0.42 + Math.random() * 0.08,
            (Math.random() - 0.5) * 0.35,
            (Math.random() - 0.5) * 0.25
        );
        dot.userData.organPartKey = 'synapse';
        group.add(dot);
    }

    group.scale.set(0.55, 0.55, 0.55);
    return group;
}
