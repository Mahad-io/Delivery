/* Delivery Hub - progressive enhancement only.
 *
 * Everything on this site works without this file. What is here adds
 * convenience: focusing the error summary, giving instant feedback on quiz
 * answers, and turning the "save for later" form into a background request so
 * the page does not jump. If any of it fails, the underlying HTML still works.
 */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  /* --- Move focus to the error summary, as the Design System does --------- */
  var summary = document.querySelector('[data-error-summary]');
  if (summary) summary.focus();

  /* --- Quiz feedback ----------------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-quiz]'), function (box) {
    var feedback = box.querySelector('[data-quiz-feedback]');
    var details = box.querySelector('details');
    if (feedback) feedback.classList.add('js-only');
    box.addEventListener('change', function (e) {
      var input = e.target;
      if (!input || input.type !== 'radio' || !feedback) return;
      var correct = input.getAttribute('data-correct') === 'true';
      feedback.style.display = 'block';
      feedback.className = 'notice notice--' + (correct ? 'success' : 'warn');
      feedback.textContent = correct
        ? 'That is right.'
        : 'Not quite - open "show the answer" below for the reasoning.';
      if (!correct && details) details.open = true;
    });
  });

  /* --- Save for later, without a page reload ---------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-save-form]'), function (form) {
    form.addEventListener('submit', function (e) {
      var button = form.querySelector('button');
      if (!button || !window.fetch) return; // fall back to a normal submit
      e.preventDefault();
      button.disabled = true;

      fetch(form.action, {
        method: 'POST',
        headers: {
          'x-csrf-token': (form.querySelector('input[name="_csrf"]') || {}).value || '',
          'Accept': 'application/json'
        }
      })
        .then(function (r) { return r.json().then(function (body) { return { status: r.status, body: body }; }); })
        .then(function (res) {
          button.disabled = false;
          if (res.status === 401 && res.body.signupUrl) {
            // The signup prompt: explain why, then send them there.
            var note = document.querySelector('[data-signup-note]');
            if (note) {
              note.className = 'notice notice--warn';
              note.innerHTML = 'You need a free account to ' + res.body.reason +
                '. <a href="' + res.body.signupUrl + '">Create one now</a> - it takes about twenty seconds.';
              note.setAttribute('role', 'alert');
              note.scrollIntoView({ block: 'nearest' });
            } else {
              window.location.href = res.body.signupUrl;
            }
            return;
          }
          if (typeof res.body.saved === 'boolean') {
            button.textContent = res.body.saved ? 'Saved to your account' : 'Save for later';
            button.setAttribute('aria-pressed', String(res.body.saved));
          }
        })
        .catch(function () {
          button.disabled = false;
          form.submit(); // give up on the enhancement, do it the normal way
        });
    });
  });
})();
