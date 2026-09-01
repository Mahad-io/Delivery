'use strict';

/*
 * Careers content: a competency framework, an interview question bank for both
 * sides of the table, certification guidance, and how to research pay honestly.
 *
 * Deliberately no invented salary figures. Ranges move constantly and vary by
 * sector and region, so this signposts primary sources instead of pretending to
 * be one.
 */

const COMPETENCIES = [
  {
    id: 'delivery-execution',
    name: 'Delivery execution',
    description: 'Getting things finished, predictably, at a sustainable pace.',
    levels: {
      associate: 'Runs the ceremonies for one team with support. Keeps the board accurate. Escalates blockers rather than sitting on them.',
      practitioner: 'Runs one team\'s delivery end to end. Forecasts with ranges. Manages the RAID log actively and closes items. Recovers a slipping sprint without heroics.',
      senior: 'Runs a complex delivery with multiple dependencies. Cuts scope credibly under pressure. Delivery is boring in the best sense - few surprises, visible trade-offs.',
      lead: 'Sets delivery approach across several teams. Establishes standards others adopt. Diagnoses why deliveries fail here specifically and fixes the pattern, not the instance.',
      head: 'Accountable for delivery capability across a portfolio. Changes funding, structure or intake so that delivery gets easier rather than heroic.'
    }
  },
  {
    id: 'facilitation',
    name: 'Facilitation and coaching',
    description: 'Designing conversations that produce decisions and learning.',
    levels: {
      associate: 'Facilitates standard ceremonies to an agenda. Keeps time. Notices when one voice dominates.',
      practitioner: 'Chooses formats to fit the need. Gets contribution from the quietest person in the room. Coaches individuals rather than instructing them.',
      senior: 'Facilitates high-stakes sessions with senior and conflicting stakeholders. Handles conflict in the room. Coaches other delivery people.',
      lead: 'Builds facilitation capability in others. Designs the organisation\'s recurring forums so they produce decisions.',
      head: 'Shapes the culture of how decisions get made. Intervenes in organisational dynamics, not just team ones.'
    }
  },
  {
    id: 'stakeholders',
    name: 'Stakeholder and communication',
    description: 'Holding relationships outside the team so the team can concentrate.',
    levels: {
      associate: 'Reports reliably to a template. Knows who the stakeholders are and what each needs.',
      practitioner: 'Owns the relationship with a sponsor. Delivers bad news early. Escalates with options rather than complaints.',
      senior: 'Trusted by senior stakeholders who go to them for the real picture. Changes a stakeholder\'s stance deliberately. Manages a hostile relationship without avoidance.',
      lead: 'Operates credibly at exec level. Negotiates scope, funding and timelines. Represents delivery in commercial and regulatory conversations.',
      head: 'Accountable to the board for delivery. Shapes what leadership asks for, not only how it is answered.'
    }
  },
  {
    id: 'agile-practice',
    name: 'Agile and lean practice',
    description: 'Depth of understanding, and judgement about when to depart from the book.',
    levels: {
      associate: 'Knows the framework as written. Applies it faithfully.',
      practitioner: 'Understands the principles behind the practices. Adapts practices with a stated reason and reviews the result.',
      senior: 'Fluent across Scrum, Kanban and lean. Diagnoses which method fits the work. Can argue against a practice from first principles.',
      lead: 'Designs ways of working for multiple teams. Chooses or rejects scaling frameworks with a clear-eyed view of what each costs.',
      head: 'Sets the organisation\'s approach to delivery. Resists fashion; measures whether changes improved outcomes.'
    }
  },
  {
    id: 'metrics',
    name: 'Metrics and evidence',
    description: 'Knowing what is true, and being able to show it.',
    levels: {
      associate: 'Keeps the board and basic reporting accurate. Understands lead time and cycle time.',
      practitioner: 'Instruments flow metrics. Forecasts probabilistically. Presents metrics with the caveats attached.',
      senior: 'Designs measurement for a delivery including outcome and counter-metrics. Spots and resists gaming.',
      lead: 'Designs measurement across teams that resists gaming and drives the right behaviour. Kills harmful metrics.',
      head: 'Owns delivery measurement at portfolio level and its relationship to business outcomes.'
    }
  },
  {
    id: 'risk',
    name: 'Risk, governance and assurance',
    description: 'Seeing what could go wrong, and building proportionate control.',
    levels: {
      associate: 'Maintains the RAID log. Understands probability and impact scoring.',
      practitioner: 'Manages risk actively with named owners and real mitigations. Runs a governance forum. Understands the accessibility, security and privacy obligations that apply.',
      senior: 'Designs proportionate governance for a complex delivery. Handles regulatory and contractual constraints. Runs credible go/no-go decisions.',
      lead: 'Sets governance standards across teams. Reduces governance that costs more than it returns.',
      head: 'Accountable for assurance across a portfolio. Answers to audit and regulators.'
    }
  },
  {
    id: 'people',
    name: 'Team health and people',
    description: 'Building teams that people want to stay in and can do their best work in.',
    levels: {
      associate: 'Notices when someone is struggling and raises it. Runs one-to-ones with support.',
      practitioner: 'Builds psychological safety deliberately. Gives clear, timely feedback. Protects sustainable pace with evidence.',
      senior: 'Turns around a team in poor health. Handles a serious interpersonal or performance situation well. Develops others deliberately.',
      lead: 'Builds a community of practice. Recruits and levels delivery people. Shapes how teams are formed and funded.',
      head: 'Accountable for the health and capability of a delivery function, including succession.'
    }
  },
  {
    id: 'technical',
    name: 'Technical and domain literacy',
    description: 'Enough understanding to ask the right question and smell a bad answer.',
    levels: {
      associate: 'Understands the delivery lifecycle and basic technical vocabulary.',
      practitioner: 'Understands the team\'s architecture at a block-diagram level, its deployment pipeline, and its main failure modes. Can chair an incident.',
      senior: 'Engages credibly in technical trade-off discussions. Understands the cost of technical debt in delivery terms and can argue for paying it down.',
      lead: 'Understands the technical strategy and its delivery implications across teams. Partners with engineering leadership as a peer.',
      head: 'Shapes technology investment decisions from a delivery and risk perspective.'
    }
  }
];

const INTERVIEW_BANK = [
  {
    theme: 'Delivery under pressure',
    forCandidates: 'They want evidence you make trade-offs visible rather than absorbing them. Have one story where you cut scope and one where you moved a date - with the numbers.',
    questions: [
      'Tell me about a delivery that was going to miss its date. What did you do, and when did you tell people?',
      'Describe a time you cut scope. Who decided, and how did you make the cost visible?',
      'What is the latest you have ever told a sponsor bad news? What would you do differently?',
      'How do you decide between moving a date, cutting scope, and adding people?',
      'Tell me about a delivery that failed. What was your part in it?'
    ]
  },
  {
    theme: 'Metrics and forecasting',
    forCandidates: 'This is where strong candidates separate. Know why velocity is not a productivity measure and be able to describe probabilistic forecasting in plain words.',
    questions: [
      'How would you answer "when will it be done?" for a team with three months of history?',
      'What is flow efficiency, and what would you do if a team\'s was 20%?',
      'Your director asks for velocity by team so they can compare. What do you say?',
      'Which four metrics would you instrument on a new team, and why those?',
      'How do you tell whether a delivery improvement actually worked?'
    ]
  },
  {
    theme: 'Stakeholders and influence',
    forCandidates: 'Interviewers are listening for whether you take responsibility for the relationship. Avoid stories where the stakeholder is simply the villain.',
    questions: [
      'Tell me about a stakeholder who was actively working against your delivery.',
      'Describe an escalation you got wrong.',
      'How do you get commitment from a team that does not report to you and has other priorities?',
      'How do you decide what goes in a status report and what does not?',
      'Tell me about a time you pushed back on your own manager.'
    ]
  },
  {
    theme: 'Team health and difficult people situations',
    forCandidates: 'Be specific and be discreet. Strong answers describe behaviour and conditions, not diagnoses of people.',
    questions: [
      'Tell me about a team in poor health that you improved. What did you measure?',
      'Describe a conflict between two team members that you had to address.',
      'How do you know whether a team feels safe to disagree with you?',
      'You inherit a team working significant overtime and treating it as normal. What do you do in week one?',
      'How do you handle someone who is quietly not delivering?'
    ]
  },
  {
    theme: 'Agile depth',
    forCandidates: 'Expect to be tested on whether your knowledge is deeper than a two-day course. Being able to argue against a practice is a strong signal.',
    questions: [
      'What does the Scrum Guide actually mandate, and what do teams add?',
      'When would you use Kanban rather than Scrum, and what would you lose?',
      'Which agile practice do you think is most often applied badly, and why?',
      'How would you decide whether to adopt a scaling framework?',
      'What would make you recommend against agile delivery for a piece of work?'
    ]
  },
  {
    theme: 'Your own practice',
    forCandidates: 'The self-awareness questions carry more weight than people expect. Prepare a real weakness with a real mitigation.',
    questions: [
      'What is the most useful feedback you have had, and what did you change?',
      'What part of the delivery manager role are you weakest at?',
      'What do you do that a team might find annoying?',
      'How do you keep learning? Name something you have changed your mind about.',
      'What would your last team say improved after you arrived - and what got worse?'
    ]
  },
  {
    theme: 'Questions to ask them',
    forCandidates: 'Interviews go two ways. These questions get you the information that decides whether you should take the job.',
    questions: [
      'What does the delivery manager here do that another organisation might not expect?',
      'How are priorities set, and how often do they change mid-sprint?',
      'What happens when a team says a date is not achievable?',
      'Who owns the backlog, and does that match who actually decides?',
      'How much of the team\'s capacity goes to unplanned work in a typical month?',
      'What is the last thing this organisation stopped doing?',
      'How is delivery measured here, and is that reported by individual?',
      'What would I be walking into that you would want to warn a friend about?'
    ]
  }
];

const CERTIFICATIONS = [
  {
    name: 'Professional Scrum Master (PSM I / II / III)',
    body: 'Scrum.org',
    site: 'https://www.scrum.org',
    cost: 'Low for PSM I (assessment only, no mandatory course)',
    effort: '10-20 hours of study for PSM I if you already work in Scrum',
    worthIt: 'Best value entry certification. The assessment is genuinely based on the Scrum Guide, so preparing for it teaches you something. PSM II and III are substantially harder and better respected.',
    caution: 'PSM I alone will not get you a job. It shows you read the guide.'
  },
  {
    name: 'Certified ScrumMaster (CSM)',
    body: 'Scrum Alliance',
    site: 'https://www.scrumalliance.org',
    cost: 'Higher - a two-day course is mandatory',
    effort: 'Two days plus a straightforward assessment',
    worthIt: 'The course is the product. A good trainer and a room of peers is worth the money; a bad one is not. Ask who is teaching before you book.',
    caution: 'Requires renewal every two years with fees and education units.'
  },
  {
    name: 'Professional Scrum Product Owner / Kanban / Agile Leadership',
    body: 'Scrum.org',
    site: 'https://www.scrum.org',
    cost: 'Low to moderate',
    effort: '10-25 hours each',
    worthIt: 'The Kanban and Evidence-Based Management assessments cover material most delivery managers are weakest on - flow and measurement.',
    caution: 'Breadth of certificates impresses nobody. Depth in one area does.'
  },
  {
    name: 'PRINCE2 / PRINCE2 Agile',
    body: 'PeopleCert / AXELOS',
    site: 'https://www.peoplecert.org',
    cost: 'Moderate to high',
    effort: 'Foundation a few days; Practitioner considerably more',
    worthIt: 'Still frequently required in UK public sector and large regulated organisations. If your target roles list it, get it; it is a gate, not a differentiator.',
    caution: 'Learn it as a vocabulary for governance, not as a delivery method for product teams.'
  },
  {
    name: 'APM PMQ / ChPP',
    body: 'Association for Project Management',
    site: 'https://www.apm.org.uk',
    cost: 'Moderate to high',
    effort: 'PMQ is a substantial syllabus; ChPP is an assessed professional standard',
    worthIt: 'Well regarded in UK project and programme management, infrastructure and public sector. ChPP is a genuine professional credential rather than an exam pass.',
    caution: 'Less relevant if you are targeting product-led digital teams.'
  },
  {
    name: 'PMP',
    body: 'Project Management Institute',
    site: 'https://www.pmi.org',
    cost: 'High',
    effort: 'Significant - documented experience hours plus a hard exam',
    worthIt: 'The strongest international recognition, particularly outside the UK and in consultancy. Now includes substantial agile content.',
    caution: 'Requires evidenced project management experience before you can sit it.'
  },
  {
    name: 'SAFe (SSM, SAFe Agilist, RTE)',
    body: 'Scaled Agile',
    site: 'https://scaledagile.com',
    cost: 'High - courses are mandatory',
    effort: 'Two days per certification',
    worthIt: 'Only if you are working in, or targeting, a SAFe organisation. Then it is close to mandatory and often employer-funded.',
    caution: 'Carries mixed reputation in product-led organisations. Do not lead your CV with it if you are applying to one.'
  },
  {
    name: 'GOV.UK DDaT delivery manager capability framework',
    body: 'UK Government (not a certification)',
    site: 'https://www.gov.uk',
    cost: 'Free',
    effort: 'An afternoon to read properly',
    worthIt: 'The clearest published description of what delivery managers do at each level anywhere. Read it whether or not you work in the public sector - and use it to structure your own development plan.',
    caution: 'It is a framework, not a credential. Nobody will ask if you have it; plenty will recognise the language.'
  }
];

const PAY_GUIDANCE = {
  intro:
    'Ranges move fast and vary enormously by sector, region and whether a role sits in a product organisation or a programme office. Rather than publish figures that will be wrong within a year, here is how to find out what is true this month.',
  steps: [
    'Read the level descriptions in the GOV.UK DDaT capability framework and honestly place yourself. Public sector pay scales are published, which makes them a reliable floor and a useful anchor.',
    'Collect at least fifteen live job adverts at your target level, in your region, that publish a range. Adverts that hide the range should be treated as the lower end.',
    'Separate the market into segments before averaging: public sector, consultancy, in-house product, contract or day rate. They are barely comparable.',
    'For day rates, check whether the role is inside or outside IR35 and model the difference properly, including the gaps between contracts.',
    'Ask three people at your target level directly. In delivery communities this is a normal and usually welcomed question.',
    'Weight recruiter salary surveys lightly. They are drawn from that recruiter\'s placements and are usually optimistic.'
  ],
  negotiating: [
    'Negotiate on evidence of level, not on need. Bring the competency framework and the specific things you have done at that level.',
    'Ask what band the role sits in and where in the band the offer falls. If it is at the bottom, ask what would justify mid-band.',
    'Get the level and the title right even if the money is fixed. Level compounds; a one-off uplift does not.',
    'Ask about the promotion process and the last three people who went through it. The answer tells you more than the range does.'
  ]
};

const COMMUNITIES = [
  { name: 'Government Digital Service community of practice', note: 'Cross-government delivery community. Publishes openly; much of it is useful outside the public sector.', site: 'https://www.gov.uk' },
  { name: 'Scrum.org and Scrum Alliance community forums', note: 'Practitioner forums attached to the certification bodies. Variable, but the Scrum.org forums have genuinely expert regulars.', site: 'https://www.scrum.org' },
  { name: 'Local agile and lean meetups', note: 'The single best return on time for most people. Speak at one within a year - it is the fastest way to build a network and to find out what you do not know.', site: null },
  { name: 'Delivery and agile conferences', note: 'Aim for one a year with a genuine practitioner track. The corridor conversations are worth more than the talks; plan for them.', site: null },
  { name: 'An internal community of practice', note: 'If your organisation has more than four delivery people and no community of practice, start it. Monthly, one topic, one person presenting a real problem rather than a success story.', site: null }
];

const READING = [
  { title: 'Accelerate', author: 'Forsgren, Humble, Kim', why: 'The evidence base for the DORA metrics. Read it before arguing about delivery performance with anyone.' },
  { title: 'Team Topologies', author: 'Skelton and Pais', why: 'The most practically useful book on why your teams keep tripping over each other.' },
  { title: 'The Scrum Guide', author: 'Schwaber and Sutherland', why: 'Thirteen pages, free, and most teams have never read it. Do that first.' },
  { title: 'Actionable Agile Metrics for Predictability', author: 'Daniel Vacanti', why: 'The clearest treatment of flow metrics and probabilistic forecasting.' },
  { title: 'The Fearless Organization', author: 'Amy Edmondson', why: 'Psychological safety from the researcher who defined it, with the behaviours rather than the slogans.' },
  { title: 'Agile Retrospectives', author: 'Derby and Larsen', why: 'The five-phase structure every good retro still uses.' },
  { title: 'Thinking in Systems', author: 'Donella Meadows', why: 'Changes how you see the organisation you are trying to change.' },
  { title: 'Escaping the Build Trap', author: 'Melissa Perri', why: 'Why output-focused organisations stay busy and go nowhere. Read alongside your product colleagues.' },
  { title: 'Turn the Ship Around!', author: 'David Marquet', why: 'Moving decisions to where the information is, told as a story you will remember.' },
  { title: 'GOV.UK Service Manual', author: 'UK Government', why: 'Free, opinionated, and the best practical guide to running digital delivery in the open.' }
];

module.exports = { COMPETENCIES, INTERVIEW_BANK, CERTIFICATIONS, PAY_GUIDANCE, COMMUNITIES, READING };
