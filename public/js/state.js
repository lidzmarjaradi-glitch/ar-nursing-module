// ═══════════════════════════════════════════════════════
// state.js — Global state variables & utility functions
// ═══════════════════════════════════════════════════════

// Model data
let modelsData = [];
let currentModel = null;
let currentModelId = null;
let scene, camera, renderer, organMesh;
let orbitControls = null;
/** Left-button down position — skip raycast click if user orbited (moved past threshold). */
let orbitClickStart = null;
let isAutoRotating = false;
const VIEW_ZOOM = { min: 1.5, max: 14 };
let raycaster, mouse;

// --- Panel-aware camera view offset ---
// Panel is now bottom-left (not right), so no horizontal shift needed.
const PANEL_OCCUPIED_PX = 0;
const PANEL_SHIFT_PX = 0;
let viewOffsetTarget = 0;   // target shift in px (0 = centered, PANEL_SHIFT_PX = panel open)
let viewOffsetCurrent = 0;   // current (lerped) shift

// ====== INTERACTION MODE SYSTEM ======
let currentInteractionMode = 'explore'; // 'explore' | 'guided' | 'quiz'

// --- Guided Learning Mode state ---
let guidedStepIndex = 0;
let guidedKeys = [];        // ordered structure keys for current model
let guidedCameraTarget = new THREE.Vector3();
let guidedCameraPos = new THREE.Vector3();
let guidedAnimating = false;

// --- Quiz Mode state ---
let quizQuestions = [];      // shuffled structure keys
let quizCurrentIndex = 0;
let quizCorrectCount = 0;
let quizTotalAnswered = 0;
let quizAwaitingClick = false;
let quizAnswered = false;    // has current question been answered?

// --- Highlight indicator state ---
let highlightOutlines = [];   // wireframe outline meshes added to scene
let highlightRing = null;     // pulsing ring indicator
let highlightPulseTime = 0;   // for pulsing animation

function stopAutoRotate() {
    isAutoRotating = false;
    const btn = document.getElementById('autoRotate');
    if (btn) btn.classList.remove('active');
    if (orbitControls) orbitControls.autoRotate = false;
}

function resetOrbitView() {
    if (organMesh) organMesh.rotation.set(0, 0, 0);
    if (camera) camera.position.set(0, 0, 5);
    if (orbitControls) {
        orbitControls.target.set(0, 0, 0);
        orbitControls.update();
    }
}

/** Apply the current view offset to the camera frustum (shifts rendered image) */
function applyCameraViewOffset() {
    if (!camera) return;
    const w = window.innerWidth, h = window.innerHeight;
    if (viewOffsetCurrent > 0.5) {
        camera.setViewOffset(w, h, viewOffsetCurrent, 0, w, h);
    } else {
        camera.clearViewOffset();
    }
    camera.updateProjectionMatrix();
}

function dollyOrbitCamera(zoomIn) {
    if (!orbitControls || !camera) return;
    const off = new THREE.Vector3().subVectors(camera.position, orbitControls.target);
    let dist = off.length();
    dist *= zoomIn ? 0.88 : 1.14;
    dist = Math.max(VIEW_ZOOM.min, Math.min(VIEW_ZOOM.max, dist));
    off.normalize().multiplyScalar(dist);
    camera.position.copy(orbitControls.target).add(off);
    orbitControls.update();
}
let interactiveParts = [];
let highlightedMeshes = [];
let currentTooltipStructure = null;
let heartNumberLabelsVisible = true;

/** Show or hide the information panel (bottom sheet). Hides peek strip when show=false. */
function setInfoPanelVisible(show, persist) {
    const _infoPanel = document.getElementById('infoPanel');
    if (!_infoPanel) return;
    _infoPanel.classList.toggle('hidden', !show);
    // When hiding, also collapse expanded state
    if (!show) _infoPanel.classList.remove('expanded');
    document.body.classList.toggle('panel-open', show);
    viewOffsetTarget = 0; // bottom sheet doesn't shift the camera laterally
    if (persist) {
        try { localStorage.setItem('infoPanelVisible', show ? '1' : '0'); } catch (e) { }
    }
}
let quizFinished = false;
let heartCss2DRenderer = null;
let heartScreenLabelEntries = [];
/** Populated when the external brain glTF loads (multi-mesh regional models). */
let brainMeshDetailsRuntime = null;
/** Populated when the UMCG heart+lungs glTF loads (lungs selector). */
let lungMeshDetailsRuntime = null;
