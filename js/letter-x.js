// Letter X explosion animation
(function() {
    'use strict';

    function animateLetterX() {
        const verseGroup = document.getElementById('logo-text-verse');
        if (!verseGroup) return;
        
        const svg = verseGroup.closest('svg');
        const orbitContainer = document.getElementById('orbit-container');
        if (!svg || !orbitContainer) return;
        
        const versePath = verseGroup.querySelector('path');
        if (!versePath) return;
        
        const center = Utils.getElementCenter(versePath, svg);
        const particleCount = 150;
        const colors = ['#ffffff', '#a8b8ff', '#c8d5f0', '#a8b8e8'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = Utils.createSVGElement('circle');
            const size = Utils.random(3, 9);
            const angle = Math.random() * Math.PI * 2;
            const distance = Utils.random(150, 400);
            const targetX = center.x + Math.cos(angle) * distance;
            const targetY = center.y + Math.sin(angle) * distance;
            
            particle.setAttribute('cx', center.x);
            particle.setAttribute('cy', center.y);
            particle.setAttribute('r', size);
            particle.setAttribute('fill', Utils.randomItem(colors));
            particle.setAttribute('opacity', '1');
            particle.setAttribute('filter', 'url(#stardustGlow)');
            particle.style.pointerEvents = 'none';
            
            orbitContainer.appendChild(particle);
            
            const duration = Utils.random(1.2, 2.0);
            const delay = Math.random() * 0.1;
            
            gsap.timeline({
                onComplete: () => particle.parentNode?.removeChild(particle)
            })
            .to(particle, {
                attr: { cx: targetX, cy: targetY, r: size * 0.5 },
                opacity: 0,
                duration: duration,
                ease: 'power2.out',
                delay: delay
            });
        }
        
        Utils.killAnimations(verseGroup);
        
        const tl = gsap.timeline();
        
        for (let i = 0; i < 4; i++) {
            tl.to(verseGroup, {
                x: (Math.random() - 0.5) * 6,
                y: (Math.random() - 0.5) * 3,
                duration: 0.04,
                ease: 'none'
            });
        }
        
        tl.set(verseGroup, { x: 0, y: 0, transformOrigin: 'center center', clearProps: 'transform' })
        .to(verseGroup, {
            scale: 2.5,
            opacity: 0,
            filter: 'blur(8px)',
            duration: 0.5,
            ease: 'power2.out'
        })
        .to(verseGroup, {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.4,
            ease: 'power2.in'
        }, '+=0.1');
    }

    window.LetterX = {
        animate: animateLetterX
    };

})();

