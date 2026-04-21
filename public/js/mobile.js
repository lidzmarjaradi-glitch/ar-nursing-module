/* ═══════════════════════════════════════════════════════
   Mobile Bottom Sheet Controller  v3.5
   Activates only on viewports ≤ 768px.
   Desktop layout is completely unaffected.

   Features:
   - 3 snap points: collapsed (56px) / mid (~40 vh) / expanded (~72 vh)
   - Drag locked to handle bar only — zero scroll conflict in panel body
   - Velocity-based snap for native flick feel
   - Live backdrop dim synced to drag position
   - Safe-area aware (iPhone home indicator handled via CSS)
   - Per-mode state memory — restores last snap on mode switch
   - GPU-accelerated: will-change during drag, auto otherwise
   - Orientation change recalculates snap positions instantly
   - Rapid-tap spam protection via isAnimating flag
   ═══════════════════════════════════════════════════════ */
(function () {
    'use strict';

    /* ─── Constants ───────────────────────────────────────── */
    var BREAKPOINT   = 768;
    var HANDLE_H     = 56;       // px — height of collapsed peek
    var MID_VH       = 0.40;     // fraction of viewport shown in mid state
    var FLICK_VEL    = 0.45;     // px/ms — velocity threshold for flick snap
    var EASING       = 'cubic-bezier(0.22, 1, 0.36, 1)';
    var DURATION_MS  = 280;
    var TRANSITION   = 'transform ' + DURATION_MS + 'ms ' + EASING;

    /* Snap indices — 0 = most collapsed, 2 = most expanded */
    var SNAP_COLLAPSED = 0;
    var SNAP_MID       = 1;
    var SNAP_EXPANDED  = 2;

    var SHEETS = [
        { panelId: 'guidedPanel', handleId: 'guidedSheetHandle', mode: 'guided'  },
        { panelId: 'quizPanel',   handleId: 'quizSheetHandle',   mode: 'quiz'    },
        { panelId: 'infoPanel',   handleId: 'infoSheetHandle',   mode: 'explore' }
    ];

    /* Last-used snap index per mode — restored when switching back */
    var modeSnapMemory = { explore: SNAP_COLLAPSED, guided: SNAP_COLLAPSED, quiz: SNAP_COLLAPSED };

    function isMobile() { return window.innerWidth <= BREAKPOINT; }

    /* ─── Snap Y computation ──────────────────────────────── */
    /*
     * translateY values where 0 = fully open, higher = more collapsed.
     * Returns [collapsedY, midY, expandedY].
     */
    function getSnapYs(panel) {
        var h       = panel.offsetHeight || 300;
        var midShow = Math.min(window.innerHeight * MID_VH, h);
        return [
            Math.max(0, h - HANDLE_H),   // COLLAPSED: only handle peeks
            Math.max(0, h - midShow),    // MID: ~40 vh visible
            0                            // EXPANDED: full panel
        ];
    }

    /* ─── Backdrop ────────────────────────────────────────── */
    var _backdrop = null;

    function ensureBackdrop() {
        if (_backdrop) return _backdrop;
        _backdrop = document.createElement('div');
        _backdrop.id = 'sheetBackdrop';
        _backdrop.style.cssText =
            'position:fixed;inset:0;background:rgba(0,0,0,0);' +
            'pointer-events:none;z-index:95;' +
            'transition:background ' + DURATION_MS + 'ms ' + EASING + ';';
        _backdrop.addEventListener('click', function () {
            if (!isMobile()) return;
            SHEETS.forEach(function (s) {
                var p = document.getElementById(s.panelId);
                if (p && isPanelShowing(p)) snapTo(p, SNAP_COLLAPSED, true);
            });
        });
        document.body.appendChild(_backdrop);
        return _backdrop;
    }

    function setBackdropAlpha(alpha) {
        var bd = ensureBackdrop();
        if (alpha <= 0) {
            bd.style.background    = 'rgba(0,0,0,0)';
            bd.style.pointerEvents = 'none';
        } else {
            bd.style.background    = 'rgba(0,0,0,' + Math.min(alpha, 0.45).toFixed(3) + ')';
            bd.style.pointerEvents = 'auto';
        }
    }

    /* ─── Panel visibility helper ─────────────────────────── */
    function isPanelShowing(panel) {
        if (panel.id === 'infoPanel') return !panel.classList.contains('hidden');
        return panel.classList.contains('visible');
    }

    /* ─── Read current translateY from computed matrix ───── */
    function currentTranslateY(panel) {
        var m = window.getComputedStyle(panel).transform;
        if (!m || m === 'none') return 0;
        var parts = m.match(/matrix.*\((.+)\)/);
        return parts ? (parseFloat(parts[1].split(',')[5]) || 0) : 0;
    }

    /* ─── Core snap ───────────────────────────────────────── */
    function snapTo(panel, snapIndex, animate) {
        if (!panel) return;
        var snapYs = getSnapYs(panel);
        var y      = snapYs[snapIndex];

        panel.dataset.snap     = String(snapIndex);
        panel.style.willChange = 'auto';

        if (animate) {
            /* rAF ensures transition fires from the current painted position */
            requestAnimationFrame(function () {
                panel.style.transition = TRANSITION;
                panel.style.transform  = 'translateY(' + y + 'px)';
            });
        } else {
            panel.style.transition = 'none';
            panel.style.transform  = 'translateY(' + y + 'px)';
        }

        /* CSS class drives chevron rotation */
        if (snapIndex === SNAP_EXPANDED) {
            panel.classList.add('sheet-expanded');
        } else {
            panel.classList.remove('sheet-expanded');
        }

        /* Backdrop opacity: 0 → collapsed, 0.5 → mid, 1 → expanded */
        var alpha = snapIndex === SNAP_COLLAPSED ? 0
                  : snapIndex === SNAP_MID       ? 0.2
                  : 0.4;
        setBackdropAlpha(alpha);
    }

    /* ─── Velocity-based nearest snap ─────────────────────── */
    function nearestSnap(snapYs, currentY, velocity) {
        /* Proximity: find closest snap point */
        var best = 0, bestDist = Infinity;
        for (var i = 0; i < snapYs.length; i++) {
            var d = Math.abs(currentY - snapYs[i]);
            if (d < bestDist) { bestDist = d; best = i; }
        }
        /* Velocity override: nudge one step further in drag direction */
        if (velocity >  FLICK_VEL) return Math.max(best - 1, SNAP_COLLAPSED); // flick down → collapse
        if (velocity < -FLICK_VEL) return Math.min(best + 1, SNAP_EXPANDED);  // flick up → expand
        return best;
    }

    /* ─── Collapse all sheets ─────────────────────────────── */
    function collapseAll(animate) {
        SHEETS.forEach(function (s) {
            var p = document.getElementById(s.panelId);
            if (p) snapTo(p, SNAP_COLLAPSED, animate === true);
        });
        setBackdropAlpha(0);
    }

    /* ─── Per-sheet initialization ────────────────────────── */
    function initSheet(sheetDef) {
        var panel  = document.getElementById(sheetDef.panelId);
        var handle = document.getElementById(sheetDef.handleId);
        if (!panel || !handle) return;

        panel.dataset.snap = String(SNAP_COLLAPSED);

        /* ── Drag state ── */
        var isDragging      = false;
        var isAnimating     = false;   // spam-protection lock
        var dragStartTouchY = 0;
        var dragStartPanelY = 0;
        var dragSnapYs      = null;
        var lastTouchY      = 0;
        var lastTouchTime   = 0;
        var tapStartY       = 0;

        /* TOUCHSTART on handle — begin drag tracking */
        handle.addEventListener('touchstart', function (e) {
            if (!isMobile()) return;
            tapStartY       = e.touches[0].clientY;
            dragStartTouchY = e.touches[0].clientY;
            dragStartPanelY = currentTranslateY(panel);
            dragSnapYs      = getSnapYs(panel);
            lastTouchY      = dragStartTouchY;
            lastTouchTime   = e.timeStamp;
            isDragging      = true;

            /* Kill CSS transition and prime GPU layer */
            panel.style.transition = 'none';
            panel.style.willChange = 'transform';
            ensureBackdrop();
        }, { passive: true });

        /* TOUCHMOVE on handle — live position update */
        handle.addEventListener('touchmove', function (e) {
            if (!isDragging || !isMobile()) return;

            var dy   = e.touches[0].clientY - dragStartTouchY;
            var newY = dragStartPanelY + dy;

            /* Clamp with slight overscroll feel at both ends */
            var minY = -16;
            var maxY = dragSnapYs[SNAP_COLLAPSED] + 32;
            newY = Math.max(minY, Math.min(maxY, newY));

            panel.style.transform = 'translateY(' + newY + 'px)';

            /* Live backdrop opacity sync */
            var expandedY  = dragSnapYs[SNAP_EXPANDED];
            var collapsedY = dragSnapYs[SNAP_COLLAPSED];
            var range      = collapsedY - expandedY;
            if (range > 0) {
                var progress = 1 - (newY - expandedY) / range;
                setBackdropAlpha(Math.max(0, Math.min(1, progress)) * 0.4);
            }

            lastTouchY    = e.touches[0].clientY;
            lastTouchTime = e.timeStamp;
        }, { passive: true });

        /* TOUCHEND on handle — calculate velocity, snap to point */
        handle.addEventListener('touchend', function (e) {
            if (!isDragging || !isMobile()) return;
            isDragging = false;

            /* Spam guard: ignore rapid re-taps during snap animation */
            if (isAnimating) return;
            isAnimating = true;
            setTimeout(function () { isAnimating = false; }, DURATION_MS + 50);

            var totalDrag = Math.abs(e.changedTouches[0].clientY - tapStartY);

            /* Tap (minimal movement) → toggle collapsed ↔ expanded */
            if (totalDrag < 12) {
                var curSnap  = parseInt(panel.dataset.snap || SNAP_COLLAPSED, 10);
                var nextSnap = curSnap >= SNAP_MID ? SNAP_COLLAPSED : SNAP_EXPANDED;
                snapTo(panel, nextSnap, true);
                return;
            }

            /* Drag → velocity + proximity snap */
            var dt        = e.timeStamp - lastTouchTime;
            var velocity  = dt > 0 ? (e.changedTouches[0].clientY - lastTouchY) / dt : 0;
            var snapIndex = nearestSnap(dragSnapYs, currentTranslateY(panel), velocity);
            snapTo(panel, snapIndex, true);
        }, { passive: true });

        /* Swipe-down on panel BODY (not handle) collapses one level */
        var bodySwipeStartY    = 0;
        var bodySwipeScrollTop = 0;
        var touchOnHandle      = false;

        panel.addEventListener('touchstart', function (e) {
            if (!isMobile()) return;
            touchOnHandle      = handle.contains(e.target);
            bodySwipeStartY    = e.touches[0].clientY;
            bodySwipeScrollTop = panel.scrollTop;
        }, { passive: true });

        panel.addEventListener('touchend', function (e) {
            if (!isMobile() || touchOnHandle) return;
            var dy = e.changedTouches[0].clientY - bodySwipeStartY;
            /* Only collapse if swiping down > 60 px AND at top of scroll */
            if (dy > 60 && bodySwipeScrollTop <= 2) {
                var curSnap = parseInt(panel.dataset.snap || SNAP_COLLAPSED, 10);
                if (curSnap > SNAP_COLLAPSED) snapTo(panel, curSnap - 1, true);
            }
        }, { passive: true });
    }

    /* ─── Mode switching with state memory ────────────────── */
    function patchSwitchMode() {
        if (typeof window.switchMode !== 'function') return;
        var _orig = window.switchMode;
        window.switchMode = function (mode) {
            if (isMobile()) {
                /* Save snap state of every panel before collapsing */
                SHEETS.forEach(function (s) {
                    var p = document.getElementById(s.panelId);
                    if (p) modeSnapMemory[s.mode] = parseInt(p.dataset.snap || SNAP_COLLAPSED, 10);
                });
                collapseAll(false); // instant — mode.js animates panels in
            }
            _orig(mode);
            /* Restore saved snap for the newly active panel */
            if (isMobile()) {
                var targetPanelId = null;
                SHEETS.forEach(function (s) { if (s.mode === mode) targetPanelId = s.panelId; });
                if (targetPanelId) {
                    /* Delay so modes.js has time to add .visible / remove .hidden */
                    setTimeout(function () {
                        var p       = document.getElementById(targetPanelId);
                        var savedSnap = modeSnapMemory[mode] !== undefined
                            ? modeSnapMemory[mode] : SNAP_COLLAPSED;
                        if (p) snapTo(p, savedSnap, true);
                    }, 60);
                }
            }
        };
    }

    /* ─── Info panel label tracks loaded model name ───────── */
    function syncInfoSheetLabel() {
        var title = document.getElementById('infoTitle');
        var label = document.getElementById('infoSheetLabel');
        if (!title || !label) return;
        var observer = new MutationObserver(function () {
            var text = title.textContent.trim();
            if (text && text !== 'Loading...') {
                label.textContent = '\u2139\ufe0f ' + text;
            }
        });
        observer.observe(title, { childList: true, characterData: true, subtree: true });
    }

    /* ─── Resize / orientation change ─────────────────────── */
    var _prevWidth = window.innerWidth;
    window.addEventListener('resize', function () {
        var w = window.innerWidth;
        if (Math.abs(w - _prevWidth) < 50) return; // trivial resize, ignore
        _prevWidth = w;

        if (!isMobile()) {
            /* Back to desktop: clear all inline overrides */
            SHEETS.forEach(function (s) {
                var p = document.getElementById(s.panelId);
                if (!p) return;
                p.style.transform  = '';
                p.style.transition = '';
                p.style.willChange = 'auto';
                p.classList.remove('sheet-expanded');
            });
            setBackdropAlpha(0);
            return;
        }
        /* Mobile orientation change: recalculate snap positions instantly */
        SHEETS.forEach(function (s) {
            var p    = document.getElementById(s.panelId);
            var snap = p ? parseInt(p.dataset.snap || SNAP_COLLAPSED, 10) : SNAP_COLLAPSED;
            if (p) snapTo(p, snap, false);
        });
    });

    /* ─── Public API ──────────────────────────────────────── */
    window.mobileCollapseSheets = function () { collapseAll(true); };

    /* ─── Init ────────────────────────────────────────────── */
    function init() {
        ensureBackdrop();
        SHEETS.forEach(function (s) { initSheet(s); });
        patchSwitchMode();
        syncInfoSheetLabel();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
