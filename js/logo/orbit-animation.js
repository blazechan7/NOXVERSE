// Orbit animation when star is clicked
(function() {
    'use strict';

    function createParticle() {
        const container = document.getElementById('orbit-container');
        if (!container) return null;

        const group = Utils.createSVGElement('g', { class: 'orbit-particle-group' });

        const trails = [];
        for (let i = 0; i < ORBIT_CONFIG.trailStreaks; i++) {
            const trail = Utils.createSVGElement('path', {
                class: 'orbit-trail',
                stroke: 'url(#shootingStarGradient)',
                'stroke-width': ORBIT_CONFIG.trailWidth,
                'stroke-linecap': 'butt',
                'stroke-linejoin': 'miter',
                fill: 'none',
                d: 'M 0,0'
            });
            
            const centerIndex = Math.floor(ORBIT_CONFIG.trailStreaks / 2);
            const distanceFromCenter = Math.abs(i - centerIndex);
            const opacity = 0.7 - (distanceFromCenter * 0.15);
            
            trail.setAttribute('opacity', opacity);
            trail.setAttribute('filter', 'url(#stardustGlow)');
            trails.push(trail);
        }

        const particle = Utils.createSVGElement('path', {
            class: 'orbit-particle'
        });
        
        const starSize = ORBIT_CONFIG.starSize;
        const outerRadius = starSize;
        const innerRadius = starSize * 0.3;
        const backStretch = 1.4;
        const frontShrink = 0.85;
        const sideShrink = 0.7;
        let starPath = '';
        
        const points = [];
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4 - Math.PI / 2;
            let radius = i % 2 === 0 ? outerRadius : innerRadius;
            
            if (i === 0) radius = radius * backStretch;
            else if (i === 4) radius = radius * frontShrink;
            else if (i === 2 || i === 6) radius = radius * sideShrink;
            
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            points.push({ x, y, angle, radius, isInner: i % 2 === 1 });
        }
        
        // Build path with curves only for inner sides (segments connecting to inner points)
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const prevPoint = points[(i - 1 + points.length) % points.length];
            
            if (i === 0) {
                starPath += `M ${point.x} ${point.y}`;
            } else if (point.isInner) {
                // Curving INTO an inner point - create deeper curve from outer point
                const angleDiff = point.angle - prevPoint.angle;
                let normalizedDiff = angleDiff;
                if (normalizedDiff > Math.PI) normalizedDiff -= 2 * Math.PI;
                if (normalizedDiff < -Math.PI) normalizedDiff += 2 * Math.PI;
                
                // Control points create a deeper curve that pulls more toward center
                const t1 = 0.3;
                const t2 = 0.7;
                const angle1 = prevPoint.angle + normalizedDiff * t1;
                const angle2 = prevPoint.angle + normalizedDiff * t2;
                
                // Control points positioned to create deeper inward curve (pull more toward center)
                const control1Radius = prevPoint.radius * 0.5;
                const control2Radius = point.radius * 0.95;
                const control1X = Math.cos(angle1) * control1Radius;
                const control1Y = Math.sin(angle1) * control1Radius;
                const control2X = Math.cos(angle2) * control2Radius;
                const control2Y = Math.sin(angle2) * control2Radius;
                
                starPath += ` C ${control1X} ${control1Y} ${control2X} ${control2Y} ${point.x} ${point.y}`;
            } else if (prevPoint.isInner) {
                // Curving OUT OF an inner point - create deeper curve to outer point (sharper edge)
                const angleDiff = point.angle - prevPoint.angle;
                let normalizedDiff = angleDiff;
                if (normalizedDiff > Math.PI) normalizedDiff -= 2 * Math.PI;
                if (normalizedDiff < -Math.PI) normalizedDiff += 2 * Math.PI;
                
                // Control points create a deeper curve that approaches outer point more directly
                const t1 = 0.15;
                const t2 = 0.5;
                const angle1 = prevPoint.angle + normalizedDiff * t1;
                const angle2 = prevPoint.angle + normalizedDiff * t2;
                
                // Control points positioned to create deeper outward curve, approaching outer point sharply
                const control1Radius = prevPoint.radius * 0.95;
                const control2Radius = point.radius * 0.5;
                const control1X = Math.cos(angle1) * control1Radius;
                const control1Y = Math.sin(angle1) * control1Radius;
                const control2X = Math.cos(angle2) * control2Radius;
                const control2Y = Math.sin(angle2) * control2Radius;
                
                starPath += ` C ${control1X} ${control1Y} ${control2X} ${control2Y} ${point.x} ${point.y}`;
            } else {
                starPath += ` L ${point.x} ${point.y}`;
            }
        }
        starPath += ' Z';
        
        particle.setAttribute('d', starPath);
        particle.setAttribute('fill', ORBIT_CONFIG.particleColor);
        particle.setAttribute('opacity', ORBIT_CONFIG.particleOpacity);
        particle.setAttribute('filter', 'url(#orbitGlow)');

        const starGroup = Utils.createSVGElement('g', { class: 'orbit-star-group' });
        starGroup.appendChild(particle);
        
        const glitterGroup = Utils.createSVGElement('g', { class: 'orbit-glitter-group' });
        
        trails.forEach(trail => group.appendChild(trail));
        group.appendChild(glitterGroup);
        group.appendChild(starGroup);
        
        const startPos = Utils.getPositionOnCircle(ORBIT_CONFIG.startAngle, ORBIT_CONFIG.centerX, ORBIT_CONFIG.centerY, ORBIT_CONFIG.radius);
        group.setAttribute('transform', `translate(${startPos.x}, ${startPos.y})`);

        container.appendChild(group);
        
        group.particle = particle;
        group.trails = trails;
        group.starGroup = starGroup;
        group.glitterGroup = glitterGroup;
        group.positionHistory = [];
        
        return group;
    }

    function updateGlitterParticles(glitterGroup, positionHistory, currentPos, startIdx) {
        glitterGroup.innerHTML = '';
        if (positionHistory.length < 3) return;
        
        const particleCount = ORBIT_CONFIG.glitterParticleCount;
        const particleSize = ORBIT_CONFIG.glitterParticleSize;
        
        for (let i = 0; i < particleCount; i++) {
            const t = Math.random();
            const historyIndex = Math.floor(startIdx + (positionHistory.length - startIdx) * t);
            
            if (historyIndex >= 0 && historyIndex < positionHistory.length) {
                const point = positionHistory[historyIndex];
                const smokeSpread = 30;
                const randomX = (Math.random() - 0.5) * smokeSpread;
                const randomY = (Math.random() - 0.5) * smokeSpread;
                const flowOffset = 10;
                const flowX = (Math.random() - 0.5) * flowOffset * (1 - t);
                const flowY = (Math.random() - 0.5) * flowOffset * (1 - t);
                const driftAmount = 8;
                const driftX = (Math.random() - 0.5) * driftAmount;
                const driftY = (Math.random() - 0.5) * driftAmount;
                
                const offsetX = point.x - currentPos.x + randomX + flowX + driftX;
                const offsetY = point.y - currentPos.y + randomY + flowY + driftY;
                
                const glitter = Utils.createSVGElement('circle', {
                    cx: offsetX,
                    cy: offsetY,
                    r: particleSize * (0.5 + Math.random() * 0.8),
                    fill: '#ffffff',
                    opacity: Math.min(0.8, Math.max(0.1, 0.2 + (1 - t) * 0.4 + 0.15 * Math.sin(i * 2.5 + Math.random() * 2))),
                    filter: 'url(#smokeGlow)'
                });
                
                glitterGroup.appendChild(glitter);
            }
        }
    }

    function animateOrbit(group) {
        if (!group || !gsap) return;

        const particle = group.particle;
        const trails = group.trails;
        const duration = ORBIT_CONFIG.duration;
        const fadeStart = duration - ORBIT_CONFIG.fadeOutDuration;
        const eclipseLeft = document.getElementById('eclipse-left');
        const eclipseRight = document.getElementById('eclipse-right');
        const { eclipseCenterX, eclipseCenterY } = ORBIT_CONFIG;

        const tl = gsap.timeline({
            onComplete: () => {
                if (group.parentNode) {
                    group.parentNode.removeChild(group);
                }
                if (eclipseLeft) {
                    eclipseLeft.setAttribute('transform', `rotate(0, ${eclipseCenterX}, ${eclipseCenterY})`);
                }
                if (eclipseRight) {
                    eclipseRight.setAttribute('transform', `rotate(0, ${eclipseCenterX}, ${eclipseCenterY})`);
                }
            }
        });

        let progress = { value: 0 };
        const positionHistory = group.positionHistory;
        const maxHistoryPoints = 20;
        
        tl.to(progress, {
            value: 1,
            duration: duration,
            ease: ORBIT_CONFIG.ease,
            onUpdate: function() {
                const currentAngle = ORBIT_CONFIG.startAngle + progress.value;
                const pos = Utils.getPositionOnCircle(currentAngle, ORBIT_CONFIG.centerX, ORBIT_CONFIG.centerY, ORBIT_CONFIG.radius);
                
                const radialAngle = currentAngle * Math.PI * 2;
                const tangentAngle = radialAngle + (Math.PI / 2);
                const rotationDegrees = (tangentAngle * 180) / Math.PI + 270;
                
                positionHistory.push({ x: pos.x, y: pos.y });
                
                if (positionHistory.length > maxHistoryPoints) {
                    positionHistory.shift();
                }
                
                group.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
                group.starGroup.setAttribute('transform', `rotate(${rotationDegrees})`);
                
                const eclipseRotation = currentAngle * 360;
                if (eclipseLeft) {
                    eclipseLeft.setAttribute('transform', `rotate(${eclipseRotation}, ${eclipseCenterX}, ${eclipseCenterY})`);
                }
                if (eclipseRight) {
                    eclipseRight.setAttribute('transform', `rotate(${eclipseRotation}, ${eclipseCenterX}, ${eclipseCenterY})`);
                }
                
                if (positionHistory.length >= 3) {
                    let pathData = '';
                    const startIdx = Math.max(0, positionHistory.length - Math.floor(ORBIT_CONFIG.trailLength / 20));
                    const startPoint = positionHistory[startIdx];
                    const startOffsetX = startPoint.x - pos.x;
                    const startOffsetY = startPoint.y - pos.y;
                    
                    pathData = `M ${startOffsetX} ${startOffsetY}`;
                    
                    for (let i = startIdx + 1; i < positionHistory.length; i++) {
                        const point = positionHistory[i];
                        const offsetX = point.x - pos.x;
                        const offsetY = point.y - pos.y;
                        
                        if (i === startIdx + 1) {
                            pathData += ` L ${offsetX} ${offsetY}`;
                        } else {
                            const prevPoint = positionHistory[i - 1];
                            const prevOffsetX = prevPoint.x - pos.x;
                            const prevOffsetY = prevPoint.y - pos.y;
                            const controlX = (prevOffsetX + offsetX) / 2;
                            const controlY = (prevOffsetY + offsetY) / 2;
                            
                            pathData += ` Q ${prevOffsetX} ${prevOffsetY} ${controlX} ${controlY}`;
                            pathData += ` T ${offsetX} ${offsetY}`;
                        }
                    }
                    
                    pathData += ` L 0 0`;
                    
                    const centerIndex = Math.floor(ORBIT_CONFIG.trailStreaks / 2);
                    trails.forEach((trail, index) => {
                        const offset = (index - centerIndex) * ORBIT_CONFIG.trailSpacing;
                        const perpAngle = tangentAngle;
                        const offsetX = Math.cos(perpAngle) * offset;
                        const offsetY = Math.sin(perpAngle) * offset;
                        const offsetPath = pathData.replace(/(-?\d+\.?\d*)\s+(-?\d+\.?\d*)/g, (match, x, y) => {
                            return `${parseFloat(x) + offsetX} ${parseFloat(y) + offsetY}`;
                        });
                        
                        trail.setAttribute('d', offsetPath);
                    });
                    
                    updateGlitterParticles(group.glitterGroup, positionHistory, pos, startIdx);
                } else if (positionHistory.length >= 2) {
                    const prevPoint = positionHistory[0];
                    const offsetX = prevPoint.x - pos.x;
                    const offsetY = prevPoint.y - pos.y;
                    const simplePath = `M ${offsetX} ${offsetY} L 0 0`;
                    trails.forEach(trail => trail.setAttribute('d', simplePath));
                }
            }
        });

        tl.to([particle, ...trails], {
            opacity: 0,
            duration: ORBIT_CONFIG.fadeOutDuration,
            ease: 'power2.in'
        }, fadeStart);

        return tl;
    }

    function setupStarClick() {
        const star = document.getElementById('logo-star');
        if (!star) return;

        star.style.cursor = 'pointer';
        let currentAnimation = null;

        star.addEventListener('click', function(e) {
            e.stopPropagation();

            if (currentAnimation) {
                currentAnimation.kill();
                currentAnimation = null;
            }

            const container = document.getElementById('orbit-container');
            if (container) {
                container.innerHTML = '';
            }
            
            const eclipseLeft = document.getElementById('eclipse-left');
            const eclipseRight = document.getElementById('eclipse-right');
            const { eclipseCenterX, eclipseCenterY } = ORBIT_CONFIG;
            if (eclipseLeft) eclipseLeft.setAttribute('transform', `rotate(0, ${eclipseCenterX}, ${eclipseCenterY})`);
            if (eclipseRight) eclipseRight.setAttribute('transform', `rotate(0, ${eclipseCenterX}, ${eclipseCenterY})`);

            const particle = createParticle();
            if (particle) {
                currentAnimation = animateOrbit(particle);
            }
        });
    }

    window.OrbitAnimation = {
        init() {
            if (typeof gsap === 'undefined') return;
            // DOM is already ready when called from main.js
            setupStarClick();
        }
    };

})();

