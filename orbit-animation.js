(function() {
    'use strict';

    const ORBIT_CONFIG = {
        // Logo center in viewBox coordinates
        centerX: 200,
        centerY: 25,
        
        // Orbit radius - distance from logo center to orbit path
        radius: 420,
        
        // Particle appearance
        starSize: 50,
        particleColor: '#ffffff',
        particleOpacity: 1,
        
        // Trail settings
        trailLength: 800,
        trailWidth: 40,
        
        // Glitter particles
        glitterParticleCount: 60,
        glitterParticleSize: 2,
        
        // Animation timing
        duration: 1.8,
        fadeOutDuration: 0.4,
        ease: 'sine.inOut',
        
        // Start position (0 = top, 0.25 = right, 0.5 = bottom, 0.75 = left)
        startAngle: 0                // Start at top (12 o'clock position)
    };

    function getPositionOnCircle(angle) {
        const { centerX, centerY, radius } = ORBIT_CONFIG;
        const radians = (angle * Math.PI * 2) + (ORBIT_CONFIG.startAngle * Math.PI * 2);
        return {
            x: centerX + Math.cos(radians) * radius,
            y: centerY + Math.sin(radians) * radius
        };
    }

    function createParticle() {
        const container = document.getElementById('orbit-container');
        if (!container) {
            console.warn('Orbit container not found');
            return null;
        }

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'orbit-particle-group');

        const trail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        trail.setAttribute('class', 'orbit-trail');
        trail.setAttribute('stroke', 'url(#shootingStarGradient)');
        trail.setAttribute('stroke-width', ORBIT_CONFIG.trailWidth);
        trail.setAttribute('stroke-linecap', 'butt');
        trail.setAttribute('stroke-linejoin', 'round');
        trail.setAttribute('fill', 'none');
        trail.setAttribute('opacity', 0.15);
        trail.setAttribute('filter', 'url(#stardustGlow)');
        trail.setAttribute('d', 'M 0,0');

        const particle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        particle.setAttribute('class', 'orbit-particle');
        
        const starSize = ORBIT_CONFIG.starSize;
        const outerRadius = starSize;
        const innerRadius = starSize * 0.3;
        const backStretch = 1.4;
        const frontShrink = 0.85;
        let starPath = '';
        
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4 - Math.PI / 2;
            let radius = i % 2 === 0 ? outerRadius : innerRadius;
            
            if (i === 0) radius = radius * backStretch;
            else if (i === 4) radius = radius * frontShrink;
            
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) starPath += `M ${x} ${y}`;
            else starPath += ` L ${x} ${y}`;
        }
        starPath += ' Z';
        
        particle.setAttribute('d', starPath);
        particle.setAttribute('fill', ORBIT_CONFIG.particleColor);
        particle.setAttribute('opacity', ORBIT_CONFIG.particleOpacity);
        particle.setAttribute('filter', 'url(#orbitGlow)');

        const starGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        starGroup.setAttribute('class', 'orbit-star-group');
        starGroup.appendChild(particle);
        
        const glitterGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        glitterGroup.setAttribute('class', 'orbit-glitter-group');
        
        group.appendChild(trail);
        group.appendChild(glitterGroup);
        group.appendChild(starGroup);
        
        const startPos = getPositionOnCircle(ORBIT_CONFIG.startAngle);
        group.setAttribute('transform', `translate(${startPos.x}, ${startPos.y})`);

        container.appendChild(group);
        
        group.particle = particle;
        group.trail = trail;
        group.starGroup = starGroup;
        group.glitterGroup = glitterGroup;
        group.positionHistory = [];
        
        return group;
    }

    function updateGlitterParticles(glitterGroup, positionHistory, currentPos, startIdx) {
        while (glitterGroup.firstChild) {
            glitterGroup.removeChild(glitterGroup.firstChild);
        }
        
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
                
                const glitter = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                const sizeVariation = 0.5 + Math.random() * 0.8;
                const actualSize = particleSize * sizeVariation;
                
                glitter.setAttribute('cx', offsetX);
                glitter.setAttribute('cy', offsetY);
                glitter.setAttribute('r', actualSize);
                glitter.setAttribute('fill', '#ffffff');
                
                const baseOpacity = 0.2 + (1 - t) * 0.4;
                const sparkleVariation = 0.15 * Math.sin(i * 2.5 + Math.random() * 2);
                const opacity = Math.min(0.8, Math.max(0.1, baseOpacity + sparkleVariation));
                glitter.setAttribute('opacity', opacity);
                glitter.setAttribute('filter', 'url(#smokeGlow)');
                
                glitterGroup.appendChild(glitter);
            }
        }
    }

    function animateOrbit(group) {
        if (!group || !gsap) {
            console.warn('GSAP not loaded or particle invalid');
            return;
        }

        const particle = group.particle;
        const trail = group.trail;
        const duration = ORBIT_CONFIG.duration;
        const fadeStart = duration - ORBIT_CONFIG.fadeOutDuration;

        const tl = gsap.timeline({
            onComplete: () => {
                if (group.parentNode) {
                    group.parentNode.removeChild(group);
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
                const pos = getPositionOnCircle(currentAngle);
                
                const radialAngle = currentAngle * Math.PI * 2;
                const tangentAngle = radialAngle + (Math.PI / 2);
                const rotationDegrees = ((tangentAngle + Math.PI) * 180) / Math.PI + 90;
                
                positionHistory.push({ x: pos.x, y: pos.y, angle: currentAngle });
                
                if (positionHistory.length > maxHistoryPoints) {
                    positionHistory.shift();
                }
                
                group.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
                group.starGroup.setAttribute('transform', `rotate(${rotationDegrees})`);
                
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
                    trail.setAttribute('d', pathData);
                    updateGlitterParticles(group.glitterGroup, positionHistory, pos, startIdx);
                } else if (positionHistory.length >= 2) {
                    const prevPoint = positionHistory[0];
                    const offsetX = prevPoint.x - pos.x;
                    const offsetY = prevPoint.y - pos.y;
                    trail.setAttribute('d', `M ${offsetX} ${offsetY} L 0 0`);
                }
            }
        });

        tl.to([particle, trail], {
            opacity: 0,
            duration: ORBIT_CONFIG.fadeOutDuration,
            ease: 'power2.in'
        }, fadeStart);

        return tl;
    }

    function setupStarClick() {
        const star = document.getElementById('logo-star');
        if (!star) {
            console.warn('Star element not found');
            return;
        }

        star.style.cursor = 'pointer';

        let currentAnimation = null;

        star.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (currentAnimation) {
                currentAnimation.kill();
                currentAnimation = null;
            }

            const container = document.getElementById('orbit-container');
            if (container) {
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
            }

            const particle = createParticle();
            if (particle) {
                currentAnimation = animateOrbit(particle);
            }
        });
    }

    function init() {
        if (typeof gsap === 'undefined') {
            console.error('GSAP library not loaded. Please include GSAP before this script.');
            return;
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupStarClick);
        } else {
            setupStarClick();
        }
    }

    init();

})();
