/* ════════════════════════════════════════════════
   Lozartico SL v2 — main.js
   ════════════════════════════════════════════════ */

// ── NAV scroll ─────────────────────────────────
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
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }
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
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Gallery items stagger ──────────────────────
const galleryObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        galleryObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);
document.querySelectorAll('.gallery__item').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
  galleryObserver.observe(el);
  // Reuse visible class
  el.dataset.observed = 'true';
});
const galleryReveal = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      galleryReveal.unobserve(e.target);
    }
  }),
  { threshold: 0.08 }
);
document.querySelectorAll('.gallery__item').forEach(el => galleryReveal.observe(el));

// ── Smooth scroll for anchors ──────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Button ripple effect ───────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      width:${size}px; height:${size}px; left:${x}px; top:${y}px;
      background:rgba(255,255,255,0.18);
      transform:scale(0); animation:ripple 0.55s ease-out forwards;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// Add ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes ripple { to { transform: scale(1); opacity: 0; } }';
document.head.appendChild(rippleStyle);

// ── Hero counter animation ─────────────────────
function animateCount(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const isPlus = String(target).includes('+');
  const numTarget = parseFloat(String(target).replace('+', ''));
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * numTarget);
    el.textContent = (isPlus ? '+' : '') + current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const badgeNums = document.querySelectorAll('.hero__badge-num');
const badgeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const raw = el.textContent.trim();
      if (raw.includes('%')) animateCount(el, parseInt(raw), '%');
      else if (raw.includes('+')) animateCount(el, raw, '');
      badgeObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
badgeNums.forEach(el => badgeObserver.observe(el));

// Animate stat numbers in case study
const statNums = document.querySelectorAll('.stat__num');
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const raw = el.textContent.trim();
      if (/^\d+$/.test(raw)) animateCount(el, parseInt(raw));
      else if (raw.endsWith('%')) animateCount(el, parseInt(raw), '%');
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statObserver.observe(el));

// ── Service card magnetic hover ────────────────
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
    card.style.transform = `translateY(-5px) rotateX(${-y}deg) rotateY(${x}deg)`;
    card.style.transformStyle = 'preserve-3d';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transformStyle = '';
  });
});

// ── Hero parallax ──────────────────────────────
const heroBg = document.querySelector('.hero__bg');
const heroPhoto = document.querySelector('.hero__photo-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroBg) heroBg.style.transform = `translateY(${y * 0.2}px)`;
    if (heroPhoto) heroPhoto.style.transform = `translateY(${y * 0.12}px)`;
  }, { passive: true });
}

// ── Contact form ───────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
if (contactForm) {
  // Input focus animations
  contactForm.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('focus', () => {
      field.parentElement.classList.add('focused');
    });
    field.addEventListener('blur', () => {
      field.parentElement.classList.remove('focused');
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span style="display:inline-flex;gap:0.5rem;align-items:center">⏳ Enviando...</span>';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '✅ ¡Enviado correctamente!';
      if (formSuccess) formSuccess.classList.add('visible');
      contactForm.reset();
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        if (formSuccess) formSuccess.classList.remove('visible');
      }, 6000);
    }, 1400);
  });
}

// ── Nav active link ────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ── Floating WhatsApp button (optional) ───────
const wa = document.createElement('a');
wa.href = 'https://wa.me/34910345678?text=Hola%2C%20me%20gustar%C3%ADa%20solicitar%20un%20presupuesto';
wa.target = '_blank';
wa.rel = 'noopener';
wa.setAttribute('aria-label', 'WhatsApp Lozartico');
wa.innerHTML = `
  <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>`;
wa.style.cssText = `
  position: fixed; bottom: 1.75rem; right: 1.75rem; z-index: 200;
  width: 56px; height: 56px;
  background: #25D366; color: white;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(37,211,102,0.4);
  transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
  animation: waPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 2s both;
`;
document.head.insertAdjacentHTML('beforeend', `<style>
  @keyframes waPop { from { opacity:0; transform:scale(0) rotate(-180deg); } to { opacity:1; transform:scale(1) rotate(0); } }
</style>`);
wa.addEventListener('mouseenter', () => { wa.style.transform = 'scale(1.12)'; wa.style.boxShadow = '0 6px 28px rgba(37,211,102,0.5)'; });
wa.addEventListener('mouseleave', () => { wa.style.transform = ''; wa.style.boxShadow = '0 4px 20px rgba(37,211,102,0.4)'; });
document.body.appendChild(wa);
