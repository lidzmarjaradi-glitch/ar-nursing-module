// ═══════════════════════════════════════════════════════
// scene.js — Three.js scene setup, resize & animation loop
// ═══════════════════════════════════════════════════════

function initScene() {
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('three-canvas'),
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x06080f, 1);

    // Raycaster for interactive clicks
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0x4a90d9, 0.5);
    backLight.position.set(-5, -5, -5);
    scene.add(backLight);

    // Handle resize
    window.addEventListener('resize', onWindowResize);

    if (typeof THREE.CSS2DRenderer !== 'undefined') {
        heartCss2DRenderer = new THREE.CSS2DRenderer();
        heartCss2DRenderer.setSize(window.innerWidth, window.innerHeight);
        const el = heartCss2DRenderer.domElement;
        el.style.position = 'absolute';
        el.style.top = '0';
        el.style.left = '0';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '5';
        document.getElementById('viewer-container').appendChild(el);
    }

    if (typeof THREE.OrbitControls !== 'undefined') {
        orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
        orbitControls.target.set(0, 0, 0);
        orbitControls.enableDamping = true;
        orbitControls.dampingFactor = 0.08;
        orbitControls.enablePan = false;
        orbitControls.minDistance = VIEW_ZOOM.min;
        orbitControls.maxDistance = VIEW_ZOOM.max;
        orbitControls.minPolarAngle = Math.PI * 0.08;
        orbitControls.maxPolarAngle = Math.PI * 0.92;
        orbitControls.rotateSpeed = 0.72;
        orbitControls.zoomSpeed = 0.85;
        orbitControls.autoRotate = false;
        orbitControls.autoRotateSpeed = 1.6;
    }

    setupControls();
    setupModeControls();

    animate();
}

// ─── Window resize ───

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (heartCss2DRenderer) {
        heartCss2DRenderer.setSize(window.innerWidth, window.innerHeight);
    }
    // Recalculate panel offset for new viewport size
    if (isMobileDevice()) {
        viewOffsetTarget = 0;
        viewOffsetCurrent = 0;
    }
    applyCameraViewOffset();
    if (orbitControls) {
        orbitControls.update();
    }
    updateHeartScreenSpaceLabels();
}

// ─── Animation loop ───

function animate() {
    requestAnimationFrame(animate);

    if (orbitControls) {
        orbitControls.update();
    }

    // Smoothly lerp camera view offset for panel-aware centering
    const voDiff = viewOffsetTarget - viewOffsetCurrent;
    if (Math.abs(voDiff) > 0.5) {
        viewOffsetCurrent += voDiff * 0.1;
        applyCameraViewOffset();
    } else if (voDiff !== 0) {
        viewOffsetCurrent = viewOffsetTarget;
        applyCameraViewOffset();
    }

    // Guided mode: smooth camera focus animation (zoom + rotate to structure)
    if (guidedAnimating && orbitControls) {
        const lerpFactor = 0.14;
        orbitControls.target.lerp(guidedCameraTarget, lerpFactor);
        camera.position.lerp(guidedCameraPos, lerpFactor);
        orbitControls.update();
        const distT = orbitControls.target.distanceTo(guidedCameraTarget);
        const distP = camera.position.distanceTo(guidedCameraPos);
        if (distT < 0.003 && distP < 0.003) {
            orbitControls.target.copy(guidedCameraTarget);
            camera.position.copy(guidedCameraPos);
            orbitControls.update();
            guidedAnimating = false;
        }
    }

    // Highlight indicator: pulse ring + outline animation
    highlightPulseTime += 0.04;
    if (highlightRing && camera) {
        // Billboard: ring always faces the camera
        highlightRing.quaternion.copy(camera.quaternion);
        // Scale ring to consistent screen-space size based on camera distance
        const dist = camera.position.distanceTo(highlightRing.position);
        const baseScale = dist * 0.08; // consistent apparent size
        const pulse = 0.3 + 0.25 * Math.sin(highlightPulseTime * 2.5);
        highlightRing.material.opacity = pulse;
        const s = baseScale * (1.0 + 0.08 * Math.sin(highlightPulseTime * 2.5));
        highlightRing.scale.set(s, s, s);
    }
    // Pulse emissive on highlighted meshes
    if (highlightedMeshes.length > 0) {
        const emPulse = 0.3 + 0.2 * Math.sin(highlightPulseTime * 2.5);
        highlightedMeshes.forEach(mesh => {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach(mat => {
                if (mat && mat.emissive) mat.emissiveIntensity = emPulse;
            });
        });
    }
    // Pulse outline opacity
    if (highlightOutlines.length > 0) {
        const oPulse = 0.4 + 0.4 * Math.sin(highlightPulseTime * 2.5);
        highlightOutlines.forEach(o => {
            if (o.material) o.material.opacity = oPulse;
        });
    }

    // Throttle heart label updates to ~20 fps for performance
    if (!animate._heartLabelCounter) animate._heartLabelCounter = 0;
    if (++animate._heartLabelCounter >= 3) {
        animate._heartLabelCounter = 0;
        updateHeartScreenSpaceLabels();
    }
    renderer.render(scene, camera);
    if (heartCss2DRenderer && (currentModelId === 'heart' || currentModelId === 'brain' || currentModelId === 'lungs' || currentModelId === 'kidney')) {
        heartCss2DRenderer.render(scene, camera);
    }
}

// Detect mobile device
