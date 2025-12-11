// Starfall Skills Animation
(function() {
    'use strict';

    function createStarPath(starSize) {
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
        
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const prevPoint = points[(i - 1 + points.length) % points.length];
            
            if (i === 0) {
                starPath += `M ${point.x} ${point.y}`;
            } else if (point.isInner) {
                const angleDiff = point.angle - prevPoint.angle;
                let normalizedDiff = angleDiff;
                if (normalizedDiff > Math.PI) normalizedDiff -= 2 * Math.PI;
                if (normalizedDiff < -Math.PI) normalizedDiff += 2 * Math.PI;
                
                const t1 = 0.3;
                const t2 = 0.7;
                const angle1 = prevPoint.angle + normalizedDiff * t1;
                const angle2 = prevPoint.angle + normalizedDiff * t2;
                
                const control1Radius = prevPoint.radius * 0.5;
                const control2Radius = point.radius * 0.95;
                const control1X = Math.cos(angle1) * control1Radius;
                const control1Y = Math.sin(angle1) * control1Radius;
                const control2X = Math.cos(angle2) * control2Radius;
                const control2Y = Math.sin(angle2) * control2Radius;
                
                starPath += ` C ${control1X} ${control1Y} ${control2X} ${control2Y} ${point.x} ${point.y}`;
            } else if (prevPoint.isInner) {
                const angleDiff = point.angle - prevPoint.angle;
                let normalizedDiff = angleDiff;
                if (normalizedDiff > Math.PI) normalizedDiff -= 2 * Math.PI;
                if (normalizedDiff < -Math.PI) normalizedDiff += 2 * Math.PI;
                
                const t1 = 0.15;
                const t2 = 0.5;
                const angle1 = prevPoint.angle + normalizedDiff * t1;
                const angle2 = prevPoint.angle + normalizedDiff * t2;
                
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
        
        return starPath;
    }

    function initStarfallSkills() {
        if (typeof gsap === 'undefined' || typeof Utils === 'undefined') return;

        const container = document.getElementById('starfall-skills');
        if (!container) return;

        const svg = container.querySelector('.starfall-svg');
        if (!svg) return;

        const infoContainer = container.querySelector('.skill-info-container');
        if (!infoContainer) return;

        const skills = [
            { 
                name: 'Visual Design', 
                description: 'Branding, identity, and visual communication',
                color: '#9b59b6',
                trailGradient: 'starfallTrailGradientPurple',
                legendClass: 'legend-purple'
            },
            { 
                name: 'Web Design', 
                description: 'Interactive experiences and responsive design',
                color: '#4a90e2',
                trailGradient: 'starfallTrailGradientBlue',
                legendClass: 'legend-blue'
            },
            { 
                name: 'Animation', 
                description: 'GSAP, motion design, and micro-interactions',
                color: '#f39c12',
                trailGradient: 'starfallTrailGradientGold',
                legendClass: 'legend-gold'
            },
            { 
                name: 'UI/UX', 
                description: 'User-centered design and prototyping',
                color: '#27ae60',
                trailGradient: 'starfallTrailGradientGreen',
                legendClass: 'legend-green'
            }
        ];

        const containerWidth = 1000;
        const containerHeight = 600;
        const starSize = 28;
        const trailLength = 60;
        const trailStreaks = 5;
        const trailWidth = 8;
        const trailSpacing = 4;

        skills.forEach((skill, index) => {
            const group = Utils.createSVGElement('g', { class: 'skill-star-group' });
            
            // Create trails with skill-specific color
            const trails = [];
            for (let i = 0; i < trailStreaks; i++) {
                const trail = Utils.createSVGElement('path', {
                    class: 'skill-star-trail',
                    stroke: `url(#${skill.trailGradient})`,
                    'stroke-width': trailWidth,
                    'stroke-linecap': 'butt',
                    'stroke-linejoin': 'miter',
                    fill: 'none',
                    d: 'M 0,0'
                });
                
                const centerIndex = Math.floor(trailStreaks / 2);
                const distanceFromCenter = Math.abs(i - centerIndex);
                const baseOpacity = 0.8 - (distanceFromCenter * 0.12);
                
                trail.setAttribute('opacity', baseOpacity);
                trail.setAttribute('filter', 'url(#starfallTrailGlow)');
                trails.push(trail);
                group.appendChild(trail);
            }
            
            // Create star with skill-specific color
            const starPath = Utils.createSVGElement('path', {
                class: 'skill-star-path',
                d: createStarPath(starSize),
                fill: skill.color,
                stroke: '#ffffff',
                'stroke-width': '1.5',
                'stroke-linejoin': 'round'
            });
            
            // Store skill data on group for reference
            group.setAttribute('data-skill-name', skill.name);
            
            group.appendChild(starPath);
            svg.appendChild(group);

            const startX = Math.random() * containerWidth;
            const startY = -30;
            const endY = containerHeight + 150; // Extend beyond to allow fade
            const drift = (Math.random() - 0.5) * 150;
            const duration = 4 + Math.random() * 2;
            const delay = index * 0.8;

            const positionHistory = [];
            const maxHistoryPoints = trailLength + 10; // Extra buffer

            gsap.set(group, {
                x: startX,
                y: startY,
                opacity: 1
            });
            gsap.set(starPath, { opacity: 1 });
            
            // Initialize trails with empty path
            trails.forEach(trail => {
                trail.setAttribute('d', 'M 0,0');
            });

            // Function to update trails
            const updateTrails = function() {
                const currentX = gsap.getProperty(group, 'x');
                const currentY = gsap.getProperty(group, 'y');
                
                // Skip if position is invalid
                if (isNaN(currentX) || isNaN(currentY)) {
                    return;
                }
                
                // Calculate fade-out opacity - fade out in last 200px before bottom
                const fadeStartY = containerHeight - 200;
                const fadeEndY = containerHeight - 50;
                let starOpacity = 1;
                if (currentY > fadeStartY) {
                    starOpacity = 1 - ((currentY - fadeStartY) / (fadeEndY - fadeStartY));
                    starOpacity = Math.max(0, Math.min(1, starOpacity));
                }
                
                gsap.set(starPath, { opacity: starOpacity });
                
                // Only start building trails once star has moved downward significantly
                // This prevents horizontal trails from appearing before the star falls
                const minVerticalMovement = 25;
                if (currentY < startY + minVerticalMovement) {
                    return;
                }
                
                // Add current position to history
                positionHistory.push({ x: currentX, y: currentY });
                
                // Keep history within bounds
                if (positionHistory.length > maxHistoryPoints) {
                    positionHistory.shift();
                }
                
                // Build trail path - need at least 2 points
                if (positionHistory.length >= 2) {
                    const startIdx = Math.max(0, positionHistory.length - trailLength);
                    let pathData = '';
                    
                    // Build path from history
                    for (let i = startIdx; i < positionHistory.length; i++) {
                        const point = positionHistory[i];
                        const offsetX = point.x - currentX;
                        const offsetY = point.y - currentY;
                        
                        if (i === startIdx) {
                            pathData = `M ${offsetX} ${offsetY}`;
                        } else {
                            pathData += ` L ${offsetX} ${offsetY}`;
                        }
                    }
                    
                    // Close path to current position
                    pathData += ` L 0 0`;
                    
                    // Apply to all trail streaks
                    const centerIndex = Math.floor(trailStreaks / 2);
                    trails.forEach((trail, trailIndex) => {
                        const offset = (trailIndex - centerIndex) * trailSpacing;
                        const offsetPath = pathData.replace(/(-?\d+\.?\d*)\s+(-?\d+\.?\d*)/g, (match, x, y) => {
                            const newX = parseFloat(x) + offset;
                            const newY = parseFloat(y);
                            return `${newX} ${newY}`;
                        });
                        trail.setAttribute('d', offsetPath);
                        
                        const baseOpacity = 0.8 - (Math.abs(trailIndex - centerIndex) * 0.12);
                        trail.setAttribute('opacity', baseOpacity * starOpacity);
                    });
                }
            };

            const animation = gsap.to(group, {
                y: endY,
                x: startX + drift,
                opacity: 1,
                duration: duration,
                delay: delay,
                ease: 'none',
                repeat: -1,
                onUpdate: function() {
                    updateTrails();
                },
                onRepeat: function() {
                    // Clear trails and history before reset
                    trails.forEach(trail => {
                        trail.setAttribute('d', 'M 0,0');
                    });
                    
                    positionHistory.length = 0;
                    
                    const newX = Math.random() * containerWidth;
                    const newStartY = -30;
                    gsap.set(group, {
                        x: newX,
                        y: newStartY,
                        opacity: 1
                    });
                    gsap.set(starPath, { opacity: 1 });
                }
            });

            const info = document.createElement('div');
            info.className = 'skill-info';
            info.innerHTML = `
                <h3 class="skill-name">${skill.name}</h3>
                <p class="skill-description">${skill.description}</p>
            `;
            infoContainer.appendChild(info);

            group.addEventListener('mouseenter', () => {
                animation.pause();
                gsap.to(group, {
                    scale: 1.3,
                    duration: 0.2
                });
                
                const rect = group.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                
                const starX = rect.left - containerRect.left + rect.width / 2;
                const starY = rect.top - containerRect.top;
                
                // Use estimated dimensions (min-width: 200px, max-width: 250px, typical height ~80px)
                const infoWidth = 220;
                const infoHeight = 80;
                
                let infoX = starX + 20;
                let infoY = starY;
                
                // Check if info box would overflow on the right
                if (infoX + infoWidth > containerRect.width - 10) {
                    infoX = starX - infoWidth - 20; // Position on left side
                }
                
                // Check if info box would overflow on the left
                if (infoX < 10) {
                    infoX = 10; // Keep it within bounds
                }
                
                // Check if info box would overflow on the bottom
                if (infoY + infoHeight / 2 > containerRect.height - 10) {
                    infoY = containerRect.height - infoHeight / 2 - 10;
                }
                
                // Check if info box would overflow on the top
                if (infoY - infoHeight / 2 < 10) {
                    infoY = infoHeight / 2 + 10;
                }
                
                info.style.left = infoX + 'px';
                info.style.top = infoY + 'px';
                info.classList.add('visible');
            });

            group.addEventListener('mouseleave', () => {
                info.classList.remove('visible');
                gsap.to(group, {
                    scale: 1,
                    duration: 0.2,
                    onComplete: () => {
                        animation.resume();
                    }
                });
            });
        });
    }

    window.StarfallSkills = {
        init: initStarfallSkills
    };
})();
