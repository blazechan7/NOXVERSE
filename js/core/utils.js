// Utility functions
(function() {
    'use strict';

    window.Utils = {
        // Convert angle to position on circle
        getPositionOnCircle(angle, centerX, centerY, radius) {
            const radians = angle * Math.PI * 2;
            return {
                x: centerX + Math.cos(radians) * radius,
                y: centerY + Math.sin(radians) * radius
            };
        },

        // Convert screen coordinates to SVG viewBox coordinates
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

        // Get center point of an element in SVG coordinates
        getElementCenter(element, svg) {
            const rect = element.getBoundingClientRect();
            const centerScreenX = rect.left + rect.width / 2;
            const centerScreenY = rect.top + rect.height / 2;
            return this.screenToSVG(centerScreenX, centerScreenY, svg);
        },

        // Create SVG element with attributes
        createSVGElement(tag, attributes = {}) {
            const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
            return element;
        },

        // Random number between min and max
        random(min, max) {
            return min + Math.random() * (max - min);
        },

        // Random item from array
        randomItem(array) {
            return array[Math.floor(Math.random() * array.length)];
        },

        // Kill all GSAP animations on element
        killAnimations(element) {
            if (typeof gsap !== 'undefined') {
                gsap.killTweensOf(element);
            }
        }
    };

})();

