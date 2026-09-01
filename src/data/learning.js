'use strict';

/*
 * Learning paths. Each path is a sequence of modules; each module has learning
 * objectives, short teaching content, a practice task, and links to the
 * templates in the catalogue so learning and doing stay connected.
 *
 * Progress is stored per user in `module_progress`, which is what powers the
 * completion percentages and the certificate of completion.
 */

const PATHS = [
  {
    id: 'new-dm',
    title: 'New delivery manager',
    strapline: 'From "I have the job title" to running a delivery with confidence.',
    audience: 'First 90 days in a delivery manager role, or moving into delivery from PM, BA, engineering or ops.',
    hours: 6,
    modules: [
      {
        id: 'what-the-job-is',
        title: 'What the job actually is',
        minutes: 30,
        objectives: [
          'Describe the delivery manager role in terms of outcomes, not ceremonies',
          'Distinguish delivery management from project management and product management',
          'Identify the four things only you can do on a team'
        ],
        content: [
          'A delivery manager is accountable for the team being able to deliver: removing what is in the way, making the flow of work visible, and holding the relationship with everyone outside the team so the team can concentrate. You are not accountable for what gets built - that is product - or for how it is built - that is engineering.',
          'The four things nobody else will do if you do not: name the uncomfortable truth to the sponsor; unblock a dependency that sits outside the team; protect the team\'s capacity from well-meaning erosion; and make the system of work visible enough that the team can improve it.',
          'The trap is becoming the team\'s administrator. Running the board, writing the tickets and reporting the status feels like the job and is measurably not it. If the team could not function without you as an information router, you have built a bottleneck and called it a role.'
        ],
        practice: 'Write down the last five things you did at work. For each, ask: did this make the team more capable, or did it make the team more dependent on me? Be honest about the ratio.',
        resources: ['onboarding-30-60-90', 'raci-matrix'],
        quiz: [
          {
            q: 'A stakeholder asks you to add a feature mid-sprint. What is the delivery manager response?',
            options: [
              'Add it - stakeholder management means keeping them happy',
              'Refuse it - the sprint is sacred',
              'Make the cost visible, route the decision to whoever owns the priority, and record it',
              'Ask the team to absorb it alongside the sprint goal'
            ],
            answer: 2,
            why: 'You do not own priority. You own making the trade-off visible and getting it decided by the right person, quickly, with a record.'
          }
        ]
      },
      {
        id: 'first-two-weeks',
        title: 'Your first two weeks on a team',
        minutes: 35,
        objectives: [
          'Run a structured diagnosis of a team you have just joined',
          'Identify which problems are yours to fix and which are structural',
          'Resist the urge to change process too early'
        ],
        content: [
          'Diagnose before prescribing, but put a deadline on the diagnosis. Two weeks of listening earns you a great deal of permission; two months of listening looks like an absence of leadership.',
          'The highest-value early activity is tracing one piece of work end to end and timing every wait. It tells you more about the system than a month of standups, and it gives you a concrete story to tell rather than an opinion to defend.',
          'In the first fortnight, only fix the free things: an agenda that does not exist, an action with no owner, a meeting with no purpose, a board that does not reflect reality. Save the expensive changes for when you have evidence and relationships.'
        ],
        practice: 'Pick one recently completed item. Reconstruct its timeline from request to production and mark every period where nobody was working on it. Calculate the flow efficiency. Bring the number, not the conclusion, to your next retro.',
        resources: ['onboarding-30-60-90', 'cycle-time-worksheet', 'stakeholder-map']
      },
      {
        id: 'making-work-visible',
        title: 'Making work visible',
        minutes: 40,
        objectives: [
          'Design a board that reflects how work really flows',
          'Set and defend work-in-progress limits',
          'Spot the queues that a board is hiding'
        ],
        content: [
          'Most boards are org charts in disguise: columns named after teams or handoffs, with the waiting invisible. A useful board makes waiting the most obvious thing on it, because waiting is where almost all of your lead time goes.',
          'Add explicit queue columns between stages - "ready for review", "waiting on vendor" - and you will immediately see where the system is jammed. Teams often discover that the constraint is a single reviewer, not a shortage of developers.',
          'Work-in-progress limits are the only lever that reliably reduces cycle time without changing anything else. Little\'s Law is arithmetic, not philosophy: average cycle time equals average WIP divided by average throughput. Halve WIP and cycle time halves.'
        ],
        practice: 'Add one explicit queue column to your board this week. Count how many items sit in it at the end of each day for a fortnight. Bring the count to a retro.',
        resources: ['flow-metrics-starter', 'cycle-time-worksheet'],
        quiz: [
          {
            q: 'Cycle time is too long. The team has capacity. What is the first thing to try?',
            options: [
              'Add another developer',
              'Reduce work in progress',
              'Increase the sprint length',
              'Ask people to work faster'
            ],
            answer: 1,
            why: 'Cycle time = WIP / throughput. Reducing WIP reduces cycle time immediately and costs nothing. Adding people usually increases WIP and makes it worse.'
          }
        ]
      },
      {
        id: 'facilitation-basics',
        title: 'Facilitation that is not just chairing',
        minutes: 40,
        objectives: [
          'Run a session where the quietest person contributes',
          'Use silent writing, timeboxes and structured divergence',
          'Handle the dominant voice and the disengaged room'
        ],
        content: [
          'Facilitation is designing the conditions for a good conversation, then getting out of the way. The single highest-return technique is silent individual writing before any discussion: it roughly doubles the number of distinct ideas and largely removes the effect of seniority on who is heard.',
          'Timeboxes are a kindness. An open-ended discussion privileges whoever has the most stamina. Announce the box, show the timer, and stop on time even mid-sentence - you will get better at the next one.',
          'For the dominant voice: give them a job. Note-taker, timekeeper, or "you go last so you do not anchor the room". For the disengaged room: the problem is almost always that the session has no consequence. Make the output a decision, and attendance improves without a plea.'
        ],
        practice: 'Facilitate your next retro using silent writing for the whole gather-data phase. Count how many items come from people who usually speak least.',
        resources: ['retro-pack', 'sprint-ceremonies-agendas']
      },
      {
        id: 'risk-in-practice',
        title: 'Risk, dependencies and the RAID log',
        minutes: 35,
        objectives: [
          'Write a risk that can be acted on',
          'Score, prioritise and escalate proportionately',
          'Convert a hope into a written commitment'
        ],
        content: [
          'A usable risk names a cause, not a fear. "Launch might fail" cannot be acted on. "The payments vendor has not given a written certification date and it sits on the critical path" has an owner, an action and a date attached to it automatically.',
          'Score probability times impact and agree a tolerance line with your sponsor in advance. Above the line, the sponsor decides; below it, you do. Agreeing this while everyone is calm is what makes escalation unremarkable later.',
          'Dependencies have exactly two states: committed in writing by a named person, or not committed. Record the evidence - a ticket, a roadmap line, a dated note. "They said yes on a call" evaporates the moment their priorities change.'
        ],
        practice: 'Rewrite the three worst-written risks in your current RAID log so that each names a cause, an owner and a first action.',
        resources: ['raid-log', 'dependency-tracker', 'escalation-matrix']
      },
      {
        id: 'reporting-upward',
        title: 'Reporting upward without losing the room',
        minutes: 35,
        objectives: [
          'Write a one-page status report that generates decisions',
          'Deliver bad news early and keep credibility',
          'Agree RAG definitions that mean something'
        ],
        content: [
          'The test of a status report is whether a stakeholder knows, in ninety seconds, what you need from them. Everything else is context. Lead with the decisions you need, dated.',
          'Bad news early is cheap; bad news late is expensive and permanent. The reputational damage is almost never from the slip - it is from the sponsor finding out from someone else. Build a format where amber is normal and unremarkable, and it will get used.',
          'Never go from green to red. A jump like that tells everyone that the amber period existed and was concealed. Amber with a named action and a date is a sign of a delivery manager in control, not one in trouble.'
        ],
        practice: 'Take your last status report and rewrite it so the "decisions needed" section is first and each item has an option set and a recommendation.',
        resources: ['status-report', 'steering-pack', 'comms-plan'],
        quiz: [
          {
            q: 'You have just learned a launch will slip two weeks. The steering group is in nine days. When do you tell the sponsor?',
            options: [
              'At the steering group, with a full recovery plan',
              'Today, with what you know, the options and when you will confirm',
              'Once you are certain of the new date',
              'After you have tried to recover the two weeks'
            ],
            answer: 1,
            why: 'Sponsors forgive slips and remember surprises. Tell them today with the options; confirm the date when you have it.'
          }
        ]
      },
      {
        id: 'saying-no',
        title: 'Protecting the team and saying no well',
        minutes: 30,
        objectives: [
          'Refuse a request without damaging the relationship',
          'Make trade-offs visible instead of absorbing them',
          'Recognise the requests you should say yes to'
        ],
        content: [
          'You rarely need to say no. You need to say "yes, and here is what moves". Most requests are made without any knowledge of the cost; supply the cost and the requester usually withdraws or reprioritises themselves.',
          'Absorbing work silently is the most damaging habit available to a delivery manager. It teaches the organisation that your team\'s capacity is elastic, and it hides the cost from the only people who could decide differently.',
          'Say yes quickly to: anything that removes a future dependency, anything that a user is actively harmed by, and anything small enough that the conversation would cost more than the work. Judgement here is most of the craft.'
        ],
        practice: 'For the next three incoming requests, respond with the trade-off rather than a yes or a no. Note what happens to each.',
        resources: ['comms-plan', 'escalation-matrix', 'working-agreement']
      },
      {
        id: 'first-90-review',
        title: 'Proving your impact at 90 days',
        minutes: 25,
        objectives: [
          'Show before-and-after evidence for the changes you made',
          'Name the structural problem you cannot fix alone',
          'Agree what good looks like at six months'
        ],
        content: [
          'At 90 days you should be able to point at two changes, with numbers either side. Not "the team feels better" - cycle time, flow efficiency, unplanned work percentage, action closure rate, health check movement.',
          'You will also have found at least one problem you cannot fix from inside the team: a funding cycle, an unstaffed shared platform, an intake process that fills the backlog with somebody else\'s priorities. Name it, propose options, and escalate it properly. Carrying it silently is not resilience.',
          'Finish by agreeing with your own manager what success looks like at six months, in writing. It is the cheapest way to avoid a surprising conversation later.'
        ],
        practice: 'Write a one-page 90-day review: two changes with evidence, one thing you removed permanently, one escalation with options, and your proposed focus for the next quarter.',
        resources: ['status-report', 'team-health-check', 'flow-metrics-starter']
      }
    ]
  },

  {
    id: 'scrum-master',
    title: 'Scrum master craft',
    strapline: 'Beyond the certificate: what a genuinely good scrum master does all day.',
    audience: 'Scrum masters, or delivery managers holding the scrum master accountability on a team.',
    hours: 5,
    modules: [
      {
        id: 'scrum-actually-says',
        title: 'What the Scrum Guide actually says',
        minutes: 35,
        objectives: [
          'State the three accountabilities, five events and three artefacts accurately',
          'Identify the commitments attached to each artefact',
          'Separate Scrum from the practices commonly bolted onto it'
        ],
        content: [
          'The 2020 Scrum Guide is about thirteen pages. Read it in full - most disagreements in teams are about things it does not say. Three accountabilities: product owner, scrum master, developers. Five events: the sprint itself, plus planning, daily scrum, review and retrospective. Three artefacts, each with a commitment: product backlog / product goal, sprint backlog / sprint goal, increment / definition of done.',
          'Things Scrum does not mandate, and which teams routinely believe it does: story points, velocity, a Definition of Ready, a backlog refinement event, two-week sprints, a physical board, or a scrum master who runs the board. These may all be good ideas. None of them is Scrum.',
          'The sprint goal is the artefact most often skipped and the one that does most work. Without it, a sprint is a batch of tickets and there is nothing to protect, nothing to negotiate against, and nothing to inspect at review.'
        ],
        practice: 'Read the Scrum Guide in one sitting. Write down three things your team does that it believes are Scrum but are not, and one commitment it is skipping.',
        resources: ['sprint-ceremonies-agendas', 'definition-of-ready-done'],
        quiz: [
          {
            q: 'Which of these is a Scrum commitment?',
            options: ['Velocity', 'Definition of Done', 'Story points', 'Definition of Ready'],
            answer: 1,
            why: 'The three commitments are the product goal, the sprint goal and the Definition of Done. The others are optional practices.'
          }
        ]
      },
      {
        id: 'servant-leadership',
        title: 'Serving without being a servant',
        minutes: 35,
        objectives: [
          'Coach rather than instruct',
          'Choose between teaching, facilitating, mentoring and getting out of the way',
          'Avoid becoming the team\'s administrative layer'
        ],
        content: [
          'The scrum master has four modes: teach (the team lacks knowledge), facilitate (the team has the knowledge but not the conditions), coach (the team needs to reach its own answer) and step back (the team is fine). Most scrum masters over-use one and never develop the others.',
          'Coaching means asking the question you do not know the answer to. If you already know what you want them to say, you are instructing with extra steps, and the team will notice.',
          'The administrative slide is gradual and comfortable: you write the tickets because you are quicker, you run the board because it is tidier, you give the update because you know it best. Each step makes the team less capable. Give the work back deliberately, one item per sprint.'
        ],
        practice: 'Identify one thing you do for the team every sprint that they could do themselves. Hand it over this sprint, including the awkward part where they do it worse than you at first.',
        resources: ['one-to-one-template', 'working-agreement']
      },
      {
        id: 'impediments',
        title: 'Impediments: finding, sizing and clearing',
        minutes: 35,
        objectives: [
          'Distinguish an impediment from a problem the team should solve itself',
          'Escalate an impediment with options rather than complaints',
          'Track impediments to closure and spot patterns'
        ],
        content: [
          'An impediment is something the team cannot remove itself. A slow build the team could fix is not an impediment; a shared platform team with a six-week queue is. Solving the first for them is theft of learning; leaving the second is negligence.',
          'Keep an impediment log with the same discipline as a RAID log: cause, owner, date raised, date cleared, days lost. The aggregate is your business case for structural change - "we lost 31 team-days to the security review queue last quarter" is an argument; "security is slow" is a grumble.',
          'Escalate with a decision, not a feeling. Name the impediment, the cost in days, two options, and your recommendation. Delivery managers who escalate this way get a reputation for being useful rather than difficult.'
        ],
        practice: 'Start an impediment log today. Record days lost for each. In four weeks, total it by cause and take the top cause to your lead with two options.',
        resources: ['raid-log', 'escalation-matrix', 'cycle-time-worksheet']
      },
      {
        id: 'psychological-safety',
        title: 'Psychological safety you can act on',
        minutes: 40,
        objectives: [
          'Recognise the observable signals of low safety',
          'Use specific behaviours that raise it',
          'Avoid the interventions that make it worse'
        ],
        content: [
          'Psychological safety is the shared belief that you can take an interpersonal risk - admit an error, ask a naive question, disagree with a senior person - without being punished. It is the strongest predictor of team effectiveness in the research, and it is behavioural, not a matter of niceness.',
          'Observable signals of low safety: nobody says "I do not know"; questions get asked in DMs instead of channels; bad news arrives late; the same one or two people speak in every meeting; retros produce only process actions and never interpersonal ones.',
          'What raises it: leaders framing work as a learning problem rather than an execution problem; leaders admitting their own errors first and specifically; asking direct questions and then waiting; responding to bad news with curiosity about the conditions rather than the person. What lowers it: mandatory fun, anonymous surveys with no visible follow-through, and any use of retro content in a performance conversation.'
        ],
        practice: 'In your next team meeting, say out loud one specific thing you got wrong recently and what you learned. Do not soften it. Notice what happens over the following fortnight.',
        resources: ['team-health-check', 'incident-postmortem', 'retro-pack']
      },
      {
        id: 'conflict',
        title: 'Conflict: surfacing it and using it',
        minutes: 35,
        objectives: [
          'Tell productive disagreement from corrosive conflict',
          'Intervene in a team disagreement without taking a side',
          'Use disagree-and-commit properly'
        ],
        content: [
          'A team with no visible conflict is not a healthy team; it is a team where disagreement has gone underground. Your job is not to remove conflict but to move it from personal to substantive, and from private to open.',
          'When two people are stuck, get the disagreement stated as a question about the work rather than about each other, then make the criteria explicit: what would change your mind? Most technical arguments dissolve the moment both parties state their decision criteria out loud.',
          'Disagree and commit only works if disagreement was genuinely heard and the commitment is genuinely binding. Say the words explicitly - "I do not agree, and I will support this fully" - and revisit at an agreed date. Used as a euphemism for "be quiet", it destroys trust quickly.'
        ],
        practice: 'Next time a disagreement stalls, ask both parties to write down what evidence would change their mind. Compare the answers before discussing anything else.',
        resources: ['working-agreement', 'decision-log']
      },
      {
        id: 'scaling-scrum',
        title: 'When one team becomes several',
        minutes: 35,
        objectives: [
          'Recognise which problems scaling frameworks actually solve',
          'Choose the lightest coordination that works',
          'Avoid coordinating your way around a bad team boundary'
        ],
        content: [
          'Coordination cost grows roughly with the square of the number of teams that need to talk to each other. The cheapest scaling intervention is almost always redrawing team boundaries so that fewer teams need to talk - team topologies, not more ceremonies.',
          'If you genuinely have multiple teams on one product, start with the lightest coordination: a shared product goal, a single backlog with one owner of priority, a weekly cross-team dependency review, and a shared Definition of Done. That covers most of what a framework would give you.',
          'Reach for a named framework - SAFe, LeSS, Nexus, Scrum@Scale - when you need a shared vocabulary across dozens of teams and a funding model to match. Understand that you are buying alignment and paying in autonomy and overhead. Make that trade knowingly.'
        ],
        practice: 'Draw your current team boundaries and every cross-team dependency from the last quarter. Ask whether a different boundary would have removed most of the lines.',
        resources: ['dependency-tracker', 'escalation-matrix']
      },
      {
        id: 'measuring-agility',
        title: 'Measuring whether any of it is working',
        minutes: 30,
        objectives: [
          'Choose measures that resist gaming',
          'Pair speed measures with stability and outcome measures',
          'Present metrics to leadership without creating perverse incentives'
        ],
        content: [
          'Any single delivery metric reported upward will be gamed within two quarters. Pair them: throughput with change failure rate, cycle time with escaped defects, deployment frequency with recovery time. Pairs are much harder to game than singletons.',
          'Never report velocity upward and never compare it between teams. Story points are a local estimation currency with no exchange rate; treating them as a productivity measure is the single most common way to damage a delivery organisation.',
          'The measures that matter most to leadership are outcome measures, and they are usually available: contact rate, conversion, retention, cost to serve, error rate. Leading with those and using flow metrics as the explanation is far more persuasive than the reverse.'
        ],
        practice: 'Write down the metrics your organisation reports on delivery. For each, describe how you would game it if you wanted to. Then propose the pair that would prevent it.',
        resources: ['flow-metrics-starter', 'velocity-capacity-tracker', 'status-report']
      }
    ]
  },

  {
    id: 'metrics',
    title: 'Metrics, forecasting and evidence',
    strapline: 'Answer "when will it be done?" honestly and be believed.',
    audience: 'Delivery managers and scrum masters who are asked for dates and want to stop guessing.',
    hours: 4,
    modules: [
      {
        id: 'flow-fundamentals',
        title: 'Flow fundamentals and Little\'s Law',
        minutes: 35,
        objectives: [
          'Define lead time, cycle time, throughput, WIP and flow efficiency precisely',
          'Apply Little\'s Law to a real board',
          'Explain why utilisation and speed are in tension'
        ],
        content: [
          'Little\'s Law: average cycle time equals average work in progress divided by average throughput. It is arithmetic and holds regardless of methodology. It is also the whole argument for WIP limits, and it means you can shorten delivery times without anyone working harder.',
          'Flow efficiency - touch time divided by elapsed time - is the number that changes minds. Most teams measure between 15% and 40%. When 70% of elapsed time is waiting, effort-based interventions cannot help; only queue-based ones can.',
          'Queueing theory says wait times rise non-linearly as utilisation approaches 100%. Past roughly 80% utilisation, small increases in load produce large increases in delay. Planning a team to full utilisation guarantees long and unpredictable lead times.'
        ],
        practice: 'Count the items in progress on your board right now and your average weekly completion rate. Divide. Compare the answer with your team\'s felt sense of how long things take.',
        resources: ['flow-metrics-starter', 'cycle-time-worksheet']
      },
      {
        id: 'probabilistic-forecasting',
        title: 'Probabilistic forecasting',
        minutes: 45,
        objectives: [
          'Forecast a delivery date as a range with a confidence level',
          'Run a Monte Carlo simulation from throughput history',
          'Communicate a probabilistic forecast to a stakeholder who wants one date'
        ],
        content: [
          'A single-date forecast derived from an average is wrong roughly half the time, and always wrong in the direction people remember. A forecast should be a date and a confidence: "85% confident by 17 October".',
          'Monte Carlo from throughput history is simple enough to do in a spreadsheet: sample randomly from your last twelve weeks of weekly completion counts, accumulate until you reach the remaining item count, record the number of weeks, repeat ten thousand times, then read the 50th, 85th and 95th percentiles off the distribution.',
          'When a stakeholder insists on one date, give them the 85th percentile and say what it is. Most people are perfectly comfortable with probability once it is explained in terms of the decision they are making - "if you need to book a marketing campaign, book against the 85th".'
        ],
        practice: 'Take your last twelve weeks of completed-item counts and your current remaining scope. Run the simulation. Compare the 50th and 85th percentile dates with the date you would previously have quoted.',
        resources: ['velocity-capacity-tracker', 'flow-metrics-starter'],
        quiz: [
          {
            q: 'Your 50th percentile forecast is 20 October and your 85th is 10 November. A stakeholder needs a date to book external training. Which do you give?',
            options: ['20 October', '10 November, described as 85% confident', 'The average of the two', 'Refuse to give a date'],
            answer: 1,
            why: 'Commitments that other people spend money against should be made at high confidence. Explain the number so they can choose their own risk level next time.'
          }
        ]
      },
      {
        id: 'estimation',
        title: 'Estimation: when it helps and when to skip it',
        minutes: 35,
        objectives: [
          'Choose between relative sizing, right-sizing and counting items',
          'Run a useful estimation session',
          'Recognise when estimation is costing more than it returns'
        ],
        content: [
          'The purpose of estimation is a conversation that surfaces uncertainty, not a number. If your sessions produce numbers without arguments, you are doing the expensive part and skipping the valuable part.',
          'For forecasting, counting items usually beats summing points, because item counts have a stable distribution and points inflate over time. Many mature teams drop estimation entirely and forecast from throughput - which works as long as items are right-sized, meaning "small enough to finish comfortably in a sprint".',
          'Keep estimation when the team is new to the domain, when you need to compare two possible approaches, or when the conversation reliably uncovers hidden work. Drop it when the estimate is never used, when it is being compared between teams, or when the sessions have become a ritual.'
        ],
        practice: 'For the next month, forecast using item counts alongside your usual estimates. Compare accuracy at the end. Most teams find the simpler method is at least as good.',
        resources: ['flow-metrics-starter', 'velocity-capacity-tracker']
      },
      {
        id: 'outcome-measures',
        title: 'Measuring outcomes, not output',
        minutes: 35,
        objectives: [
          'Write a measurable outcome statement',
          'Choose leading, lagging and counter-metrics',
          'Instrument before you build'
        ],
        content: [
          'An outcome statement has a direction, a magnitude and a timeframe: "reduce sign-in failure rate from 4.1% to under 2% by the end of Q4". Anything vaguer cannot be argued with, which is exactly why vague ones survive.',
          'You need three kinds of measure. Leading - readable within a sprint, tells you if the mechanism is working. Lagging - what the sponsor cares about, readable in a quarter. Counter-metric - the thing you promise not to damage while chasing the other two.',
          'Instrument before you build, and record the baseline. A launch with no baseline cannot be evaluated, and "we think it helped" is what turns delivery into a faith-based activity.'
        ],
        practice: 'Take your current top initiative. Write its outcome statement with a number, name a leading, lagging and counter-metric, and check whether each is actually instrumented today.',
        resources: ['project-brief', 'business-case-lite', 'status-report']
      },
      {
        id: 'dashboards',
        title: 'Dashboards people actually read',
        minutes: 30,
        objectives: [
          'Design a one-screen delivery dashboard',
          'Choose the right chart for each metric',
          'Avoid the RAG-only dashboard'
        ],
        content: [
          'One screen, five numbers, same five every week, each with direction of travel and a one-line reason. If a dashboard needs a walkthrough, it is a report, and it should be written as one.',
          'Chart choices that matter: cycle time as a scatterplot with percentile lines, not a bar chart of averages; work in progress as a cumulative flow diagram; throughput as a simple run chart; outcome measures as a time series with the launch date marked.',
          'A dashboard of only RAG statuses tells you what someone felt. A dashboard of only flow metrics tells you the machine is running but not whether it is going anywhere. You need one of each, side by side.'
        ],
        practice: 'Cut your current reporting to five numbers. Show the draft to someone outside your team and ask them what they conclude. If they conclude nothing, cut differently.',
        resources: ['status-report', 'flow-metrics-starter']
      },
      {
        id: 'metrics-ethics',
        title: 'The ethics of measuring people',
        minutes: 25,
        objectives: [
          'Recognise when a team metric becomes an individual surveillance metric',
          'Apply Goodhart\'s Law to your own reporting',
          'Handle a request for individual productivity data'
        ],
        content: [
          'Goodhart\'s Law: when a measure becomes a target, it ceases to be a good measure. This is not cynicism about people; it is a structural property of measurement in systems where the measured party can respond.',
          'Any delivery metric broken down by individual becomes a surveillance metric and destroys the trust that made it accurate. Commits per developer, points per person, tickets closed - these measure legibility, not contribution, and they punish the people doing the least legible and most valuable work.',
          'When asked for individual productivity data, ask what decision it is for. Almost always the real question is about team throughput, a specific performance concern, or resourcing. Each of those has a better answer, and offering the better answer is more useful than a refusal.'
        ],
        practice: 'Write the two-sentence answer you will give the next time someone asks for individual productivity metrics. Have it ready before you need it.',
        resources: ['flow-metrics-starter', 'team-health-check']
      }
    ]
  },

  {
    id: 'stakeholders',
    title: 'Stakeholders, influence and difficult conversations',
    strapline: 'The part of the job that does not appear on the board.',
    audience: 'Anyone who has to hold a delivery together across teams they do not manage.',
    hours: 4,
    modules: [
      {
        id: 'mapping-influence',
        title: 'Mapping interest, influence and worry',
        minutes: 30,
        objectives: ['Build a stakeholder map that changes your behaviour', 'Identify unmet information needs before they become escalations', 'Plan a stance change'],
        content: [
          'The interest/influence grid is useful, but the column that changes what you do is "what are they worried about". Ask them directly. People answer this question honestly far more often than delivery managers expect.',
          'Nearly every stakeholder escalation is an unmet information need expressed as an intervention. Someone who does not know what is happening will start asking about things they can see, which is usually your process.',
          'Plan stance changes explicitly: current stance, target stance, and the specific thing you will do to move it. "Sceptical to neutral by giving the contact centre eight weeks of notice" is a plan. "Manage stakeholders better" is not.'
        ],
        practice: 'Ask your three most influential stakeholders, individually, what they are most worried about on this delivery. Write the answers down verbatim and compare them with what you assumed.',
        resources: ['stakeholder-map', 'comms-plan']
      },
      {
        id: 'comms-rhythm',
        title: 'Building a communication rhythm',
        minutes: 30,
        objectives: ['Match channel and cadence to audience', 'Write for the reader who has ninety seconds', 'Make the rhythm survive a busy month'],
        content: [
          'A rhythm that never varies is worth more than a brilliant one-off. Same day, same format, same length. The reliability is the message: this delivery is under control.',
          'Write for a reader who will not read to the end. Decision first, then the reason, then the detail. Journalists call it the inverted pyramid, and it works because most readers stop after the first paragraph either way.',
          'The busy month is the test. If your comms stop when it gets hard, stakeholders learn that silence means trouble - and then silence itself becomes a signal that triggers escalation.'
        ],
        practice: 'Diary your reporting slot as a recurring commitment for the next quarter and treat it as unmovable. Note any week you were tempted to skip it and why.',
        resources: ['comms-plan', 'status-report', 'steering-pack']
      },
      {
        id: 'difficult-conversations',
        title: 'Difficult conversations',
        minutes: 40,
        objectives: ['Prepare and open a hard conversation', 'Separate observation from interpretation', 'Land a message that will not be welcome'],
        content: [
          'Prepare three things: the one sentence you must say, the outcome you want, and the thing you might be wrong about. Going in without the third makes you brittle.',
          'Separate observation from story. "The dependency date has moved three times" is an observation. "Your team does not take our work seriously" is a story you have built on top of it. Lead with the observation and ask for their story before offering yours.',
          'Deliver the message in the first minute. Everything before it is padding that the other person will spend the whole conversation trying to see past, and softening the opening makes the message land harder, not softer.'
        ],
        practice: 'Identify the conversation you have been avoiding for more than two weeks. Write the one sentence. Book the meeting.',
        resources: ['one-to-one-template', 'stakeholder-map']
      },
      {
        id: 'influence-without-authority',
        title: 'Influence without authority',
        minutes: 35,
        objectives: ['Get commitment from teams you do not manage', 'Trade rather than plead', 'Build credit before you need it'],
        content: [
          'You have almost no formal authority and it does not matter much. What works is reciprocity, clarity and reliability: be the delivery manager who does what they said, gives notice, and never surprises another team, and your requests get answered.',
          'Trade rather than plead. Other teams have their own pressures; a request framed as "here is what I can do for you, here is what I need" is answerable. A request framed as urgency is not.',
          'Build credit before you need it. Help with something that is not yours, early, when there is nothing at stake. Every experienced delivery manager can name the colleague who only ever appears when they want something.'
        ],
        practice: 'Do one useful thing for another team this fortnight with no ask attached. Note whether your next request to them lands differently.',
        resources: ['dependency-tracker', 'escalation-matrix']
      },
      {
        id: 'escalating-well',
        title: 'Escalating well',
        minutes: 30,
        objectives: ['Escalate with a decision rather than a complaint', 'Use a proportionate ladder', 'Keep the relationship intact afterwards'],
        content: [
          'An escalation should arrive as a decision to make: here is the situation, the cost, two options and my recommendation. An escalation that arrives as a feeling makes you the problem in the room.',
          'Use a ladder and tell people you are on it. Peer to peer first, then written with the impact, then to the shared accountable owner. Skipping rungs wins the battle and costs you the relationship you will need next quarter.',
          'Always tell the other party you are escalating, before you do it. It costs nothing, it is what you would want, and it is the difference between escalating and reporting someone.'
        ],
        practice: 'Rewrite your last escalation email as a decision paper: situation, cost in days or pounds, two options, recommendation.',
        resources: ['escalation-matrix', 'dependency-tracker', 'decision-log']
      },
      {
        id: 'managing-upwards',
        title: 'Managing upwards',
        minutes: 30,
        objectives: ['Work out what your sponsor is actually measured on', 'Give them what they need before they ask', 'Push back on your own management'],
        content: [
          'Find out what your sponsor is measured on and what their boss asks them about. Almost everything puzzling about their behaviour becomes obvious once you know, and you can start answering the question before it is asked.',
          'Anticipate. A sponsor who has to ask for information has already lost confidence a little. The delivery managers who get trusted with the hard deliveries are the ones whose sponsors never need to chase.',
          'Pushing back upward is part of the job. Do it with evidence, in private first, with an alternative attached. A delivery manager who never says "I think that is the wrong call" is not providing the service the organisation is paying for.'
        ],
        practice: 'Ask your sponsor what they get asked about this delivery by their own leadership. Add those answers to the top of your next status report.',
        resources: ['status-report', 'stakeholder-map', 'business-case-lite']
      }
    ]
  },

  {
    id: 'scaling',
    title: 'Scaling, programmes and portfolios',
    strapline: 'When one team is not the unit of delivery any more.',
    audience: 'Senior delivery managers, programme managers, and anyone coordinating several teams.',
    hours: 4,
    modules: [
      {
        id: 'team-boundaries',
        title: 'Team boundaries and coordination cost',
        minutes: 40,
        objectives: ['Explain why coordination cost grows super-linearly', 'Redraw boundaries to reduce dependencies', 'Choose a team interaction mode deliberately'],
        content: [
          'Communication paths between n teams grow as n(n-1)/2. Four teams have six paths; ten teams have forty-five. This is why adding teams to a late programme reliably makes it later, and why the highest-leverage scaling intervention is redrawing boundaries rather than adding process.',
          'Conway\'s Law is not a warning, it is a design tool. Your architecture will come to mirror your team structure, so choose the team structure that would produce the architecture you want.',
          'Team Topologies gives three useful interaction modes: collaboration (high-bandwidth, temporary, expensive), X-as-a-service (low-bandwidth, durable, cheap), and facilitating (one team helping another become capable). Naming which mode two teams are in resolves a surprising amount of friction.'
        ],
        practice: 'List every cross-team dependency from the last quarter. Group them by pair of teams. Ask what single boundary change would remove the largest group.',
        resources: ['dependency-tracker', 'raci-matrix']
      },
      {
        id: 'frameworks-compared',
        title: 'Scaling frameworks, honestly compared',
        minutes: 45,
        objectives: ['Describe what SAFe, LeSS, Nexus and Scrum@Scale each optimise for', 'Match a framework to an organisational problem', 'Recognise when the answer is no framework'],
        content: [
          'SAFe optimises for alignment and predictability across many teams in an organisation that funds and plans annually. It buys you a shared vocabulary, a planning cadence and something recognisable to finance. It costs autonomy, overhead, and a large amount of role scaffolding. It is genuinely the right answer in some large regulated organisations, and is over-applied elsewhere.',
          'LeSS optimises for keeping Scrum intact at scale by removing roles and artefacts rather than adding them: one product owner, one backlog, many teams. It demands real organisational change, which is why it is adopted less often than it deserves.',
          'Nexus is the minimal extension of Scrum for three to nine teams on one product, and is the sensible default at that size. Scrum@Scale is modular and lets you scale only the parts that hurt.',
          'The unfashionable answer that is frequently correct: no framework. A shared product goal, one owner of priority, a single backlog, a shared Definition of Done, and a weekly dependency review will get most three-to-five-team products where they need to go.'
        ],
        practice: 'Write down the specific problem you want a scaling framework to solve. Then check whether the four lightweight practices above would solve it. Be honest.',
        resources: ['dependency-tracker', 'steering-pack']
      },
      {
        id: 'programme-governance',
        title: 'Programme governance that is proportionate',
        minutes: 35,
        objectives: ['Design governance around decisions', 'Set delegated authority thresholds', 'Cut governance that costs more than it returns'],
        content: [
          'Governance exists to make decisions at the right level, quickly, with the right people accountable. Every forum should be able to name the decisions it owns. A forum that cannot is a status meeting wearing a badge.',
          'Delegated authority thresholds are the mechanism that makes governance fast: below this figure the delivery lead decides, above it the sponsor, above that the exec. Write them down and the escalation arguments largely disappear.',
          'Audit your own governance annually: attendance, decision latency, action closure rate, and the ratio of decisions to meetings. If a forum has made no decisions in two consecutive meetings, propose halving its frequency.'
        ],
        practice: 'For every recurring governance meeting you attend, write the decisions it owns. Propose removing or merging any that cannot answer.',
        resources: ['steering-pack', 'escalation-matrix', 'decision-log']
      },
      {
        id: 'portfolio-prioritisation',
        title: 'Portfolio prioritisation and stopping things',
        minutes: 35,
        objectives: ['Apply cost of delay and WSJF sensibly', 'Make the cost of too many parallel initiatives visible', 'Actually stop something'],
        content: [
          'Cost of delay is the missing number in most prioritisation arguments. Two initiatives of equal value are not equal if one loses 80% of its value by missing a seasonal window. Weighted shortest job first - value plus time criticality plus risk reduction, divided by size - is a reasonable approximation and much better than a loudest-voice ordering.',
          'Portfolio-level WIP is the most under-managed number in most organisations. Twenty initiatives across capacity for eight means every one runs at a third speed with three times the coordination overhead. The arithmetic is the same as team-level WIP.',
          'Stopping is a skill and it is mostly organisational, not analytical. Make it routine: a standing agenda item, a pre-agreed stopping criterion set at funding time, and a celebration of the team that stopped something early. Otherwise every initiative continues until it succeeds or everyone leaves.'
        ],
        practice: 'Count your organisation\'s live initiatives and its teams. If the ratio is above about 1.5, take the arithmetic to your portfolio forum with a proposal to stop two things.',
        resources: ['business-case-lite', 'delivery-roadmap', 'decision-log']
      },
      {
        id: 'multi-supplier',
        title: 'Multi-supplier and contracted delivery',
        minutes: 35,
        objectives: ['Spot the contract shapes that block iterative delivery', 'Write outcome-based acceptance criteria', 'Manage a supplier without becoming their project manager'],
        content: [
          'Fixed-price, fixed-scope contracts push all discovery risk into a change-control process, which is where iterative delivery goes to die. Where you can influence procurement, argue for outcome-based or capacity-based contracting with regular break points.',
          'Acceptance criteria in a contract should describe an outcome and a quality bar - including accessibility, security and performance - not a list of features. Feature lists get delivered exactly as written and satisfy nobody.',
          'Integrate suppliers into the team\'s ceremonies and metrics rather than running a parallel governance track. Two sets of reporting means two versions of the truth, and you will spend your time reconciling them instead of delivering.'
        ],
        practice: 'Read the acceptance criteria in your current supplier contract. Identify which are feature lists and rewrite two as outcomes with a quality bar.',
        resources: ['go-live-checklist', 'raci-matrix', 'dependency-tracker']
      },
      {
        id: 'transformation',
        title: 'Change that outlives you',
        minutes: 30,
        objectives: ['Choose a small number of changes that compound', 'Build the coalition before the announcement', 'Leave something that survives your departure'],
        content: [
          'Transformation programmes fail in a predictable way: too many changes at once, imposed rather than adopted, measured by adoption of practices rather than improvement in outcomes.',
          'Pick two or three changes that compound - usually reducing WIP, shortening feedback loops, and moving decisions closer to the work. Everything else is downstream of those three.',
          'Build the coalition before the announcement. A change with three enthusiastic team leads behind it beats a change with an executive mandate and no advocates, every time.',
          'The test of whether you changed anything: come back in a year. Whatever is still happening is what you actually changed. Design for that from the start by embedding changes in artefacts people already use.'
        ],
        practice: 'Name the change you most want to make. Identify three people whose support would make it inevitable. Talk to them before you write anything down.',
        resources: ['team-health-check', 'flow-metrics-starter', 'project-closure']
      }
    ]
  }
];

const GLOSSARY = [
  { term: 'Acceptance criteria', definition: 'Testable conditions that must be true for a piece of work to be accepted. Written before work starts, not after.' },
  { term: 'ADR (Architecture Decision Record)', definition: 'A short document recording one significant technical decision, its context, the options considered and the consequences.' },
  { term: 'Blameless post-mortem', definition: 'A review of an incident that examines the conditions that made failure possible rather than the people involved.' },
  { term: 'Burn-down / burn-up chart', definition: 'Charts of remaining or completed work over time. Burn-up is generally more honest because it shows scope change.' },
  { term: 'Capacity', definition: 'The time a team actually has available after leave, on-call, support and other commitments. Usually 60-80% of the naive figure.' },
  { term: 'Change failure rate', definition: 'The proportion of changes to production that cause a degradation requiring remediation. One of the four DORA metrics.' },
  { term: 'Cost of delay', definition: 'The value lost per unit of time that a piece of work is not delivered. The missing variable in most prioritisation arguments.' },
  { term: 'Cumulative flow diagram', definition: 'A stacked area chart of items in each state over time. Widening bands show growing queues.' },
  { term: 'Cycle time', definition: 'Elapsed time from work starting to work being delivered. Report percentiles, not averages.' },
  { term: 'Definition of Done', definition: 'The shared, team-owned quality bar that must be met for an increment to be releasable. A Scrum commitment.' },
  { term: 'Definition of Ready', definition: 'A team convention describing when work is well enough understood to start. Not part of Scrum.' },
  { term: 'Dependency', definition: 'Something a team needs from outside itself, or that others need from it. Has a direction, an owner and, if managed, a written commitment.' },
  { term: 'DORA metrics', definition: 'Deployment frequency, lead time for changes, change failure rate and failed-deployment recovery time. Speed and stability, read together.' },
  { term: 'DPIA', definition: 'Data Protection Impact Assessment. Required under UK GDPR Article 35 before high-risk processing of personal data.' },
  { term: 'Escaped defect', definition: 'A defect found in production rather than before release. A better quality signal than raw defect count.' },
  { term: 'Feature flag', definition: 'A runtime switch allowing code to be deployed without being released. Decouples deployment from launch.' },
  { term: 'Flow efficiency', definition: 'Touch time divided by total elapsed time. Typically 15-40%. Reveals that queues, not effort, dominate lead time.' },
  { term: 'Goodhart\'s Law', definition: 'When a measure becomes a target, it ceases to be a good measure.' },
  { term: 'Impediment', definition: 'Something blocking the team that the team cannot remove itself. Distinct from a problem the team should solve.' },
  { term: 'Increment', definition: 'A usable, releasable output that meets the Definition of Done. Scrum artefact.' },
  { term: 'Kanban', definition: 'A method for improving flow through visualisation, explicit WIP limits, explicit policies and flow measurement.' },
  { term: 'Lead time', definition: 'Elapsed time from request to delivery. What the customer experiences. Always longer than cycle time.' },
  { term: 'LeSS', definition: 'Large-Scale Scrum. Scales by removing roles and artefacts rather than adding them: one product owner, one backlog, many teams.' },
  { term: 'Little\'s Law', definition: 'Average cycle time = average WIP / average throughput. The arithmetic behind WIP limits.' },
  { term: 'Monte Carlo forecast', definition: 'Simulating many possible futures by sampling historical throughput, producing a date range with confidence levels.' },
  { term: 'Nexus', definition: 'A minimal framework for three to nine Scrum teams working on one product.' },
  { term: 'Outcome vs output', definition: 'Output is what you shipped; outcome is what changed for users or the business. Only the second one is the point.' },
  { term: 'Pre-mortem', definition: 'Imagining a future failure and working backwards to identify the causes, before committing.' },
  { term: 'Product goal', definition: 'The longer-term objective the product backlog serves. A Scrum commitment attached to the product backlog.' },
  { term: 'Psychological safety', definition: 'The shared belief that interpersonal risk-taking - admitting error, disagreeing, asking naive questions - is safe.' },
  { term: 'RACI', definition: 'Responsible, Accountable, Consulted, Informed. One Accountable per activity, always.' },
  { term: 'RAID log', definition: 'A single register of risks, assumptions, issues and dependencies, each with an owner and a date.' },
  { term: 'RAG status', definition: 'Red / amber / green. Worthless without a stated reason and agreed definitions.' },
  { term: 'Right-sizing', definition: 'Splitting work until items are small enough to finish comfortably in a sprint, so item counts become a reliable forecasting unit.' },
  { term: 'Risk appetite / tolerance', definition: 'Appetite is how much risk you are willing to seek; tolerance is the threshold above which a risk must be escalated.' },
  { term: 'ROPA', definition: 'Record of Processing Activities. The inventory of personal-data processing required by UK GDPR Article 30.' },
  { term: 'SAFe', definition: 'Scaled Agile Framework. Optimises for alignment and predictability across many teams; costs autonomy and overhead.' },
  { term: 'Scrum', definition: 'A lightweight framework: three accountabilities, five events, three artefacts, each artefact with a commitment.' },
  { term: 'Servant leadership', definition: 'Leading by enabling others rather than directing them. Four modes: teach, facilitate, coach, step back.' },
  { term: 'Sprint goal', definition: 'The single objective for a sprint. A Scrum commitment, and the artefact most often skipped.' },
  { term: 'Story points', definition: 'A relative sizing currency, local to one team, with no exchange rate. Never compare between teams.' },
  { term: 'Team Topologies', definition: 'A model of four team types and three interaction modes, used to reduce coordination cost by design.' },
  { term: 'Throughput', definition: 'Items completed per unit of time. Simpler and harder to game than velocity, and better for forecasting.' },
  { term: 'Timebox', definition: 'A fixed maximum duration for an activity. Ends when the time ends, not when the work ends.' },
  { term: 'Velocity', definition: 'Story points completed per sprint. A local planning aid. Reported upward or compared between teams, it becomes actively harmful.' },
  { term: 'Vertical slice', definition: 'A thin piece of work that goes through every layer and delivers user-visible value. The opposite of a layer-by-layer plan.' },
  { term: 'WCAG 2.2 AA', definition: 'The accessibility conformance level most public-facing services are expected to meet. Legally required for UK public sector bodies.' },
  { term: 'WIP limit', definition: 'An explicit cap on items in progress. The cheapest reliable way to reduce cycle time.' },
  { term: 'WSJF', definition: 'Weighted shortest job first. (Value + time criticality + risk reduction) / size. A rough but useful prioritisation heuristic.' }
];

const pathById = new Map(PATHS.map((p) => [p.id, p]));

function getPath(id) {
  return pathById.get(id) || null;
}

function getModule(pathId, moduleId) {
  const p = getPath(pathId);
  if (!p) return null;
  const index = p.modules.findIndex((m) => m.id === moduleId);
  if (index === -1) return null;
  return {
    module: p.modules[index],
    path: p,
    index,
    prev: p.modules[index - 1] || null,
    next: p.modules[index + 1] || null
  };
}

function totalModules() {
  return PATHS.reduce((n, p) => n + p.modules.length, 0);
}

module.exports = { PATHS, GLOSSARY, getPath, getModule, totalModules };
