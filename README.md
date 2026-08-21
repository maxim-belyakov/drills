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

## Paradigm shift, 2026-08-16

The cycle was scoped as 40 drills in 4 weeks. After 14 days, 9 were closed - week 1
had taken exactly twice its planned time, which put cycle 1 into October and cycle 3
past the offer horizon.

Two things came out of the review:

1. **The plan counted work as pending that was already done.** Seven of the ten
   Next.js drills were closed by hand on 2026-07-28..08-01 while building
   `mapbox-drill`, and are documented in the vault session log.
2. **The 5-minute norm was calibrated against a problem that no longer exists.**
   It was insurance against avoidance - the mechanism that cost a Wolters Kluwer
   round on 08-03. Fifteen days, zero misses, including an interview day and a day
   spent on a coach. Avoidance is closed.

What changed:

- 30 remaining drills collapse to **17** - merged where they train one movement,
  struck where already closed
- the **minimum stays 5 minutes**; the **target becomes one 45-60 minute session**,
  two or three drills
- the timed builds stop being a final exam. **Saturday is a timed run, every week** -
  the Mapbox round was exactly that format, and the 90-minute build is where the
  failure was, so it cannot be the last thing trained
- written repeats only for drills that actually failed: 04, 05, 09, 10. Drills 01,
  02, 03, 06, 07, 08 closed on their first repeat and move to the Anki deck

## Counter

Start: 2026-08-03
Closed cold: **14 of 26**
Day streak: **20**
Cycle 1 target: **end of August**

## Remaining - 17

**Async (6)** - 11 promise from scratch + two styles · 12 try/catch in async code ·
13 all vs allSettled · 14 sequential vs parallel · 15 fetch error handling +
AbortController · 16 event loop out loud

**React (7)** - 17 useState · 18 useEffect cleanup + deps array · 19 keys in a list ·
20 controlled form + lifting state · 21 useMemo / useCallback / React.memo ·
22 custom useFetch with loading, error, empty · 23 debounce

**Next.js and assembly (3, plus the weekly run)** - 24 POST with a body ·
25 a 45-minute build out loud · 26 a 90-minute full run with changing requirements

Drills 25 and 26 are not one-offs. They are the Saturday run, repeated to the end.

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
| 2026-08-11 | repeat 03 + 08 sorting | ✅ repeat 03 green, the seed was there in all four. 08 🔁 - looked up the spelling of localeCompare, and byName mutated the shared array while the other two did not |
| 2026-08-12 | repeat 04 + 08 sorting, second pass | ✅ 04 closed after five self-corrected iterations - the seed came back on its own, the accumulator SHAPE did not. 08 cold, localeCompare written unaided this time. sortedPrices took three tries, all of them tuning the operator while the real fault was the operands |
| 2026-08-13 | repeat 05 + 09 Set and Map | 🔁 both. 05 reproduced the same two misses as its first pass. 09 peeked on countBy. Named three new gaps: the `for` family, mutating vs non-mutating methods, map used for side effects |
| 2026-08-14 | 05 third pass + 09 Set and Map, second pass | ✅ both cold, fresh examples on new data. 05 clean in one go after failing the same two spots twice. 09 self-corrected without looking anything up; `??=` on a function result was the only real block |
| 2026-08-15 | repeat 06 + 10 closures | ✅ 06 green. 10 🔁 and not a recall failure - six attempts all computed from a parameter, never declaring a variable that lives between calls. Conceptual, needed a lecture the format did not give |
| 2026-08-16 | 10 closures, makeCounter from a phone | ✅ written cold in chat, ran green including counter independence. One day after failing it six times and googling it - the lecture was the missing piece, not repetition |
| 2026-08-18 | 11 promise basics | 🔁 written against the example, not from memory. ok and fail ignored their parameters until the checks were hardened - eighth sighting of a function reading something other than what it was given. order needed teaching: `.then` takes a function, not a value |
| 2026-08-19 | 11 promise basics, second pass + 12 async try/catch | ✅ 11 cold, parameters used this time. 12 🔁 - safeAwait was looked up after three attempts awaiting the function itself instead of calling it. viaThen took six attempts, all of them trying to pull a value out of a promise into a sync variable - the central async misconception, caught here rather than in a round |
| 2026-08-20 | 12 async try/catch, second pass | ✅ cold, no example. `await boom()` written with the call this time, after three attempts yesterday awaiting the function itself |
| 2026-08-21 | 13 all vs allSettled, second pass + 14 sequential vs parallel | ✅ both. 13 clean, the array argument came without prompting. 14 had allAtOnce calling Promise.all over plain numbers instead of promises - green because the values matched, tenth sighting; a timing check now makes that impossible |
