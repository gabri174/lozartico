/* ════════════════════════════════════════════════
   Lozartico SL — main.js
   ════════════════════════════════════════════════ */

// ── NAV scroll effect ──────────────────────────
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Mobile menu ────────────────────────────────
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Scroll reveal ──────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── CTA tabs ───────────────────────────────────
document.querySelectorAll('.cta__tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.cta__tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ── Smooth scroll for anchor links ────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Contact form ───────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Enviando…';
    btn.disabled = true;

    // Simulate async submit (replace with real fetch/API call)
    setTimeout(() => {
      btn.textContent = '✅ Enviado';
      if (formSuccess) formSuccess.classList.add('visible');
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = 'Enviar Consulta';
        btn.disabled = false;
        if (formSuccess) formSuccess.classList.remove('visible');
      }, 5000);
    }, 1200);
  });
}

// ── Hero parallax (subtle) ─────────────────────
const heroBg = document.querySelector('.hero__bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.25}px)`;
  }, { passive: true });
}
