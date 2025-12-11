// Interactive info tool with trail animation
(function() {
    'use strict';

    function initInfoTool() {
        const infoTrigger = document.querySelector('.info-trigger[data-info="modern-aesthetics"]');
        if (!infoTrigger || typeof gsap === 'undefined') return;

        let infoPanel = null;
        let trail = null;
        let isOpen = false;

        function createInfoPanel() {
            if (infoPanel) return;

            infoPanel = document.createElement('div');
            infoPanel.className = 'info-panel';
            infoPanel.innerHTML = `
                <div class="info-panel-header">
                    <span class="info-panel-title">Modern Aesthetics</span>
                    <button class="info-panel-close">&times;</button>
                </div>
                <div class="info-panel-content">
                    <p>Modern aesthetics is all about keeping the design clean and minimal, using simple shapes, balanced spacing, and smooth animation to make everything feel crisp and refined.</p>
                </div>
            `;
            document.body.appendChild(infoPanel);

            const closeBtn = infoPanel.querySelector('.info-panel-close');
            closeBtn.addEventListener('click', closeInfoPanel);

            document.addEventListener('click', (e) => {
                if (isOpen && !infoPanel.contains(e.target) && !infoTrigger.contains(e.target)) {
                    closeInfoPanel();
                }
            });
        }

        function createTrail(startX, startY, endX, endY) {
            if (trail) trail.remove();

            trail = document.createElement('div');
            trail.className = 'info-trail';
            trail.style.position = 'fixed';
            trail.style.left = startX + 'px';
            trail.style.top = startY + 'px';
            trail.style.width = '2px';
            trail.style.height = '2px';
            trail.style.zIndex = '9998';
            trail.style.pointerEvents = 'none';
            trail.style.opacity = '0';
            document.body.appendChild(trail);

            const dx = endX - startX;
            const dy = endY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            gsap.set(trail, {
                rotation: angle,
                transformOrigin: 'left center'
            });

            const tl = gsap.timeline();
            tl.to(trail, {
                opacity: 1,
                width: distance + 'px',
                duration: 0.6,
                ease: 'power2.out'
            });
        }

        function openInfoPanel() {
            if (isOpen) return;
            isOpen = true;

            createInfoPanel();

            const triggerRect = infoTrigger.getBoundingClientRect();
            const panelRect = infoPanel.getBoundingClientRect();
            const panelX = window.innerWidth - panelRect.width - 40;
            const panelY = 100;
            
            infoPanel.style.left = panelX + 'px';
            infoPanel.style.top = panelY + 'px';
            infoPanel.style.opacity = '0';
            infoPanel.style.transform = 'translateY(-20px)';

            const startX = triggerRect.right;
            const startY = triggerRect.top + (triggerRect.height / 2);
            const endX = panelX + 20;
            const endY = panelY + 20;

            createTrail(startX, startY, endX, endY);

            gsap.to(infoPanel, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: 0.3,
                ease: 'power2.out'
            });
        }

        function closeInfoPanel() {
            if (!isOpen || !infoPanel) return;
            isOpen = false;

            gsap.to(infoPanel, {
                opacity: 0,
                y: -20,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    if (infoPanel) {
                        infoPanel.remove();
                        infoPanel = null;
                    }
                }
            });

            if (trail) {
                gsap.to(trail, {
                    opacity: 0,
                    width: '2px',
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => {
                        if (trail) {
                            trail.remove();
                            trail = null;
                        }
                    }
                });
            }
        }

        infoTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isOpen) {
                closeInfoPanel();
            } else {
                openInfoPanel();
            }
        });
    }

    window.InfoTool = {
        init: initInfoTool
    };
})();

