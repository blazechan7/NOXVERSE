(function() {
    'use strict';

    function createShootingStarAnimation(button, targetSection) {
        if (!button || !targetSection) return;
        
        const starTrail = button.querySelector('.star-trail');
        if (!starTrail) return;

        button.addEventListener('click', () => {
            if (typeof gsap === 'undefined') return;

            const buttonRect = button.getBoundingClientRect();
            const startX = buttonRect.left - 100;
            const buttonY = buttonRect.top + (buttonRect.height / 2);
            const endX = window.innerWidth + 200;

            starTrail.style.opacity = '0';
            starTrail.style.visibility = 'hidden';

            const shootingStar = document.createElement('div');
            shootingStar.className = 'star-trail';
            shootingStar.style.position = 'fixed';
            shootingStar.style.left = startX + 'px';
            shootingStar.style.top = buttonY + 'px';
            shootingStar.style.zIndex = '999999';
            shootingStar.style.pointerEvents = 'none';
            shootingStar.style.opacity = '1';
            shootingStar.style.visibility = 'visible';
            shootingStar.style.width = '60px';
            shootingStar.style.height = '2px';
            shootingStar.style.transform = 'translate(-50%, -50%)';
            document.body.appendChild(shootingStar);

            const tl = gsap.timeline({
                onComplete: () => {
                    shootingStar.remove();
                    setTimeout(() => {
                        starTrail.style.opacity = '';
                        starTrail.style.visibility = '';
                    }, 400);
                }
            });

            tl.to(shootingStar, {
                width: '400px',
                height: '3px',
                duration: 0.3,
                ease: 'power2.out'
            })
            .to(shootingStar, {
                left: endX + 'px',
                duration: 1.2,
                ease: 'power2.inOut'
            })
            .to(shootingStar, {
                opacity: 0,
                scale: 0.5,
                duration: 0.3
            }, '-=0.2')
            .call(() => {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, null, '-=0.2');

            gsap.to(button, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });
        });

        if (typeof gsap !== 'undefined') {
            setTimeout(() => {
                gsap.to(button, {
                    y: -5,
                    duration: 2,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true
                });
            }, 2000);
        }
    }

    function initShootingStarCTA() {
        const exploreButton = document.getElementById('explore-button');
        const aboutSection = document.getElementById('about');
        createShootingStarAnimation(exploreButton, aboutSection);

        const exploreProjectsButton = document.getElementById('explore-projects-button');
        const projectsSection = document.getElementById('projects');
        createShootingStarAnimation(exploreProjectsButton, projectsSection);
    }

    window.ShootingStarCTA = {
        init: initShootingStarCTA
    };
})();

