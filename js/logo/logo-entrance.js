// Logo entrance animation - Stellar Emergence
(function() {
    'use strict';

    function initEntrance() {
        if (typeof gsap === 'undefined') {
            return;
        }

        const logoStar = document.getElementById('logo-star');
        const logoRing = document.getElementById('logo-ring');
        const textNox = document.getElementById('logo-text-nox');
        const textVerse = document.getElementById('logo-text-verse');
        const textNoxverse = document.getElementById('logo-text-noxverse-bottom');

        if (!logoStar || !logoRing) {
            return;
        }

        logoStar.style.transition = 'none';

        const tl = gsap.timeline({ 
            delay: 0.3,
            defaults: { ease: 'power2.out' }
        });

        gsap.set(logoStar, {
            opacity: 0,
            scale: 0.2,
            transformOrigin: 'center center'
        });
        
        tl.to(logoStar, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.5)'
        });

        tl.from(logoRing, {
            opacity: 0,
            rotation: -180,
            scale: 0.7,
            duration: 1,
            ease: 'power2.out',
            transformOrigin: 'center center'
        }, '+=0.1');

        const topTextElements = [textNox, textVerse].filter(el => el !== null);
        if (topTextElements.length > 0) {
            tl.from(topTextElements, {
                opacity: 0,
                y: -30,
                duration: 0.9,
                ease: 'power3.out'
            }, '-=0.3');
        }

        if (textNoxverse) {
            tl.from(textNoxverse, {
                opacity: 0,
                y: 30,
                duration: 0.9,
                ease: 'power3.out'
            }, '+=0.1');
        }

        const exploreButton = document.getElementById('explore-button');
        if (exploreButton) {
            tl.from(exploreButton, {
                opacity: 0,
                y: 20,
                duration: 0.9,
                ease: 'power3.out'
            }, '+=0');
        }
    }

    window.LogoEntrance = {
        init: initEntrance
    };

})();

