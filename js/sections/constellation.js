(function() {
    'use strict';

    function initConstellation() {
        const container = document.querySelector('.constellation-container');
        const nodes = document.querySelectorAll('.constellation-node');
        
        if (!container || nodes.length === 0) return;

        const nodePositions = [
            { x: 20, y: 30 },
            { x: 50, y: 60 },
            { x: 80, y: 25 }
        ];

        nodes.forEach((node, index) => {
            if (nodePositions[index]) {
                node.style.left = nodePositions[index].x + '%';
                node.style.top = nodePositions[index].y + '%';
            }
        });

        nodes.forEach((node) => {
            const nodeInfo = node.querySelector('.node-info');
            const star = node.querySelector('.node-star');
            const isNode2 = node.getAttribute('data-node') === '2';
            let isHovered = false;
            let hideTimeout = null;

            function showNodeInfo() {
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                    hideTimeout = null;
                }
                
                if (isHovered) return;
                isHovered = true;

                if (nodeInfo && typeof gsap !== 'undefined') {
                    gsap.killTweensOf(nodeInfo);
                    gsap.to(nodeInfo, {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                }

                if (star && typeof gsap !== 'undefined') {
                    gsap.killTweensOf(star);
                    gsap.to(star, {
                        scale: 1.5,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            }

            function hideNodeInfo() {
                if (!isHovered) return;
                
                hideTimeout = setTimeout(() => {
                    isHovered = false;

                    if (nodeInfo && typeof gsap !== 'undefined') {
                        gsap.killTweensOf(nodeInfo);
                        gsap.to(nodeInfo, {
                            opacity: 0,
                            y: isNode2 ? 10 : -10,
                            duration: 0.3,
                            ease: 'power2.in'
                        });
                    }

                    if (star && typeof gsap !== 'undefined') {
                        gsap.killTweensOf(star);
                        gsap.to(star, {
                            scale: 1,
                            duration: 0.3,
                            ease: 'power2.in'
                        });
                    }
                    
                    hideTimeout = null;
                }, 100);
            }

            node.addEventListener('mouseenter', showNodeInfo);
            node.addEventListener('mouseleave', hideNodeInfo);

            if (nodeInfo) {
                nodeInfo.addEventListener('mouseenter', showNodeInfo);
                nodeInfo.addEventListener('mouseleave', hideNodeInfo);
            }
        });
    }

    window.Constellation = {
        init: initConstellation
    };
})();

