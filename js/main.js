// Main initialization
(function() {
    'use strict';

    function setupLetterClicks() {
        const noxGroup = document.getElementById('logo-text-nox');
        const verseGroup = document.getElementById('logo-text-verse');
        
        if (noxGroup) {
            noxGroup.style.cursor = 'pointer';
            noxGroup.addEventListener('click', (e) => {
                e.stopPropagation();
                LetterN.animate();
            });
        }
        
        if (verseGroup) {
            verseGroup.style.cursor = 'pointer';
            verseGroup.addEventListener('click', (e) => {
                e.stopPropagation();
                LetterX.animate();
            });
        }
    }

    function init() {
        if (typeof gsap === 'undefined') return;
        
        OrbitAnimation.init();
        setupLetterClicks();
        Instructions.init();
        Starfield.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

