// Utility functions
(function() {
    'use strict';

    window.Utils = {
        getPositionOnCircle(angle, centerX, centerY, radius) {
            const radians = angle * Math.PI * 2;
            return {
                x: centerX + Math.cos(radians) * radius,
                y: centerY + Math.sin(radians) * radius
            };
        },

        screenToSVG(screenX, screenY, svg) {
            const svgRect = svg.getBoundingClientRect();
            const svgViewBox = svg.viewBox.baseVal;
            
            const relativeX = (screenX - svgRect.left) / svgRect.width;
            const relativeY = (screenY - svgRect.top) / svgRect.height;
            
            return {
                x: svgViewBox.x + relativeX * svgViewBox.width,
                y: svgViewBox.y + relativeY * svgViewBox.height
            };
        },

        getElementCenter(element, svg) {
            const rect = element.getBoundingClientRect();
            const centerScreenX = rect.left + rect.width / 2;
            const centerScreenY = rect.top + rect.height / 2;
            return this.screenToSVG(centerScreenX, centerScreenY, svg);
        },

        createSVGElement(tag, attributes = {}) {
            const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
            return element;
        },

        random(min, max) {
            return min + Math.random() * (max - min);
        },

        randomItem(array) {
            return array[Math.floor(Math.random() * array.length)];
        },

        killAnimations(element) {
            if (typeof gsap !== 'undefined') {
                gsap.killTweensOf(element);
            }
        }
    };

})();

