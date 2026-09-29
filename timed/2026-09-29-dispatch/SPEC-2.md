# Spec 2 - arrived at minute 30. The timer does not stop.

Everything in spec 1 still holds. This adds to it.

**Run `check2.jsx` from now on**, not `check.jsx`. It contains all of spec 1 plus
what is below, so green here means both specs hold:

    npm run drill timed/2026-09-29-dispatch/check2.jsx

## What the dispatcher asked for

1. **A weight cap.** `#max-weight` is an `<input>` next to `#status`, on the page
   always. While it holds a number, only orders with `weight <= that number` are on
   screen. Empty filters nothing. A value that is not a number filters nothing
   either - the board does not go blank because someone typed a letter.

2. **`#count` counts the rows on screen**, as before - which now means after the cap.

3. **`#assigned-count` is new**, and reads exactly:

       {how many rows on screen already have a courier} of {how many rows on screen} assigned

   e.g. `0 of 3 assigned`. It must move **the moment an assign succeeds**, and the
   list is still not refetched - one list request stays one list request.

4. **The cap survives a status switch.** Switch from `new` to `assigned` and the
   number you typed is still in the box and still filtering.

## Before you write

Say out loud, in one sentence each:

- where the assigned number has to read from, for requirement 3 to hold at all
- what happens to a filter typed by the user if its value lives anywhere that the
  list request can reach
