# SP1 Structural markers - being followable out loud

First pass: technique, one worked example on unrelated material, then two tasks cold. Repeat later with different questions and no technique block.

Why this drill: Soda rejected on 15.10.2026 and named the reason first, in writing - "Our main issue was communication. You clearly have experience and were able to summarize the problem statement well, but at times we had trouble to understand and follow you when diving into the solution." Fourth independent source in two weeks after Fresha 02.10, Soda 07.10 and EPAM 13.10, and the first time it is the cause of a rejection rather than a remark. The technique is praised every time. The telling is what loses rounds.



# The technique - four moves

1. **Announce the count** before any content. "There are three parts to this."
2. **Name every part** before expanding the first one. The listener gets a map.
3. **Close each part out loud.** "That's the first one. Second: ..."
4. **Land it in one line** that is a claim, not a summary of the structure.

And one thing to kill: thinking aloud without a signpost. The Soda transcript has "okay, let me think... what else, what else" dozens of times. Replace it with a declared pause - "Give me a second to pick the best example." Three seconds of silence after that reads as confidence; the same three seconds with "what else" reads as being lost.



# Worked example, unrelated material

Question: "How do you keep a test suite fast as the codebase grows?"

> There are three things I do, and they work at different levels: what runs, when it runs, and what we stop writing.
>
> First, what runs. Most suites are slow because integration tests outnumber unit tests. I measure where the minutes go before touching anything, and usually it is twenty tests out of a thousand.
>
> That's the first one. Second, when it runs. Not everything belongs on every commit. Unit on every push, integration on merge, the full suite nightly.
>
> And third, what we stop writing. A test that never fails is not protection, it is maintenance. We delete those.
>
> So in one line: measure first, split by when it runs, and delete what never catches anything.



# Task 1 - working with AI (90 seconds)

"Tell me how you actually work with AI - not as an add-on, but as a co-worker."

## Result 19.10.2026: markers 2.5 of 4, time 3:10 against 90 seconds

Green: announced the count in the first words, named all three layers before expanding.
Red: no "that's the first one" anywhere, and the boundary between layer two and three is inaudible. The landing restates the structure instead of making a claim.

At his measured 118 words per minute, 3:10 is about 370 words where the budget is 175. The same three points in twice the words; the excess is repetition, not content.

Content faults:
- "Bureaucracy layer" - fifth sighting of an invented word for a known thing, and this one carries a negative charge. The accepted word is intake, or simply "before I write any code".
- Not one number in three minutes, the same defect that cost the OLX manager round on 08.10.
- The AI judge against non-deterministic answers never came up, although hyperexponential's JD asks in a separate line where the agent acts, where it advises and where the human stays in control.
- The framing question was not asked. On OLX 02.10 he asked it unprompted and it is logged as the best moment of that round.

## Reference answer

> Quick check - do you mean the product, or how I work day to day? I'll take my own process, and we can go to the product after.
>
> There are three layers, and AI does a different job in each: before the code, during it, and after.
>
> First, before the code. When a ticket arrives I close the open questions with the analyst. Then I ask AI to read the requirements and tell me what is missing - edge cases, dependencies I did not think of. On my team a ticket cannot be estimated while questions are open.
>
> That's the first one. Second, during the code. For a complex ticket I do not hand it to the model first. I draw the skeleton myself, the abstract classes and the data schema, and only then let AI fill it in, checking at every step.
>
> And third, after the code. Tests, a QA agent that brings up an environment with fake data, a security scan, and an AI reviewer that all eight engineers on my team have installed.
>
> One line: AI is fast and it lies about being done, so I only let it work where the output can be checked.



# Task 2 - purely hands on (60 seconds)

Molly's wording, 06.10.2026: "For this particular role, it will be purely hands on. It won't be that kind of management responsibility. Is that something that you're kind of open to? Are you looking to continue with those management responsibilities?"

Must be heard: yes in the first sentence, one reason why he wants it, what the lead years give him as an engineer rather than as a title, and yes again at the end. Forbidden near the word management: combination, plus, as well as.

## Result 19.10.2026: 2.5 of 4, and much better than 06.10

The ending no longer reverses the opening, which was the whole failure on 06.10, where the answer began "Yeah, definitely" and closed with "if this role has management responsibility plus a strong technical lead element, that's the combination that I'm comfortable with".

Still leaking:
- "One thing why I'm worried is I won't focus more to the code right now" - says the opposite of what he means, and the word worried introduces doubt where there is none.
- "I still can do manage tasks" - the same door from 06.10, opened in the middle instead of at the end. They did not ask whether he can, they asked whether he wants to work without it.

## Reference answer

> Yes, that is exactly what I want.
>
> For two years I have split my time sixty forty between code and leading eight people, and the forty is the part I want back. AI is changing how software gets built right now, and I want to be hands on the keyboard for that, not hearing about it in a standup.
>
> What I keep from leading is useful as an engineer, not as a title. I built our Git flow, our Jira flow and our release process myself. So when something in the process slows the team down, I see it early and I can fix it without needing a mandate.
>
> So yes, purely hands on is what I am looking for.

The third paragraph is the load-bearing one: the lead years are presented as an engineer's instrument, not as a claim on a role. And 60/40 is what makes "I want the code back" measurable instead of declarative.



# Score

Markers 2.5 of 4 on both tasks, and in both cases the missing half is the same one: closing a part out loud, and landing on a claim rather than on a restatement of the structure. Repeat with new questions before the next round.
