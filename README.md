# Daily Recall Drills

Artifact for the 4-week recall programme kept in the Obsidian vault
(`🎯 Программа ежедневных повторений (4 недели)`).

40 drills, 4 weeks, a **closed list**. Anything new that surfaces along the way goes to
`PARKING.md` and waits for the next cycle. Nothing is ever added to the current cycle.

**Daily quota:** one drill, 5 minutes. A good session: two drills, 25 minutes.
When the timer rings, stop - even if it is going well.

**Format:** look at a working example for 3-5 min → close everything →
write it from memory, **saying out loud what you are doing** → run it.
Passes ✅. Peeked 🔁, comes back in a day.

**First pass gets a worked example, repeats do not.** Every drill opened for the first time starts with 3-5 minutes looking at a working analogue - that is the format, not a concession. A drill coming back as 🔁 or as a spaced repeat gets nothing: it has been seen.

**A drill coming back for the THIRD time gets a fresh worked example on different data.** Twice-failed means the first example did not transfer, so repeating it is not a repetition, it is the same failed lesson. New data, same technique.

**Week 2 rhythm (from 2026-08-09):** every session is **one new drill plus a cold re-run of the oldest closed drill**, about five minutes extra. The programme's spaced repeat - a day later, then a week later - was not happening; this makes it part of the session instead of a separate intention.

**Every closed drill ends with a commit AND a push**, in the same sitting - no unpushed work left overnight.

**Three states:** new → 🔁 written with a hint → ✅ written cold.
Only the third counts as closed.

## Counter

Start: 2026-08-03
Closed cold: **8 of 40**
Day streak: **10**

## Log

| Date | Drill | Result |
| --- | --- | --- |
| 2026-08-03 | 01 map ids | ✅ all three under 90 s, no hints. Did not narrate out loud yet - that half is the target tomorrow |
| 2026-08-04 | 02 filter vs find | ✅ all four cold, narrated out loud. some/every came out fuzzy in the spoken part, rewritten by hand as part 6 - green. Slip: typed `=` for `===` twice, caught it myself |
| 2026-08-05 | 03 reduce sum and aggregate | ✅ all four cold, narrated out loud. Notes: tie-breaking in a max-reduce, accumulator kept on the left, flag initialised explicitly |
| 2026-08-06 | 04 group by | 🔁 peeked at the example. Green afterwards, narrated out loud throughout. Systematic miss: forgot the `{}` initial value in all four - one habit, not four mistakes. Returns tomorrow |
| 2026-08-07 | 04 group by, second pass | ✅ cold, no example, narrated out loud. The initial value was there in all four this time. Chose `??=` over `||=` unprompted - correct for both the array and the counter |
| 2026-08-08 | 05 destructuring, second pass | ✅ cold, no example, narrated out loud. `greet` was green for the wrong reason at first - it read the module-level object instead of its parameter; check hardened, then fixed |
| 2026-08-09 | repeat 01 + 06 spread and rest | ✅ repeat 01 green on the first re-run after six days, under five minutes. 06 all five checks cold, narrated. Spoken parts (b) rest vs `arguments` and (c) deep copy needed support |
| 2026-08-10 | repeat 02 + 07 optional chaining and nullish | ✅ repeat 02 green on the first re-run including some/every. 07 green, but two functions were green for the wrong reason until the check was hardened: `||` where `??` was the point, and a chainTrap that only worked because the throw always happened. First pass had no worked example - my miss, now a written rule |
| 2026-08-12 | repeat 04 + 08 sorting, second pass | ✅ 04 closed after five self-corrected iterations - the seed came back on its own, the accumulator SHAPE did not. 08 cold, localeCompare written unaided this time. sortedPrices took three tries, all of them tuning the operator while the real fault was the operands |
