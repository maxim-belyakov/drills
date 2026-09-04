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

**On React, the first pass ALWAYS opens with the explanation - no exceptions.** Broken
three times running (drills 15, 16, 17) before he named it on 2026-09-01: *"I would never
have guessed what you want."* The written drills assume the technique is known and only
recall is missing; on React that assumption is false, and a task handed over without the
technique is not a drill, it is a riddle.

**First pass gets a worked example, repeats do not.** Every drill opened for the first time starts with 3-5 minutes looking at a working analogue - that is the format, not a concession. A drill coming back as 🔁 or as a spaced repeat gets nothing: it has been seen.

**One worked example per TASK, not one per drill** (2026-09-03, named by him mid-session: *"the example before the drill has stopped explaining what is actually wanted from me"*). A drill-level explanation teaches the CONCEPT; it does not tell you the SHAPE of the answer for task 3. Each numbered task gets its own three-to-six-line worked analogue on unrelated data, showing the shape and nothing else. Where a task hangs off given code the student must not edit, that given code is quoted in the session message too - not left to be found in the file.

**A drill coming back for the THIRD time gets a fresh worked example on different data.** Twice-failed means the first example did not transfer, so repeating it is not a repetition, it is the same failed lesson. New data, same technique.

**Week 2 rhythm (from 2026-08-09):** every session is **one new drill plus a cold re-run of the oldest closed drill**, about five minutes extra. The programme's spaced repeat - a day later, then a week later - was not happening; this makes it part of the session instead of a separate intention.

**Every session opens with three trace snippets.** Not a warm-up in spirit - a graded
part of the session. It exists because of two findings four days apart: on 2026-08-22
three of four trace misses were on code he can write, and on 2026-08-25 a real round was
lost to reading rather than to JavaScript. Reading and writing are trained separately,
and only one of them was being trained.

**The spoken part is checked, always.** Section 2 of every drill and assembly is not
optional and not homework - it is answered out loud in the session and graded here, same
as the code. It was skipped on A1 (2026-08-26) and he flagged it himself. A drill whose
spoken part was never answered is not closed.

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

## The one finding that keeps repeating

Not a JS gap. **Reading the task.** Three independent sightings in four days:

- **08-22, trace drill.** Three of four misses were on code he can write.
- **08-23, timed build 1.** Two correct values did not count: the spec said "return an
  object" and "paid orders only". Both were written down. Both were skipped.
- **08-25, Goldman CoderPad, a real round.** Task two: 13 of 38 minutes spent writing a
  new solution instead of debugging the existing one, and the line requiring
  case-insensitive matching was applied 17 minutes after it could have been.

The rule written here on 08-23 - *first two minutes, re-read the spec out loud and type
the empty answer skeleton* - and the 90-second intake protocol written after the round
are the same rule, found twice from two directions. It is now the first step of every
assembly.

## Counter

Start: 2026-08-03
Closed cold: **14 of 26** numbered drills · assemblies closed cold: **2** (A1 second pass, A2)
Day streak: **broken at 21, 2026-08-24** - one deliberate skip for a live round
Sessions: 19 · of them 📱 mobile: 2 · days with no drill: 1 (08-17, spent rewriting the plan)

**Closes per week: 6 · 4 · 4 · 0.**

Week four closed **no numbered drill at all**. Drills 15 and 16 were both written and both
came back green, and both returned - one for peeking, one for naming the mechanism
backwards. Honest by the criterion, empty by the counter. What did close was two
**assemblies**, A2 cold with no help at all and A1 on its second pass; but assemblies are
not part of the 26.

The real finding of the 08-30 review is not the rate, it is **what is left**. Ten drills
remain and **seven of them are React** (17-23), untouched, while a week and a half went
into polishing async that was already complete in content. React is the stack he presents
himself on. Next week is a React week: 17-23, one a day. Drills 15 and 16 come back only
as warm-up snippets, never as the content of a day.

**The Saturday timed run was not surviving** - instituted 08-16 as weekly, run once on
08-23, deferred once and missed outright on 08-29. Settled on 2026-09-01 by doing it on a
weekday evening instead of arguing about the schedule: **the run happens whenever he is at
the machine with 45 free minutes, Saturday or not.** The fixed day was the part that kept
failing, not the exercise.

**A timed run is not always "write it from scratch".** Build 2 was four planted faults in
working-looking code, and it trained the thing that actually loses rounds: reading a spec
and debugging what is already on screen. Alternate the two shapes.

Streak and closes now measure different things. The streak measures showing up, which
has been solved since 08-03 and no longer carries information. Closes are the number.

## Remaining - 17

**Running the React drills:** `npm run drill week-4-react/17-usestate.jsx` (add a name to run one check).

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

**Format column:** 💻 a full session at the machine · 📱 a mobile session, done from the phone in chat with no editor and no runner · ⏱ a timed run. A mobile session keeps the day, but it is not interchangeable with a full one - it cannot close a drill that has to be typed. Marked so the two can be counted apart.

| Date | Drill | Format | Result |
| --- | --- | :-: | --- |
| 2026-08-03 | 01 map ids | 💻 | ✅ all three under 90 s, no hints. Did not narrate out loud yet - that half is the target tomorrow |
| 2026-08-04 | 02 filter vs find | 💻 | ✅ all four cold, narrated out loud. some/every came out fuzzy in the spoken part, rewritten by hand as part 6 - green. Slip: typed `=` for `===` twice, caught it myself |
| 2026-08-05 | 03 reduce sum and aggregate | 💻 | ✅ all four cold, narrated out loud. Notes: tie-breaking in a max-reduce, accumulator kept on the left, flag initialised explicitly |
| 2026-08-06 | 04 group by | 💻 | 🔁 peeked at the example. Green afterwards, narrated out loud throughout. Systematic miss: forgot the `{}` initial value in all four - one habit, not four mistakes. Returns tomorrow |
| 2026-08-07 | 04 group by, second pass | 💻 | ✅ cold, no example, narrated out loud. The initial value was there in all four this time. Chose `??=` over `||=` unprompted - correct for both the array and the counter |
| 2026-08-08 | 05 destructuring, second pass | 💻 | ✅ cold, no example, narrated out loud. `greet` was green for the wrong reason at first - it read the module-level object instead of its parameter; check hardened, then fixed |
| 2026-08-09 | repeat 01 + 06 spread and rest | 💻 | ✅ repeat 01 green on the first re-run after six days, under five minutes. 06 all five checks cold, narrated. Spoken parts (b) rest vs `arguments` and (c) deep copy needed support |
| 2026-08-10 | repeat 02 + 07 optional chaining and nullish | 💻 | ✅ repeat 02 green on the first re-run including some/every. 07 green, but two functions were green for the wrong reason until the check was hardened: `||` where `??` was the point, and a chainTrap that only worked because the throw always happened. First pass had no worked example - my miss, now a written rule |
| 2026-08-11 | repeat 03 + 08 sorting | 💻 | ✅ repeat 03 green, the seed was there in all four. 08 🔁 - looked up the spelling of localeCompare, and byName mutated the shared array while the other two did not |
| 2026-08-12 | repeat 04 + 08 sorting, second pass | 💻 | ✅ 04 closed after five self-corrected iterations - the seed came back on its own, the accumulator SHAPE did not. 08 cold, localeCompare written unaided this time. sortedPrices took three tries, all of them tuning the operator while the real fault was the operands |
| 2026-08-13 | repeat 05 + 09 Set and Map | 💻 | 🔁 both. 05 reproduced the same two misses as its first pass. 09 peeked on countBy. Named three new gaps: the `for` family, mutating vs non-mutating methods, map used for side effects |
| 2026-08-14 | 05 third pass + 09 Set and Map, second pass | 💻 | ✅ both cold, fresh examples on new data. 05 clean in one go after failing the same two spots twice. 09 self-corrected without looking anything up; `??=` on a function result was the only real block |
| 2026-08-15 | repeat 06 + 10 closures | 💻 | ✅ 06 green. 10 🔁 and not a recall failure - six attempts all computed from a parameter, never declaring a variable that lives between calls. Conceptual, needed a lecture the format did not give |
| 2026-08-16 | 10 closures, makeCounter from a phone | 📱 | ✅ written cold in chat, ran green including counter independence. One day after failing it six times and googling it - the lecture was the missing piece, not repetition |
| 2026-08-18 | 11 promise basics | 💻 | 🔁 written against the example, not from memory. ok and fail ignored their parameters until the checks were hardened - eighth sighting of a function reading something other than what it was given. order needed teaching: `.then` takes a function, not a value |
| 2026-08-19 | 11 promise basics, second pass + 12 async try/catch | 💻 | ✅ 11 cold, parameters used this time. 12 🔁 - safeAwait was looked up after three attempts awaiting the function itself instead of calling it. viaThen took six attempts, all of them trying to pull a value out of a promise into a sync variable - the central async misconception, caught here rather than in a round |
| 2026-08-20 | 12 async try/catch, second pass | 💻 | ✅ cold, no example. `await boom()` written with the call this time, after three attempts yesterday awaiting the function itself |
| 2026-08-21 | 13 all vs allSettled, second pass + 14 sequential vs parallel | 💻 | ✅ both. 13 clean, the array argument came without prompting. 14 had allAtOnce calling Promise.all over plain numbers instead of promises - green because the values matched, tenth sighting; a timing check now makes that impossible |
| 2026-08-22 | mobile trace drill (no machine) | 📱 | 🔁 4 of 8. Correct: event-loop order, default sort, destructuring defaults, and that try/catch does not catch a rejected async call. Missed: `.map(slow)` calls slow twice synchronously (yesterday's lesson, one day old), an ascending comparator read as descending, a reduce callback with no return (should throw TypeError), and `||` vs `??` on `0` and `""` read as booleans. Timed build 1 deferred, folder is ready |
| 2026-08-23 | timed build 1, order report | ⏱ | 🔁 **4 of 8 on the clock, 8 of 8 an hour later.** All four "how it ran" checks green on the very first run: 24 calls, never above 5 in flight, genuinely parallel, 232 ms - batching by 5 was his own choice and it is correct. The four reds were not concurrency: returned an array instead of the object (byStatus and failed were both already right inside it), summed every order instead of paid only, topCustomers never started. After the clock all four closed, the last one being the deliberate tie: Cleo and Bo both on 385.75, a comparator with no second level returns 0, and a stable sort then ranks by insertion order instead of by name. One unblock at minute 12 - the `list.map(fn)` -> `allSettled` shape. Eleventh sighting of green for the wrong reason: positions used as ids, which only works because the ids happen to be 1..24; renumbering them to 101..124 made every single order fail. `report.reference.js` added next to it |
| 2026-08-24 | none | - | **Skipped, deliberately.** An interview at 14:00 on 08-25; the evening went to preparing for that round in the Java chat instead. Not avoidance - avoidance was the original problem and it has been closed since 08-03. A real round outranks a drill. Recorded as a gap rather than fudged, because the log is only useful if it is true |
| 2026-08-25 | trace regression + assembly A1, skeleton only | 📱 | ✅ **4 of 4 on the trace.** The four places missed on 08-22 were re-run on fresh data and all four held: `||` vs `??` on `0` and `false`, a descending comparator read correctly, a reduce whose block body returns nothing, and `.map(fn)` calling fn once per element before the next line. Two precision notes: he stopped one line short on the last one (`done` prints too, and its position was the whole question), and he called the reduce fault "because arrow function" when it is really "because a block body without return". Assembly A1 opened: the answer skeleton was written correctly first, per the rule from 08-23. The body waits for a machine |
| 2026-08-26 | assembly A1, people summary | 💻 | 🔁 all six green, but `topEarners` needed help. Three of four values landed unaided: `headcount` built through a `Map` and folded back into an object - his own idea, not from any drill - plus `payroll` and `inactive`. `topEarners` cost most of the session to two separate faults. First `localCompare` instead of `localeCompare`, second sighting after 08-11; the engine answers "is not a function", which reads as "strings cannot be compared" and sent him hunting for a concept when it was a missing letter. Second, the tie-break was written on salary rather than on name, so it could never break anything - equal salaries make equal strings. Also returned whole person objects where the spec asked for `{ name, salary }`. 📌 The tie itself finally landed: with no second level the answer is decided by row order in the input, not by the data |
| 2026-08-26 | assembly A2, ticket report | 💻 | ✅ **written cold, no help at all** - the first assembly with zero hints from me. Three real bugs found by himself: he re-read the spec mid-work and caught that unassigned tickets belong to nobody; he found a missing `.` before `sort`; and he saw that `acc[k] = (acc[k] ?? []).push(id)` stores a number, because `push` returns the new length. Spoken part 1.5 of 3. (a) right. (b) wrong and it matters - he guessed it would throw; in fact `acc[null]` silently becomes the string key `"null"`, and here that phantom person would have had 21 hours and taken first place in `busiest` ahead of Pim. (c) half: he named the real cost (one request per iteration instead of one) but wandered into the unrelated try/catch lesson, and did not say that the result would still be CORRECT - which is what makes it dangerous. 📌 Two sessions in a row a typo cost the bulk of the time (`localCompare`, a missing dot). Rule: when the engine's message does not match your understanding, re-read the spelling before doubting the concept |
| 2026-08-27 | assembly A1, second pass | 💻 | ✅ cold, no hints, narrated. Salaries had been reshuffled so the tie fell on Wei/Clara instead of the pair he saw on 08-26 - he wrote the tie-break up front and never stepped on it. Note for later: `.map(...).slice(0,3)` transforms all seven then keeps three; cut first, transform second |
| 2026-08-27 | 15 fetch, HTTP errors and AbortController | 💻 | 🔁 all ten green, two peeks. First pass, so it opened with theory. Faults, in order: called `fetchJson` recursively instead of `fetch` (stack overflow read to him as "endless re-requests"); wrapped part 1 in a try/catch that swallowed the very throw the spec asked for; `setImmediate` instead of `setTimeout`, which ignores the delay and fires on the next tick, so every request aborted before it could answer. Accidentally correct and worth keeping: he awaited `res.json()` inside the try of `safeFetchJson` but not in `fetchJson` - the first needs it or a parse failure escapes the catch, the second does not because an async function adopts a returned promise. 🔴 Spoken 1.5 of 3, and (b) came out INVERTED: he said try/catch around `await fetch` catches non-2xx statuses. It is the exact opposite - it catches only transport failure, and 404/500 fulfil. That is the whole point of the drill, so it returns |
| 2026-08-28 | 16 event loop | 💻 | 🔁 all four green cold - three predictions and `schedule`, revised in his head rather than by running, and narrated. But the drill is about the model, not the output, and the model has one hole: he described the code after `await` as going to the MACROtask queue. It is a microtask, exactly like a `.then` callback. In snippet2 there are no timers, so the wrong mechanism still produced the right order - green for the wrong reason again, this time in reasoning rather than in code. Spoken 2 of 3. (a) right in substance, called it a closure instead of starvation. (b) mechanism right, did not say what the 0 actually is (a minimum delay, not a promise; clamped to ~4 ms after five nested timers). (c) right answer, wrong reason - said macrotasks give 'clearer separation'; the real reason is that microtasks all drain inside the same tick and never yield, so chunking into them freezes the page just the same. Measured it: 2000 chunks via microtasks let the UI tick 0 times, via macrotasks 1999 times |
| 2026-08-29 | none | - | **Missed.** No session. Not a deliberate skip like 08-24 and not a mobile one - the day simply did not happen. Timed build 2 was due here and slipped with it, second Saturday running |
| 2026-08-30 | trace warm-up + drill 15 from memory | 📱 | 🔁 **2 of 3 on the trace, `withTimeout` written on a phone but peeked.** First session under the new rule that a session opens with three trace snippets, and these were built so the two queues actually interleave - 08-28's snippet2 had no timers, so a wrong model still produced the right order. A and B green with correct reasoning: he put the `await` continuation ahead of a timer scheduled earlier, which the "macrotask" model from 08-28 could not have produced. The model moved in two days. 🔴 C missed, an adjacent gap rather than the old one: in `await g()` he queued `g` itself as a microtask. The CALL happens first and synchronously - an async function runs to its own first `await` before anything is queued. Third sighting of one idea from three directions (drill 14 `list.map(slow)`, snippet A today, now C): **calling starts the work, `await` only waits.** `withTimeout` came back structurally complete from memory - try/catch/finally, signal passed, `res.ok`, `AbortError` told apart, rethrow, `clearTimeout` in `finally`. He peeked, so 15 returns again, but what he peeked for was API spelling, not shape - and that distinction is worth keeping. Two real slips survived the phone: the parameter is `md` while the body uses `ms` (second parameter-name mismatch this week, after `setImmediate`), and `"http +" + status` puts the plus inside the string |
| 2026-08-31 | none | - | **Missed.** Second miss in three days after 08-29. Named by him without excuses |
| 2026-09-01 | 17 useState | 💻 | 🔁 all eight green in the end, but the day is a red mark on ME, not on him. Harness built first: real jsdom, real React 19 root, JSX via esbuild-register, `npm run drill <file>` - serves all seven React drills. 🔴 **Three of the four tasks passed while dodging their own lesson, because I wrote the checks badly.** `setCount(count + 2)` satisfied "one click adds two" without ever meeting the stale-closure trap; `useEffect` satisfied the lazy-init task; a nested `setTags(prev => setTags(...))` passed because a second state update in the same handler forced the re-render anyway. Eleventh sighting of green-for-the-wrong-reason, this time in my own code. All three hardened mid-session: task 1 rewritten as `<Delayed />` where three clicks race one 20 ms timer and no arithmetic can save you, `<p id="count">` added so an `undefined` state throws, `useEffect` banned by a source check. 🔴 **And I gave the task before the theory for the third React drill running.** He said it plainly: *"I would NEVER have guessed what you want - in seven years of React I have never used this."* That is true and it is fair. Rule now absolute: **every first pass on a React drill opens with the explanation.** What he actually knew and what he did not: `Greeter` written correctly cold, controlled input and all. But the component model itself needed teaching - he passed `count` as a prop, returned strings instead of JSX, destructured `useState` with braces, called the setter during render, and used a `const` handler before its declaration. The updater form `setX(prev => ...)` had to be handed over as a literal line at the end. 📌 Two of his own patterns worth keeping: `?.` used to silence a crash instead of fixing the `undefined` above it, and building a hypothesis ("the first render beats the prop") when the error message already named the cause (`nothing matches #count`) - the same reading failure as the 08-25 round |
| 2026-09-01 | timed build 2, inherited code | ⏱ | ✅ **8 of 8 in 20 minutes of the 45.** The Saturday fixture, finally run, and in a new shape: not "write it from scratch" but four planted faults in someone else's working-looking code - built to drill the exact failure of the 08-25 round, where 13 of 38 minutes went into rewriting instead of debugging. All four found and fixed by reading the checks: case-insensitive match, tie-break plus the mutating `sort`, an inclusive boundary, and a filter that was missing plus a `toFixed` that returns a string. Two self-catches worth keeping: he first lowercased only the name and not the query - the half-fix on case, which is the Goldman miss verbatim - and the "upper case query" check caught it; and he wrote `parseInt` on `"600.83"`, saw 600, and moved to `parseFloat` himself. He also named `toSorted` and `[...list]` as alternatives before choosing, unprompted. Compared with timed build 1 on 08-23 (4 of 8 on the clock, one unblock given): this one needed nothing from me at all |
| 2026-09-02 | 18 useEffect and cleanup | 💻 | 🔁 all five green, and the fifth was handed over - he called the session at the end of task 3, asked for the solution to memorise, and that is an honest stop rather than a fudge. Opened with theory per the React rule, and this time the theory was verified before it was sent: a `Thermo` component printed `OPEN kitchen / CLOSE kitchen / OPEN garage / CLOSE garage`, which shows both moments React runs a cleanup, and a `WeatherBad` / `WeatherGood` pair showed the stale answer landing on screen at 90 ms in one and not the other. ✅ `Clock` and `Title` both written cold on the first attempt with no peeking - interval plus `clearInterval` in the cleanup, `[text]` as the dependency - and he narrated them. That is the component model from 08-31 arriving one day later. 🔴 **`Search` was green and wrong, twelfth sighting.** He left the dependency array off entirely, so the effect re-ran after the state update, set a second 30 ms timer and called `runSearch("abc")` a second time - 30 ms AFTER the check had already read the log. Measured: at 60 ms `["abc"]`, at 260 ms `["abc","abc"]`. It stops only because the second result is the identical string and React bails out of the re-render. The `act` warning he pasted and could not read was exactly this and nothing else - in this harness that warning means something is still running after the check stopped watching. 🔴 Closures are the real gap and he said so first: *"I still poorly understand this closure and the difference between const/let and var."* Re-taught as boxes - a function keeps the box, not the value; how many boxes exist is decided by how many times the declaration line RUNS; `for (let i)` gets a fresh box per iteration, a `let` above the loop gets one box for all of them; `var` gets one box per function call. Verified all three. That is the same mechanism as the `current` flag in task 4, which is why it went first |
| 2026-09-03 | 19 keys in a list | 💻 | 🔁 all six green, two of the four handed over. ✅ **3 of 3 on the trace - the first clean opener since the rule started on 08-30.** Closures read correctly at call time, `a === b` on two identical literals, `[...a] === a`, and `reverse` returning the same array with `toSorted` returning a new one - that last one he answered `false` on 09-02 and answered right today. ✅ `Roster` keyed by `p.id` first time, unprompted, and `Pairs` written correctly with `<Fragment key={r.id}>` - he read up on `dl`/`dt`/`dd`, which he had never used, and got it in one. 🔴 `Roster` still threw first, on `person={item.name}` instead of `person={item}` - he did not read the given `Row` before writing against it, and the error printed `id="b-undefined"`, which was the answer. Same reading failure as 08-25, and he named it himself before I did. 🔴 Tasks 3 and 4 both stalled at *"I completely do not understand what is wanted"* and were handed over as worked examples. **And he was right about why:** *"the example before the drill has stopped explaining what is actually wanted from me. Let us change the approach."* A drill-level explanation teaches the concept and leaves the SHAPE of each answer to be guessed - that is a riddle again, in a new form, three days after the same rule was made absolute for React. Fixed and committed: **one worked example per TASK**, plus given code quoted in the session message rather than left in the file. Second process fault of my own: English component names (`Roster`, `Draft`) cost him a translation step for nothing - names go transparent from drill 20. 🔴 Spoken 1 of 3. (a) half - had the index rule and the append-only exception, but framed a key as a uniqueness label rather than as React's answer to "which of these is the one I had last time", and missed that uniqueness is among siblings only. (b) knew the replacement, not the reason: `<>` is sugar with nowhere to put attributes, and `<key={x}>` is a parse error, not a React rule. (c) missed - said he had not changed a key, when `key={user.id}` going from 1 to 2 IS the change; the answer is unmount of the old, cleanup, mount of a fresh one. 📌 He raised ADHD as the reason for the reading misses; the answer given was a protocol, not encouragement - before writing a line, write out for each given component its name, its props, what it reads off each prop, and what it renders |
| 2026-09-04 | 20 controlled inputs and lifting state up | 💻 | 🔁 **all six green cold, and three of them green for the wrong reason.** First drill built under the two rules he named on 09-03 - a worked example per TASK and transparent component names - and the format worked: no "I do not understand what is wanted" in the whole session, and the lifted state in `Thermometer` came out right on his own, one state with the second field derived and the reverse conversion in its `onChange`. Self-corrected twice without help: `<p id="total">{num}</p>` where it should have been `{sum}`, and `setMeters` copied out of my example. 🔴 Three defects the checks let through, all confirmed by probe. `useState(initial || true)` ignores the prop entirely - with `initial={false}` the box still renders ticked; thirteenth sighting, and this one is `||` erasing a legitimate `false`, which is drill 07 material. `.trim()` inside `onChange` runs on every keystroke, so a space never survives - typing "John Smith" one character at a time produces `"johnsmith"`, and the user physically cannot enter a space; my own `CityField` example put `.trim()` there, so half of that one is mine. `Number(celsius) > 99` instead of `>= 100` - the spec said "100 and above", the check feeds exactly 100, and 99.5 comes out boiling; the same boundary trap he FOUND when it was planted for him on 09-01, written by himself today. 🔴 Trace 2 of 3. A: `Number("  ")` guessed as 2 (whitespace trims to empty, so 0) and `Boolean("0")` called false (only the empty string is falsy). B: put `p` before `b` - the mirror image of the 09-03 miss, and one rule covers both: **a task enters the microtask queue at the moment the promise is ALREADY settled**, so `await Promise.resolve()` queues immediately while `.then` on a pending promise queues nothing. C right. 🔴 Spoken 2 of 3. (a) the frozen input was right, but he listed `id` as one of the three required parts - `id` is only the check's selector; the three are the state, `value` from it, `onChange` back into it. (b) "the child gets a reference to the parent's state" - it gets a VALUE and a function to report with; state is never handed out by reference, and he did not say WHEN state is lifted. (c) right in full |
