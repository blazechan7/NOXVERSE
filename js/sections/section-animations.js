// Section entrance animations with GSAP
(function() {
    'use strict';

    function initSectionAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            return;
        }

        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                opacity: 0,
                y: 30,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });

        gsap.utils.toArray('.about-text').forEach((text, index) => {
            gsap.from(text, {
                opacity: 0,
                y: 20,
                duration: 0.8,
                delay: index * 0.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: text,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        gsap.utils.toArray('.constellation-node').forEach((node, index) => {
            gsap.from(node, {
                opacity: 0,
                scale: 0,
                duration: 0.8,
                delay: index * 0.2,
                ease: 'back.out(1.2)',
                scrollTrigger: {
                    trigger: '.constellation-container',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });


        gsap.from('.contact-text', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.contact-content',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        gsap.from('.contact-subtext', {
            opacity: 0,
            y: 15,
            duration: 0.8,
            delay: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.contact-content',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        gsap.from('.contact-form', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            delay: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.contact-content',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    }

    window.SectionAnimations = {
        init: initSectionAnimations
    };
})();

