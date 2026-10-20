# TS1 Occupancy by resource - code and voice at the same time

Built 20.10.2026 the evening before the Regnology coding challenge. Their own framing: TypeScript or Java, a task from a template, and "you don't really need to know algorithms by heart". So the round scores the telling, not the algorithm.

Run as an interview: the interviewer holds the edge cases and releases them only when asked, and demands a three step plan out loud before the first line of code.



# Task

```ts
type Booking = {
  id: string;
  resourceId: string;
  startsAt: string;            // ISO
  endsAt: string;              // ISO
  status: "confirmed" | "cancelled" | "pending";
};

// occupancyByResource(bookings, dayISO)
//   -> [{ resourceId, minutesBooked, conflicts }]
//
// only confirmed bookings
// clip intervals to the boundaries of the given day
// conflicts = number of overlapping pairs within one resource
// sort by minutesBooked descending, ties by resourceId
```

Edge cases the candidate has to ask about, held by the interviewer: empty array, a booking crossing midnight, a booking entirely outside the day, touching intervals that do not overlap. Plus two that are not on the list and decide the answer: which timezone the day is in, and whether minutesBooked may exceed 1440 when two bookings of one resource overlap.



# Result 20.10.2026

## The algorithm was right, written on paper under a timer

Group into a `Map` keyed by resourceId, clip with `Math.max(bStart, dayStart)` and `Math.min(bEnd, dayEnd)`, keep the interval only when `clippedStart < clippedEnd`, compare pairs with the inner loop starting at `j = i + 1`, overlap test strict on both sides so touching intervals do not count, sort descending with `localeCompare` as the tie break. All of that first time, no reference.

The strict `<` on both sides is the answer to the touching-intervals edge case. He never asked about that case and handled it correctly anyway - and never said so out loud, which is where the points were.

## Three real findings

1. **`return results.sort(...)` sits inside the outer loop.** Only the first resource is ever returned. This is structure, not typing, and no editor catches it.
2. **The day window is taken as exactly 24 hours from `dayISO`.** Never said out loud. On a DST change the day is 23 or 25 hours, and if `dayISO` is not UTC the window shifts.
3. **`minutesBooked` adds overlapping bookings twice**, so a resource can exceed 1440 minutes in a day. That may be correct or may be a bug, and the decision was made silently.

## The process finding, which is the point of the drill

Three questions were asked - what complexity two nested loops are, what the outer loop iterates over, and what `conflicts` shows for exactly two overlapping bookings. **None were answered.** Each time the reply was the next block of code. A request to trace one booking out loud was also not done; the bug was fixed silently instead.

Fixing it silently is good engineering and invisible to an interviewer. He asks again in different words - which is exactly what happened in the Regnology team round earlier the same day, where one question came in four formulations.

One edge case of four was asked.

## Loose terms

- "it will be of logarithm n" for two nested loops over pairs. It is O(n squared), and the claim was not corrected when questioned directly.
- Structure described, approach never named. The word is pairwise comparison.
- None of group by, clip, half-open interval or tie break were used, although all four were being done.
- "I will increase conflict for my current booking and for the booking in the inside loop" counts per booking; the spec counts pairs. The code came out right, the words said something else.

## My own error in this run, recorded because it changes how the drill is scored

The first verdict listed seven findings. Four of them were syntax typed into a chat window with no editor - a missing `=`, `=` for `=>`, a missing closing brace, an unchecked `Map.get`. Those are not findings, they are the absence of a keyboard, and presenting them in one table with the real ones made the result look several times worse than it was. Maksim said so and he was right.

**Rule for this drill from now on: when the code is typed into a chat, syntax and typos are not scored. Only logic, structure and unasked questions are.**



# Green - must be heard

1. The task restated in full before anything else: minutes per resource inside the day, overlapping pairs, and the sort order. Not one third of it.
2. A plan read backwards from the output - name each field of the result and where it comes from. Planning forward is how grouping, clipping and the minutes went missing from the plan.
3. Every question from the interviewer answered before the next line of code.
4. At least two edge cases asked about unprompted.
5. The complexity named correctly when asked.
6. A decision said out loud when it is made silently in code - "touching intervals are not a conflict, so I use a strict less than".
