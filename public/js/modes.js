// ═══════════════════════════════════════════════════════
// modes.js — Guided learning & quiz interaction modes
// ═══════════════════════════════════════════════════════

// ─── Mode helpers ───

function getMeshWorldCenter(meshKey) {
    if (!organMesh) return null;
    const center = new THREE.Vector3();
    let found = false;

    if (currentModelId === 'heart') {
        // Heart: group key matches organPartKey; combine bounding boxes of all meshes in the group
        const groupBox = new THREE.Box3();
        organMesh.traverse((child) => {
            if (!child.isMesh) return;
            if (child.userData.organPartKey === meshKey) {
                child.updateMatrixWorld(true);
                const box = new THREE.Box3().setFromObject(child);
                groupBox.union(box);
                found = true;
            }
        });
        if (found) groupBox.getCenter(center);
    } else if (currentModelId === 'kidney') {
        // Kidney labels are placed at computed anchor positions — find closest screen label entry
        const entry = heartScreenLabelEntries.find(e => e.key === meshKey);
        if (entry && entry.mesh) {
            entry.mesh.updateMatrixWorld(true);
            const lc = entry.localCenter.clone();
            center.copy(lc);
            entry.mesh.localToWorld(center);
            found = true;
        }
    } else {
        // Brain, lungs, syringe: search by organPartKey or mesh name
        organMesh.traverse((child) => {
            if (found) return;
            if (!child.isMesh) return;
            const pk = child.userData.organPartKey || child.name;
            if (pk === meshKey) {
                child.updateMatrixWorld(true);
                const box = new THREE.Box3().setFromObject(child);
                box.getCenter(center);
                found = true;
            }
        });
    }
    return found ? center : null;
}

/** Smoothly animate camera to look at a world-space target position.
 *  Computes an ideal viewing angle facing the structure (outward from model center)
 *  and zooms in close so the user can clearly see the part. */
function focusCameraOnPoint(worldPos) {
    if (!camera || !orbitControls) return;

    // Model center (origin or bounding-box center of the whole organ)
    const modelCenter = new THREE.Vector3(0, 0, 0);
    if (organMesh) {
        const mbox = new THREE.Box3().setFromObject(organMesh);
        mbox.getCenter(modelCenter);
    }

    // Direction from model center outward through the target part
    const outward = worldPos.clone().sub(modelCenter);
    if (outward.lengthSq() < 1e-8) outward.set(0, 0, 1);
    outward.normalize();

    // Zoom-in distance: close enough to see the part clearly
    const zoomDist = 0.5;

    // Camera position: place it along the outward direction from the part
    guidedCameraTarget.copy(worldPos);
    guidedCameraPos.copy(worldPos).addScaledVector(outward, zoomDist);

    guidedAnimating = true;
}

// ====== MODE SWITCHING ======

function switchMode(mode) {
    if (mode === currentInteractionMode) return;
    const prevMode = currentInteractionMode;
    currentInteractionMode = mode;

    // Clean up previous mode
    if (prevMode === 'guided') exitGuidedMode();
    if (prevMode === 'quiz') exitQuizMode();

    // Update body classes
    document.body.classList.remove('mode-explore', 'mode-guided', 'mode-quiz');
    document.body.classList.add('mode-' + mode);

    // Update mode bar buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Enter new mode
    if (mode === 'guided') enterGuidedMode();
    else if (mode === 'quiz') enterQuizMode();
    else enterExploreMode();
}

function enterExploreMode() {
    // Restore normal label state
    removeHighlight();
    heartScreenLabelEntries.forEach(e => {
        if (e.labelEl) { e.labelEl.classList.remove('dimmed', 'guided-active', 'quiz-correct', 'quiz-wrong'); }
    });
    // Restore line visibility
    document.querySelectorAll('.heart-screen-label-line').forEach(l => l.classList.remove('guided-active-line'));
    // Re-show labels if they were on
    if (heartNumberLabelsVisible) {
        setHeartNumberLabelsVisible(true);
    }
    guidedAnimating = false;
}

// ====== GUIDED LEARNING MODE ======

function enterGuidedMode() {
    if (!currentModelId) return;
    const detailsMap = getMeshDetailsMap(currentModelId);
    if (!detailsMap) { switchMode('explore'); return; }

    guidedKeys = meshLegendKeys(currentModelId);
    if (guidedKeys.length === 0) { switchMode('explore'); return; }

    guidedStepIndex = 0;

    // Stop any auto-rotation
    stopAutoRotate();

    // Hide info panel in guided mode for clean view
    setInfoPanelVisible(false, false);

    // Show all labels but dimmed
    setHeartNumberLabelsVisible(true);

    showGuidedStep();
    document.getElementById('guidedPanel').classList.add('visible');
    document.getElementById('guidedStepPill').classList.add('visible');
    document.getElementById('guidedFloatNav').classList.add('visible');
}

function exitGuidedMode() {
    document.getElementById('guidedPanel').classList.remove('visible');
    document.getElementById('guidedStepPill').classList.remove('visible');
    document.getElementById('guidedFloatNav').classList.remove('visible');
    guidedAnimating = false;
    removeHighlight();
    // Undim all labels
    heartScreenLabelEntries.forEach(e => {
        if (e.labelEl) e.labelEl.classList.remove('dimmed', 'guided-active');
    });
    document.querySelectorAll('.heart-screen-label-line').forEach(l => l.classList.remove('guided-active-line'));
}

function showGuidedStep() {
    const detailsMap = getMeshDetailsMap(currentModelId);
    if (!detailsMap || guidedKeys.length === 0) return;

    const key = guidedKeys[guidedStepIndex];
    const info = detailsMap[key];
    if (!info) return;

    const total = guidedKeys.length;
    const step = guidedStepIndex + 1;

    // Update panel content
    document.getElementById('guidedStepCounter').textContent = 'Step ' + step + ' of ' + total;
    document.getElementById('guidedTitle').textContent = info.title || key;
    document.getElementById('guidedDetail').textContent = info.detail || '';

    // Clinical relevance: try structureInfo first, then fall back to detail
    let clinical = '';
    if (structureInfo[currentModelId]) {
        const si = structureInfo[currentModelId];
        // structureInfo is an object { name: tooltip }
        for (const [name, tooltip] of Object.entries(si)) {
            if (info.title && (name.toLowerCase().includes(info.title.toLowerCase()) || info.title.toLowerCase().includes(name.toLowerCase()))) {
                clinical = tooltip;
                break;
            }
        }
    }
    const clinicalEl = document.getElementById('guidedClinical');
    if (clinical) {
        clinicalEl.textContent = clinical;
        clinicalEl.style.display = '';
    } else {
        clinicalEl.style.display = 'none';
    }

    // Progress bar
    document.getElementById('guidedProgressFill').style.width = ((step / total) * 100) + '%';

    // Nav button states
    document.getElementById('guidedPrev').disabled = guidedStepIndex === 0;
    document.getElementById('guidedNext').textContent = guidedStepIndex === total - 1 ? 'Finish ✓' : 'Next →';

    // Highlight current structure, dim others
    removeHighlight();
    highlightOrganPartByKey(key);

    heartScreenLabelEntries.forEach(e => {
        if (!e.labelEl) return;
        const isActive = e.key === key;
        e.labelEl.classList.toggle('dimmed', !isActive);
        e.labelEl.classList.toggle('guided-active', isActive);
    });
    // Dim/activate SVG lines too
    document.querySelectorAll('.heart-screen-label-line').forEach(line => {
        line.classList.remove('guided-active-line');
    });
    // Find the SVG line for this label
    const activeEntry = heartScreenLabelEntries.find(e => e.key === key);
    if (activeEntry && activeEntry.lineEl) {
        activeEntry.lineEl.classList.add('guided-active-line');
    }

    // Focus camera on the structure
    const worldCenter = getMeshWorldCenter(key);
    if (worldCenter) {
        focusCameraOnPoint(worldCenter);
    }
}

function guidedNext() {
    if (guidedStepIndex >= guidedKeys.length - 1) {
        // Finished — go back to explore
        switchMode('explore');
        return;
    }
    guidedStepIndex++;
    showGuidedStep();
}

function guidedPrev() {
    if (guidedStepIndex <= 0) return;
    guidedStepIndex--;
    showGuidedStep();
}

// ====== QUIZ MODE ======

// ─── Quiz system ───

function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function enterQuizMode() {
    if (!currentModelId) return;
    const detailsMap = getMeshDetailsMap(currentModelId);
    if (!detailsMap) { switchMode('explore'); return; }

    const keys = meshLegendKeys(currentModelId);
    if (keys.length === 0) { switchMode('explore'); return; }

    // Hide info panel and disable toggle during quiz
    setInfoPanelVisible(false, false);
    quizFinished = false;
    document.getElementById('toggleInfo').classList.add('quiz-locked');

    // Shuffle and pick a random number of questions (6-10, or all if fewer)
    const maxQ = Math.min(keys.length, Math.floor(Math.random() * 5) + 6);
    quizQuestions = shuffleArray(keys).slice(0, maxQ);
    quizCurrentIndex = 0;
    quizCorrectCount = 0;
    quizTotalAnswered = 0;
    quizAwaitingClick = true;
    quizAnswered = false;

    // Hide all labels
    setHeartNumberLabelsVisible(false);

    showQuizQuestion();
    const quizPanel = document.getElementById('quizPanel');
    quizPanel.classList.add('visible');
    // JS fallback: ensure panel is visible even if CSS transition is suppressed
    requestAnimationFrame(() => {
        quizPanel.style.bottom = '0';
        quizPanel.style.opacity = '1';
    });
}

function exitQuizMode() {
    const quizPanel = document.getElementById('quizPanel');
    quizPanel.style.bottom = '';
    quizPanel.style.opacity = '';
    quizPanel.classList.remove('visible');
    quizAwaitingClick = false;
    quizAnswered = false;
    quizFinished = true;
    document.getElementById('toggleInfo').classList.remove('quiz-locked');
    removeHighlight();
    // Remove quiz CSS classes and restore display
    heartScreenLabelEntries.forEach(e => {
        if (e.labelEl) {
            e.labelEl.classList.remove('quiz-correct', 'quiz-wrong', 'dimmed');
            e.labelEl.style.display = '';
        }
        if (e.lineEl) e.lineEl.style.display = '';
    });
    // Restore label visibility to user preference
    setHeartNumberLabelsVisible(heartNumberLabelsVisible);
}

function showQuizQuestion() {
    const detailsMap = getMeshDetailsMap(currentModelId);
    if (!detailsMap) return;

    const correctKey = quizQuestions[quizCurrentIndex];
    const correctInfo = detailsMap[correctKey];
    if (!correctInfo) return;

    quizAnswered = false;
    quizAwaitingClick = false;

    // Reset visual state from previous question
    removeHighlight();
    heartScreenLabelEntries.forEach(e => {
        if (e.labelEl) {
            e.labelEl.classList.remove('quiz-correct', 'quiz-wrong');
            e.labelEl.style.display = 'none';
        }
    });
    document.querySelectorAll('.heart-screen-label-line').forEach(l => l.style.display = 'none');

    // Focus camera on the structure so user can see it
    const worldCenter = getMeshWorldCenter(correctKey);
    if (worldCenter) focusCameraOnPoint(worldCenter);
    highlightOrganPartByKey(correctKey);

    // Update panel
    const total = quizQuestions.length;
    document.getElementById('quizQuestionNum').textContent = quizCurrentIndex + 1;
    document.getElementById('quizQuestionTotal').textContent = total;
    document.getElementById('quizCorrect').textContent = quizCorrectCount;
    document.getElementById('quizTotal').textContent = quizTotalAnswered;

    // Question text
    document.getElementById('quizQuestion').textContent = 'What structure is highlighted?';
    document.getElementById('quizInstruction').textContent = 'Select the correct answer below';

    // Build 4 multiple choice options (1 correct + 3 distractors)
    const allKeys = meshLegendKeys(currentModelId);
    const distractorPool = allKeys.filter(k => k !== correctKey);
    const distractors = shuffleArray(distractorPool).slice(0, 3);
    const choices = shuffleArray([correctKey, ...distractors]);

    const choicesEl = document.getElementById('quizChoices');
    choicesEl.innerHTML = '';
    choices.forEach(choiceKey => {
        const choiceInfo = detailsMap[choiceKey];
        const btn = document.createElement('button');
        btn.className = 'quiz-choice-btn';
        btn.textContent = choiceInfo ? choiceInfo.title : choiceKey;
        btn.addEventListener('click', () => handleQuizChoice(choiceKey, correctKey, btn));
        choicesEl.appendChild(btn);
    });

    // Hide feedback and action buttons
    const fb = document.getElementById('quizFeedback');
    fb.className = 'quiz-feedback';
    fb.style.display = 'none';
    document.getElementById('quizNext').style.display = 'none';
    document.getElementById('quizRestart').style.display = 'none';
    document.getElementById('quizSkip').style.display = '';
}

function handleQuizChoice(chosenKey, correctKey, clickedBtn) {
    if (quizAnswered) return;
    quizAnswered = true;
    quizTotalAnswered++;

    const detailsMap = getMeshDetailsMap(currentModelId);
    const correctInfo = detailsMap ? detailsMap[correctKey] : null;
    const isCorrect = chosenKey === correctKey;

    // Mark all choice buttons
    const allBtns = document.querySelectorAll('#quizChoices .quiz-choice-btn');
    allBtns.forEach(btn => {
        btn.classList.add('answered');
        const btnTitle = btn.textContent;
        const correctTitle = correctInfo ? correctInfo.title : correctKey;
        if (btnTitle === correctTitle) {
            btn.classList.add('choice-correct');
        } else if (btn === clickedBtn && !isCorrect) {
            btn.classList.add('choice-wrong');
        } else {
            btn.classList.add('choice-dimmed');
        }
    });

    const fb = document.getElementById('quizFeedback');

    if (isCorrect) {
        quizCorrectCount++;
        fb.className = 'quiz-feedback correct';
        fb.innerHTML = '✓ Correct!';
        const entry = heartScreenLabelEntries.find(e => e.key === correctKey);
        if (entry && entry.labelEl) {
            entry.labelEl.style.display = '';
            entry.labelEl.classList.add('quiz-correct');
        }
        if (entry && entry.lineEl) entry.lineEl.style.display = '';
    } else {
        fb.className = 'quiz-feedback wrong';
        fb.innerHTML = '✗ Incorrect. The answer is <strong>' + (correctInfo ? correctInfo.title : correctKey) + '</strong>';
        const correctEntry = heartScreenLabelEntries.find(e => e.key === correctKey);
        if (correctEntry && correctEntry.labelEl) {
            correctEntry.labelEl.style.display = '';
            correctEntry.labelEl.classList.add('quiz-correct');
        }
        if (correctEntry && correctEntry.lineEl) correctEntry.lineEl.style.display = '';
    }

    fb.style.display = 'block';

    // Update score
    document.getElementById('quizCorrect').textContent = quizCorrectCount;
    document.getElementById('quizTotal').textContent = quizTotalAnswered;

    // Show next or restart
    document.getElementById('quizSkip').style.display = 'none';
    if (quizCurrentIndex < quizQuestions.length - 1) {
        document.getElementById('quizNext').style.display = '';
    } else {
        fb.innerHTML += '<br><br><strong>Quiz Complete!</strong> Score: ' + quizCorrectCount + ' / ' + quizQuestions.length + ' (' + Math.round((quizCorrectCount / quizQuestions.length) * 100) + '%)';
        document.getElementById('quizRestart').style.display = '';
        // Unlock info panel after quiz is finished
        quizFinished = true;
        document.getElementById('toggleInfo').classList.remove('quiz-locked');
    }
}

function quizNextQuestion() {
    quizCurrentIndex++;
    removeHighlight();
    showQuizQuestion();
}

function quizSkipQuestion() {
    quizTotalAnswered++;
    document.getElementById('quizTotal').textContent = quizTotalAnswered;
    if (quizCurrentIndex < quizQuestions.length - 1) {
        quizCurrentIndex++;
        showQuizQuestion();
    } else {
        // End of quiz
        const fb = document.getElementById('quizFeedback');
        fb.className = 'quiz-feedback wrong';
        fb.innerHTML = '<strong>Quiz Complete!</strong> Score: ' + quizCorrectCount + ' / ' + quizQuestions.length + ' (' + Math.round((quizCorrectCount / quizQuestions.length) * 100) + '%)';
        fb.style.display = 'block';
        quizAwaitingClick = false;
        document.getElementById('quizSkip').style.display = 'none';
        document.getElementById('quizRestart').style.display = '';
        // Unlock info panel after quiz is finished
        quizFinished = true;
        document.getElementById('toggleInfo').classList.remove('quiz-locked');
    }
}

function quizRestart() {
    exitQuizMode();
    enterQuizMode();
}

// ====== MODE EVENT HANDLERS ======

// ─── Mode event handlers ───

function setupModeControls() {
    // Mode bar buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => switchMode(btn.dataset.mode));
    });

    // Guided nav
    document.getElementById('guidedPrev').addEventListener('click', guidedPrev);
    document.getElementById('guidedNext').addEventListener('click', guidedNext);

    // Quiz buttons
    document.getElementById('quizNext').addEventListener('click', quizNextQuestion);
    document.getElementById('quizSkip').addEventListener('click', quizSkipQuestion);
    document.getElementById('quizRestart').addEventListener('click', quizRestart);

    // Keyboard shortcuts for guided mode
    document.addEventListener('keydown', (e) => {
        if (currentInteractionMode === 'guided') {
            if (e.key === 'ArrowRight' || e.key === 'n') guidedNext();
            else if (e.key === 'ArrowLeft' || e.key === 'p') guidedPrev();
        }
    });
}
