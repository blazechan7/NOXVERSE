// Instructions Panel with Multiple Pages
(function() {
    'use strict';

    function setupInstructions() {
        const panel = document.getElementById('instructions');
        const header = document.querySelector('.instructions-header');
        const pageNavBtns = document.querySelectorAll('.page-nav-btn');
        const pages = document.querySelectorAll('.instruction-page');
        
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
        
        pageNavBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const targetPage = btn.getAttribute('data-page');
                
                pageNavBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                pages.forEach(page => {
                    if (page.getAttribute('data-page') === targetPage) {
                        page.classList.add('active');
                    } else {
                        page.classList.remove('active');
                    }
                });
            });
        });
    }

    window.Instructions = {
        init: setupInstructions
    };

})();
