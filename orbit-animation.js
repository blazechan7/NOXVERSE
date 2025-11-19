(function() {
    'use strict';

    const ORBIT_CONFIG = {
        centerX: 200,
        centerY: 25,
        radius: 420,
        starSize: 70,
        particleColor: '#ffffff',
        particleOpacity: 1,
        trailLength: 1500,
        trailStreaks: 5,
        trailWidth: 25,
        trailSpacing: 12,
        glitterParticleCount: 60,
        glitterParticleSize: 2,
        duration: 1.8,
        fadeOutDuration: 0.4,
        ease: 'sine.inOut',
        startAngle: 0,
        eclipseCenterX: 35,
        eclipseCenterY: 12
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
        if (!container) return null;

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'orbit-particle-group');

        // Create multiple parallel trail streaks
        const trails = [];
        for (let i = 0; i < ORBIT_CONFIG.trailStreaks; i++) {
            const trail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            trail.setAttribute('class', 'orbit-trail');
            trail.setAttribute('stroke', 'url(#shootingStarGradient)');
            trail.setAttribute('stroke-width', ORBIT_CONFIG.trailWidth);
            trail.setAttribute('stroke-linecap', 'butt');
            trail.setAttribute('stroke-linejoin', 'miter');
            trail.setAttribute('fill', 'none');
            
            const centerIndex = Math.floor(ORBIT_CONFIG.trailStreaks / 2);
            const distanceFromCenter = Math.abs(i - centerIndex);
            const opacity = 0.7 - (distanceFromCenter * 0.15);
            
            trail.setAttribute('opacity', opacity);
            trail.setAttribute('filter', 'url(#stardustGlow)');
            trail.setAttribute('d', 'M 0,0');
            trails.push(trail);
        }

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
        
        // Add all trails to group
        trails.forEach(trail => group.appendChild(trail));
        group.appendChild(glitterGroup);
        group.appendChild(starGroup);
        
        const startPos = getPositionOnCircle(ORBIT_CONFIG.startAngle);
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
                // Reset eclipse rotations when animation completes
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
                const pos = getPositionOnCircle(currentAngle);
                
                const radialAngle = currentAngle * Math.PI * 2;
                const tangentAngle = radialAngle + (Math.PI / 2);
                const rotationDegrees = ((tangentAngle + Math.PI) * 180) / Math.PI + 90;
                
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
            
            const eclipseLeft = document.getElementById('eclipse-left');
            const eclipseRight = document.getElementById('eclipse-right');
            const { eclipseCenterX, eclipseCenterY } = ORBIT_CONFIG;
            if (eclipseLeft) {
                eclipseLeft.setAttribute('transform', `rotate(0, ${eclipseCenterX}, ${eclipseCenterY})`);
            }
            if (eclipseRight) {
                eclipseRight.setAttribute('transform', `rotate(0, ${eclipseCenterX}, ${eclipseCenterY})`);
            }

            const particle = createParticle();
            if (particle) {
                currentAnimation = animateOrbit(particle);
            }
        });
    }

    function init() {
        if (typeof gsap === 'undefined') return;

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupStarClick);
        } else {
            setupStarClick();
        }
    }
    
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
    
    function animateLetterX() {
        const verseGroup = document.getElementById('logo-text-verse');
        if (!verseGroup) return;
        
        const cloneCount = 8;
        
        for (let i = 0; i < cloneCount; i++) {
            const clone = verseGroup.cloneNode(true);
            clone.removeAttribute('id');
            clone.style.pointerEvents = 'none';
            verseGroup.parentNode.appendChild(clone);
            
            const angle = (Math.PI * 2 * i) / cloneCount + (Math.random() - 0.5) * 0.3;
            const distance = 15 + Math.random() * 20;
            const targetX = Math.cos(angle) * distance;
            const targetY = Math.sin(angle) * distance;
            const hueShift = Math.random() * 60 - 30;
            
            gsap.timeline({
                onComplete: () => {
                    if (clone.parentNode) {
                        clone.parentNode.removeChild(clone);
                    }
                }
            })
            .set(clone, {
                opacity: 0.7,
                filter: `hue-rotate(${hueShift}deg)`
            })
            .to(clone, {
                x: targetX,
                y: targetY,
                rotation: (Math.random() - 0.5) * 180,
                opacity: 0,
                scale: 0.5 + Math.random() * 0.5,
                duration: 0.6 + Math.random() * 0.3,
                ease: 'power3.out',
                delay: i * 0.02
            });
        }
        
        const tl = gsap.timeline();
        
        for (let i = 0; i < 6; i++) {
            tl.to(verseGroup, {
                x: (Math.random() - 0.5) * 8,
                y: (Math.random() - 0.5) * 4,
                duration: 0.05,
                ease: 'none'
            });
        }
        
        tl.to(verseGroup, {
            opacity: 0.2,
            scale: 1.2,
            filter: 'blur(2px)',
            duration: 0.15,
            ease: 'power2.out'
        })
        .to(verseGroup, {
            opacity: 0,
            scale: 0.8,
            duration: 0.1
        })
        .to(verseGroup, {
            opacity: 0,
            duration: 0.3
        })
        .to(verseGroup, {
            opacity: 1,
            scale: 1.3,
            filter: 'blur(0px)',
            duration: 0.08,
            ease: 'power2.out'
        })
        .to(verseGroup, {
            x: -3,
            duration: 0.05
        })
        .to(verseGroup, {
            x: 3,
            duration: 0.05
        })
        .to(verseGroup, {
            x: -2,
            duration: 0.05
        })
        .to(verseGroup, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: 'elastic.out(1, 0.6)'
        });
    }
    
    function setupLetterClicks() {
        const noxGroup = document.getElementById('logo-text-nox');
        const verseGroup = document.getElementById('logo-text-verse');
        
        if (noxGroup) {
            noxGroup.style.cursor = 'pointer';
            noxGroup.addEventListener('click', (e) => {
                e.stopPropagation();
                animateLetterN();
            });
        }
        
        if (verseGroup) {
            verseGroup.style.cursor = 'pointer';
            verseGroup.addEventListener('click', (e) => {
                e.stopPropagation();
                animateLetterX();
            });
        }
    }

    function setupInstructions() {
        const panel = document.getElementById('instructions');
        const header = document.querySelector('.instructions-header');
        
        if (!panel || !header) return;
        
        const isFirstVisit = !localStorage.getItem('nox-visited');
        if (isFirstVisit) {
            panel.classList.add('first-visit');
            localStorage.setItem('nox-visited', 'true');
            
            setTimeout(() => {
                panel.classList.add('collapsed');
            }, 8000);
        } else {
            panel.classList.add('collapsed');
        }
        
        header.addEventListener('click', () => {
            panel.classList.toggle('collapsed');
        });
    }

    init();
    setupLetterClicks();
    setupInstructions();

})();
