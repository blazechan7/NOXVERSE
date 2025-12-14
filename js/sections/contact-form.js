// Contact Form Handler with FormSubmit
(function() {
    'use strict';

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return false;
        }
        // Check for common fake/test emails
        const fakePatterns = ['test@', 'example@', 'fake@', '@test', '@example'];
        return !fakePatterns.some(pattern => email.toLowerCase().includes(pattern));
    }

    function initContactForm() {
        const form = document.getElementById('contact-form');
        const submitBtn = document.getElementById('contact-submit');
        const formMessage = document.getElementById('form-message');
        const emailInput = document.getElementById('contact-email-input');
        
        if (!form || !submitBtn || !formMessage || !emailInput) return;
        
        const submitText = submitBtn.querySelector('.submit-text');
        const submitLoader = submitBtn.querySelector('.submit-loader');
        
        if (!submitText || !submitLoader) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate email
            const email = emailInput?.value.trim();
            if (!email || !validateEmail(email)) {
                formMessage.textContent = 'Please enter a valid email address';
                formMessage.classList.add('show', 'error');
                setTimeout(() => {
                    formMessage.classList.remove('show');
                }, 3000);
                return;
            }
            
            // Disable submit button
            submitBtn.disabled = true;
            submitText.style.display = 'none';
            submitLoader.style.display = 'inline';
            formMessage.classList.remove('show', 'success', 'error');
            
            // Get form data
            const formData = new FormData(form);
            
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });
                
                // FormSubmit returns HTML on success
                if (response.ok) {
                    formMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                    formMessage.classList.add('show', 'success');
                    form.reset();
                    
                    setTimeout(() => {
                        submitText.style.display = 'inline';
                        submitLoader.style.display = 'none';
                        submitBtn.disabled = false;
                        formMessage.classList.remove('show');
                    }, 3000);
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                formMessage.textContent = 'Oops! Something went wrong. Please try again.';
                formMessage.classList.add('show', 'error');
                
                submitText.style.display = 'inline';
                submitLoader.style.display = 'none';
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    formMessage.classList.remove('show');
                }, 5000);
            }
        });
    }

    window.ContactForm = {
        init: initContactForm
    };
})();
