(function() {
    'use strict';

    function createCosmicParticle() {
        const aboutSection = document.getElementById('about');
        if (!aboutSection) return;

        const cosmicBg = aboutSection.querySelector('.cosmic-bg');
        if (!cosmicBg) return;

        const particle = document.createElement('div');
        particle.className = 'cosmic-particle';
        
        const size = Math.random() * 3 + 1;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(168, 184, 255, ${0.4 + Math.random() * 0.4});
            border-radius: 50%;
            left: ${startX}%;
            top: ${startY}%;
            box-shadow: 0 0 ${size * 3}px rgba(168, 184, 255, 0.8);
            pointer-events: none;
            opacity: 0;
        `;

        cosmicBg.appendChild(particle);

        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline({ repeat: -1, delay: delay });
            
            tl.to(particle, {
                opacity: 1,
                scale: 1.5,
                duration: duration / 3,
                ease: 'power2.out'
            })
            .to(particle, {
                opacity: 0.8,
                scale: 0.8,
                duration: duration / 3,
                ease: 'power2.inOut'
            })
            .to(particle, {
                opacity: 0,
                scale: 0.5,
                duration: duration / 3,
                ease: 'power2.in'
            });
        }
    }

    function initCosmicAbout() {
        const aboutSection = document.getElementById('about');
        if (!aboutSection) return;

        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createCosmicParticle();
            }, i * 300);
        }
    }

    window.CosmicAbout = {
        init: initCosmicAbout
    };
})();

