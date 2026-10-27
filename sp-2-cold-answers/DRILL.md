# SP2 Cold answers - say what you were asked

Run 27.10.2026. Continuation of `sp-1-markers`, with a new method: the answer is spoken into a phone and scored against a card of countable items, instead of being typed into a chat and judged by reading.

The card: duration, fillers spoken aloud, questions handed back to the interviewer, markers 0-4, terms said other than written, own numbers.



# What the log says is weakest, counted rather than remembered

| Zone | Sightings | Outcome |
|---|---|---|
| Unfollowable when moving to the solution | four independent companies in two weeks - Fresha 02.10, Soda 07.10, EPAM 13.10, Soda 15.10 | the only one ever named as the cause of a rejection |
| Simple question under observation | OLX 15.10 local state, Soda 14.10 columnar, EPAM 13.10 live code | the easier the question, the higher the chance of a miss |
| No numbers of his own | eight rounds running by 28.09, then OLX 08.10 "I'm sorry, I don't remember the numbers" | still open |
| Concedes the number at first doubt | Regnology 16.10 | 5-6k brutto given away before an offer existed |

The technique was praised in all four write-ups of zone one. The rejections were for the telling.



# Task 1 - cold, no preparation

"How do you handle errors in a frontend application?"

## Result: answered a different question

2:50 spoken. The word `error` appears **once**, inside a list, in the first fifteen seconds. The remaining two and a half minutes are a performance investigation - requests, pagination, memory leaks, debounce, asset size.

Not one word of the vocabulary the question was about: error boundary, try/catch, unhandled rejection, fallback UI, retry, Sentry, correlation id.

The content itself was good. It was a competent answer to a question nobody asked.

**Mechanism, and it is zone two exactly:** a short, familiar-sounding question does not trigger the "check what is being asked" step, so the nearest rehearsed frame arrives on the sound of the question rather than its meaning. Two weeks of drilling "eleven seconds is not one number" is what came out.

| Card | |
|---|---|
| Duration | 2:50, inside budget |
| Fillers aloud | 6 |
| **Questions handed back** | **0** |
| Markers | 0.5 of 4 |
| Own numbers | 0 |

🟢 **Zero questions handed back, and that is new.** The three previous attempts produced five between them - "Right?", "Make sense?", "Shall I continue?". That sub-zone closed in two days.

📌 And the markers explain themselves: 4 of 4 on 20.10 when the shape was prepared, 0.5 of 4 here when the content had to be invented. **The markers hold where the content is ready.**



# Task 2 - retelling the reference answer

Scored 3 of 4. Count, map and closed parts all present. **The landing was missing again** - the answer ended on "back-end log can be joined" instead of the one line it was built for.

📌 **The landing is the only marker that has never survived a single run** - 19.10, 20.10, 27.10. The other three now arrive by themselves, so there is one thing left to train rather than four.

Vocabulary, which was the point of the exercise: 6 of 7 landed - unhandled promise rejection, fallback, Sentry, correlation id, retry, inline validation. The miss was **error boundary**, which is the mechanism the whole middle section exists for, and which he then asked about directly. Explained: it catches errors thrown during render so one subtree shows a fallback instead of the app going white, and it does not catch event handlers or async code.



# Task 3 - cold again, one rule: name what you were asked first

"How do you decide what to test?"

1:55 spoken. The rule was not followed - the answer went straight into content - but two parts were named in the first sentence, real cases and priority, which is half the map. Markers 2.5 of 4.

✅ The opening instinct was right: what the user will actually hit in production. That is risk-based testing and it is the senior answer.

🔴 **The landing was "95 or 100% should be covered by the test".** An interviewer stops there and pushes, because coverage counts lines executed and not behaviour checked, and it contradicts his own first half about priority. Replacement that keeps his own idea: *"Coverage percentage is not a goal - it counts lines executed, not behaviour checked. I test by risk: what hurts the user if it breaks, times how likely it is to break."*



# 🔴 The finding that changes how this is measured at all

Maksim, same evening: **half the mispronunciation list was never a mispronunciation.** `long chain`, `long fuse`, `flow wise`, `middle wire`, `relout`, `ZOOSTAND` come from **Whisper transcripts of his own recordings**, not from anything an interviewer reacted to. He says the words came out fine when he said them.

**A transcript is evidence of what the tool heard. It is not evidence of what the person said.**

Of the whole terminology zone, exactly one instance survives on independent evidence: `pictures` instead of `snapshots` on Soda 14.10, where the interviewer asked twice - *"What do you mean by pictures? What pictures?"* - and the confusion is in his words, not in a machine's.

The same doubt applies to `digit` for `widget` and `Unity` for `unit` recorded today: both came out of dictation into a chat, so both may be the phone and not the mouth.

**Rule from here: a word counts as a miss only when a live listener reacted to it.** The deck keeps the cards, because saying a name out loud once is cheap and useful, but the zone loses six of its seven sightings.



# Homework, "a new way to do a work task"

The new method was: record the answer, score it against a card of countable items, instead of typing it into a chat.

His verdict, in his words: making the cards was far easier; speaking a three minute answer is much harder than doing cards.

📌 Which is the answer to the question the exercise asks. The hard version is the one that matches the round - nobody is interviewed by typing - and the easy version is the one that was being done instead. The difficulty is the point, not a defect of the method.
