// Main JavaScript for Portfolio Interactions

document.addEventListener('DOMContentLoaded', () => {
    console.log("Portfolio Initialized: Peter Njuguna");

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        const closeMenu = () => {
            navToggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
        };

        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!isOpen));
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });

        document.addEventListener('click', (e) => {
            if (!navToggle.getAttribute('aria-expanded') || navToggle.getAttribute('aria-expanded') === 'false') return;
            if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
        });
    }

    // Contact form: build a mailto link from the entered fields
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = contactForm.querySelector('#name').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const message = contactForm.querySelector('#message').value.trim();
            const status = contactForm.querySelector('.form-status');

            const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
            const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
            window.location.href = `mailto:peternjugunaw25@gmail.com?subject=${subject}&body=${body}`;

            if (status) {
                status.textContent = 'Opening your email client to send this message…';
            }
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll animations live in js/motion.js
});
