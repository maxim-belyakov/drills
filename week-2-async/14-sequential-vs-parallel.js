// Drill 14 - sequential versus parallel: why a loop with await inside is slow
//
// Green criterion, two parts: cold from memory, and narrated out loud.
//
// Run:  node week-2-async/14-sequential-vs-parallel.js
// Run after EVERY function.

// each call takes 50 ms and resolves with its own id
const slow = (id) => new Promise((resolve) => setTimeout(() => resolve(id), 50));
const ids = [1, 2, 3, 4];

// --- 1 --------------------------------------------------------
// oneByOne(ids) must fetch them in a for...of loop with await INSIDE, and return
// the array of results.
//   -> [1, 2, 3, 4]
// Four calls of 50 ms each, one after another. Note how long that is.

function oneByOne(list) {
  // here
}

// --- 2 --------------------------------------------------------
// allAtOnce(ids) must do the same work in parallel and return the same array.
//   -> [1, 2, 3, 4]
// Start every call first, then wait for all of them.

function allAtOnce(list) {
  // here
}

// --- 3 --------------------------------------------------------
// Prove it. compare() must time both, and return a two-element array:
//   [ <did oneByOne take at least 190 ms?>, <did allAtOnce take under 120 ms?> ]
// Use Date.now() before and after each. Expected: [true, true]

function compare() {
  // here
}

// --- 4 --------------------------------------------------------
// The trap that looks parallel and is not. Both of these are written with .map,
// but only one of them actually runs in parallel:
//
//   A:  await Promise.all(list.map(async (id) => await slow(id)))
//   B:  const out = []; for (const id of list) { out.push(await slow(id)) }
//
// mapTrap() must run this THIRD version and return how long it took, rounded
// down to the nearest 50:
//
//   const out = [];
//   for (const p of list.map(slow)) { out.push(await p) }
//
// Is that one sequential or parallel? Do not guess - run it.
// Expected: 50

function mapTrap() {
  // here
}

// --- 5, spoken, nothing to write ------------------------------
//   a) at which exact moment does a promise start doing its work
//   b) why is version 4 above fast, even though it awaits inside a loop
//   c) you have 500 items and an API that allows 5 at a time. Promise.all over
//      all 500 is wrong - what do you do instead, and what is that called

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

runChecks([
  { name: "oneByOne", fn: oneByOne, run: () => oneByOne(ids), expected: [1, 2, 3, 4] },
  { name: "allAtOnce", fn: allAtOnce, run: () => allAtOnce(ids), expected: [1, 2, 3, 4] },
  { name: "compare", fn: compare, run: () => compare(), expected: [true, true] },
  { name: "mapTrap", fn: mapTrap, run: () => mapTrap(), expected: 50 },
]);
