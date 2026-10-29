

| MRC SYSTEMS  /  CONTENT  /  DELIVERY | WEBSITE DELIVERY  Framework \+ reusable project template Building a Website, Step by Step A practical framework for planning, designing, developing, launching, and improving a website. Use it as a project handbook, delivery checklist, client-facing roadmap, or starting point for a tailored statement of work. PREPARED BY Manny Roy Consulting PREPARED ON August 6, 2026 DOCUMENT TYPE Reusable website project framework The central premise A website is not a stack of pages. It is a system of decisions, content, technology, and ownership. |
| :---: | :---- |

# **00  How to use this framework**

*A structured process without pretending the work is linear.*

This document is a reusable plan for taking a website from an early idea to a live, maintainable system. It can support a small marketing site, a content platform, a catalogue, an ecommerce build, or a more application-like service.

The framework is deliberately broad. Not every project needs every artifact, workshop, or approval. Use the smallest amount of process that creates clarity, reduces risk, and makes future ownership realistic.

| MRC WORKING PRINCIPLE Deliverables are evidence, not paperwork. Create an artifact when it helps the team understand a problem, make a decision, validate an assumption, coordinate work, or transfer ownership. |
| :---- |

## **What this document provides**

* Nine practical phases, each with a goal, questions, activities, deliverables, readiness checks, dependencies, and common risks.  
* Continuous workstreams for accessibility, content, SEO, performance, security, measurement, and operations.  
* A way to manage change without treating every new discovery as a project failure.  
* Reusable worksheets for project briefs, requirements, content planning, decisions, QA, launch, and maintenance.  
* A scaling model so a five-page site is not managed like a custom platform, and a complex platform is not managed like a brochure site.

## **Who can use it**

* Independent consultants: shape proposals, discovery calls, delivery plans, client approvals, and handoff.  
* Internal teams: align marketing, communications, IT, leadership, subject-matter experts, and operations.  
* Agencies and developers: reduce ambiguous handoffs and late-stage surprises with explicit readiness checks.  
* Clients and stakeholders: prepare decisions, content, access, feedback, and approvals before they block delivery.

# **01  Website work is connected systems work**

*A decision made “later” can force changes to work already completed.*

The phases in this document organize attention. They do not isolate responsibility. Strategy, content, design, technology, accessibility, measurement, and operations continuously affect one another.

## **The process is not a relay race**

A weak delivery model treats each discipline as a handoff: strategy finishes, then content begins, then design begins, then development begins, then testing begins. That sequence looks tidy, but it hides feedback until change is expensive.

A stronger model keeps a clear direction while allowing short feedback loops. Content begins before design, testing begins before launch readiness, accessibility is defined before components are built, and operational ownership is discussed before the site is deployed. W3C explicitly recommends integrating accessibility throughout production rather than treating it as a final sequential activity; agile service guidance similarly emphasizes learning, testing risky assumptions, and iterating through live operation. \[3\] \[5\] \[6\]

| PRACTICAL INTERPRETATION Use phases as risk-reduction lenses. At any point, new evidence can send the team back to an earlier decision. The goal is not to avoid change. The goal is to discover important change while it is still manageable. |
| :---- |

## **Continuous workstreams**

| Workstream | What travels through the full project |
| :---- | :---- |
| **Content** | User needs, messaging, page purpose, assets, migration, metadata, editorial workflow, and ownership. |
| **Accessibility** | Standards, inclusive research, readable content, interaction design, semantics, keyboard support, testing, and monitoring. |
| **SEO and discoverability** | Search intent, crawlable structure, URL planning, metadata, structured data, redirects, and post-launch indexing. |
| **Performance** | Budgets for images, fonts, scripts, third parties, rendering, hosting, and real-user experience. |
| **Security and privacy** | Data minimization, permissions, forms, authentication, integrations, secrets, consent, and incident readiness. |
| **Measurement** | Goals, events, consent-aware analytics, baselines, reporting, and decision rules. |
| **Operations and handoff** | Ownership, access, backups, updates, documentation, training, support, and retirement. |

## **Costly-to-reverse decisions deserve earlier attention**

| Decision type | Examples | Recommended approach |
| :---- | :---- | :---- |
| Costly to reverse | URL structure, CMS and content model, data architecture, authentication, payment platform, hosting model, privacy approach. | Research early. Test risky assumptions. Record the rationale and downstream effects. |
| Moderately reversible | Navigation labels, component behavior, search filters, page templates, analytics events. | Prototype and validate before scaling across the site. |
| Easy to reverse | Minor copy, spacing, icon choice, small visual refinements. | Decide quickly, test in context, and avoid blocking higher-value work. |

# **02  The website delivery map**

*Nine phases, seven continuous tracks, one operating system for decisions.*

| Phase | Focus | Generalized outcome |
| :---: | :---- | :---- |
| 1 | Strategy & Discovery | Why the site should exist, who it serves, and how success will be recognized. |
| 2 | Requirements & Scope | What must be delivered, what will not be delivered, and which assumptions need testing. |
| 3 | Information Architecture & Content Strategy | How information is organized, written, found, governed, and migrated. |
| 4 | UX/UI Design & Prototyping | How users move, understand, interact, and experience the brand across devices. |
| 5 | Technical Architecture & Build Planning | How the system will be implemented, integrated, deployed, secured, and operated. |
| 6 | Development & Content Integration | How components, templates, content, data, and integrations become a working site. |
| 7 | Testing & Launch Readiness | How quality, accessibility, security, performance, search, and operations are verified. |
| 8 | Deployment & Launch | How the site moves to production safely, with monitoring and rollback available. |
| 9 | Operations, Measurement & Improvement | How the live site remains accurate, secure, useful, measurable, and maintainable. |

## **A lightweight operating cadence**

1. Plan a short block of work around the highest-value outcome or riskiest unknown.  
2. Build or document something tangible enough to review: a brief, sitemap, prototype, component, migration test, or working slice.  
3. Show the work to the right people while decisions are still reversible.  
4. Record decisions, new risks, changed assumptions, and follow-up work in one source of truth.  
5. Update the backlog, scope, and timeline based on evidence rather than optimism.

| AGILE DOES NOT MEAN UNPLANNED Keep the goal, constraints, responsibilities, and quality standards clear. Be flexible about the path when new evidence shows that the original path is wrong. |
| :---- |

# **01  Strategy & Discovery**

*Define the problem before committing to the solution.*

| PHASE GOAL Build a shared understanding of the organization, users, current system, desired outcomes, constraints, and evidence. Discovery should make it possible to decide whether a website is the right response and what it must change. |
| :---- |

## **Questions this phase must answer**

* What is the primary problem or opportunity?  
* Who needs the website, what are they trying to accomplish, and what gets in their way today?  
* What business or organizational outcome should improve?  
* What evidence already exists: analytics, support requests, interviews, search data, sales feedback, or content performance?  
* What does the current site or process do well, and what must not be lost?  
* Who makes decisions, who contributes expertise, and who will own the site after launch?  
* What constraints are already real: budget, deadline, policy, procurement, technology, staffing, or legal obligations?

## **Recommended work**

* Kickoff and stakeholder interviews.  
* Current-state website, content, analytics, technology, and operational review.  
* User and audience research appropriate to the scale of the project.  
* Competitor and analogous-experience review focused on patterns, not imitation.  
* Baseline measurement and a first pass at risks, assumptions, and dependencies.  
* A proceed, pause, reframe, or stop decision.

## **Core deliverables**

\[ \] Project brief and problem statement.

\[ \] Primary audiences and evidence-based user needs.

\[ \] Business goals, user outcomes, and initial success measures.

\[ \] Current-state findings and baseline metrics.

\[ \] Stakeholder, owner, and decision-authority map.

\[ \] Initial risk, assumption, and dependency log.

## **Readiness check**

*Move forward when the team knows enough to make the next decisions responsibly. “Ready” does not mean every detail is frozen.*

\[ \] The team can state the website’s primary job in one sentence.

\[ \] The primary user groups and their top needs are understood well enough to guide scope.

\[ \] Success can be measured with more than traffic alone.

\[ \] A decision owner and future operational owner are identified.

\[ \] Known constraints and major unknowns are visible.

| INTERSECTION NOTE Strategy shapes every later phase. A change in audience, goal, or operating model can alter content, navigation, design, technology, analytics, and maintenance. Treat discovery findings as shared project inputs, not as a report that disappears after kickoff. |
| :---- |

## **Common failure modes**

* Starting with a preferred platform, visual style, or feature list before the problem is understood.  
* Using unsupported personas or demographic stereotypes instead of evidence-based needs.  
* Defining success as “launch,” “more traffic,” or “a modern look” without a useful outcome.  
* Copying competitors instead of identifying unmet needs and relevant patterns.  
* Assuming the project must continue even when discovery shows the value is weak.

*Research basis: Webflow emphasizes goals and scope before design; ONS and GOV.UK guidance centers user needs and evidence. \[1\] \[5\] \[12\]*

# **02  Requirements & Scope**

*Translate the strategy into boundaries, priorities, and testable expectations.*

| PHASE GOAL Define what the website must do, how well it must do it, what the first release includes, and which uncertainties should be tested before the team commits to a full build. |
| :---- |

## **Questions this phase must answer**

* Which user tasks and organizational capabilities are essential for the first release?  
* What content types, workflows, forms, transactions, search, accounts, commerce, or integrations are required?  
* What are the non-functional expectations for accessibility, performance, security, privacy, reliability, SEO, and maintainability?  
* What content or data must be migrated, archived, redirected, or retired?  
* Which requirements are mandatory, negotiable, or explicitly deferred?  
* Which assumptions could make the proposed solution unworkable or disproportionately expensive?  
* How will scope changes be evaluated and approved?

## **Recommended work**

* Write functional requirements, non-functional requirements, user stories, and acceptance criteria at the appropriate level of detail.  
* Prioritize work into must, should, could, and later categories—or an equivalent value/risk model.  
* Identify technical, content, policy, integration, and operational dependencies.  
* Run small technical or content spikes against the riskiest assumptions.  
* Estimate effort ranges and sequence work around dependencies.  
* Define exclusions, client responsibilities, review rounds, and approval points.

## **Core deliverables**

\[ \] Scope statement with inclusions and exclusions.

\[ \] Prioritized requirement backlog.

\[ \] User stories or use cases with acceptance criteria for critical journeys.

\[ \] Non-functional requirement set.

\[ \] Updated risk, assumption, and dependency log.

\[ \] High-level schedule, budget model, milestones, and change protocol.

## **Readiness check**

*Move forward when the team knows enough to make the next decisions responsibly. “Ready” does not mean every detail is frozen.*

\[ \] The first useful release is defined and can be explained without listing every future idea.

\[ \] Critical requirements trace back to user or organizational needs.

\[ \] Major dependencies have owners and target dates.

\[ \] High-risk unknowns have been tested, scheduled for testing, or explicitly accepted.

\[ \] The consequences of changing scope, time, cost, or quality are understood.

| INTERSECTION NOTE Requirements are not “finished” before architecture and design. A wireframe can reveal a missing content requirement; a CMS review can expose an editorial workflow; an integration spike can force a scope change. Keep traceability from user need to requirement to implementation and test. |
| :---- |

## **Common failure modes**

* Treating stakeholder requests as requirements without examining the underlying need.  
* Estimating development while content, migration, approvals, and integrations remain undefined.  
* Writing a feature list with no acceptance criteria or priority.  
* Calling every requirement mandatory.  
* Freezing scope without a process for handling legitimate new evidence.

*Research basis: GOV.UK agile guidance recommends testing risky assumptions before production-scale build; Webflow emphasizes explicit scope. \[1\] \[5\] \[6\]*

# **03  Information Architecture & Content Strategy**

*Plan the information before polishing the interface.*

| PHASE GOAL Create a structure that helps users find, understand, and act on content while giving editors a sustainable model for creating, updating, governing, migrating, and retiring it. |
| :---- |

## **Questions this phase must answer**

* What information and actions do users expect, and in what order?  
* Which pages, content types, collections, taxonomies, and relationships are needed?  
* How should navigation and labels reflect user language rather than internal departments?  
* What is the job, key message, evidence, and next action for each page?  
* Who creates, approves, updates, and retires each type of content?  
* How will URLs, metadata, internal linking, search intent, and redirects be handled?  
* What existing content should be retained, rewritten, merged, migrated, archived, or removed?

## **Recommended work**

* Inventory and audit existing pages, assets, downloads, data, and content performance.  
* Group content through user research, card sorting, task analysis, or practical editorial workshops.  
* Draft the sitemap, navigation model, page hierarchy, URL conventions, and redirect approach.  
* Define content types, fields, metadata, relationships, states, and editorial workflows.  
* Create page briefs using real user needs, messages, evidence, calls to action, and search intent.  
* Start writing and sourcing content early enough to influence wireframes and component needs.

## **Core deliverables**

\[ \] Approved sitemap and navigation model.

\[ \] Content inventory, audit, and migration disposition.

\[ \] Page/content matrix with purpose, audience, owner, status, and CTA.

\[ \] Page briefs or content outlines for priority templates.

\[ \] Content model, taxonomy, metadata, and editorial workflow.

\[ \] URL convention, SEO topic map, and redirect map for redesigns.

## **Readiness check**

*Move forward when the team knows enough to make the next decisions responsibly. “Ready” does not mean every detail is frozen.*

\[ \] Every planned page or content type has a reason to exist and an owner.

\[ \] Priority user journeys can be completed through the proposed structure.

\[ \] The content model can support the current plan without creating avoidable duplication.

\[ \] Real content is available—or actively being produced—for key design work.

\[ \] Migration and redirect responsibilities are visible.

| INTERSECTION NOTE Information architecture drives design templates, CMS fields, APIs, search, analytics, SEO, and future maintenance. A late change to the sitemap can mean new components, data migration, redirects, navigation, and test cases. Content is therefore both an input to design and a product of the build. |
| :---- |

## **Common failure modes**

* Designing around placeholder text and discovering later that real content does not fit.  
* Mirroring the organization chart instead of the user’s mental model.  
* Creating separate pages for every internal request without addressing duplication or ownership.  
* Choosing navigation labels for cleverness rather than comprehension.  
* Migrating everything because deletion or consolidation feels politically difficult.

*Research basis: Webflow and Elementor both place sitemaps, wireframes, and content planning before visual polish; ONS guidance emphasizes explicit user needs. \[1\] \[2\] \[12\]*

# **04  UX/UI Design & Prototyping**

*Test hierarchy, interaction, and brand expression before scaling the build.*

| PHASE GOAL Turn user needs, requirements, and real content into usable flows, responsive page systems, accessible interaction patterns, and a visual language that can be implemented consistently. |
| :---- |

## **Questions this phase must answer**

* What are the critical user journeys and decision points?  
* What information must be visible first, and what can be progressively disclosed?  
* Which components and patterns repeat across pages?  
* How should interactions behave across keyboard, touch, pointer, zoom, and assistive technology?  
* What happens during loading, empty, error, success, unavailable, or permission-limited states?  
* How will the experience adapt across screen sizes and content extremes?  
* Does the brand system support readability, contrast, consistency, and performance?

## **Recommended work**

* Map user flows and task paths for critical journeys.  
* Create low-fidelity wireframes that focus on hierarchy, content, and function.  
* Prototype uncertain or high-risk interactions before committing to production code.  
* Test prototypes with representative users and stakeholders.  
* Develop visual direction, design tokens, responsive rules, and reusable components.  
* Document interaction behavior, validation, states, motion, and accessible alternatives.  
* Review feasibility with development before the design system scales.

## **Core deliverables**

\[ \] Critical user flows and wireframes.

\[ \] Interactive prototype for uncertain or important journeys.

\[ \] Visual direction and approved key templates.

\[ \] Design tokens, component inventory, and responsive behavior.

\[ \] Interaction notes, content requirements, and state definitions.

\[ \] Accessibility and usability findings with design revisions.

## **Readiness check**

*Move forward when the team knows enough to make the next decisions responsibly. “Ready” does not mean every detail is frozen.*

\[ \] Critical journeys can be understood and tested without explanation from the designer.

\[ \] Designs use representative content, long labels, errors, and edge cases—not only ideal examples.

\[ \] Desktop, mobile, keyboard, focus, zoom, and reduced-motion behavior are considered.

\[ \] Components have clear purpose, variants, and ownership.

\[ \] Development has validated technical feasibility for risky patterns.

| INTERSECTION NOTE Design often exposes problems upstream. A confusing prototype may indicate weak content or architecture, not a colour problem. A technically expensive interaction may require a simpler experience. A performance budget can change imagery and animation. Keep the design review connected to content, technology, accessibility, and operations. |
| :---- |

## **Common failure modes**

* Designing a polished homepage before the information structure and page system are understood.  
* Approving only one desktop viewport and leaving responsive behavior to interpretation.  
* Using custom controls where native, semantic patterns would be clearer and more robust.  
* Treating accessibility as a colour-contrast check instead of an interaction requirement.  
* Ignoring error, empty, loading, long-content, and no-JavaScript states.

*Research basis: W3C recommends integrating accessibility and involving users throughout; WCAG 2.2 provides testable requirements. Progressive enhancement supports robust core experiences. \[3\] \[4\] \[7\]*

# **05  Technical Architecture & Build Planning**

*Choose a system that supports the content, users, team, constraints, and future ownership.*

| PHASE GOAL Define the technical model, environments, data flows, integrations, security controls, performance expectations, deployment workflow, and operating responsibilities before implementation becomes difficult to change. |
| :---- |

## **Questions this phase must answer**

* What delivery model fits the project: static, CMS-driven, headless, server-rendered, ecommerce, application, or hybrid?  
* Who will edit content, how often, and with what technical confidence?  
* What data is stored, transmitted, generated, synchronized, or collected?  
* Which integrations are critical, and what happens when they fail?  
* How will development, staging, production, secrets, backups, deployments, monitoring, and rollback work?  
* What are the target performance budgets, browser/device support, accessibility level, and security verification needs?  
* What costs, vendor dependencies, licences, and support obligations will continue after launch?

## **Recommended work**

* Compare viable platforms and hosting models against documented needs and constraints.  
* Define the content schema, data model, API contracts, integration boundaries, and failure behavior.  
* Create architecture decision records for consequential choices.  
* Set up repository, environments, CI/CD, configuration, secrets management, and access controls.  
* Establish performance budgets, security requirements, browser support, and test strategy.  
* Prototype or spike critical integrations, migration paths, search, authentication, or rendering assumptions.  
* Plan backup, recovery, monitoring, documentation, training, and handoff.

## **Core deliverables**

\[ \] Technical architecture and system/context diagram.

\[ \] Platform, hosting, and integration decision records.

\[ \] Content schema or CMS model mapped to the content strategy.

\[ \] Environment, deployment, backup, monitoring, and rollback plan.

\[ \] Security, privacy, accessibility, SEO, and performance requirements.

\[ \] Implementation backlog, sequence, dependencies, and test approach.

## **Readiness check**

*Move forward when the team knows enough to make the next decisions responsibly. “Ready” does not mean every detail is frozen.*

\[ \] The architecture supports the content model and editor workflow—not only the public interface.

\[ \] Critical integrations and data flows are understood and technically feasible.

\[ \] Sensitive data, secrets, permissions, and third-party risks have owners and controls.

\[ \] The deployment can be repeated, monitored, and reversed.

\[ \] Ongoing cost and operational responsibility are acceptable to the future owner.

| INTERSECTION NOTE Technology is a cross-project constraint. A CMS decision affects content fields, previews, URLs, migration, training, permissions, and maintenance. Third-party scripts affect privacy and performance. Hosting affects deployment, backups, reliability, and cost. Make technical trade-offs visible to non-technical decision-makers. |
| :---- |

## **Common failure modes**

* Choosing a platform because it is familiar, fashionable, or already paid for rather than because it fits the requirements.  
* Overengineering a small site or forcing a complex service into a simple page-building model.  
* Treating staging, backups, monitoring, and rollback as post-launch concerns.  
* Adding third-party scripts without an owner, purpose, privacy review, or performance budget.  
* Designing a public experience while neglecting the editor and administrator experience.

*Research basis: Google recommends secure, fast, accessible, device-ready implementations; web.dev supports explicit performance budgets; OWASP ASVS provides security requirements. \[8\] \[10\] \[11\]*

# **06  Development & Content Integration**

*Build the system in reviewable slices, using real content and continuous verification.*

| PHASE GOAL Implement reusable components, templates, data structures, integrations, content, and deployment workflows while preserving fast feedback across design, content, accessibility, quality, and stakeholder review. |
| :---- |

## **Questions this phase must answer**

* What vertical slice will prove the most value or remove the most risk first?  
* Which foundations must be stable before the team can scale pages and components?  
* How will design decisions map to reusable code and CMS structures?  
* When and how will real content, assets, redirects, and metadata enter the system?  
* Which automated checks can prevent regression during the build?  
* How will stakeholders review working increments without derailing the backlog?  
* What documentation must be written while implementation knowledge is fresh?

## **Recommended work**

* Build the base layout, design tokens, semantic structure, component primitives, and development standards.  
* Implement one representative end-to-end slice before producing every page.  
* Develop templates, components, CMS fields, data adapters, search, forms, and integrations in priority order.  
* Integrate real content continuously; migrate and validate in manageable batches.  
* Use progressive enhancement so core content and tasks remain robust when advanced features fail or are unavailable.  
* Run automated linting, builds, tests, accessibility checks, link checks, and performance checks where practical.  
* Hold regular demonstrations, consolidate feedback, and update the decision log and backlog.

## **Core deliverables**

\[ \] Working site increments in a controlled staging environment.

\[ \] Reusable component and template implementation.

\[ \] CMS/data configuration and integrated content.

\[ \] Repository, build pipeline, deployment configuration, and automated checks.

\[ \] Migration log, redirect implementation, and content issue log.

\[ \] Technical, editorial, and operational documentation in progress.

## **Readiness check**

*Move forward when the team knows enough to make the next decisions responsibly. “Ready” does not mean every detail is frozen.*

\[ \] Critical journeys work end to end in staging.

\[ \] The component system can support remaining pages without one-off duplication.

\[ \] Priority content is integrated and representative of real production conditions.

\[ \] No unresolved issue prevents formal QA from producing reliable results.

\[ \] The build can be deployed repeatably by more than one person or through documented automation.

| INTERSECTION NOTE Development will reveal missing content, impossible assumptions, weak requirements, and design edge cases. Treat these findings as normal system feedback. Fix the source decision when necessary rather than patching every symptom in code. |
| :---- |

## **Common failure modes**

* Building page by page without reusable components or content models.  
* Waiting until the end to integrate real content, forms, data, or third-party services.  
* Presenting stakeholders with a single large reveal after weeks of hidden work.  
* Treating automated tests as optional polish instead of fast feedback.  
* Allowing staging and production configuration to drift.

*Research basis: GOV.UK recommends robust, progressively enhanced frontends; agile guidance supports incremental delivery and feedback. \[5\] \[7\]*

# **07  Testing & Launch Readiness**

*Verify that the website works, can be operated, and is safe to release.*

| PHASE GOAL Evaluate the complete site against requirements and real-world conditions. Resolve blockers, document accepted limitations, confirm operational readiness, and prepare a controlled launch and rollback plan. |
| :---- |

## **Questions this phase must answer**

* What counts as a launch blocker, a high-priority defect, or an accepted known issue?  
* Which browsers, devices, inputs, assistive technologies, networks, roles, and content states must be tested?  
* Do forms, transactions, notifications, integrations, analytics, consent, and error handling work end to end?  
* Can search engines crawl and understand the intended pages without exposing staging or private content?  
* Are performance budgets met under realistic content and network conditions?  
* Can the team restore a backup, roll back a release, and respond to an incident?  
* Has the future owner accepted the site, documentation, access, and maintenance responsibilities?

## **Recommended work**

* Execute functional, content, responsive, browser, device, and user-acceptance testing.  
* Combine automated accessibility checks with keyboard, screen-reader, zoom, focus, content, and interaction review.  
* Test performance with lab tools and establish a baseline for field monitoring.  
* Validate crawl controls, metadata, structured data, canonical URLs, sitemaps, redirects, and error pages.  
* Review security controls, permissions, secrets, data handling, privacy notices, consent, and third-party scripts.  
* Verify analytics events, filters, dashboards, and privacy-aware measurement.  
* Run backup/restore, deployment, rollback, and launch-day rehearsals where the risk warrants them.

## **Core deliverables**

\[ \] QA plan and traceable test matrix.

\[ \] Defect log with severity, owner, disposition, and retest status.

\[ \] Accessibility findings and remediation record.

\[ \] Performance, SEO, security/privacy, analytics, and content readiness reports.

\[ \] User-acceptance sign-off and accepted-known-issues list.

\[ \] Final launch runbook, rollback plan, communication plan, and support contacts.

## **Readiness check**

*Move forward when the team knows enough to make the next decisions responsibly. “Ready” does not mean every detail is frozen.*

\[ \] Launch blockers are resolved and high-risk known issues are explicitly accepted by an accountable owner.

\[ \] Critical tasks work across the agreed support matrix and with keyboard/assistive technology.

\[ \] Forms, notifications, analytics, consent, redirects, and integrations have been tested in production-like conditions.

\[ \] Backups, access, monitoring, documentation, and support coverage are in place.

\[ \] The team can explain exactly how to launch, validate, roll back, and communicate.

| INTERSECTION NOTE QA is not a separate team’s last task. Every issue has an upstream cause: content, design, code, architecture, configuration, data, or process. A serious finding may require returning to an earlier phase. Protect the quality threshold even when the launch date is emotionally important. |
| :---- |

## **Common failure modes**

* Testing only the happy path, desktop Chrome, or the development team’s devices.  
* Relying on automated accessibility tools as proof of accessibility.  
* Measuring performance before real content and third-party scripts are present.  
* Treating security, privacy, SEO, analytics, and email delivery as launch-day configuration.  
* Letting the deadline redefine critical defects as acceptable without an accountable decision.

*Research basis: WCAG 2.2 supplies testable accessibility criteria; OWASP provides security verification and testing guidance; Google recommends thorough pre-migration testing. \[4\] \[9\] \[11\]*

# **08  Deployment & Launch**

*Move the website to production as a controlled operational change.*

| PHASE GOAL Deploy or migrate the site with backups, monitoring, redirects, communications, smoke tests, and rollback available. Launch should establish a stable live baseline—not create an unowned emergency. |
| :---- |

## **Questions this phase must answer**

* Who leads the launch, who approves go/no-go, and who responds if validation fails?  
* What content, database, DNS, certificate, email, integration, or configuration changes happen during the launch window?  
* What must be frozen, backed up, exported, or synchronized immediately before cutover?  
* How will the old site remain available or be retired safely?  
* Which smoke tests must pass on the live domain?  
* How long will the team monitor intensively, and what thresholds trigger rollback?  
* When will stakeholders, users, support teams, and search engines be notified?

## **Recommended work**

* Confirm approvals, backups, credentials, support coverage, DNS settings, certificates, and communication channels.  
* Deploy or migrate through the documented workflow.  
* Apply and validate redirects, crawl directives, canonical URLs, sitemaps, integrations, and email delivery.  
* Run live smoke tests across critical journeys, devices, analytics, forms, transactions, and monitoring.  
* Record issues and decisions in real time; roll back when the agreed threshold is met.  
* Submit or verify search-engine discovery tools and monitor crawl/indexing behavior for migrations.  
* Maintain a stabilization window before closing the project or decommissioning the old system.

## **Core deliverables**

\[ \] Live production site and deployment record.

\[ \] Validated redirect and URL migration results.

\[ \] Live smoke-test results and launch issue log.

\[ \] Monitoring, uptime, error, performance, and analytics confirmation.

\[ \] Search Console/sitemap verification where relevant.

\[ \] Credential, ownership, documentation, training, and support handoff.

## **Readiness check**

*Move forward when the team knows enough to make the next decisions responsibly. “Ready” does not mean every detail is frozen.*

\[ \] Critical journeys pass on the public production environment.

\[ \] Monitoring shows stable availability, errors, and performance through the agreed stabilization period.

\[ \] Analytics and forms are receiving the expected signals.

\[ \] Search and redirect behavior is being monitored where URLs or hosting changed.

\[ \] The operational owner has access, documentation, support contacts, and authority.

| INTERSECTION NOTE Launch can reveal environment-specific problems that staging did not reproduce. Keep development, content, infrastructure, analytics, and decision owners available together. Do not shut down the previous system until the new one is demonstrably serving users and crawlers as expected. |
| :---- |

## **Common failure modes**

* Launching without a restorable backup or tested rollback path.  
* Forgetting development noindex, robots, basic-auth, environment variables, or test payment/email settings.  
* Changing DNS, hosting, URLs, content, and analytics simultaneously without a controlled sequence.  
* Decommissioning the previous site before traffic, integrations, and redirects stabilize.  
* Treating the launch announcement as more important than live validation.

*Research basis: Google’s site-move guidance recommends copying and testing the new site, changing DNS, monitoring traffic, and retiring old infrastructure only after confidence is established. \[9\]*

# **09  Operations, Measurement & Improvement**

*Keep the website useful after the project team leaves.*

| PHASE GOAL Operate the site as a maintained service: secure it, keep content accurate, monitor accessibility and performance, measure outcomes, learn from users, and prioritize improvements based on evidence. |
| :---- |

## **Questions this phase must answer**

* Who owns content, technology, analytics, accessibility, security, vendors, budgets, and incidents?  
* What must be monitored daily, weekly, monthly, quarterly, or annually?  
* How are updates, backups, restore tests, licences, renewals, and third-party changes handled?  
* Which KPIs indicate usefulness, and what action follows when they move?  
* How will support requests, search data, analytics, feedback, and user research enter the backlog?  
* What content has review dates, expiry rules, or legal accuracy obligations?  
* How will the team decide between maintenance, optimization, new features, redesign, and retirement?

## **Recommended work**

* Set up routine monitoring, backups, software and dependency updates, security review, and incident response.  
* Review content accuracy, ownership, broken links, accessibility, performance, search visibility, and analytics quality on a schedule.  
* Compare actual outcomes with the baseline and goals defined in discovery.  
* Gather qualitative feedback and observe users when analytics cannot explain behavior.  
* Maintain a prioritized backlog with value, risk, effort, and dependency information.  
* Run regular improvement cycles and document changes that affect users, content, integrations, or operations.  
* Train new owners and update documentation as the system changes.

## **Core deliverables**

\[ \] Maintenance and support plan or service agreement.

\[ \] Ownership and escalation map.

\[ \] Monitoring dashboard and reporting cadence.

\[ \] Content review calendar and editorial governance.

\[ \] Accessibility, performance, security, and SEO review schedule.

\[ \] Prioritized improvement backlog and roadmap.

\[ \] Operational runbook, training materials, and retirement criteria.

## **Readiness check**

*Move forward when the team knows enough to make the next decisions responsibly. “Ready” does not mean every detail is frozen.*

\[ \] Each recurring task has an owner, cadence, evidence, and escalation path.

\[ \] Metrics connect to decisions rather than existing only in a dashboard.

\[ \] The site can be updated, restored, and operated without relying on undocumented personal knowledge.

\[ \] New content and features pass the same accessibility and quality expectations as the launch build.

\[ \] The organization has a realistic budget and backlog for continued improvement.

| INTERSECTION NOTE The live phase feeds the next discovery cycle. Search data can reshape content; support requests can reveal weak journeys; performance regressions can change third-party choices; new legislation or organizational strategy can change requirements. A website remains healthy when learning has a route back into decisions. |
| :---- |

## **Common failure modes**

* Assuming hosting uptime is the same as maintenance.  
* Collecting analytics without deciding what will change in response.  
* Allowing content, plugins, dependencies, integrations, or ownership records to drift.  
* Depending on one person’s memory for credentials, deployment, or recovery.  
* Funding launch but not the work required to keep the site accurate, accessible, secure, and useful.

*Research basis: W3C accessibility guidance includes an ongoing sustain phase; GOV.UK treats live service as a period of continued support and iteration. \[3\] \[5\]*

# **10  Decision impact and change management**

*Make change visible before it becomes hidden rework.*

A sooner-or-later decision should never be evaluated only where it first appears. Use a change-impact review to identify which disciplines, deliverables, tests, owners, costs, and dates are affected.

| Change | Likely downstream effects |
| :---- | :---- |
| **Primary audience or user need** | Strategy, content, sitemap, journeys, accessibility research, design language, functionality, measurement. |
| **URL or navigation structure** | Content, IA, templates, internal links, redirects, analytics, SEO, migration, support materials. |
| **CMS or content model** | Editor workflow, fields, templates, APIs, migration, permissions, previews, training, maintenance cost. |
| **Form or data collection** | UX, validation, privacy notice, consent, security, CRM/email integration, analytics, retention, support. |
| **Brand or imagery direction** | Design system, content production, CMS media fields, responsive behavior, performance, accessibility, SEO. |
| **Third-party integration** | Scope, architecture, privacy, security, performance, failure states, monitoring, vendor cost, operational ownership. |
| **Accessibility target** | Procurement, research, content, design tokens, interaction patterns, code standards, QA, documentation, training. |
| **Performance budget** | Fonts, images, video, animation, JavaScript, third parties, rendering, hosting, testing, editorial guardrails. |
| **Multilingual requirement** | Research, content model, URL strategy, layout expansion, search, SEO, translation workflow, QA, governance. |
| **Launch date** | Scope, review windows, content readiness, QA coverage, migration, support, risk acceptance—not only development speed. |

## **Change-impact questions**

\[ \] What new evidence or constraint caused the proposed change?

\[ \] Which user need, business goal, or risk does the change address?

\[ \] Which approved decisions, deliverables, components, content, integrations, tests, and documentation are affected?

\[ \] Is the change reversible? What happens if it is delayed?

\[ \] What is the effort range, schedule effect, cost effect, and quality effect?

\[ \] Who is accountable for accepting the trade-off?

\[ \] What will be removed, deferred, or re-planned to make room?

| DECISION DISCIPLINE Do not hide a strategic change inside a design comment, a content edit, or a development ticket. Name the decision, record the rationale, assess its effects, and update the source artifacts. |
| :---- |

## **Change-impact record**

| Field | Working response |
| :---- | :---- |
| Proposed change |  |
| New evidence / reason |  |
| User or business outcome affected |  |
| Affected decisions and deliverables |  |
| Content, design, technical, QA, operational effects |  |
| Effort / cost / timeline effect |  |
| Trade-off or work to remove |  |
| Decision owner and date |  |

# **11  Scale the process to the project**

*Keep the controls that reduce risk; remove ceremony that does not.*

A five-page services site and a transactional platform should not generate the same paperwork. The framework scales by changing the depth of evidence, number of participants, formality of approval, and breadth of testing—not by skipping the thinking entirely.

| Area | Lean site | Standard CMS site | Complex service / commerce |
| :---- | :---- | :---- | :---- |
| Project brief | One-page brief | Brief plus research summary | Formal brief, governance, baseline, and business case |
| Research | Stakeholder input and available evidence | Audience interviews, analytics, competitor/analog review | Multi-method user research, service context, policy and operational analysis |
| Requirements | Prioritized capability list | Stories/acceptance criteria for key journeys | Traceable functional/non-functional requirements and formal risk controls |
| Architecture and content | Simple sitemap and page matrix | Content model, briefs, URL/redirect plan | Complex taxonomy, migration program, workflows, permissions, search and localization |
| Design | Wireframes for key templates; lightweight style system | Responsive prototype and component library | Research-tested journeys, comprehensive states, design-system governance |
| Technical planning | Platform and hosting note | Architecture, environments, integrations, performance/security requirements | ADRs, threat model, data architecture, resiliency, procurement and operational design |
| QA | Launch checklist and real-device review | Traceable test plan, accessibility/performance/SEO evidence | Formal UAT, security verification, assistive-tech testing, migration rehearsal and recovery testing |
| Operations | Owner, backups, updates, content review | Runbook, monitoring, maintenance cadence and training | SLA, incident management, governance, audit schedule, roadmap and retirement plan |

## **Questions that determine process depth**

* How many distinct users, journeys, page types, languages, contributors, and approvers are involved?  
* Does the site collect personal, financial, health, account, or other sensitive data?  
* How costly is downtime, error, lost search equity, inaccessible access, or incorrect content?  
* How much content or data must be migrated and normalized?  
* How many third-party systems, vendors, APIs, and operational teams are involved?  
* How regulated, public, permanent, or mission-critical is the service?  
* How easily can the site be changed after launch, and who will be able to change it?

## **Minimum non-negotiables at every scale**

* A named goal, primary audience, decision owner, and operational owner.  
* A sitemap or explicit page list with a purpose and owner for each item.  
* Real content early enough to shape the design and verify the build.  
* Responsive, accessible, secure, and privacy-aware implementation expectations.  
* Testing of critical tasks, forms, links, devices, and production configuration.  
* A backup, rollback or recovery path appropriate to the risk.  
* Documentation and handoff that let the next owner make a safe change.

## **Process-tailoring profile**

| Factor | Project assessment |
| :---- | :---- |
| Project type and primary outcome |  |
| Audience and journey complexity |  |
| Content and migration volume |  |
| Data, integrations, and transaction risk |  |
| Accessibility, privacy, security, and regulatory impact |  |
| Stakeholder and approval complexity |  |
| Operational capacity after launch |  |
| Recommended process depth and omitted artifacts |  |

# **12  Reusable project templates**

*Adapt the fields. Keep the logic.*

The following worksheets can be copied into a proposal, project hub, spreadsheet, issue tracker, or client workbook. They are deliberately tool-agnostic.

## **Template A — Project brief**

| Field | Working response |
| :---- | :---- |
| Project name |  |
| Decision owner |  |
| Operational owner after launch |  |
| Problem or opportunity |  |
| Primary website goal |  |
| Primary users and top needs |  |
| Desired user actions |  |
| Success measures and baseline |  |
| In-scope capabilities |  |
| Out of scope / deferred |  |
| Known constraints |  |
| Major assumptions and risks |  |
| Target launch / key dates |  |
| Budget or resource model |  |
| Approval and feedback process |  |

## **Template B — Requirement and priority register**

| ID | Need / requirement | Type | Priority | Acceptance evidence | Owner / status |
| :---: | :---- | :---: | :---: | :---- | :---- |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

*Suggested types: user, content, functional, integration, accessibility, performance, security, privacy, SEO, analytics, migration, operations.*

## **Template C — Decision register**

| Date | Decision | Why | Affected areas | Owner | Review trigger |
| :---: | :---- | :---- | :---- | :---: | :---- |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

## **Template D — Page and content matrix**

| Page / type | User \+ job | Key message / evidence | CTA | Owner | Status |
| :---- | :---- | :---- | :---- | :---: | :---: |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

*Add columns for target topic/keyword, URL, template, content source, redirect, review date, legal approval, or migration status when they are relevant.*

## **Template E — Component and state inventory**

| Component | Purpose | Variants / states | Content fields | Accessibility notes | Build status |
| :---- | :---- | :---- | :---- | :---- | :---: |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

## **Template F — QA and launch-readiness matrix**

| Area | Test / acceptance check | Environment | Owner | Result | Issue / evidence |
| :---- | :---- | :---: | :---: | :---: | :---- |
| Functional |  |  |  |  |  |
| Content |  |  |  |  |  |
| Responsive / browser |  |  |  |  |  |
| Accessibility |  |  |  |  |  |
| Performance |  |  |  |  |  |
| SEO / crawl |  |  |  |  |  |
| Security / privacy |  |  |  |  |  |
| Analytics / consent |  |  |  |  |  |
| Integrations / email |  |  |  |  |  |
| Backup / rollback |  |  |  |  |  |
| Operations / handoff |  |  |  |  |  |

## **Template G — Launch control sheet**

| When | Action | Owner | Dependency / evidence | Status |
| :---: | :---- | :---: | :---- | :---: |
| Before launch | Confirm approvals, freeze window, backups, credentials, monitoring, support coverage, and communications. |  |  |  |
| Before launch | Verify production configuration, DNS/TTL, TLS, email, environment variables, crawl settings, and redirect file. |  |  |  |
| Cutover | Deploy or migrate through the documented process. |  |  |  |
| Cutover | Run critical live smoke tests and analytics/form/email checks. |  |  |  |
| Cutover | Decide continue or rollback using the agreed threshold. |  |  |  |
| After launch | Monitor errors, uptime, performance, traffic, indexing, integrations, and support channels. |  |  |  |
| After launch | Close or assign launch issues; update documentation and handoff. |  |  |  |

## **Template H — Operations and improvement plan**

| Responsibility | Owner | Cadence / trigger | Tool / evidence | Escalation / next action |
| :---- | :---: | :---- | :---- | :---- |
| Uptime and error monitoring |  |  |  |  |
| Backups and restore testing |  |  |  |  |
| Platform, plugin, dependency, and security updates |  |  |  |  |
| Content accuracy and expiry review |  |  |  |  |
| Accessibility review |  |  |  |  |
| Performance and Core Web Vitals review |  |  |  |  |
| SEO, indexing, redirects, and broken links |  |  |  |  |
| Analytics quality and KPI review |  |  |  |  |
| Vendor, licence, domain, and certificate renewal |  |  |  |  |
| Improvement backlog and roadmap review |  |  |  |  |
| Documentation and training updates |  |  |  |  |
| Incident response and communications |  |  |  |  |
| **A USABLE HANDOFF** The project is not truly handed off when files and passwords change hands. It is handed off when the next owner can understand the system, make a safe change, recognize a problem, restore service, and know when to ask for help. |  |  |  |  |

# **13  Research foundation**

*Common industry process patterns, strengthened with lifecycle and technical guidance.*

This framework synthesizes common website-process guidance with standards and operational practices. Popular process articles consistently organize work around goals, scope, structure/content, design, development, testing, launch, and iteration. The formal lifecycle sources strengthen that sequence by treating accessibility, user research, performance, security, migration, and live operation as responsibilities that begin before launch and continue afterward.

## **Popular process and content guidance**

| Ref. | Source | Contribution to this framework | URL |
| :---: | :---- | :---- | :---- |
| \[1\] | Webflow — The modern web design process | Goals, scope, sitemaps/wireframes, content-first design, visual design, testing, launch, and continued iteration. | https://webflow.com/resources/ebooks/the-modern-web-design-process |
| \[2\] | Elementor — How to Design a Website: An 8-Step Guide | Purpose/goals, structure/content, platform, brand, layout, functionality, optimization, launch/testing/iteration. | https://elementor.com/blog/how-to-design-a-website-guide/ |
| \[12\] | ONS Service Manual — Understanding your users: Identifying user needs | Evidence-based user needs, clear content, scannability, analytics, testing, and user feedback. | https://service-manual.ons.gov.uk/content/writing-for-users/user-needs |

## **How the sources were synthesized**

* The familiar plan-design-build-test-launch sequence remains useful as a communication map.  
* Content, accessibility, SEO, performance, security, measurement, and operations are treated as continuous workstreams rather than final checks.  
* Formal phase gates are replaced with readiness checks: move forward when the next decision can be made responsibly.  
* Agile practice is expressed through risk-first prototypes, reviewable increments, consolidated feedback, and explicit decision records.  
* Launch is treated as a controlled transition into live operation, not the end of the website lifecycle.

## **Standards and technical lifecycle guidance**

| Ref. | Source | Contribution to this framework | URL |
| :---: | :---- | :---- | :---- |
| \[3\] | W3C WAI — Planning and Managing Web Accessibility | Accessibility as an initiate-plan-implement-sustain responsibility that is integrated and repeated over time. | https://www.w3.org/WAI/planning-and-managing/ |
| \[4\] | W3C — Web Content Accessibility Guidelines (WCAG) 2.2 | Current testable accessibility requirements and conformance framework. | https://www.w3.org/TR/WCAG22/ |
| \[5\] | GOV.UK Service Manual — Agile delivery | Discovery, alpha, beta, live, prioritization, roadmaps, measurement, governance, and continuous improvement. | https://www.gov.uk/service-manual/agile-delivery |
| \[6\] | GOV.UK Service Manual — How the alpha phase works | Testing the riskiest assumptions with work that is only complex enough to learn from. | https://www.gov.uk/service-manual/agile-delivery/how-the-alpha-phase-works |
| \[7\] | GOV.UK Service Manual — Building a robust frontend using progressive enhancement | Start with robust HTML and add CSS/JavaScript enhancements without making core access fragile. | https://www.gov.uk/service-manual/technology/using-progressive-enhancement |
| \[8\] | Google Search Central — SEO Guide for Web Developers | Secure, fast, accessible, device-ready implementation and crawl/index visibility. | https://developers.google.com/search/docs/fundamentals/get-started-developers |
| \[9\] | Google Search Central — Changing your web hosting and SEO | Prepare and test infrastructure, cut over, monitor traffic, and retire old infrastructure only after confidence. | https://developers.google.com/search/docs/crawling-indexing/site-move-no-url-changes |
| \[10\] | web.dev — Use Lighthouse for performance budgets | Explicit limits for page resources and metrics; combine lab evidence with real-user data. | https://web.dev/articles/use-lighthouse-for-performance-budgets |
| \[11\] | OWASP — Application Security Verification Standard | A structured basis for secure-development requirements and web-application security verification. | https://owasp.org/www-project-application-security-verification-standard/ |

*Sources reviewed August 6, 2026\. Standards, regulations, vendor guidance, platform behavior, and search-engine practices change. Confirm the current requirements that apply to the project, organization, jurisdiction, and technology before treating this template as a compliance checklist.*

# **14  The website is never only the build**

*The outcome depends on what the organization can understand, operate, and improve.*

A good website project makes the right work visible early, tests uncertainty before it becomes expensive, and leaves behind a system that can be inherited.

That means defining outcomes before layouts, planning content before placeholders become permanent, choosing technology with ownership in mind, testing throughout the work, launching with operational controls, and using live evidence to decide what comes next.

| MRC CLOSING PRINCIPLE Useful systems are better than big ones. The best process is not the one with the most artifacts; it is the one that helps people make sound decisions, deliver a quality website, and keep it useful after launch. |
| :---- |

## **Before beginning the next website**

\[ \] Name the problem, user, outcome, owner, and constraint.

\[ \] Identify the most consequential decision and the riskiest assumption.

\[ \] Choose the smallest artifact or prototype that can reduce that uncertainty.

\[ \] Plan how content, accessibility, performance, security, measurement, and operations will stay present through the project.

\[ \] Decide how new evidence will change the plan without losing accountability.

**Manny Roy Consulting**

[mannyroy.com](https://www.mannyroy.com/)