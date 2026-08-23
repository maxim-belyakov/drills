# Timed build 1 - clock state

Run started 2026-08-23.

- **12 minutes used.** 33 minutes remain.
- Paused at minute 12 by a real interruption, not by being stuck.
- One unblock was given at minute 12: the `list.map(fn)` -> `Promise.allSettled` shape,
  on unrelated data, plus two mechanical faults named (`i + 5` does not move `i`;
  only `fetchOrderIds` was imported).
- Strategy chosen by hand: batches of 5. Valid here - 5 waves x 40 ms = ~200 ms.
- Open question left with him: `allSettled` gives `reason` but no id, so where does
  the id for `failed` come from?

Resume: 33 minutes on the clock, same rules. Do not read this file's neighbours.
