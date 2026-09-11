# Timed build 4 - inherited React

**45 minutes on the clock.** Start the timer before you open `inbox.jsx`.

Same shape as build 2 on 2026-09-01, in React this time: `inbox.jsx` was written by
someone else, it mostly works, and **six checks say otherwise**. Make them green.

Why this shape again: every fault in here is one you have written yourself in the last
two weeks, and every one of them was green under its own check. This build hands you
the checks that would have caught them.

## Rules

- **Do not rewrite `inbox.jsx` from scratch.** Find the line, change the line.
- Read the spec below out loud before you touch anything. All of it.
- First two minutes: for `Row` and `Inbox`, write down the props, what each one is
  read for, and what is rendered. Then start.
- Narrate while you work.
- `check.jsx` is given, do not edit it.
- Before calling a line fixed, ask out loud: **what input would break this that the
  check never sends?**
- Timer rings - stop, even if it is red. Send what you have plus the number of minutes.

## The spec

`<Inbox messages={...} initialUnreadOnly={...} />`

- Renders the messages **in the order given**, one `<li id="m-{id}">` each, with a
  star button `#star-{id}` that toggles between `-` and `*`. The star belongs to the
  message, not to the row position.
- `#q` is a search field. **Any non-empty query** filters by subject, case-insensitive
  on both sides. The user must be able to type spaces.
- `#unread-only` is a checkbox. When on, only unread messages are shown. Its initial
  state is the `initialUnreadOnly` prop; **the prop is a boolean and is respected as
  given**, `false` included. When the prop is missing, the box starts off.
- `#clear` empties the search and switches the box off - **the box on screen, not
  only the state behind it**.
- `#count` says `{shown} of {total}`. An empty result renders `#empty` and no rows.
- A new `messages` array handed to the component is shown at once.

Run: `npm run drill timed/2026-09-12-inbox/check.jsx`

## Spoken, after the clock

- a) For each line you changed: what input breaks the OLD line that its check never sent?
- b) Why is `value` on a checkbox not the same as `checked`, and what does "controlled"
  mean for a checkbox in one sentence?
- c) The star moved to another message. Say what React actually did, in terms of
  mount and unmount, and why the fix is one attribute.
