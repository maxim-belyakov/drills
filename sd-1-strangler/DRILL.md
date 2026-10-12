# SD1 Strangler - extracting one domain from a monolith with zero downtime

First pass: theory and a worked example in the session message, then this task cold, out loud, recorded. Repeat on Monday without the theory.

Why this drill: OLX named its own challenge on 08.10.2026 - retiring Atlas, a large PHP monolith shared by real estate, motors and horizontals ("one big object that is doing everything"). Listing lifecycle is being extracted first. Constraints named out loud: a huge event flow, zero downtime, the listing domain differs between units, and the new system must not become "Atlas 2.0".



# Task (say it, 12 minutes, timer on)

"Atlas is a monolith that owns the whole listing lifecycle for several business units. Design how you would move listing lifecycle - create, edit, publish, expire, archive - into a new service, with zero downtime, while traffic keeps flowing."



# The order you speak in

1. Clarify (2 min): which operations are in scope, scale (listings, writes per second, events per second), who reads listings today, what "zero downtime" means for writes, how different the units really are.
2. Who sees what: seller, buyer, other units and internal consumers. What must never break for each.
3. Domain first: the listing aggregate and its states. Core fields shared by all units, unit-specific attributes as a validated extension. This is the answer to "not Atlas 2.0".
4. Design: facade in front, new service with its own store, anti-corruption layer, data sync during the transition, events.
5. Trade-offs: CDC against outbox, reads first against writes first, sync calls against events.
6. Ship it: shadow traffic and diffing, waves by market, rollback by flipping a route, observability, and removing the code from Atlas at the end.



# Green - must be heard

1. A clarifying question before any box is drawn
2. Domain before infrastructure: no CDN or load balancer in the first five minutes
3. A facade or router that decides old or new per operation and per market
4. The dual-write problem named, and either outbox or CDC as the fix, with one trade-off
5. An anti-corruption layer between Atlas's model and the new listing model
6. Core plus extension for per-unit differences
7. Idempotent consumers, events keyed by listing id for ordering
8. Shadow reads or parallel run with a diff before cutover
9. Reads move first, writes last
10. Waves by market, rollback = route flip
11. Done means the code is deleted from Atlas
12. At least one of your own stories used: tenant waves, OpenAPI contract as the seam, idempotent resync, or the rollout that failed without observability

Score: count the greens. 8 or more out of 12 on the first cold pass is good.



# Say it (the 20-second opener)

"I would not rewrite Atlas. I would put a facade in front of it, carve out listing lifecycle behind that facade, keep the two in sync while traffic moves over market by market, prove the new path with shadow reads, and call it done only when the code is gone from Atlas."
