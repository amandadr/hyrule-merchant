

|  | PROJECT FOUNDATION  Concept brief \+ world-building workbook A Merchant’s Roadbook A static Hyrule shop-and-tour-guide experience Initial project vision, world-building framework, technical architecture, creative guardrails, discovery questions, and phased direction. PREPARED FOR MannyRoy.com PREPARED ON August 6, 2026 VERSION Concept foundation 0.1 PROJECT MODE Noncommercial portfolio prototype The central premise The shopkeeper does not merely sell supplies. They help travellers understand the road ahead. |
| :---- | :---- |

**00  How to use this brief**

*A decision record, creative foundation, and practical workbook for the first build.*

|  | WORKING RULE  The brief separates facts from invention. API capabilities are documented as source constraints. World-building, prices, stock, tours, recipes, and merchant lore are original design work that still needs explicit decisions. |
| :---- | :---- |

**Status language**

| Status | Meaning |
| :---- | :---- |
| DECIDED | Already chosen and should guide planning unless a new constraint appears. |
| RECOMMENDED | A strong current direction that should be tested before it becomes permanent. |
| OPEN | A creative or product decision that needs an answer. |
| RESEARCH | A technical, legal, content, or source question requiring verification. |

**Contents**

| 01 | Executive brief | 09 | Visual and narrative direction |
| :---- | :---- | :---- | :---- |
| **02** | Decisions already made | **10** | Data and content model |
| **03** | Experience concept | **11** | Technical architecture |
| **04** | World-building foundation | **12** | Risks, constraints, and uncertainties |
| **05** | The shop, economy, and catalogue | **13** | Scope and phased roadmap |
| **06** | The tour-guide layer | **14** | World-building workbook |
| **07** | Signature experiences | **15** | Decision register and source notes |
| **08** | Information architecture |  |  |

**01  Executive brief**

*A memorable portfolio experience built around an original merchant identity and a dependable static architecture.*

|  | DECIDED  Concept in one sentence Create an unofficial, noncommercial Hyrule merchant site that combines a simulated shop, regional field guide, and journey-planning service, powered by a build-time snapshot of the Hyrule Compendium API. |
| :---- | :---- |

The project should feel like a real service operating inside Hyrule, not a themed product grid. The shopkeeper’s value is judgment: what to carry, where to travel, what dangers to expect, and how ingredients can be combined. Commerce provides the familiar structure; guidance and world-building create the memorable experience.

**Why this project is strong**

| A clear creative hook The merchant and tour-guide premise gives every page a role in one coherent world. | Useful source relationships Locations, drops, cooking effects, equipment properties, and regions can become recommendations and journeys. |
| :---- | :---- |
| **A credible technical story** External data is ingested, validated, normalized, enriched, and delivered as a fast static application. | **A long feature runway** Brewing, loadouts, route planning, bundles, a field journal, and daily merchant logic can be added progressively. |

**What the finished project should prove**

* Creative direction: the ability to invent a coherent product experience rather than merely skin an API.  
* Systems thinking: source data is transformed into a stable internal model before it reaches the interface.  
* Frontend delivery: responsive, accessible, high-performance pages with purposeful client-side state.  
* Information architecture: commerce, editorial guidance, and interactive tools remain understandable together.  
* Sustainable scope: the first release is complete on its own, while later features have a clear place to grow.

**What it should not become**

* A direct recreation of Nintendo’s interface, branding, or official store experience.  
* A generic fan wiki with a cart attached.  
* A real store that collects payments, customer accounts, addresses, or fulfilment information.  
* A sprawling game-mechanics simulator that prevents a polished first release.  
* A runtime dependency on a community API that can make the portfolio demo unavailable.

**02  Decisions already made**

*The commitments that define the project before world-building begins.*

| Area | Current direction | Status |
| :---- | :---- | :---- |
| Data foundation | Hyrule Compendium API. | DECIDED |
| Deployment model | Pure static site; no persistent commerce server. | DECIDED |
| Product concept | Fictional merchant shop combined with a tour-guide and field-service layer. | DECIDED |
| Portfolio purpose | Demonstrate creative product design, API integration, data modelling, accessibility, and performance. | DECIDED |
| Signature feature | Potion or elixir brewing is the leading interactive feature. | DECIDED |
| User state | Cart/satchel, favourites, and working selections may persist in the browser only. | RECOMMENDED |
| Framework | Astro \+ TypeScript \+ validated build-time content \+ small interactive islands. | RECOMMENDED |
| Commerce boundary | No real orders, payments, customer accounts, or inventory authority. | DECIDED |

**Project principles**

**1\.** Useful before clever. Every playful interaction must help the visitor browse, prepare, compare, or understand.

**2\.** Original over imitative. Use the world as source material, but build a distinct merchant brand and interface.

**3\.** Static by design. The application should remain useful when the upstream API is unavailable.

**4\.** A shopkeeper with judgment. Recommendations should reflect the merchant’s expertise, values, and limitations.

**5\.** Progressive depth. A complete shop launches first; richer systems are layered on deliberately.

**6\.** Explain the transformation. The case study should show how source data became products, guides, routes, and experiences.

|  | RECOMMENDED  Primary design test Could this feature exist only because the merchant understands the world, or could it be dropped unchanged into any generic ecommerce template? Prefer the former. |
| :---- | :---- |

**03  Experience concept**

*A retail service for travellers, not merely a catalogue of Hyrule objects.*

**The merchant’s role**

The merchant is a practical intermediary between the world’s raw information and a traveller’s decisions. They know where supplies come from, what can be combined, which routes are risky, and what a first-time visitor tends to forget. The site should express that expertise through structure, recommendations, and voice.

| Prepare Choose a destination or objective and assemble supplies, equipment, meals, or elixirs. | Discover Browse regions, creatures, resources, hazards, and merchant observations. |
| :---- | :---- |
| **Trade** Add goods to a simulated satchel, compare value, and complete a fictional transaction. | **Experiment** Combine ingredients, test effects, and learn through low-stakes interactive systems. |

**Core visitor journeys**

| Visitor intent | Experience response |
| :---- | :---- |
| “I know where I am going.” | Select a region, review conditions and hazards, and add a recommended journey bundle. |
| “I know what I need.” | Search or browse the shop, compare items, and assemble a satchel. |
| “I have ingredients.” | Use the brewing tool to test combinations and save a recipe. |
| “I am exploring.” | Follow links between monsters, drops, materials, effects, regions, and products. |
| “I want the story.” | Meet the merchant, read field notes, and understand how the shop travels or sources goods. |

**Recommended service promise**

|  | INSPIRATION  “Pack smarter. Travel farther. Return with a better story.” This is not proposed final copy. It captures the combined role of outfitter, field guide, and storyteller and can be used to test future name and voice directions. |
| :---- | :---- |

**04  World-building foundation**

*The decisions that make the merchant credible, consistent, and useful across the whole site.*

**Recommended operating model**

|  | RECOMMENDED  A travelling merchant with one dependable base. The shop has a home location where records and stock are organized, but the merchant regularly travels established routes. This naturally supports a storefront, region guides, seasonal availability, field notes, pickup points, and stories from the road. |
| :---- | :---- |

**World boundaries to decide first**

| Question | Why it matters | Status |
| :---- | :---- | :---- |
| Game era | Breath of the Wild, Tears of the Kingdom, or a deliberately ambiguous “traveller’s Hyrule.” | Open |
| Canon relationship | Strictly lore-consistent, lightly inspired, or original fiction set beside familiar places. | Open |
| Spoiler policy | Whether later-game regions, monsters, equipment, and story implications are surfaced. | Open |
| Geographic base | A named settlement, a road junction, a stable network, or an original mobile camp. | Open |
| Business legitimacy | Licensed trader, opportunistic collector, guild member, family shop, or itinerant specialist. | Open |
| Audience | New travellers, experienced adventurers, researchers, tourists, locals, or a mixed market. | Open |

**Merchant character sheet**

| ☐ | Name, title, and what regular customers call them |
| :---: | :---- |
| ☐ | Home region, travel routes, and reason for moving between them |
| ☐ | Past profession or formative experience that created their expertise |
| ☐ | Strongest knowledge: ingredients, monsters, routes, equipment, weather, trade, or folklore |
| ☐ | Blind spots: what they misunderstand, avoid, exaggerate, or refuse to sell |
| ☐ | Values: safety, profit, curiosity, conservation, hospitality, reputation, or independence |
| ☐ | Relationship to danger: cautious planner, veteran guide, reluctant survivor, or thrill-seeker |
| ☐ | Relationship to customers: mentor, neighbour, storyteller, salesperson, or practical fixer |
| ☐ | Signature object, phrase, ritual, or shopkeeping habit |
| ☐ | Reason the shop’s records are available to visitors through this “site” |

**A useful source of tension**

The merchant should want two things that occasionally conflict. Examples: protect travellers while still making a living; preserve rare habitats while selling valuable materials; tell the truth while maintaining a colourful reputation; remain independent while relying on a trade network. A small tension makes policies, recommendations, and dialogue feel authored rather than decorative.

**05  The shop, economy, and catalogue**

*Translate API records into a business that has rules, limits, and a point of view.*

**Do not sell every record**

The Hyrule Compendium API organizes knowledge into creatures, equipment, materials, monsters, and treasure. A believable shop should use those categories differently. Some records become products; others become threats, sources, guide entries, or relationship nodes. This prevents the experience from feeling like an encyclopedia with prices added.

| API source | Customer-facing role | Recommended treatment |
| :---- | :---- | :---- |
| Materials | Pantry, apothecary, cooking goods, monster parts, minerals | Usually a product; may also appear in recipes and regional guides. |
| Equipment | Arms, shields, bows, tools, field gear | Product or comparison entry; availability and condition may be invented. |
| Creatures | Wildlife, insects, fish, field specimens | Selective product/ingredient use; otherwise guide content. Establish an ethical rule. |
| Monsters | Threat index and sourcing intelligence | Not products. Connect them to hazards, drops, routes, and preparation advice. |
| Treasure | Salvage, ore deposits, chests, curios | Source or guide entry; individual drops may become products. |
| Regions | Destinations, route guides, pickup points | Tour-guide structure, not commerce inventory. |

**Invented business fields**

* Price in rupees and the rule used to derive or author it.  
* Inventory status: available, scarce, seasonal, special order, guide-only, or not sold.  
* Rarity and sourcing difficulty, separate from combat danger.  
* Condition or quality for equipment and salvage.  
* Merchant note explaining practical use, cautions, or value.  
* Source relationships: found in region, dropped by monster, used in recipe, recommended for route.  
* Ethical or legal restrictions: protected creatures, dangerous materials, restricted weapons, or no-trade items.  
* Cross-sells: what belongs in the same pack, meal, elixir, route, or objective.

**Pricing philosophy options**

| Approach | Strength | Recommendation |
| :---- | :---- | :---- |
| Simple authored prices | Fastest and easiest to balance; strongest control over merchandising. | Best for MVP. |
| Rule-derived prices | Use rarity, locations, recovery, attack, defence, and effects to generate a base value. | Strong systems story; requires tuning. |
| Merchant economy | Prices change by route, stock, danger, or season. | Excellent later feature; avoid in first release. |

|  | RECOMMENDED  Recommended MVP economy Author a small, curated catalogue and document a simple pricing rubric. Do not generate a price for every record until the shop’s product rules are proven. |
| :---- | :---- |

**06  The tour-guide layer**

*Make regional understanding a first-class service rather than an afterthought.*

**The guide’s job**

The guide layer answers a different question from the shop. The shop asks, “What can I acquire?” The guide asks, “What should I know before I go?” They should share data and recommendations without collapsing into one page type.

**Recommended regional guide template**

| Section | Purpose |
| :---- | :---- |
| Overview | What makes the region distinct and why a traveller goes there. |
| Conditions | Climate, terrain, visibility, traversal constraints, and preparation assumptions. |
| Hazards | Relevant monsters, environmental risks, and merchant cautions. |
| Useful finds | Materials, creatures, salvage, and notable supply opportunities. |
| Recommended pack | A prebuilt bundle with reasons for every item. |
| Route notes | Suggested starting point, rest points, detours, and optional objectives. |
| Merchant story | A short field note that gives the region personal history. |
| Spoiler level | A clear indicator if the guide includes later-game content. |

**Important source limitation**

|  | RESEARCH  The API’s regions endpoint currently supports the Breath of the Wild map only. If the site uses Tears of the Kingdom compendium entries, region coverage may not align automatically. The project must either choose Breath of the Wild as the geographic foundation, author an independent region model, or accept a deliberately mixed world with clear editorial rules. |
| :---- | :---- |

**Tour types worth exploring**

* **Practical route:** A safe, purpose-driven itinerary: gather ingredients, reach a settlement, or prepare for a climate.  
* **Merchant trail:** Follow the shopkeeper’s regular buying and selling circuit.  
* **Naturalist walk:** Observe creatures and materials without treating every encounter as inventory.  
* **Danger tour:** A high-risk guide focused on monster territory, drops, and equipment requirements.  
* **Culinary journey:** Collect regional ingredients and finish with a meal or elixir challenge.

**07  Signature experiences**

*Features that could only belong to this merchant, this world, and this dataset.*

**1\. Brewing bench**

The brewing bench is the leading signature feature. Visitors select ingredients, learn whether the combination is compatible, see the resulting effect, and save or add the mixture to their satchel. The experience should teach the shop’s logic, not attempt to recreate every hidden game formula.

| Stage | Brewing capability |
| :---- | :---- |
| MVP | Choose 2-5 ingredients; validate broad compatibility; show effect family, strength band, duration band, and a merchant note. |
| Phase 2 | Support named recipes, substitutions, favourites, failures, and “use what I have” suggestions. |
| Phase 3 | Add region-aware ingredient sourcing, merchant price, inventory constraints, and daily experiments. |

**2\. Journey pack builder**

A traveller selects a region, objective, risk tolerance, and expected duration. The merchant recommends an editable pack, explains every choice, and shows the total rupee value. This is the strongest bridge between the store and tour-guide layers.

**3\. Relationship browsing**

|  | STRENGTH  Monster → drops → ingredients → effects → routes → recommended gear Use connected records to create meaningful discovery paths. The goal is not exhaustive lore. It is to let one practical question lead naturally to the next. |
| :---- | :---- |

**Feature priority**

| Priority | Features |
| :---- | :---- |
| Launch | Curated shop, guide pages, search/filter, satchel, simulated checkout, one regional pack, brewing proof of concept. |
| Next | Saved field journal, richer recipes, comparison tools, multiple journey packs, merchant stories. |
| Later | Dynamic economy, route map, daily stock, challenges, achievements, offline installability, or multiple merchants. |

**Scope warning**

Potion systems, maps, routes, and fictional economies can each become a project of their own. The first release should contain one delightful example of each chosen idea, not a complete simulation of Hyrule.

**08  Information architecture**

*Keep shopping, guidance, and experimentation clear while allowing them to reinforce one another.*

**Recommended primary navigation**

| Area | Primary purpose |
| :---- | :---- |
| Shop | Browse available goods and curated collections. |
| Regions | Choose a destination and review field guidance. |
| Field Guide | Explore creatures, monsters, materials, equipment, and treasure relationships. |
| Brew | Combine ingredients and save a result. |
| My Satchel | View cart, saved recipes, favourites, and journey pack. |
| The Merchant | Learn the character, routes, policies, sourcing philosophy, and project disclaimer. |

**Recommended page families**

* Home: service promise, merchant introduction, current route, featured supplies, and one clear starting action.  
* Collection: product-focused browsing with filters, availability, price, and practical merchant notes.  
* Product detail: source facts, invented commerce data, related routes, effects, drops, and bundle logic.  
* Guide entry: educational record for monsters, creatures, treasure, or non-sale equipment.  
* Region guide: conditions, hazards, useful finds, route notes, and recommended pack.  
* Brewing bench: ingredient selection, explanation, result, and saved recipe state.  
* Satchel/checkout: transparent simulation, no collection of real personal or payment information.

**State and feedback requirements**

* Every action has a visible result and a reversible path.  
* The satchel persists locally but can be reset easily.  
* The site identifies simulated values and invented logic without breaking immersion.  
* Empty, invalid, loading, unavailable, and reset states are designed deliberately.  
* Keyboard, screen-reader, reduced-motion, and small-screen use are first-class test cases.

**09  Visual and narrative direction**

*Build a credible original merchant brand instead of reproducing official game UI.*

**Recommended visual ingredients**

| Field journal Annotations, specimen labels, route stamps, and practical margins without faux-aged clutter. | Outdoor outfitter Clear product photography, robust comparison, pack-building, and dependable navigation. |
| :---- | :---- |
| **Apothecary bench** Ingredient groupings, jars, recipes, warnings, and tactile interaction cues. | **Cartographer’s desk** Maps, landmarks, route lines, distance, conditions, and journey notes. |

**Tone of voice**

The merchant should sound experienced, useful, observant, and occasionally wry. Avoid grand fantasy exposition when one practical sentence will do. The voice can be playful, but it should still reduce uncertainty for the traveller.

| Voice quality | Illustrative line |
| :---- | :---- |
| Useful | “Take two warming meals. The road is longer than it looks.” |
| Specific | “Found near wet stone after rain; rarely worth a detour on its own.” |
| Human | “I sold my last shield to someone who promised not to test it on a Lynel.” |
| Bounded | “I have heard the story. I have not travelled that route myself.” |

**Working name directions**

| Direction | Implication |
| :---- | :---- |
| The Wandering Satchel | Warm, flexible, travel-forward; strong for an itinerant merchant. |
| Lantern & Ladle | Memorable and domestic; strong if food, brewing, and hospitality lead. |
| The Wayfarer’s Ledger | More archival and guide-oriented; supports records and route intelligence. |
| The Last Stable Supply | Playful and location-based; may feel too tied to one kind of site. |
| Roadsalt & Rupees | Distinctive and commercial; more humorous, less timeless. |

|  | GUARDRAIL  Creative guardrail Do not use official logos, reproduce the Sheikah or Purah interface, or make the site look like an official Nintendo property. Familiarity should come from the world and data relationships; identity should come from the merchant. |
| :---- | :---- |

**10  Data and content model**

*Separate upstream facts, original business logic, and authored world-building so each can be maintained responsibly.*

**Verified API capabilities**

The Hyrule Compendium API exposes compendium entries for creatures, equipment, materials, monsters, and treasure. It supports Breath of the Wild and Tears of the Kingdom through a game parameter; Breath of the Wild is the documented default. Entry schemas vary by category and include useful fields such as common locations, drops, attack/defence properties, cooking effects, hearts recovered, and Tears of the Kingdom-specific fields. The API also serves 280 × 280 PNG entry images. A separate regions endpoint covers eight Breath of the Wild regions. \[1\]\[2\]

**Recommended internal models**

| Model | Responsibility |
| :---- | :---- |
| SourceEntry | Normalized API facts and source identifiers. Never mix invented prices into this layer. |
| Product | Sellable item with price, stock state, collection, quality, restrictions, and merchant notes. |
| GuideEntry | Non-sale knowledge: monster, creature, treasure, hazard, source, or reference item. |
| Region | Editorial destination model with conditions, hazards, route notes, and recommendations. |
| Recipe | Ingredient rules, compatibility, effect outcome, explanation, and authored exceptions. |
| JourneyPack | Destination/objective plus recommended products and reasons. |
| MerchantNote | Voice-bearing content attached to products, guides, routes, or recipes. |
| SourceRecord | Provenance, retrieval date, upstream URL, asset status, and transformation warnings. |

**Source-to-experience rules**

* Preserve upstream names and source IDs so every transformed record can be traced.  
* Validate nullable arrays and category-specific fields before generating pages.  
* Store original facts separately from invented price, rarity, stock, and merchant copy.  
* Use a manual overrides file for corrections, exclusions, featured items, and editorial choices.  
* Record the game source on every entry; do not silently blend Breath of the Wild and Tears of the Kingdom data.  
* Decide whether images are hotlinked, downloaded at build time, or replaced; document the legal and operational choice.

**Content not supplied by the API**

| Missing layer | Required response |
| :---- | :---- |
| Recipes and exact brewing outcomes | Author a simplified project rule set or verify a separate source. |
| Prices and inventory | Create original business logic. |
| Tour routes and travel times | Author editorially; map data is a separate research stream. |
| Merchant identity and notes | Original world-building. |
| Store collections and promotions | Original merchandising. |
| Legal permission for underlying franchise assets | Requires independent review; the API’s software licence is not enough. |

**11  Technical architecture**

*A static build with a resilient data pipeline and a small, replaceable client-side commerce layer.*

![Diagram of the recommended static architecture, from Hyrule API ingestion through validation, an internal catalogue, Astro static generation, and browser-only cart and guide features.][image1]

*The deployed site remains functional without a live API or application server.*

**Recommended stack**

| Layer | Responsibility |
| :---- | :---- |
| Astro \+ TypeScript | Pre-render catalogue and guide pages; use interactive islands only where state is needed. |
| Astro content collections | Load local or remote data at build time, validate it with a schema, and query it consistently. \[3\] |
| Zod schemas | Reject malformed or incomplete source records during ingestion rather than at runtime. |
| Nano Stores | Share small cart, journal, brewing, and preference state across islands. |
| Persistent browser adapter | Store non-sensitive demo state in localStorage; Nano Stores provides a persistence package for that pattern. \[4\] |
| Netlify | Host generated static assets, deploy previews, and build from source control. |

**Build pipeline**

**1\.** Fetch only the selected game and endpoints during a controlled ingestion task.

**2\.** Save a dated raw snapshot for traceability and offline development.

**3\.** Validate and normalize every record into a source model.

**4\.** Apply original enrichment: sale status, price, rarity, tags, region links, notes, and exclusions.

**5\.** Generate typed content collections and static routes.

**6\.** Download or proxy approved assets according to the chosen rights and reliability policy.

**7\.** Run tests, accessibility checks, link checks, and a production build before deployment.

**Testing priorities**

* Schema failures and missing upstream fields.  
* Broken or unavailable source images.  
* Deterministic pricing and recipe results.  
* Cart persistence, reset, and cross-tab behaviour.  
* Keyboard operation and screen-reader announcements in brewing and cart flows.  
* Performance with the full chosen catalogue, not only a small sample.  
* Build behaviour when the API is unavailable; the last known-good snapshot should remain deployable.

**12  Risks, constraints, and uncertainties**

*The project is feasible, but its strongest creative opportunities also create its most important decisions.*

| Risk | Concern | Mitigation | Priority |
| :---- | :---- | :---- | :---- |
| Upstream reliability | The community API has no documented service-level guarantee. | Vendor a snapshot; build against last known-good data; separate refresh from deployment. | High |
| API evolution | Hostnames, schemas, or availability can change; the project has already moved away from an older Heroku hostname. \[1\] | Centralize the adapter; validate every build; record source version and retrieval date. | Medium |
| Game mismatch | Compendium supports both games, while regions are documented for Breath of the Wild only. \[1\]\[2\] | Choose one geographic canon or author a separate region model. | High |
| Recipe accuracy | The API supplies effects but not a complete brewing system. | Define a transparent simplified rule set; do not imply game-perfect calculation without verification. | High |
| Asset rights | API and repository availability do not automatically grant rights to Nintendo-owned names, images, or descriptions. | Use an unofficial noncommercial framing, original identity, attribution, limited dataset, and prelaunch rights review. | High |
| Trade dress | A close imitation of official UI could confuse visitors about affiliation. | Create an original visual system; avoid official logos and interface replication. | Medium |
| Feature creep | Brewing, maps, routes, and economies can each expand indefinitely. | Set release acceptance criteria and a visible “later” backlog. | High |
| Data ambiguity | Null locations, category-specific schemas, duplicates, or inconsistent relationships may occur. | Use validation, overrides, fallbacks, and exclusion rules. | Medium |
| Browser-only limits | State is device-local and can be cleared; it is not an account or authoritative order record. | Explain the simulation; make reset/export behaviours explicit. | Low |

**Questions that must be answered before design begins**

| ☐ | Which game defines the project’s world, or how will mixed-era data be explained? |
| :---: | :---- |
| ☐ | What is the merchant’s home, route, expertise, ethical code, and blind spot? |
| ☐ | Which API categories can become products, and which remain guide-only? |
| ☐ | Will the project use original or upstream images, and under what attribution/rights policy? |
| ☐ | How simplified can brewing be while still feeling coherent and honest? |
| ☐ | What makes a region guide useful without requiring a full interactive map? |
| ☐ | How will invented prices and rarity be explained in the case study? |
| ☐ | What is the minimum complete release that demonstrates the concept? |

**Legal and attribution note**

The API repository is published under the MIT licence for its software. That licence should not be treated as permission for every underlying franchise asset or description. The public site should be clearly unofficial and noncommercial, avoid real transactions, credit the API, avoid implying endorsement, and receive a focused terms/IP review before launch. This brief identifies a project risk; it is not legal advice.

**13  Scope and phased roadmap**

*Launch a complete small world first, then expand the systems that create repeat visits.*

**Recommended MVP**

| ☐ | One original merchant identity with a defined home, route, voice, policies, and sourcing philosophy. |
| :---: | :---- |
| ☐ | A curated catalogue rather than every API record. |
| ☐ | Shop collections for materials, equipment, and selected curios. |
| ☐ | Guide entries for monsters, creatures, treasure, and non-sale sources. |
| ☐ | Two or three region guides with one journey pack each. |
| ☐ | Search and practical filters. |
| ☐ | A browser-persistent satchel and clearly simulated checkout. |
| ☐ | A brewing proof of concept with a bounded rule set and several authored examples. |
| ☐ | An About/credits page that explains source, attribution, fiction, and noncommercial status. |
| ☐ | A case-study-ready record of the data pipeline, decisions, constraints, and measured performance. |

**Explicitly out of scope for launch**

* Real payments, order storage, customer accounts, authentication, or personal-data collection.  
* A complete interactive map of Hyrule.  
* Perfect reproduction of game recipes, combat, weather, or economic mechanics.  
* Dynamic server inventory or live price changes.  
* Every record from both games.  
* User-generated reviews, public saved lists, or social features.

**Phased delivery**

| Phase | Outcome |
| :---- | :---- |
| 0 — Discovery | Choose game scope, merchant identity, catalogue rules, asset policy, and MVP acceptance criteria. |
| 1 — Foundation | Build adapter, snapshot, schemas, internal models, design tokens, and core page templates. |
| 2 — Shop \+ guide | Deliver catalogue, product/guide details, regions, journey packs, satchel, and simulation notice. |
| 3 — Brewing | Add the first signature interaction, recipe rules, saved results, and source relationships. |
| 4 — Polish | Accessibility, performance, responsive QA, content editing, microcopy, credits, and deployment. |
| 5 — Case study | Document the brief, transformation logic, design decisions, constraints, outcomes, and next iterations. |

**MVP acceptance test**

|  | GOAL  MVP acceptance test A visitor can choose a journey, understand the merchant’s recommendation, add or remove supplies, experiment with one brewing flow, and complete a clear fictional checkout—without encountering an empty shell or needing a live server. |
| :---- | :---- |

**14  World-building workbook**

*Prompts to complete before naming, visual design, or catalogue production begins.*

**A. Merchant identity**

| Prompt | Working answer |
| :---- | :---- |
| Public name and title |  |
| Home base |  |
| Regular travel route |  |
| Former work or origin story |  |
| Primary expertise |  |
| Blind spot or limitation |  |
| Core value |  |
| Business tension |  |
| Signature habit/object |  |
| Reason customers trust them |  |

**B. Shop rules**

| Prompt | Working answer |
| :---- | :---- |
| What does the merchant refuse to sell? |  |
| How is stock sourced? |  |
| What makes an item expensive? |  |
| What creates scarcity? |  |
| How are creatures treated ethically? |  |
| What is always available? |  |
| What is special order only? |  |
| What happens when an item is “out of stock”? |  |

**C. Tour-guide rules**

* The merchant’s preferred kind of traveller is…  
* The route they know best is…  
* The place they refuse to guide anyone is…  
* The most common mistake new travellers make is…  
* The one item they insist everyone carries is…  
* The story they tell too often is…

**14  World-building workbook — continued**

*Turn the character into usable product, content, and interface rules.*

**D. Voice and writing**

| Prompt | Working answer |
| :---- | :---- |
| Three adjectives for the merchant’s voice |  |
| Words or phrases they use often |  |
| Words or attitudes they avoid |  |
| How they warn a traveller |  |
| How they praise a good choice |  |
| How they admit uncertainty |  |
| How much humour is appropriate |  |
| How they explain a fictional transaction |  |

**E. First content set**

| ☐ | Select 12-20 sellable products that demonstrate different data fields and categories. |
| :---: | :---- |
| ☐ | Select 6-10 guide-only records that create useful relationships to those products. |
| ☐ | Choose 2-3 regions that produce visibly different preparation needs. |
| ☐ | Define 3 journey objectives: safe passage, ingredient gathering, and high-risk encounter are good starting contrasts. |
| ☐ | Author 5-8 brewing examples, including at least one failed or incompatible combination. |
| ☐ | Write one merchant note for every launch product and one longer field story for every region. |

**F. First ten decisions**

**1\.** Choose Breath of the Wild, Tears of the Kingdom, or a mixed-world rule.

**2\.** Choose the merchant’s fixed base and travel model.

**3\.** Write the merchant’s one-paragraph biography.

**4\.** Define what the merchant sells, guides, and refuses.

**5\.** Choose the ethical rule for creatures and monster-derived materials.

**6\.** Choose the project’s spoiler policy.

**7\.** Choose the asset/image policy.

**8\.** Define the simplified brewing rule set.

**9\.** Choose the first three region experiences.

**10\.** Freeze the MVP and move every other idea to the backlog.

**15  Decision register and source notes**

*Keep creative choices, technical facts, and unresolved research visible as the project evolves.*

**Initial decision register**

| ID | Decision | State | Origin |
| :---- | :---- | :---- | :---- |
| D-01 | Use Hyrule Compendium API as source data. | Accepted | Project selection |
| D-02 | Build a pure static simulation with no commerce server. | Accepted | Project selection |
| D-03 | Combine shop and tour-guide roles. | Accepted | Project selection |
| D-04 | Use brewing as the leading signature interaction. | Accepted | Project selection |
| D-05 | Use a travelling merchant with a dependable base. | Proposed | This brief |
| D-06 | Separate products, guide entries, regions, recipes, and source records. | Proposed | This brief |
| D-07 | Curate the launch catalogue instead of publishing all records. | Proposed | This brief |
| D-08 | Use Astro/TypeScript build-time ingestion and browser-local state. | Proposed | This brief |
| D-09 | Keep the public experience unofficial, noncommercial, and visibly simulated. | Required | Risk control |

**Research backlog**

| ☐ | Confirm the chosen API endpoints, response counts, null patterns, and duplicate behaviour using a saved local snapshot. |
| :---: | :---- |

| ☐ | Audit image provenance and decide whether to hotlink, download, replace, or omit assets. |
| :---: | :---- |

| ☐ | Review Nintendo-related trademark, copyright, fan-site, and noncommercial presentation risks before public launch. |
| :---: | :---- |

| ☐ | Choose the canonical game scope and test how location names map to the regions model. |
| :---: | :---- |

| ☐ | Research or author the brewing rules and document where they intentionally differ from the games. |
| :---: | :---- |

| ☐ | Define an original map/route approach that does not require copying official map assets. |
| :---: | :---- |

| ☐ | Test full-catalogue build size, image weight, and page generation performance. |
| :---: | :---- |

**Source notes**

**\[1\] Hyrule Compendium API documentation**

Compendium categories, game parameter, category-specific schemas, and 280 × 280 PNG image endpoints. [Open source](https://github.com/gadhagod/Hyrule-Compendium-API/blob/master/docs/compendium-api.md)

**\[2\] Hyrule Compendium Regions API documentation**

Eight-region endpoint and current Breath of the Wild-only map support. [Open source](https://github.com/gadhagod/Hyrule-Compendium-API/blob/master/docs/regions-api.md)

**\[3\] Astro Content Collections documentation**

Build-time loaders, schemas, typed collections, and static route generation. [Open source](https://docs.astro.build/en/reference/modules/astro-content/)

**\[4\] Nano Stores persistent package**

Browser localStorage persistence for Nano Stores state. [Open source](https://github.com/nanostores/persistent)

**\[5\] Hyrule Compendium API repository licence**

MIT licence for the repository software; not a substitute for reviewing underlying franchise rights. [Open source](https://github.com/gadhagod/Hyrule-Compendium-API/blob/master/LICENSE)

**Closing direction**

|  | NORTH STAR  Build a small world with dependable rules. The memorable result will not come from publishing the largest catalogue. It will come from a merchant whose advice, inventory, routes, and experiments all feel like parts of the same life. |
| :---- | :---- |

[image1]: <data:image/png;base64,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>