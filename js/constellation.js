// Constellation map for projects
(function() {
    'use strict';

    function initConstellation() {
        const container = document.querySelector('.constellation-container');
        const svg = document.getElementById('constellation-svg');
        const nodes = document.querySelectorAll('.constellation-node');
        
        if (!container || !svg || nodes.length === 0) return;

        // Set SVG size to match container
        function updateSVGSize() {
            const rect = container.getBoundingClientRect();
            svg.setAttribute('width', rect.width);
            svg.setAttribute('height', rect.height);
            svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
        }

        updateSVGSize();
        window.addEventListener('resize', updateSVGSize);

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

        const connections = [
            [0, 1],
            [1, 2],
            [0, 2]
        ];

        const lineGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        lineGroup.setAttribute('class', 'constellation-lines-group');
        svg.appendChild(lineGroup);

        function drawLines() {
            // Clear existing lines
            lineGroup.innerHTML = '';

            connections.forEach(([startIdx, endIdx]) => {
                const startNode = nodes[startIdx];
                const endNode = nodes[endIdx];
                
                if (!startNode || !endNode) return;

                const startNodeRect = startNode.getBoundingClientRect();
                const endNodeRect = endNode.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();

                const x1 = startNodeRect.left - containerRect.left + (startNodeRect.width / 2);
                const y1 = startNodeRect.top - containerRect.top + (startNodeRect.height / 2);
                const x2 = endNodeRect.left - containerRect.left + (endNodeRect.width / 2);
                const y2 = endNodeRect.top - containerRect.top + (endNodeRect.height / 2);

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x1);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
                line.setAttribute('class', 'constellation-line');
                line.setAttribute('data-line', `${startIdx}-${endIdx}`);
                line.setAttribute('stroke', 'rgba(168, 184, 255, 0.5)');
                line.setAttribute('stroke-width', '1.5');
                line.setAttribute('opacity', '0.6');
                
                lineGroup.appendChild(line);
            });
        }

        function drawLinesWhenReady() {
            requestAnimationFrame(() => {
                setTimeout(drawLines, 50);
            });
        }

        drawLinesWhenReady();
        window.addEventListener('resize', () => {
            updateSVGSize();
            drawLinesWhenReady();
        });

        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.addEventListener('refresh', drawLinesWhenReady);
        }

        nodes.forEach((node, nodeIndex) => {
            const nodeInfo = node.querySelector('.node-info');
            const star = node.querySelector('.node-star');
            let isHovered = false;

            function showNodeInfo() {
                if (isHovered) return;
                isHovered = true;

                connections.forEach(([startIdx, endIdx]) => {
                    if (startIdx === nodeIndex || endIdx === nodeIndex) {
                        const line = lineGroup.querySelector(`[data-line="${startIdx}-${endIdx}"], [data-line="${endIdx}-${startIdx}"]`);
                        if (line && typeof gsap !== 'undefined') {
                            gsap.to(line, {
                                attr: { 
                                    stroke: 'rgba(168, 184, 255, 1)',
                                    'stroke-width': '2.5'
                                },
                                opacity: 1,
                                duration: 0.3,
                                ease: 'power2.out'
                            });
                        }
                    }
                });

                if (nodeInfo && typeof gsap !== 'undefined') {
                    gsap.to(nodeInfo, {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                }

                if (star && typeof gsap !== 'undefined') {
                    gsap.to(star, {
                        scale: 1.5,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            }

            function hideNodeInfo() {
                if (!isHovered) return;
                isHovered = false;

                connections.forEach(([startIdx, endIdx]) => {
                    if (startIdx === nodeIndex || endIdx === nodeIndex) {
                        const line = lineGroup.querySelector(`[data-line="${startIdx}-${endIdx}"], [data-line="${endIdx}-${startIdx}"]`);
                        if (line && typeof gsap !== 'undefined') {
                            gsap.to(line, {
                                attr: { 
                                    stroke: 'rgba(168, 184, 255, 0.5)',
                                    'stroke-width': '1.5'
                                },
                                opacity: 0.6,
                                duration: 0.3,
                                ease: 'power2.in'
                            });
                        }
                    }
                });

                if (nodeInfo && typeof gsap !== 'undefined') {
                    gsap.to(nodeInfo, {
                        opacity: 0,
                        y: 10,
                        duration: 0.3,
                        ease: 'power2.in'
                    });
                }

                if (star && typeof gsap !== 'undefined') {
                    gsap.to(star, {
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.in'
                    });
                }
            }

            node.addEventListener('mouseenter', showNodeInfo);
            node.addEventListener('mouseleave', (e) => {
                if (!nodeInfo.contains(e.relatedTarget)) {
                    hideNodeInfo();
                }
            });

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

