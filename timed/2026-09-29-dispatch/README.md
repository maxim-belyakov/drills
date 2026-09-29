# Timed build 7 - drill 26 - dispatch board, requirements change on the clock

**90 minutes on the clock.** Start the timer before you open anything.

This is the last drill of the programme, and the only one where **the requirements
change while you build**. You get spec 1 now. Around minute 30 a second spec arrives
in the chat, around minute 60 a third. Each one adds to what is already there; none
of them throws your work away, but none of them was foreseen in full either.

What is being trained here is not React. It is what happens to your code when the
person on the other side says "and also...". Write version one so that version two
is cheap - and say out loud, when you make a structural choice, what it would cost
to change later.

## Rules

- The timer does not stop for the new specs. Reading them is part of the 90 minutes.
- Read every spec out loud before writing. All of it.
- Narrate while you work.
- `check.jsx` is given, do not edit it. The server block in `dispatch.jsx` is given too.
- You write only between the two markers.
- Before calling anything done, ask out loud: **what input would break this that the
  check never sends?**
- Timer rings - stop, even if red. Send what you have plus the number of minutes.

## Spec 1

Build `Dispatch`, a board for the dispatcher of a courier service.

- `#status` is a `<select>` with `new`, `assigned`, `done`. It is on the page
  **always**: while loading, after an error, and with rows on screen. It starts on
  `new`.
- On mount and on every change of the selection, the component asks
  `GET /orders?status=<status>` and renders the answer.
- While a request is in flight, `#loading` is on the page.
- A failed request renders `#error` with the message the server sent, plus a
  `#retry` button that repeats the request.
- Rows are `<li id="o-{id}">` inside `<ul id="list">`, each showing the address.
- `#count` shows how many rows are on screen.
- An order with no courier shows a button `#assign-{id}`. Clicking it sends
  `POST /orders/{id}/assign` with `Content-Type: application/json` and the body
  `{"courier":"Bo"}`. On success **that row** shows `#courier-{id}` with the name and
  loses its button. **The list is not refetched** - one list request stays one list
  request.
- The slow answer for a status the user has already left must never replace a newer
  one.

Run: `npm run drill timed/2026-09-29-dispatch/check.jsx`

## Spoken, after the clock

- a) Where did spec 2 and spec 3 cost you a rewrite, and what would you have written
  differently in version one knowing them?
- b) One structural decision you made on purpose, and the trade-off you accepted.
- c) What input would break your final version that no check sends?
