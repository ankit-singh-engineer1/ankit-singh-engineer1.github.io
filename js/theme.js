/* Theme picker.
   - Themes are read from the tiles in the hero (input[name="theme-hero"]), so adding a
     theme needs no change here: add its tokens in css/tokens.css and its tile and chip in index.html.
   - The choice is remembered in localStorage. Without a saved choice the page follows the system.
   - Keyboard shortcuts match the Theme Studio extensions:
       Alt+Shift+.  next theme      Alt+Shift+,  previous theme      Alt+Shift+T  back to the system theme */
(function () {
  'use strict';

  var STORAGE_KEY = 'ankit-theme';
  var root = document.documentElement;
  var allRadios = [].slice.call(document.querySelectorAll('input[data-theme-radio]'));
  var heroRadios = allRadios.filter(function (radio) {
    return radio.name === 'theme-hero';
  });

  var themes = heroRadios.map(function (radio) {
    var label = radio.closest('label');
    var nameEl = label && label.querySelector('.tile-name');
    return { id: radio.value, name: nameEl ? nameEl.textContent.trim() : radio.value };
  });

  if (!themes.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  var fadeTimer;

  function indexOf(id) {
    for (var i = 0; i < themes.length; i++) {
      if (themes[i].id === id) return i;
    }
    return -1;
  }

  function systemTheme() {
    return darkQuery.matches ? 'ink' : 'paper';
  }

  function currentId() {
    var id = root.getAttribute('data-theme');
    return indexOf(id) === -1 ? systemTheme() : id;
  }

  function hasSavedChoice() {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      return false;
    }
  }

  function save(id) {
    try {
      if (id) localStorage.setItem(STORAGE_KEY, id);
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* Storage unavailable: the theme still applies for this visit. */
    }
  }

  function say(message) {
    if (window.portfolio && window.portfolio.toast) window.portfolio.toast(message);
  }

  function syncControls(id) {
    allRadios.forEach(function (radio) {
      radio.checked = radio.value === id;
    });

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim());
  }

  function apply(id, options) {
    options = options || {};

    if (!reduceMotion.matches) {
      root.classList.add('theme-fade');
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(function () {
        root.classList.remove('theme-fade');
      }, 450);
    }

    root.setAttribute('data-theme', id);
    syncControls(id);

    if (options.save !== false) save(id);
    if (options.announce) say(options.announce);
  }

  function step(direction) {
    var next = (indexOf(currentId()) + direction + themes.length) % themes.length;
    apply(themes[next].id, { announce: 'Theme: ' + themes[next].name });
  }

  function reset() {
    var id = systemTheme();
    save(null);
    apply(id, { save: false, announce: 'Theme: ' + themes[indexOf(id)].name + ' (system default)' });
  }

  /* Initial state. theme-init.js has already set data-theme before first paint. */
  if (indexOf(root.getAttribute('data-theme')) === -1) {
    save(null);
    root.setAttribute('data-theme', systemTheme());
  }
  syncControls(currentId());

  allRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (radio.checked) apply(radio.value);
    });
  });

  /* Follow the system while the visitor has not picked a theme */
  var onSystemChange = function () {
    if (!hasSavedChoice()) apply(systemTheme(), { save: false });
  };
  if (darkQuery.addEventListener) darkQuery.addEventListener('change', onSystemChange);
  else if (darkQuery.addListener) darkQuery.addListener(onSystemChange);

  /* Keyboard shortcuts */
  document.addEventListener('keydown', function (event) {
    if (!event.altKey || !event.shiftKey || event.ctrlKey || event.metaKey) return;

    if (event.code === 'Period') {
      event.preventDefault();
      step(1);
    } else if (event.code === 'Comma') {
      event.preventDefault();
      step(-1);
    } else if (event.code === 'KeyT') {
      event.preventDefault();
      reset();
    }
  });

  /* Header popover with the same choices */
  var toggle = document.getElementById('themeToggle');
  var menu = document.getElementById('themeMenu');

  if (toggle && menu) {
    var openMenu = function () {
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      var target = menu.querySelector('input:checked') || menu.querySelector('input');
      if (target) target.focus();
    };

    var closeMenu = function (returnFocus) {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) toggle.focus();
    };

    toggle.addEventListener('click', function () {
      if (menu.hidden) openMenu();
      else closeMenu(false);
    });

    document.addEventListener('click', function (event) {
      if (!menu.hidden && !menu.contains(event.target) && !toggle.contains(event.target)) closeMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !menu.hidden) {
        event.preventDefault();
        closeMenu(true);
      }
    });

    menu.addEventListener('focusout', function (event) {
      var next = event.relatedTarget;
      if (next && !menu.contains(next) && next !== toggle) closeMenu(false);
    });
  }
})();
