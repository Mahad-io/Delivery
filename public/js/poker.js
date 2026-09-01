/* Planning poker cards. Entirely client-side - nothing is transmitted. */
(function () {
  'use strict';

  var form = document.querySelector('[data-poker]');
  if (!form) return;

  var deckEl = document.getElementById('poker-deck');
  var resultEl = document.getElementById('poker-result');
  var chosen = null;

  function render() {
    var checked = form.querySelector('input[name="deck"]:checked');
    if (!checked || !deckEl) return;
    var cards = (checked.getAttribute('data-cards') || '').split('|').filter(Boolean);
    chosen = null;
    deckEl.innerHTML = '';
    if (resultEl) resultEl.innerHTML = '';

    cards.forEach(function (card) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'poker-card' + (card.length > 3 ? ' poker-card--wide' : '');
      b.textContent = card;
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', 'Estimate ' + card);
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(deckEl.querySelectorAll('.poker-card'), function (other) {
          other.setAttribute('aria-pressed', 'false');
        });
        b.setAttribute('aria-pressed', 'true');
        chosen = card;
        if (resultEl) {
          resultEl.innerHTML = '<p class="mb-0">Card held: <strong>' + card +
            '</strong>. Do not say it out loud yet.</p>';
        }
      });
      deckEl.appendChild(b);
    });
  }

  form.addEventListener('change', function (e) {
    if (e.target && e.target.name === 'deck') render();
  });

  var reveal = document.querySelector('[data-poker-reveal]');
  if (reveal) {
    reveal.addEventListener('click', function () {
      if (!resultEl) return;
      resultEl.innerHTML = chosen
        ? '<div class="notice notice--success"><h3>Your estimate: ' + chosen + '</h3>' +
          '<p class="mb-0">Now ask the highest and the lowest to explain, in that order. ' +
          'The gap between them is where the useful information is. Re-estimate once; if you ' +
          'still disagree, the item is not understood well enough - split it.</p></div>'
        : '<div class="notice notice--warn"><p class="mb-0">Pick a card first.</p></div>';
    });
  }

  var reset = document.querySelector('[data-poker-reset]');
  if (reset) reset.addEventListener('click', render);

  render();
})();
