(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function closeMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  document.addEventListener('click', function (e) {
    if (nav && nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  var mapBox = document.querySelector('.map');
  if (mapBox) {
    mapBox.addEventListener('click', function () { mapBox.classList.add('is-active'); });
  }

  var header = document.querySelector('.header');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function headerH() { return header ? header.getBoundingClientRect().height : 69; }
  function syncHeader() { document.documentElement.style.setProperty('--hh', headerH() + 'px'); }
  syncHeader();
  window.addEventListener('resize', syncHeader);

  function targetY(el) { return el.getBoundingClientRect().top + window.scrollY - headerH(); }

  function goTo(el) {
    window.scrollTo({ top: targetY(el), behavior: reduceMotion ? 'auto' : 'smooth' });
    var tries = 0;
    (function settle() {
      var last = window.scrollY;
      setTimeout(function () {
        if (Math.abs(window.scrollY - last) >= 1 && tries++ < 30) { settle(); return; }
        var want = targetY(el);
        if (Math.abs(want - window.scrollY) > 1) window.scrollTo({ top: want, behavior: 'instant' });
      }, 120);
    })();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains('brand')) return;
    var id = a.getAttribute('href').slice(1);
    var el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    goTo(el);
  });

  var brand = document.querySelector('.brand');
  if (brand) {
    brand.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (nav) nav.classList.remove('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  var list = document.getElementById('svcList');
  var stage = document.getElementById('stage');
  if (list && stage) {
    var rows = Array.prototype.slice.call(list.children);
    var pics = Array.prototype.slice.call(stage.children);

    function show(i) {
      rows.forEach(function (r, n) { r.classList.toggle('is-on', n === i); });
      pics.forEach(function (p, n) { p.classList.toggle('is-on', n === i); });
    }

    rows.forEach(function (row, i) {
      row.addEventListener('mouseenter', function () { show(i); });
      row.addEventListener('focusin', function () { show(i); });
      row.addEventListener('click', function () { show(i); });
    });
  }

  var form = document.getElementById('quoteForm');
  document.querySelectorAll('.ask').forEach(function (a) {
    a.addEventListener('click', function () {
      if (form) form.servicio.value = a.dataset.service;
    });
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var lines = [
        'Hola, quiero cotizar un servicio en Encode.',
        'Nombre: ' + form.nombre.value.trim(),
        'Teléfono: ' + form.telefono.value.trim(),
        'Equipo: ' + form.equipo.value,
        'Servicio: ' + form.servicio.value
      ];
      var falla = form.falla.value.trim();
      if (falla) lines.push('Detalle: ' + falla);
      window.open('https://wa.me/526462678323?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  }

  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  if ('IntersectionObserver' in window && links.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) {
      var sec = document.querySelector(l.getAttribute('href'));
      if (sec) spy.observe(sec);
    });
  }

  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  window.scrollTo(0, 0);
  window.addEventListener('load', function () { window.scrollTo(0, 0); });

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
