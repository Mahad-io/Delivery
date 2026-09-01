'use strict';

const RESOURCES = [
  ...require('./catalogue.part1'),
  ...require('./catalogue.part2')
];

const CATEGORIES = [
  {
    id: 'planning',
    name: 'Planning & governance',
    blurb: 'Briefs, roadmaps, RAID, RACI, dependencies and decision records - the paperwork that actually earns its keep.',
    icon: 'compass'
  },
  {
    id: 'agile',
    name: 'Ceremonies & ways of working',
    blurb: 'Agendas, definitions of ready and done, retro formats and working agreements you can run tomorrow.',
    icon: 'loop'
  },
  {
    id: 'stakeholders',
    name: 'Stakeholders & communication',
    blurb: 'Mapping, comms planning and the difficult conversation, prepared for in advance.',
    icon: 'people'
  },
  {
    id: 'reporting',
    name: 'Metrics & reporting',
    blurb: 'Flow metrics, forecasting, status reports, steering packs, go-live checklists and closure.',
    icon: 'chart'
  },
  {
    id: 'team',
    name: 'Team health & leadership',
    blurb: 'Health checks, one-to-ones, blameless reviews - the human half of delivery.',
    icon: 'heart'
  },
  {
    id: 'career',
    name: 'Career & onboarding',
    blurb: 'Starting well, growing deliberately, and knowing what the next level actually asks of you.',
    icon: 'ladder'
  }
];

const byId = new Map(RESOURCES.map((r) => [r.id, r]));

function getResource(id) {
  return byId.get(id) || null;
}

function listResources({ category, tag, level, q } = {}) {
  let out = RESOURCES.slice();
  if (category) out = out.filter((r) => r.category === category);
  if (level) out = out.filter((r) => r.level === level);
  if (tag) out = out.filter((r) => (r.tags || []).includes(tag));
  if (q) {
    const needle = String(q).toLowerCase().trim();
    out = out.filter((r) =>
      [r.title, r.summary, r.why, (r.tags || []).join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    );
  }
  return out;
}

function allTags() {
  const counts = new Map();
  for (const r of RESOURCES) {
    for (const t of r.tags || []) counts.set(t, (counts.get(t) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag, count]) => ({ tag, count }));
}

function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || null;
}

module.exports = { RESOURCES, CATEGORIES, getResource, listResources, allTags, categoryById };
