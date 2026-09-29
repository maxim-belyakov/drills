# Spec 3 - arrived at minute 60. The timer does not stop.

Specs 1 and 2 still hold. This adds to them.

**Run `check3.jsx` from now on.** Fourteen checks: everything from check2 plus what is
below.

    npm run drill timed/2026-09-29-dispatch/check3.jsx

## What the dispatcher asked for

Two dispatchers are working the same board, so an order can be taken while you are
looking at it.

1. **The assign can come back `409`**, with the same body shape as any other error:
   `{"error": "already taken by Cez"}`. When it does, that row shows
   `#conflict-{id}` with the message the server sent.

2. **Bo did not get the order**, so the row must not claim he did. After a 409 the row
   **reloads itself** with `GET /orders/{id}` and shows the courier who really has it
   in `#courier-{id}`. The list is still not refetched: one list request stays one
   list request, and the other rows are not touched.

3. **While an assign is in flight, that row's button is `disabled`** - and only that
   row's. A neighbour's button stays live.

4. **Two clicks on one button put one POST on the wire.** Not two.

## Before you write

Say out loud, in one sentence each:

- which of requirements 3 and 4 is about the interface and which is about the logic,
  and what breaks if you implement only the one you did
- your row is `<li>` per order and the per-row flags are now two: in flight, and
  conflicted. Where do they live, and what is the price of that choice when a second
  list arrives?
