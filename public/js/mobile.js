/* ═══════════════════════════════════════════════════════
   Mobile Bottom Sheet Controller
   Activates only on viewports ≤ 768px.
   Desktop layout is completely unaffected.
   ═══════════════════════════════════════════════════════ */
(function () {
    'use strict';

    var BREAKPOINT = 768;

    function isMobile() {
        return window.innerWidth <= BREAKPOINT;
    }

    var SHEETS = [
        { panelId: 'guidedPanel', handleId: 'guidedSheetHandle' },
        { panelId: 'quizPanel',   handleId: 'quizSheetHandle'   },
        { panelId: 'infoPanel',   handleId: 'infoSheetHandle'   }
    ];

    /* Collapse all sheets (remove sheet-expanded class) */
    function collapseAll() {
        SHEETS.forEach(function (s) {
            var p = document.getElementById(s.panelId);
            if (p) p.classList.remove('sheet-expanded');
        });
    }

    /* Toggle one sheet */
    function toggleSheet(panel) {
        panel.classList.toggle('sheet-expanded');
    }

    /* Wire up a single bottom sheet */
    function initSheet(panelId, handleId) {
        var panel  = document.getElementById(panelId);
        var handle = document.getElementById(handleId);
        if (!panel || !handle) return;

        /* Tap handle → expand / collapse */
        handle.addEventListener('click', function (e) {
            if (!isMobile()) return;
            e.stopPropagation();
            toggleSheet(panel);
        });

        /* Swipe down on panel → collapse */
        var touchStartY = 0;
        var touchStartX = 0;
        var touchStartScrollTop = 0;

        panel.addEventListener('touchstart', function (e) {
            if (!isMobile()) return;
            touchStartY         = e.touches[0].clientY;
            touchStartX         = e.touches[0].clientX;
            touchStartScrollTop = panel.scrollTop;
        }, { passive: true });

        panel.addEventListener('touchend', function (e) {
            if (!isMobile()) return;
            var dy = e.changedTouches[0].clientY - touchStartY;
            var dx = Math.abs(e.changedTouches[0].clientX - touchStartX);
            /* Only collapse if: swiping down (dy > 0), mostly vertical (dy > dx),
               fast enough (>50 px), and already scrolled to top of panel content */
            if (dy > 50 && dy > dx && touchStartScrollTop <= 2) {
                panel.classList.remove('sheet-expanded');
            }
        }, { passive: true });
    }

    /* When a new mode is activated, reset sheet-expanded so panel opens fresh (collapsed) */
    function patchSwitchMode() {
        if (typeof switchMode !== 'function') return;
        var _orig = switchMode;
        window.switchMode = function (mode) {
            if (isMobile()) collapseAll();
            _orig(mode);
        };
    }

    /* When a new model loads, update the info panel sheet label */
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

    /* Also collapse sheets whenever a new model load starts */
    window.mobileCollapseSheets = collapseAll;

    function init() {
        SHEETS.forEach(function (s) {
            initSheet(s.panelId, s.handleId);
        });
        patchSwitchMode();
        syncInfoSheetLabel();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
