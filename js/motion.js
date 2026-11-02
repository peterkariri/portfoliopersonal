// Motion layer: scroll reveals, counters, typewriter, parallax and card tilt.
(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const root = document.documentElement;

    // ---------- Scroll progress bar + navbar state ----------
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.prepend(bar);
    const navbar = document.querySelector('.navbar');

    let ticking = false;
    const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        if (navbar) navbar.classList.toggle('is-scrolled', window.scrollY > 20);
        if (!reduceMotion) parallax();
        ticking = false;
    };
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });

    // ---------- CTA background parallax ----------
    const ctaImg = document.querySelector('.cta-bg img');
    function parallax() {
        if (!ctaImg) return;
        const r = ctaImg.parentElement.getBoundingClientRect();
        const progress = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        ctaImg.style.setProperty('--parallax', `${(progress * -40).toFixed(1)}px`);
    }

    // ---------- Count-up numbers ----------
    const counters = document.querySelectorAll('.stat-number');
    const runCounter = (el) => {
        const text = el.textContent.trim();
        const match = text.match(/^([\d,]+)(.*)$/);
        if (!match) return;
        const target = parseInt(match[1].replace(/,/g, ''), 10);
        const suffix = match[2];
        const useComma = match[1].includes(',');
        const duration = 1600;
        const start = performance.now();
        const format = (n) => (useComma ? n.toLocaleString('en-US') : String(n)) + suffix;
        const step = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = format(Math.round(target * eased));
            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    if (reduceMotion) { onScroll(); return; }

    // ---------- Scroll reveal ----------
    root.classList.add('motion');

    const groups = [
        { sel: '.section-header, .page-header > *, .github-container, .cta-inner > *, .cv-summary', variant: '' },
        { sel: '.service-card, .project-card-full, .stat-item, .timeline-item, .cv-section, .contact-card, .contact-calendar', variant: '', stagger: true },
        { sel: '.about:not(.about-light) .about-image-container, .about-light .about-content', variant: 'from-left' },
        { sel: '.about:not(.about-light) .about-content, .about-light .about-image-container', variant: 'from-right' },
        { sel: '.showcase-viewport', variant: 'zoom' },
    ];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            if (entry.target.matches('.stat-item')) {
                const n = entry.target.querySelector('.stat-number');
                if (n && !n.dataset.counted) { n.dataset.counted = '1'; runCounter(n); }
            }
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    groups.forEach(({ sel, variant, stagger }) => {
        document.querySelectorAll(sel).forEach((el) => {
            if (el.closest('.hero') || el.classList.contains('reveal')) return;
            el.classList.add('reveal');
            if (variant) el.classList.add(variant);
            if (stagger) {
                const siblings = [...el.parentElement.children].filter((c) => c.matches(sel));
                const i = siblings.indexOf(el);
                el.style.setProperty('--d', `${Math.min(i % 6, 5) * 0.09}s`);
            }
            observer.observe(el);
        });
    });

    // ---------- Typewriter in the hero ----------
    const rotator = document.querySelector('.rotator');
    if (rotator && rotator.dataset.words) {
        const words = rotator.dataset.words.split('|');
        let w = 0, i = words[0].length, deleting = true;
        const tick = () => {
            const word = words[w];
            if (deleting) {
                i--;
                rotator.textContent = word.slice(0, i);
                if (i === 0) { deleting = false; w = (w + 1) % words.length; }
                setTimeout(tick, 40);
            } else {
                const next = words[w];
                i++;
                rotator.textContent = next.slice(0, i);
                if (i === next.length) { deleting = true; setTimeout(tick, 2200); }
                else setTimeout(tick, 75);
            }
        };
        setTimeout(tick, 2600);
    }

    // ---------- Hero ring sized to the yellow circle ----------
    const ring = document.querySelector('.hero-ring');
    const circle = document.querySelector('.hero .yellow-circle-bg');
    const placeRing = () => {
        if (!ring || !circle) return;
        const box = ring.parentElement.getBoundingClientRect();
        const c = circle.getBoundingClientRect();
        const pad = 22;
        ring.style.width = `${c.width + pad * 2}px`;
        ring.style.height = `${c.height + pad * 2}px`;
        ring.style.left = `${c.left - box.left - pad}px`;
        ring.style.top = `${c.top - box.top - pad}px`;
    };
    placeRing();
    window.addEventListener('resize', placeRing);
    window.addEventListener('load', placeRing);

    // ---------- Mouse parallax in the hero ----------
    const hero = document.querySelector('.hero');
    if (hero && finePointer) {
        hero.addEventListener('pointermove', (e) => {
            const r = hero.getBoundingClientRect();
            hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
            hero.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
        });
        hero.addEventListener('pointerleave', () => {
            hero.style.setProperty('--mx', 0);
            hero.style.setProperty('--my', 0);
        });
    }

    // ---------- 3D tilt on project cards ----------
    if (finePointer) {
        document.querySelectorAll('.project-card-full').forEach((card) => {
            card.addEventListener('pointermove', (e) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width;
                const y = (e.clientY - r.top) / r.height;
                card.classList.add('is-tilting');
                card.style.transform = `perspective(900px) rotateX(${((0.5 - y) * 10).toFixed(2)}deg) rotateY(${((x - 0.5) * 12).toFixed(2)}deg) translateY(-8px)`;
                card.style.setProperty('--sx', `${(x * 100).toFixed(1)}%`);
                card.style.setProperty('--sy', `${(y * 100).toFixed(1)}%`);
            });
            card.addEventListener('pointerleave', () => {
                card.classList.remove('is-tilting');
                card.style.transform = '';
            });
        });
    }

    onScroll();
})();
