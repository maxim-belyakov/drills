# Parking

Everything that surfaced during the cycle and asks to be added to the programme.
**Do not touch until the cycle is over.** The next cycle is built from this list.

- Narrating out loud while typing does not happen by itself yet (2026-08-03, drill 01).
  Explaining clearly under load is a repeat interview failure - Coralogix, Wolters Kluwer, DPG Media.
- `=` typed instead of `===` inside a predicate (2026-08-04, drill 02). Caught by eye both times, but in a callback it is a silent bug: `item.active = true` assigns, mutates the object and returns truthy, so filter keeps everything. Worth one dedicated trace-prediction drill in cycle 2.
- `some` / `every` were not recallable on the first ask (2026-08-04). Empty-array edge (`[].every` is true) is the part to re-test in a week.
