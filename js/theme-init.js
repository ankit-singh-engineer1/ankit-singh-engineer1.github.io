/* Runs in <head>, before the page paints, so there is no flash of the wrong theme.
   Keep this file tiny and synchronous. The theme picker lives in js/theme.js. */
(function () {
  var theme = null;

  try {
    theme = localStorage.getItem('ankit-theme');
  } catch (e) {
    /* Storage can be blocked (private windows, strict settings). Fall through to the system theme. */
  }

  if (!theme || !/^[a-z0-9-]{1,24}$/.test(theme)) {
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? 'ink' : 'paper';
  }

  document.documentElement.setAttribute('data-theme', theme);
})();
