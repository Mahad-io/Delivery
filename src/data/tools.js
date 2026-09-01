'use strict';

/*
 * Definitions for the interactive tools. Scoring logic lives here so that the
 * server is the single source of truth - the client never decides a score.
 */

const RETRO_TEMPLATES = [
  { id: 'ssc', name: 'Start / Stop / Continue', columns: [
    { id: 'start', name: 'Start', prompt: 'What should we begin doing?' },
    { id: 'stop', name: 'Stop', prompt: 'What should we stop doing?' },
    { id: 'continue', name: 'Continue', prompt: 'What is working that we should protect?' }
  ]},
  { id: 'four-ls', name: 'Four Ls', columns: [
    { id: 'liked', name: 'Liked', prompt: 'What did you enjoy?' },
    { id: 'learned', name: 'Learned', prompt: 'What did we find out?' },
    { id: 'lacked', name: 'Lacked', prompt: 'What was missing?' },
    { id: 'longed', name: 'Longed for', prompt: 'What do you wish we had?' }
  ]},
  { id: 'msg', name: 'Mad / Sad / Glad', columns: [
    { id: 'mad', name: 'Mad', prompt: 'What frustrated you?' },
    { id: 'sad', name: 'Sad', prompt: 'What disappointed you?' },
    { id: 'glad', name: 'Glad', prompt: 'What pleased you?' }
  ]},
  { id: 'sailboat', name: 'Sailboat', columns: [
    { id: 'wind', name: 'Wind', prompt: 'What is pushing us forward?' },
    { id: 'anchor', name: 'Anchors', prompt: 'What is holding us back?' },
    { id: 'rocks', name: 'Rocks', prompt: 'What risks are ahead?' },
    { id: 'island', name: 'Island', prompt: 'What are we aiming for?' }
  ]},
  { id: 'circles', name: 'Circles and Soup', columns: [
    { id: 'control', name: 'We control', prompt: 'We can change this ourselves.' },
    { id: 'influence', name: 'We influence', prompt: 'We can affect this with others.' },
    { id: 'soup', name: 'The soup', prompt: 'We can only adapt to this.' }
  ]},
  { id: 'premortem', name: 'Pre-mortem', columns: [
    { id: 'fail', name: 'How it fails', prompt: 'It is launch day and it went badly. Why?' },
    { id: 'signal', name: 'Early signal', prompt: 'What would we have seen first?' },
    { id: 'prevent', name: 'Prevention', prompt: 'What would stop it now?' }
  ]}
];

const POKER_DECKS = [
  { id: 'fibonacci', name: 'Fibonacci', cards: ['1', '2', '3', '5', '8', '13', '21', '?', 'Coffee'] },
  { id: 'modified-fib', name: 'Modified Fibonacci', cards: ['0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?'] },
  { id: 'tshirt', name: 'T-shirt sizes', cards: ['XS', 'S', 'M', 'L', 'XL', '?'] },
  { id: 'right-size', name: 'Right-sizing', cards: ['Fits comfortably', 'Fits, just', 'Too big - split it', 'Do not know yet'] }
];

/*
 * Delivery maturity self-assessment. Six dimensions, four statements each.
 * Deliberately behavioural: every statement describes something observable, so
 * a team cannot score well by having good intentions.
 */
const ASSESSMENT = {
  id: 'delivery-maturity',
  title: 'Delivery maturity self-assessment',
  intro:
    'Twenty-four statements about what your team observably does. Score each from 1 (not true at all) to 5 (consistently true). It takes about eight minutes and the result is only meaningful against your own future score.',
  scale: [
    { value: 1, label: 'Not true' },
    { value: 2, label: 'Rarely true' },
    { value: 3, label: 'Sometimes true' },
    { value: 4, label: 'Mostly true' },
    { value: 5, label: 'Consistently true' }
  ],
  dimensions: [
    {
      id: 'flow',
      name: 'Flow and predictability',
      questions: [
        'We know our cycle time and can state it as a percentile, not an average.',
        'We have explicit work-in-progress limits and we hold them.',
        'When asked for a date we give a range with a confidence level.',
        'Unplanned work is measured and stays below a quarter of our capacity.'
      ],
      advice: {
        low: 'Start with timestamps. Add "started" and "delivered" dates to every item this sprint and draw a scatterplot in a fortnight. Do not change anything else until you can see the data.',
        mid: 'You are measuring but not yet acting. Set one WIP limit, hold it for a month, and bring the cycle-time change to a retro.',
        high: 'Move to probabilistic forecasting and start using the numbers in commitments rather than only in retros.'
      },
      resources: ['flow-metrics-starter', 'cycle-time-worksheet', 'velocity-capacity-tracker']
    },
    {
      id: 'outcomes',
      name: 'Outcome focus',
      questions: [
        'Every significant piece of work has a measurable outcome stated before we start.',
        'We baseline the measure before launch and check it afterwards.',
        'We have stopped or changed direction on something in the last two quarters because of evidence.',
        'The team can state, unprompted, what user or business change the current sprint is aiming at.'
      ],
      advice: {
        low: 'Pick your current top initiative and write one outcome statement with a number in it. Check whether it is even instrumented today. Most are not.',
        mid: 'You state outcomes but do not close the loop. Add a fixed post-launch review date to every initiative and make someone accountable for reporting the number.',
        high: 'Push into counter-metrics and into stopping decisions - the strongest signal of outcome maturity is a team that has killed its own work.'
      },
      resources: ['project-brief', 'business-case-lite', 'status-report']
    },
    {
      id: 'quality',
      name: 'Quality and release confidence',
      questions: [
        'We have a Definition of Done the team wrote and actually applies.',
        'Releasing is routine and can happen on any working day.',
        'Accessibility is checked against WCAG 2.2 AA before release, including keyboard and screen-reader testing.',
        'We have tested a rollback recently, not just documented one.'
      ],
      advice: {
        low: 'Run the Definition of Done workshop this month, and separately find out how long a release actually takes end to end. Both are cheap and both will surprise you.',
        mid: 'The gap is usually accessibility and rollback. Book an accessibility audit a full sprint before your next launch and rehearse a rollback in a quiet week.',
        high: 'Look at change failure rate and recovery time. Optimise for boring releases rather than fast ones and the speed follows.'
      },
      resources: ['definition-of-ready-done', 'go-live-checklist', 'incident-postmortem']
    },
    {
      id: 'team-health',
      name: 'Team health and safety',
      questions: [
        'People say "I do not know" or "I disagree" in team meetings without visible cost.',
        'Bad news reaches me early rather than late.',
        'We have worked at a sustainable pace for the last three months.',
        'Retro actions from last time get reviewed at the start of the next retro.'
      ],
      advice: {
        low: 'This is the only dimension worth working on if it scores low. Start in one-to-ones, not in a team session, and start by admitting one of your own mistakes specifically.',
        mid: 'Make the retro-action review a fixed opening item and hold it for a quarter. Nothing raises the perceived value of retros faster.',
        high: 'Protect it actively. Safety erodes quietly under delivery pressure, and it is much cheaper to defend than to rebuild.'
      },
      resources: ['team-health-check', 'one-to-one-template', 'retro-pack']
    },
    {
      id: 'governance',
      name: 'Governance and risk',
      questions: [
        'Our RAID log has closures as well as additions, and every line has a named person.',
        'Escalation thresholds are agreed in advance and written down.',
        'Every cross-team dependency has a written commitment from a named person.',
        'Our governance forums make decisions rather than receive updates.'
      ],
      advice: {
        low: 'Start with the RAID log and the escalation matrix. Getting a named owner and a date on every line is a fortnight of work and changes how the delivery feels immediately.',
        mid: 'The weak point is usually dependencies. Move every one to "committed in writing by a named person" or mark it as not committed, and report the count.',
        high: 'Audit your governance for cost. Decision latency and action closure rate are the two numbers to publish.'
      },
      resources: ['raid-log', 'escalation-matrix', 'dependency-tracker', 'steering-pack']
    },
    {
      id: 'stakeholders',
      name: 'Stakeholders and communication',
      questions: [
        'Our reporting goes out on the same day, in the same format, every period, without exception.',
        'I know what each key stakeholder is worried about because I asked them.',
        'Stakeholders hear bad news from us first.',
        'Our reports lead with decisions needed rather than activity completed.'
      ],
      advice: {
        low: 'Fix the rhythm first. One page, same day, same format. Reliability buys more credibility than quality does at this stage.',
        mid: 'Ask your three most influential stakeholders directly what they are worried about, and put those answers at the top of your next report.',
        high: 'Work on anticipation - find out what your sponsor gets asked by their own leadership and answer it before it is asked.'
      },
      resources: ['stakeholder-map', 'comms-plan', 'status-report']
    }
  ]
};

/** Server-side scoring. The client posts answers; it never posts a score. */
function scoreAssessment(answers) {
  const perDimension = ASSESSMENT.dimensions.map((dim) => {
    const values = dim.questions.map((_, i) => {
      const raw = Number(answers?.[`${dim.id}_${i}`]);
      return Number.isFinite(raw) && raw >= 1 && raw <= 5 ? raw : 0;
    });
    const answered = values.filter((v) => v > 0).length;
    const total = values.reduce((a, b) => a + b, 0);
    const max = dim.questions.length * 5;
    const percent = max ? Math.round((total / max) * 100) : 0;
    const band = percent < 45 ? 'low' : percent < 75 ? 'mid' : 'high';
    return {
      id: dim.id,
      name: dim.name,
      total,
      max,
      percent,
      band,
      answered,
      of: dim.questions.length,
      advice: dim.advice[band],
      resources: dim.resources
    };
  });

  const total = perDimension.reduce((a, d) => a + d.total, 0);
  const max = perDimension.reduce((a, d) => a + d.max, 0);
  const percent = max ? Math.round((total / max) * 100) : 0;

  const overallBand =
    percent < 35 ? 'Getting started' :
    percent < 55 ? 'Finding your feet' :
    percent < 75 ? 'Solid' :
    percent < 90 ? 'Strong' : 'Exemplary';

  const weakest = perDimension.slice().sort((a, b) => a.percent - b.percent)[0];
  const strongest = perDimension.slice().sort((a, b) => b.percent - a.percent)[0];

  return { perDimension, total, max, percent, overallBand, weakest, strongest };
}

module.exports = { RETRO_TEMPLATES, POKER_DECKS, ASSESSMENT, scoreAssessment };
