/* Lozartico SL — shared site runtime */
/* IMPORTANT: every HTML page loads this file. Keep site-wide behavior here. */
const ASSET_VERSION = '20260827-sitewide-5';

function loadStylesheet(path) {
  const href = `${path}?v=${ASSET_VERSION}`;
  if (document.querySelector(`link[data-lozartico-style="${path}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.dataset.lozarticoStyle = path;
  document.head.appendChild(link);
}

loadStylesheet('/css/visual-fixes.css');
loadStylesheet('/css/redesign.css');
loadStylesheet('/css/site-wide.css');

function applyOfficialLogo() {
  document.querySelectorAll('.nav__logo').forEach(logo => {
    logo.style.backgroundImage = 'none';
    logo.style.background = 'none';
    logo.replaceChildren();

    const img = document.createElement('img');
    img.src = `https://i.postimg.cc/7b8n4rBh/logo-lozartico.png?v=${ASSET_VERSION}`;
    img.alt = 'Lozartico SL';
    img.width = 220;
    img.height = 42;
    img.loading = 'eager';
    img.decoding = 'async';
    img.style.cssText = 'display:block;width:220px;height:42px;max-width:100%;object-fit:contain;object-position:left center;';
    logo.style.cssText += ';display:flex;align-items:center;width:220px;height:42px;flex:0 0 auto;overflow:hidden;background:none!important;';
    logo.appendChild(img);
  });

  document.querySelectorAll('.nav__logo-icon,.nav__logo-text').forEach(el => {
    el.style.display = 'none';
  });
}

const NAV_ITEMS = [
  ['Servicios', 'servicios-locales.html'],
  ['Terrazas', 'terrazas.html'],
  ['Proyectos', 'proyectos.html'],
  ['Contacto', 'contacto.html']
];

function ensureGlobalNavigation() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let desktop = nav.querySelector('.nav__links');
  if (!desktop) {
    desktop = document.createElement('nav');
    desktop.className = 'nav__links';
    nav.insertBefore(desktop, nav.querySelector('#burger') || null);
  }
  desktop.setAttribute('aria-label', 'Navegación principal');
  desktop.replaceChildren();

  NAV_ITEMS.forEach(([label, href]) => {
    const a = document.createElement('a');
    a.href = href;
    a.className = 'nav__link';
    a.textContent = label;
    desktop.appendChild(a);
  });

  let cta = nav.querySelector('.nav__cta');
  if (!cta) {
    cta = document.createElement('a');
    cta.className = 'btn btn--primary nav__cta';
    nav.insertBefore(cta, nav.querySelector('#burger') || null);
  }
  cta.href = 'contacto.html';
  cta.textContent = 'Presupuesto Gratis';

  let mobile = document.getElementById('mobileMenu');
  if (!mobile) {
    mobile = document.createElement('div');
    mobile.id = 'mobileMenu';
    mobile.className = 'nav__mobile';
    document.body.insertBefore(mobile, document.body.firstChild);
  }
  mobile.replaceChildren();
  NAV_ITEMS.forEach(([label, href]) => {
    const a = document.createElement('a');
    a.href = href;
    a.className = 'nav__mobile-link';
    a.textContent = label;
    mobile.appendChild(a);
  });
}

function markCurrentPage() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === current);
  });
}

function initMobileMenu() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const mobile = document.getElementById('mobileMenu');
  if (!burger || !mobile) return;

  const close = () => {
    mobile.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  burger.setAttribute('aria-expanded', 'false');
  burger.addEventListener('click', () => {
    const open = !mobile.classList.contains('open');
    mobile.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('click', e => {
    if (nav && !nav.contains(e.target) && !mobile.contains(e.target)) close();
  });
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => observer.observe(el));
}

function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const selector = anchor.getAttribute('href');
      if (!selector || selector === '#') return;
      const target = document.querySelector(selector);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    });
  });
}

function initScrollState() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initWhatsApp() {
  if (document.querySelector('.lozartico-whatsapp')) return;
  const wa = document.createElement('a');
  wa.className = 'lozartico-whatsapp';
  wa.href = 'https://wa.me/34634332565?text=Hola%2C%20me%20gustar%C3%ADa%20solicitar%20un%20presupuesto';
  wa.target = '_blank';
  wa.rel = 'noopener';
  wa.setAttribute('aria-label', 'WhatsApp Lozartico');
  wa.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="25" height="25" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471.15-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.198.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
  wa.style.cssText = 'position:fixed;right:22px;bottom:22px;z-index:200;width:54px;height:54px;border-radius:50%;background:#25D366;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 28px rgba(37,211,102,.3);transition:transform .2s ease';
  document.body.appendChild(wa);
}

function init() {
  applyOfficialLogo();
  ensureGlobalNavigation();
  markCurrentPage();
  initMobileMenu();
  initReveal();
  initAnchors();
  initScrollState();
  initWhatsApp();
  document.documentElement.dataset.lozarticoBuild = ASSET_VERSION;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
