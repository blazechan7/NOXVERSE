(function() {
    'use strict';

    function createStarfield() {
        const starfield = document.getElementById('starfield');
        if (!starfield || typeof gsap === 'undefined') return;
        
        const starCount = 200;
        const twinklingCount = 30;
        
        for (let i = 0; i < starCount - twinklingCount; i++) {
            const star = document.createElement('div');
            star.className = 'star small';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            
            const size = Math.random();
            if (size > 0.7) {
                star.className = 'star medium';
            } else if (size <= 0.4) {
                star.style.opacity = 0.3 + Math.random() * 0.3;
            }
            
            starfield.appendChild(star);
        }
        
        for (let i = 0; i < twinklingCount; i++) {
            const star = document.createElement('div');
            const starType = Math.random();
            star.className = starType > 0.6 ? 'star large' : starType > 0.3 ? 'star medium' : 'star small';
            
            const colorType = Math.random();
            if (colorType > 0.7) star.classList.add('blue');
            else if (colorType > 0.4) star.classList.add('lavender');
            
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            starfield.appendChild(star);
            
            const baseOpacity = 0.4 + Math.random() * 0.6;
            const twinkleDuration = 2 + Math.random() * 3;
            
            gsap.to(star, {
                opacity: baseOpacity + 0.4,
                scale: 1.2,
                duration: twinkleDuration / 2,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: Math.random() * 2
            });
        }
    }
    
    function initStarfield() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createStarfield);
        } else {
            createStarfield();
        }
    }

    window.Starfield = {
        init: initStarfield
    };

})();

