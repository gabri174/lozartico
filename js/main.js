/* ════════════════════════════════════════════════
   Lozartico SL — shared interactions + visual loader
   Versioned assets: 2026-08-11-SITE-WIDE-DESIGN
   ════════════════════════════════════════════════ */

const ASSET_VERSION = '20260811-site-wide-4';

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
    const img = document.createElement('img');
    img.src = `https://i.postimg.cc/7b8n4rBh/logo-lozartico.png?v=${ASSET_VERSION}`;
    img.alt = 'Lozartico SL'; img.width = 220; img.height = 42;
    img.loading = 'eager'; img.decoding = 'async';
    img.style.cssText = 'display:block;width:220px;height:42px;max-width:none;object-fit:contain;object-position:left center;';
    logo.innerHTML = '';
    logo.style.cssText += ';display:flex;align-items:center;width:220px;height:42px;flex:0 0 auto;';
    logo.appendChild(img);
  });
}
applyOfficialLogo();

// Ensure the terrace service is visible in the shared navigation/footer on every page.
function ensureTerraceLinks() {
  document.querySelectorAll('.nav__links, .nav__mobile').forEach(menu => {
    if (!menu.querySelector('a[href="terrazas.html"]')) {
      const a = document.createElement('a');
      a.href = 'terrazas.html'; a.textContent = 'Terrazas';
      a.className = menu.classList.contains('nav__mobile') ? 'nav__mobile-link' : 'nav__link';
      menu.appendChild(a);
    }
  });
  document.querySelectorAll('.footer__col').forEach(col => {
    const heading = col.querySelector('h4');
    if (heading && heading.textContent.trim().toLowerCase() === 'servicios' && !col.querySelector('a[href="terrazas.html"]')) {
      const a = document.createElement('a'); a.href = 'terrazas.html'; a.textContent = 'Impermeabilización de Terrazas'; col.appendChild(a);
    }
  });
}
ensureTerraceLinks();

const nav = document.getElementById('nav');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', open); burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open'); burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
  }));
  document.addEventListener('click', e => {
    if (nav && !nav.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open'); burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';
    }
  });
}

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const galleryItems = document.querySelectorAll('.gallery__item');
if (galleryItems.length) galleryItems.forEach((el, i) => {
  el.style.transitionDelay = `${i * 70}ms`; el.classList.add('reveal'); revealObserver.observe(el);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => anchor.addEventListener('click', e => {
  const selector = anchor.getAttribute('href'); if (!selector || selector === '#') return;
  const target = document.querySelector(selector);
  if (target) { e.preventDefault(); window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); }
}));

document.querySelectorAll('.btn').forEach(btn => btn.addEventListener('click', function(e) {
  const rect = btn.getBoundingClientRect(), size = Math.max(rect.width, rect.height) * 2;
  const ripple = document.createElement('span');
  ripple.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;background:rgba(255,255,255,.16);transform:scale(0);animation:lozRipple .55s ease-out forwards`;
  btn.style.position = 'relative'; btn.style.overflow = 'hidden'; btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}));
const rippleStyle = document.createElement('style'); rippleStyle.textContent = '@keyframes lozRipple{to{transform:scale(1);opacity:0}}'; document.head.appendChild(rippleStyle);

function animateCount(el, target, suffix = '') {
  let start = 0; const duration = 1400;
  const numTarget = parseFloat(String(target).replace('+', '')) || 0, isPlus = String(target).includes('+');
  const step = timestamp => { if (!start) start = timestamp; const progress = Math.min((timestamp-start)/duration,1); const eased = 1-Math.pow(1-progress,3); el.textContent=(isPlus?'+':'')+Math.floor(eased*numTarget)+suffix; if(progress<1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
const badgeObserver = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return; const raw=e.target.textContent.trim();
  if(raw.includes('%')) animateCount(e.target,parseInt(raw),'%'); else if(/^\+?\d+$/.test(raw)) animateCount(e.target,raw); badgeObserver.unobserve(e.target);
}), {threshold:.5});
document.querySelectorAll('.hero__badge-num').forEach(el=>badgeObserver.observe(el));
const statObserver = new IntersectionObserver(entries => entries.forEach(e => {
  if(!e.isIntersecting) return; const raw=e.target.textContent.trim();
  if(/^\+?\d+$/.test(raw)) animateCount(e.target,raw); else if(/^\d+%$/.test(raw)) animateCount(e.target,parseInt(raw),'%'); statObserver.unobserve(e.target);
}), {threshold:.5});
document.querySelectorAll('.stat__num').forEach(el=>statObserver.observe(el));

document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => { if(window.innerWidth<900)return; const r=card.getBoundingClientRect(); const x=((e.clientX-r.left)/r.width-.5)*2; const y=((e.clientY-r.top)/r.height-.5)*2; card.style.transform=`translateY(-5px) rotateX(${-y}deg) rotateY(${x}deg)`; });
  card.addEventListener('mouseleave',()=>{card.style.transform='';});
});

const contactForm=document.getElementById('contactForm'), formSuccess=document.getElementById('formSuccess');
if(contactForm){
  contactForm.querySelectorAll('input, textarea, select').forEach(field=>{field.addEventListener('focus',()=>field.parentElement.classList.add('focused'));field.addEventListener('blur',()=>field.parentElement.classList.remove('focused'));});
  contactForm.addEventListener('submit',e=>{e.preventDefault();const btn=contactForm.querySelector('button[type="submit"]');if(!btn)return;const originalText=btn.innerHTML;btn.innerHTML='⏳ Enviando...';btn.disabled=true;setTimeout(()=>{btn.innerHTML='✓ ¡Solicitud enviada!';if(formSuccess)formSuccess.classList.add('visible');contactForm.reset();setTimeout(()=>{btn.innerHTML=originalText;btn.disabled=false;if(formSuccess)formSuccess.classList.remove('visible');},5000);},900);});
}

const currentPage=window.location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.nav__link').forEach(link=>{const href=link.getAttribute('href');if(href===currentPage||(currentPage===''&&href==='index.html'))link.classList.add('active');});

const wa=document.createElement('a');wa.href='https://wa.me/34634332565?text=Hola%2C%20me%20gustar%C3%ADa%20solicitar%20un%20presupuesto';wa.target='_blank';wa.rel='noopener';wa.setAttribute('aria-label','WhatsApp Lozartico');wa.innerHTML='<svg viewBox="0 0 24 24" fill="currentColor" width="25" height="25"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471.15-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.198.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
wa.style.cssText='position:fixed;right:22px;bottom:22px;z-index:200;width:54px;height:54px;border-radius:50%;background:#25D366;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 28px rgba(37,211,102,.3);transition:transform .2s ease';wa.addEventListener('mouseenter',()=>wa.style.transform='scale(1.08)');wa.addEventListener('mouseleave',()=>wa.style.transform='');document.body.appendChild(wa);
