# Probes

A probe is five lines of code that make one rule visible. It is written by the
student, not by me, and it exists because of what the log says: the rules that
stuck are the ones that were MEASURED - `Object.is` on two literals, the queue
holding `[5,5,5]` against `[0,5,10]` - while the flashcards for the same facts
did not stick at all.

## When a probe is written

During the opener. Every snippet is answered with **the value AND the rule that
produces it**. A value without its rule counts as a miss even when the value is
right. A rule that could not be named becomes a probe, written and run in the
same session, by hand.

## The shape

`_template.js` is the shape: predict, run, then one line naming the rule in
words you would use out loud in a round. The prediction is written BEFORE the
run and is not edited afterwards - a probe whose prediction was adjusted to the
output measures nothing.

## Naming

`probes/2026-09-23-nan-identity.js` - the date it was written plus the rule it
is about, so a probe can be re-run cold weeks later.
