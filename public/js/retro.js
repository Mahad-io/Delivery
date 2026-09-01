/* Retro board conveniences. The board works fully without this file - every
 * action is a real form post. This just saves a page reload when adding notes
 * during a live session, where a scroll jump is genuinely disruptive.
 */
(function () {
  'use strict';

  if (!window.fetch) return;

  Array.prototype.forEach.call(document.querySelectorAll('.board__col form'), function (form) {
    var textarea = form.querySelector('textarea[name="body"]');
    if (!textarea) return; // vote and delete forms: leave them as normal posts

    // Ctrl/Cmd + Enter submits, which is what people expect in a note field.
    textarea.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        form.requestSubmit ? form.requestSubmit() : form.submit();
      }
    });

    form.addEventListener('submit', function (e) {
      var body = textarea.value.trim();
      if (!body) { e.preventDefault(); textarea.focus(); return; }

      e.preventDefault();
      var csrf = (form.querySelector('input[name="_csrf"]') || {}).value || '';
      var columnId = (form.querySelector('input[name="column_id"]') || {}).value || '';

      fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-csrf-token': csrf,
          'Accept': 'application/json'
        },
        body: 'column_id=' + encodeURIComponent(columnId) + '&body=' + encodeURIComponent(body)
      })
        .then(function (r) {
          if (!r.ok) throw new Error('failed');
          // Render the note optimistically so the session keeps its rhythm.
          var note = document.createElement('article');
          note.className = 'note';
          var p = document.createElement('p');
          p.style.margin = '0';
          p.textContent = body;
          note.appendChild(p);
          var hint = document.createElement('p');
          hint.className = 'caption';
          hint.style.margin = '8px 0 0';
          hint.textContent = 'Added. Reload to vote on it.';
          note.appendChild(hint);
          form.parentNode.insertBefore(note, form);
          textarea.value = '';
          textarea.focus();
        })
        .catch(function () {
          form.submit(); // enhancement failed; do it the normal way
        });
    });
  });
})();
