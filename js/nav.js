/* Header behaviour: border on scroll, mobile menu, and highlighting the section in view. */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('siteNav');
  if (!header || !nav) return;

  /* Border appears once the page scrolls */
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
  }

  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      if (toggle) toggle.focus();
    }
  });

  window.matchMedia('(min-width: 861px)').addEventListener('change', function (event) {
    if (event.matches) setMenu(false);
  });

  /* Mark the link for the section in view */
  var links = [].slice.call(nav.querySelectorAll('a[href^="#"]'));
  var linkById = {};
  links.forEach(function (link) {
    linkById[link.getAttribute('href').slice(1)] = link;
  });

  var hero = document.querySelector('.hero');

  function setCurrent(id) {
    links.forEach(function (link) {
      if (link === linkById[id]) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          setCurrent(entry.target === hero ? '' : entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    Object.keys(linkById).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    if (hero) observer.observe(hero);
  }
})();
