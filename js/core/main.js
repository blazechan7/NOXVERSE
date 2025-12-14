// Main initialization
(function() {
    'use strict';

    window.scrollTo(0, 0);
    
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    function setupLetterClicks() {
        const noxGroup = document.getElementById('logo-text-nox');
        const verseGroup = document.getElementById('logo-text-verse');
        
        if (noxGroup && typeof LetterN !== 'undefined') {
            noxGroup.style.cursor = 'pointer';
            noxGroup.addEventListener('click', (e) => {
                e.stopPropagation();
                LetterN.animate();
            });
        }
        
        if (verseGroup && typeof LetterX !== 'undefined') {
            verseGroup.style.cursor = 'pointer';
            verseGroup.addEventListener('click', (e) => {
                e.stopPropagation();
                LetterX.animate();
            });
        }
    }

    function init() {
        if (typeof gsap === 'undefined') return;
        
        gsap.registerPlugin(ScrollTrigger);
        
        if (typeof LogoEntrance !== 'undefined') {
            LogoEntrance.init();
        }
        
        if (typeof OrbitAnimation !== 'undefined') {
            OrbitAnimation.init();
        }
        
        setupLetterClicks();
        
        if (typeof Instructions !== 'undefined') {
            Instructions.init();
        }
        
        if (typeof Starfield !== 'undefined') {
            Starfield.init();
        }
        
        if (typeof SectionAnimations !== 'undefined') {
            SectionAnimations.init();
        }
        
        if (typeof ShootingStarCTA !== 'undefined') {
            ShootingStarCTA.init();
        }
        
        if (typeof InfoTool !== 'undefined') {
            InfoTool.init();
        }
        
        if (typeof Constellation !== 'undefined') {
            Constellation.init();
        }
        
        if (typeof StarfallSkills !== 'undefined') {
            StarfallSkills.init();
        }
        
        if (typeof ContactForm !== 'undefined') {
            ContactForm.init();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

