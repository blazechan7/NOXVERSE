// Instructions panel functionality
(function() {
    'use strict';

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

    window.Instructions = {
        init: setupInstructions
    };

})();

