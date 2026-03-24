/* ═══════════════════════════════════════════════════════════
   NALEVI — Nabukeera Leah Victoria · Portfolio Script
   Author: NALEVI · 2025
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────
   1. CUSTOM CURSOR  (pointer/desktop devices only)
───────────────────────────────────────────────────────── */
(function initCursor() {
  const isPointer = window.matchMedia('(hover: hover)').matches;
  if (!isPointer) return;

  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;

  let mx = 0, my = 0;   // mouse position
  let rx = 0, ry = 0;   // ring position (lagged)

  /* Track mouse */
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  /* Animate ring with lag */
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  /* Grow cursor on interactive elements */
  const interactiveSelectors = [
    'a', 'button', '.btn',
    '.role-card', '.testimonial-card', '.contact-item'
  ].join(', ');

  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '16px';
      cursor.style.height = '16px';
      ring.style.width    = '54px';
      ring.style.height   = '54px';
      ring.style.opacity  = '0.28';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '10px';
      cursor.style.height = '10px';
      ring.style.width    = '34px';
      ring.style.height   = '34px';
      ring.style.opacity  = '0.5';
    });
  });
})();


/* ─────────────────────────────────────────────────────────
   2. STICKY NAV — shrinks + frosted on scroll
───────────────────────────────────────────────────────── */
(function initNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 60;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load in case page is already scrolled
})();


/* ─────────────────────────────────────────────────────────
   3. MOBILE MENU DRAWER
───────────────────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger    = document.getElementById('hamburger');
  const mobileMenu   = document.getElementById('mobileMenu');
  const overlay      = document.getElementById('mobileOverlay');
  const closeBtn     = document.getElementById('menuClose');
  const mobileLinks  = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !mobileMenu || !overlay) return;

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  /* Close on any mobile link tap (navigation or CTA) */
  mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));

  /* Close on Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });
})();


/* ─────────────────────────────────────────────────────────
   4. SCROLL REVEAL
   Elements with class .reveal animate in when in viewport
───────────────────────────────────────────────────────── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        /* Stagger siblings slightly */
        entry.target.style.transitionDelay = (i * 0.07) + 's';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach((el) => observer.observe(el));
})();


/* ─────────────────────────────────────────────────────────
   5. SKILL BARS — animate when section enters viewport
───────────────────────────────────────────────────────── */
(function initSkillBars() {
  const grids = document.querySelectorAll('.skills-grid');
  if (!grids.length) return;

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.querySelectorAll('.skill-bar-fill').forEach((fill, i) => {
        const target = parseFloat(
          fill.style.getPropertyValue('--target') || '0.8'
        );
        setTimeout(() => {
          fill.style.transform = `scaleX(${target})`;
        }, i * 80);
      });

      barObserver.unobserve(entry.target);
    });
  }, { threshold: 0.28 });

  grids.forEach((grid) => barObserver.observe(grid));
})();


/* ─────────────────────────────────────────────────────────
   6. CONTACT FORM — validation + feedback
───────────────────────────────────────────────────────── */
(function initContactForm() {
  const form     = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    /* Basic HTML5 validation check */
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    /* Success state */
    feedback.classList.add('visible');
    form.reset();

    /* Auto-hide feedback after 5 s */
    setTimeout(() => {
      feedback.classList.remove('visible');
    }, 5000);
  });
})();


/* ─────────────────────────────────────────────────────────
   7. ICON FALLBACK
   If an icon image fails to load, swap in an emoji fallback
───────────────────────────────────────────────────────── */
(function initIconFallbacks() {
  const fallbackMap = {
    'writer.svg':    '✍️',
    'business.svg':  '🏢',
    'coach.svg':     '🎯',
    'fashion.svg':   '✨',
    'team.svg':      '🤝',
    'nonprofit.svg': '🌍',
    'mail.png':      '✉️',
    'telephone.png': '📞',
    'location.png':  '📍',
    'social.png':    '🔗',
  };

  document.querySelectorAll('.role-icon-wrap img, .contact-item-icon img').forEach((img) => {
    img.addEventListener('error', () => {
      const file = img.dataset.file || img.getAttribute('src') || '';
      const key  = Object.keys(fallbackMap).find((k) => file.includes(k));
      if (key) {
        /* Replace img with emoji span */
        const span = document.createElement('span');
        span.textContent = fallbackMap[key];
        span.style.fontSize = '1.3rem';
        img.replaceWith(span);
      }
    });
  });
})();
