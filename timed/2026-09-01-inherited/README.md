# Timed build 2 - inherited code

**45 minutes on the clock.** Start the timer before you open `catalog.js`.

This one is not "write it from scratch". `catalog.js` was written by someone else, it
mostly works, and **eight checks say otherwise**. Your job is to make them green.

Why this shape: on 2026-08-25, in a live round, 13 of 38 minutes went into writing a new
solution instead of debugging the one already on screen, and a line of the spec was
applied 17 minutes late. This drills exactly that.

## Rules

- **Do not rewrite `catalog.js` from scratch.** Find the fault, change the line.
- Read the spec below out loud before you touch anything. All of it.
- Narrate while you work.
- `check.js` is given, do not edit it.
- Timer rings - stop, even if it is red. Send what you have plus the number of minutes.

## The spec

`findByName(list, query)` - ids of every product whose name contains `query`,
**case-insensitively**. Ids ascending. No match is an empty array.

`topRated(list, n)` - the `n` best rated, as `{ name, rating }`.
Sort: rating descending; **on a tie, name ascending, ignoring case**.
It must **not modify the list it was given**.

`priceBands(list)` - ids grouped by price into `{ cheap, mid, pricey }`:
**cheap** is under 50, **mid** is 50 to 500 **inclusive**, **pricey** is over 500.

`stockSummary(list)` - `{ count, averagePrice }` over the **in-stock products only**.
`count` is how many. `averagePrice` is a **number** rounded to two decimals, not a string.

Run: `node check.js`
