/* Small UI helpers: toast messages, copy-to-clipboard buttons and the footer year.
   Loaded first, so other scripts can call window.portfolio.toast(). */
(function () {
  'use strict';

  var toastEl = document.getElementById('toast');
  var toastTimer;

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 2400);
  }

  window.portfolio = window.portfolio || {};
  window.portfolio.toast = toast;

  /* Copy buttons: <button data-copy="text to copy" data-copied="Message shown after copying"> */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var field = document.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();

      try {
        document.execCommand('copy') ? resolve() : reject(new Error('copy command failed'));
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(field);
      }
    });
  }

  [].forEach.call(document.querySelectorAll('[data-copy]'), function (button) {
    button.addEventListener('click', function () {
      copyText(button.getAttribute('data-copy')).then(
        function () {
          toast(button.getAttribute('data-copied') || 'Copied');
        },
        function () {
          toast('Copy failed. Select the text and copy it instead.');
        }
      );
    });
  });

  /* Footer year */
  [].forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
