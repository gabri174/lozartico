/* Lozartico SL — shared site interactions */
const ASSET_VERSION = '20260827-sitewide-3';

function loadStylesheet(path) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${path}?v=${ASSET_VERSION}`;
  document.head.appendChild(link);
}
loadStylesheet('/css/visual-fixes.css');
loadStylesheet('/css/redesign.css');
loadStylesheet('/css/site-wide.css');

function applyOfficialLogo() {
  document.querySelectorAll('.nav__logo').forEach(logo => {
    logo.replaceChildren();
    logo.style.cssText = 'display:flex;align-items:center;width:220px;height:48px;flex:0 0 auto;overflow:hidden;background:none!important;';
    const img = document.createElement('img');
    img.src = `https://i.postimg.cc/7b8n4rBh/logo-lozartico.png?v=${ASSET_VERSION}`;
    img.alt = 'Lozartico SL';
    img.width = 220; img.height = 42;
    img.loading = 'eager'; img.decoding = 'async';
    img.style.cssText = 'display:block;width:220px;height:42px;max-width:220px;object-fit:contain;object-position:center;';
    logo.appendChild(img);
  });
}

const terraceHref = 'impermeabilizacion-terrazas.html';
function ensureTerraceLinks() {
  document.querySelectorAll('.nav__links, .nav__mobile').forEach(menu => {
    const existing = menu.querySelector('a[href="terrazas.html"], a[href="impermeabilizacion-terrazas.html"]');
    if (existing) { existing.href = terraceHref; return; }
    const a = document.createElement('a');
    a.href = terraceHref;
    a.textContent = 'Terrazas';
    a.className = menu.classList.contains('nav__mobile') ? 'nav__mobile-link' : 'nav__link';
    menu.appendChild(a);
  });
  document.querySelectorAll('.footer__col').forEach(col => {
    const heading = col.querySelector('h4');
    if (!heading || heading.textContent.trim().toLowerCase() !== 'servicios') return;
    if (!col.querySelector(`a[href="${terraceHref}"]`)) {
      const a = document.createElement('a');
      a.href = terraceHref;
      a.textContent = 'Impermeabilización de Terrazas';
      col.appendChild(a);
    }
  });
}

function init() {
  applyOfficialLogo();
  ensureTerraceLinks();
  const nav = document.getElementById('nav');
  if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20), { passive: true });
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open'); burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
    }));
  }
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }
  document.querySelectorAll('a[href^="#"]').forEach(anchor => anchor.addEventListener('click', e => {
    const selector = anchor.getAttribute('href');
    if (!selector || selector === '#') return;
    const target = document.querySelector(selector);
    if (target) { e.preventDefault(); window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); }
  }));
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });
  if (!document.querySelector('.lozartico-whatsapp')) {
    const wa = document.createElement('a');
    wa.className = 'lozartico-whatsapp';
    wa.href = 'https://wa.me/34634332565?text=Hola%2C%20me%20gustar%C3%ADa%20solicitar%20un%20presupuesto';
    wa.target = '_blank'; wa.rel = 'noopener'; wa.setAttribute('aria-label', 'WhatsApp Lozartico');
    wa.textContent = 'WhatsApp';
    document.body.appendChild(wa);
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
