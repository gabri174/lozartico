/* Lozartico — SEO local navigation + official logo */
(function () {
  const LOGO_URL = 'https://i.postimg.cc/7b8n4rBh/logo-lozartico.png';
  const links = [
    ['Aire acondicionado Valencia', 'aire-acondicionado-valencia.html'],
    ['Aire acondicionado Gran Canaria', 'aire-acondicionado-gran-canaria.html'],
    ['Construcción y reformas Valencia', 'construccion-reformas-valencia.html'],
    ['Construcción y reformas Gran Canaria', 'construccion-reformas-gran-canaria.html']
  ];

  document.querySelectorAll('.nav__logo').forEach(function (logo) {
    if (logo.dataset.logoReady) return;
    logo.dataset.logoReady = 'true';
    logo.innerHTML = '<img src="' + LOGO_URL + '" alt="Lozartico SL - Construcción, reformas y aire acondicionado" class="nav__logo-image">';
  });

  document.querySelectorAll('.nav__links').forEach(function (nav) {
    if (nav.querySelector('.nav__local-services')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'nav__local-services';
    wrapper.innerHTML = '<a href="servicios-locales.html" class="nav__link">Servicios locales</a>' +
      '<div class="nav__local-dropdown" aria-label="Servicios por zona">' +
      links.map(function (item) { return '<a href="' + item[1] + '">' + item[0] + '</a>'; }).join('') +
      '</div>';
    nav.appendChild(wrapper);
  });

  document.querySelectorAll('.nav__mobile').forEach(function (menu) {
    if (menu.querySelector('.nav__local-mobile')) return;
    const block = document.createElement('div');
    block.className = 'nav__local-mobile';
    block.innerHTML = '<a href="servicios-locales.html" class="nav__mobile-link">Servicios locales</a>' +
      links.map(function (item) { return '<a href="' + item[1] + '" class="nav__mobile-link nav__mobile-link--sub">' + item[0] + '</a>'; }).join('');
    menu.appendChild(block);
  });

  document.querySelectorAll('.footer__col').forEach(function (col) {
    if (!/Servicios/.test(col.querySelector('h4')?.textContent || '') || col.querySelector('.seo-local-links')) return;
    const block = document.createElement('div');
    block.className = 'seo-local-links';
    block.innerHTML = '<a href="servicios-locales.html">Servicios por zona</a>' +
      links.map(function (item) { return '<a href="' + item[1] + '">' + item[0] + '</a>'; }).join('');
    col.appendChild(block);
  });
})();
