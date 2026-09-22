# Timed build 6 - inherited React, a restock board

**45 minutes on the clock.** Start the timer before you open `restock.jsx`.

The fault-hunt shape, after build 4 on 09-14: `restock.jsx` was written by someone else,
it mostly works, and **five checks say otherwise** out of nine.

One of those five is the reason this build exists. On build 5, a single red check hid two
faults, and the structural one - an element missing from the page - hid the logical one
underneath it. There is a pair like that in here. When a check goes on failing after a fix
that was genuinely needed, that is the signal, not a reason to undo the fix.

## Rules

- **Do not rewrite `restock.jsx` from scratch.** Find the line, change the line.
- Read the spec below out loud before you touch anything. All of it.
- First two minutes: for `Row` and `Restock`, write down the props, what each one is
  read for, and what is rendered. Then start.
- Narrate while you work.
- `check.jsx` is given, do not edit it. The service block in `restock.jsx` is given too.
- Before calling a line fixed, ask out loud: **what input would break this that the
  check never sends?**
- Timer rings - stop, even if it is red. Send what you have plus the number of minutes.

## The spec

`<Restock warehouses={["north", "south"]} />`

- `#warehouse` is a selector of warehouses. It is on the page **always**: while a request
  is in flight, after a failure, and with rows on screen.
- On mount and on every change of the selection, the component asks `loadStock` for that
  warehouse. While the answer is in flight `#status` says `loading`.
- Rows render **in the order the service gave**, one `<li id="p-{sku}">` each, with a note
  field `#note-{sku}`. The note belongs to the part, not to the row position.
- A failure renders `#error` with the message and a `#retry` button. **A new request
  clears the previous error before it starts** - the screen never shows a fresh list and
  a stale error at the same time.
- `#q` filters by part name, case-insensitive on both sides. **Any non-empty query
  filters**, one letter included.
- `#count` says `{shown} of {loaded}`.
- `#total` is the money of the rows on screen, `price * qty` summed, two decimals.
- The slow answer for a warehouse the user has already left must never replace a newer
  one.

Run: `npm run drill timed/2026-09-26-restock/check.jsx`
(add a word to run one check: `npm run drill timed/2026-09-26-restock/check.jsx retry`)

## Spoken, after the clock

- a) For each line you changed: what input breaks the OLD line that its check never sent?
- b) Check 7 stays red after the fix that check 6 asked for. Name both faults behind it,
  and say which part of the failure text told you that you were looking at the second one.
- c) The note ended up on another part. Say what React did, in terms of mount and unmount,
  and why putting the index into the key is not a fix.
