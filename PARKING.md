# Parking

Everything that surfaced during the cycle and asks to be added to the programme.
**Do not touch until the cycle is over.** The next cycle is built from this list.

- Narrating out loud while typing does not happen by itself yet (2026-08-03, drill 01).
  Explaining clearly under load is a repeat interview failure - Coralogix, Wolters Kluwer, DPG Media.
- `=` typed instead of `===` inside a predicate (2026-08-04, drill 02). Caught by eye both times, but in a callback it is a silent bug: `item.active = true` assigns, mutates the object and returns truthy, so filter keeps everything. Worth one dedicated trace-prediction drill in cycle 2.
- `some` / `every` were not recallable on the first ask (2026-08-04). Empty-array edge (`[].every` is true) is the part to re-test in a week.
- Tie-breaking is not part of the reflex yet (2026-08-05, drill 03). Every find-the-max has a behaviour on equal values, and it has to be said out loud before the interviewer asks. Same family: sort stability, first vs last match.
- Accumulator on the left is a habit, not a rule to rediscover. Flipping it is harmless for `+` on numbers and a real bug for string concat or `push`.
- **Discarded expressions** (2026-08-06, drill 04, second sighting). Wrote `acc[k] + 1` with no assignment - computes the answer and throws it away. Same family as `=` for `===` in drill 02: no syntax error, no crash, wrong result. Two sightings in four days makes it a class, not a slip. Cycle 2: a trace-prediction drill built entirely of statements that look like work and do nothing.
- **The reduce initial value is known but not reflexive** (2026-08-06). Said the rule out loud on 08-05 in drill 03, dropped `, {}` in all four functions on 08-06. Knowing the rule and having the reflex are different states - re-test in a week, not by asking, by writing.
- **Tests that are green for the wrong reason** (2026-08-08, drill 05, THIRD sighting). `greet` ignored its parameter and read a module-level global; the check passed only because the same object was passed in. Prior sightings: DPG Media rejection (tests exercised the original class, not the refactor) and the Next.js `[id]` route test importing the neighbouring module. Cycle 2 drill: given a passing test, prove it can fail - change the input and watch it go red. A green test that cannot go red asserts nothing.

