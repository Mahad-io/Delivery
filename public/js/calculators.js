/* Forecasting and flow calculators.
 *
 * Everything here runs in the page. There is no fetch, no form submission and
 * no logging - delivery data is commercially sensitive and there is no reason
 * for it to reach a server. Check the network tab; you will see nothing.
 */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }
  function num(id) { return parseFloat((el(id) || {}).value); }
  function show(id, html) { var n = el(id); if (n) n.innerHTML = html; }

  function parseSeries(text) {
    return String(text || '')
      .split(/[\s,;]+/)
      .map(function (v) { return parseFloat(v); })
      .filter(function (v) { return isFinite(v) && v >= 0; });
  }

  function addWeeks(date, weeks) {
    var d = new Date(date.getTime());
    d.setDate(d.getDate() + Math.ceil(weeks) * 7);
    return d;
  }

  function fmtDate(d) {
    return d.toISOString().slice(0, 10);
  }

  function percentile(sorted, p) {
    if (!sorted.length) return NaN;
    var i = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
    return sorted[i];
  }

  /* ----------------------------- Monte Carlo ---------------------------- */

  var mcBtn = document.querySelector('[data-mc-run]');
  if (mcBtn) {
    mcBtn.addEventListener('click', function () {
      var history = parseSeries((el('mc-history') || {}).value);
      var remaining = num('mc-remaining');

      if (history.length < 5) {
        show('mc-result', '<div class="notice notice--warn"><p>Enter at least 5 weekly counts. Fewer than that and the simulation is just amplifying noise.</p></div>');
        return;
      }
      if (!isFinite(remaining) || remaining < 1) {
        show('mc-result', '<div class="notice notice--warn"><p>Enter how many items remain.</p></div>');
        return;
      }
      if (history.reduce(function (a, b) { return a + b; }, 0) === 0) {
        show('mc-result', '<div class="notice notice--warn"><p>Your history is all zeros, so no forecast is possible. Get one week of completed work first.</p></div>');
        return;
      }

      var runs = 10000;
      var results = new Array(runs);
      for (var r = 0; r < runs; r += 1) {
        var done = 0;
        var weeks = 0;
        while (done < remaining && weeks < 520) {
          done += history[Math.floor(Math.random() * history.length)];
          weeks += 1;
        }
        results[r] = weeks;
      }
      results.sort(function (a, b) { return a - b; });

      var p50 = percentile(results, 50);
      var p85 = percentile(results, 85);
      var p95 = percentile(results, 95);

      var startRaw = (el('mc-start') || {}).value;
      var start = startRaw && !isNaN(new Date(startRaw)) ? new Date(startRaw) : new Date();

      var mean = history.reduce(function (a, b) { return a + b; }, 0) / history.length;
      var naive = Math.ceil(remaining / mean);

      show('mc-result',
        '<h3>Forecast</h3>' +
        '<div class="table-scroll" tabindex="0" role="region" aria-label="Forecast percentiles"><table>' +
        '<thead><tr><th scope="col">Confidence</th><th scope="col">Weeks</th><th scope="col">Date</th><th scope="col">Use it for</th></tr></thead><tbody>' +
        '<tr><th scope="row">50%</th><td>' + p50 + '</td><td>' + fmtDate(addWeeks(start, p50)) + '</td><td>Conversation, internal planning</td></tr>' +
        '<tr><th scope="row">85%</th><td>' + p85 + '</td><td>' + fmtDate(addWeeks(start, p85)) + '</td><td>Commitments other people spend money against</td></tr>' +
        '<tr><th scope="row">95%</th><td>' + p95 + '</td><td>' + fmtDate(addWeeks(start, p95)) + '</td><td>Regulatory or contractual dates</td></tr>' +
        '</tbody></table></div>' +
        '<div class="inset inset--warn"><p style="margin:0">The naive answer &mdash; remaining divided by your average of ' +
        mean.toFixed(1) + ' &mdash; is <strong>' + naive + ' weeks</strong>. That is roughly your 50th percentile, ' +
        'which means it is wrong about half the time, and the half it is wrong is the half people remember. ' +
        'Quote the 85th instead.</p></div>'
      );
    });
  }

  /* ---------------------------- Little's Law --------------------------- */

  var llBtn = document.querySelector('[data-ll-run]');
  if (llBtn) {
    llBtn.addEventListener('click', function () {
      var wip = num('ll-wip');
      var thr = num('ll-throughput');
      if (!isFinite(wip) || !isFinite(thr) || thr <= 0) {
        show('ll-result', '<div class="notice notice--warn"><p>Enter a work-in-progress count and a weekly throughput above zero.</p></div>');
        return;
      }
      var ct = wip / thr;
      var halved = (wip / 2) / thr;
      show('ll-result',
        '<h3>Average cycle time: ' + ct.toFixed(1) + ' weeks (' + (ct * 5).toFixed(0) + ' working days)</h3>' +
        '<p>Halve your work in progress to ' + Math.round(wip / 2) + ' items and, with the same throughput, ' +
        'average cycle time becomes <strong>' + halved.toFixed(1) + ' weeks</strong>. ' +
        'Nobody has to work faster: this is arithmetic, not exhortation.</p>' +
        (wip / thr > 3
          ? '<div class="inset inset--warn"><p style="margin:0">Cycle time over three weeks with this throughput suggests too much started and not enough finished. Walk the board right to left and finish something before starting anything.</p></div>'
          : '')
      );
    });
  }

  /* -------------------------- Flow efficiency -------------------------- */

  var feBtn = document.querySelector('[data-fe-run]');
  if (feBtn) {
    feBtn.addEventListener('click', function () {
      var elapsed = num('fe-elapsed');
      var blocked = num('fe-blocked') || 0;
      var waiting = num('fe-waiting') || 0;
      if (!isFinite(elapsed) || elapsed <= 0) {
        show('fe-result', '<div class="notice notice--warn"><p>Enter the elapsed days from start to finish.</p></div>');
        return;
      }
      var touch = elapsed - blocked - waiting;
      if (touch < 0) {
        show('fe-result', '<div class="notice notice--warn"><p>Blocked plus waiting days exceed the elapsed time. Check the numbers &mdash; they cannot overlap.</p></div>');
        return;
      }
      var pct = (touch / elapsed) * 100;
      var verdict = pct < 15
        ? 'Very low. Almost all of your lead time is queueing. Adding people will make this worse, not better - remove a handoff or a queue instead.'
        : pct < 30
          ? 'Low, and typical. Your constraint is queues and handoffs, not effort. Look at what work waits for: review, test environments, security sign-off.'
          : pct < 45
            ? 'About average for a team that has not worked on this. There is still more to gain from removing queues than from working harder.'
            : 'Good. Further gains will be harder and will come from batch size rather than queue removal.';
      show('fe-result',
        '<h3>Flow efficiency: ' + pct.toFixed(0) + '%</h3>' +
        '<p>Touch time ' + touch.toFixed(1) + ' days out of ' + elapsed.toFixed(1) + ' elapsed. ' +
        (elapsed - touch).toFixed(1) + ' days &mdash; ' + (100 - pct).toFixed(0) + '% &mdash; was spent waiting.</p>' +
        '<div class="inset inset--brand"><p style="margin:0">' + verdict + '</p></div>'
      );
    });
  }

  /* ----------------------------- Capacity ------------------------------ */

  var capBtn = document.querySelector('[data-cap-run]');
  if (capBtn) {
    capBtn.addEventListener('click', function () {
      var people = num('cap-people');
      var days = num('cap-days');
      var leave = num('cap-leave') || 0;
      var oncall = num('cap-oncall') || 0;
      var other = num('cap-other') || 0;
      var unplanned = num('cap-unplanned') || 0;

      if (!isFinite(people) || !isFinite(days) || people < 1 || days < 1) {
        show('cap-result', '<div class="notice notice--warn"><p>Enter the team size and the number of working days in the sprint.</p></div>');
        return;
      }

      var gross = people * days;
      var afterAbsence = gross - leave - oncall - other;
      var net = afterAbsence * (1 - unplanned / 100);
      var pct = (net / gross) * 100;

      var verdict = pct < 55
        ? 'Below 55% of nominal. Say this out loud at planning, with the numbers, before anyone commits to a sprint goal.'
        : pct < 70
          ? 'Below 70%. Normal for a sprint with leave or a heavy on-call rota, but plan to it rather than around it.'
          : 'A reasonably clean sprint. Still do not plan to 100% - queueing theory says the last 20% of utilisation costs you predictability.';

      show('cap-result',
        '<h3>Net capacity: ' + net.toFixed(1) + ' person-days (' + pct.toFixed(0) + '% of nominal)</h3>' +
        '<div class="table-scroll" tabindex="0" role="region" aria-label="Capacity breakdown"><table><tbody>' +
        '<tr><th scope="row">Nominal (' + people + ' &times; ' + days + ')</th><td>' + gross.toFixed(1) + '</td></tr>' +
        '<tr><th scope="row">Less leave</th><td>&minus;' + leave.toFixed(1) + '</td></tr>' +
        '<tr><th scope="row">Less on-call and support</th><td>&minus;' + oncall.toFixed(1) + '</td></tr>' +
        '<tr><th scope="row">Less interviews, training, other</th><td>&minus;' + other.toFixed(1) + '</td></tr>' +
        '<tr><th scope="row">Available</th><td>' + afterAbsence.toFixed(1) + '</td></tr>' +
        '<tr><th scope="row">Less ' + unplanned + '% unplanned work</th><td>&minus;' + (afterAbsence - net).toFixed(1) + '</td></tr>' +
        '<tr><th scope="row"><strong>Net capacity</strong></th><td><strong>' + net.toFixed(1) + '</strong></td></tr>' +
        '</tbody></table></div>' +
        '<div class="inset inset--brand"><p style="margin:0">' + verdict + '</p></div>'
      );
    });
  }
})();
