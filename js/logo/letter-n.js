// Letter N animation
(function() {
    'use strict';

    function animateLetterN() {
        const noxGroup = document.getElementById('logo-text-nox');
        if (!noxGroup) return;
        
        const bbox = noxGroup.getBBox();
        const centerX = bbox.x + bbox.width / 2;
        const centerY = bbox.y + bbox.height / 2;
        
        gsap.timeline({ defaults: { transformOrigin: `${centerX}px ${centerY}px` } })
            .to(noxGroup, { skewY: 2, scaleY: 1.04, duration: 0.3, ease: 'sine.out' })
            .to(noxGroup, { skewY: -2, scaleY: 0.97, duration: 0.35, ease: 'sine.inOut' })
            .to(noxGroup, { skewY: 1, scaleY: 1.02, duration: 0.3, ease: 'sine.inOut' })
            .to(noxGroup, { skewY: 0, scaleY: 1, duration: 0.4, ease: 'sine.out' });
    }

    window.LetterN = {
        animate: animateLetterN
    };

})();

