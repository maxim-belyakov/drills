# Parking

Everything that surfaced during the cycle and asks to be added to the programme.
**Do not touch until the cycle is over.** The next cycle is built from this list.

- Narrating out loud while typing does not happen by itself yet (2026-08-03, drill 01).
  Explaining clearly under load is a repeat interview failure - Coralogix, Wolters Kluwer, DPG Media.
- `=` typed instead of `===` inside a predicate (2026-08-04, drill 02). Caught by eye both times, but in a callback it is a silent bug: `item.active = true` assigns, mutates the object and returns truthy, so filter keeps everything. Worth one dedicated trace-prediction drill in cycle 2.
- `some` / `every` were not recallable on the first ask (2026-08-04). Empty-array edge (`[].every` is true) is the part to re-test in a week.
- Tie-breaking is not part of the reflex yet (2026-08-05, drill 03). Every find-the-max has a behaviour on equal values, and it has to be said out loud before the interviewer asks. Same family: sort stability, first vs last match.
- Accumulator on the left is a habit, not a rule to rediscover. Flipping it is harmless for `+` on numbers and a real bug for string concat or `push`.

