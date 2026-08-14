// Drill 9 - Set and Map: unique values, and when a Map beats a plain object
//
// Green criterion, two parts, both required:
//   1. all four from memory, no hints, under 90 seconds each, tests green
//   2. narrated out loud WHILE typing
//
// SECOND PASS - 2026-08-14. First pass was 🔁: countBy got looked up.
// Fresh example given, different data.
//
// Run:  node week-1-js/09-set-map.js          all checks
//       node week-1-js/09-set-map.js edge     only checks matching "edge"
// Run after EVERY function.

const rows = [
  { sku: "A-1", city: "Warsaw" },
  { sku: "B-7", city: "Krakow" },
  { sku: "A-1", city: "Gdansk" },
];

const words = ["tea", "coffee", "tea", "tea", "water"];

// --- 1 --------------------------------------------------------
// unique([3, 1, 3, 2, 1]) -> [3, 1, 2]
// An ARRAY back, not a Set. Order of first appearance is preserved.

function unique(list) {
  // here
}

// --- 2 --------------------------------------------------------
// uniqueBySku(rows) -> [ <A-1 Warsaw>, <B-7 Krakow> ]
// Unique by a FIELD, keeping the first row seen for each sku.
// A plain Set of the objects will not do this - think about what you put in it.

function uniqueBySku(list) {
  // here
}

// --- 3 --------------------------------------------------------
// countBy(words) -> a Map: "tea" -> 3, "coffee" -> 1, "water" -> 1
// Return a real Map, not an object. Insertion order is first appearance.

function countBy(list) {
  // here
}

// --- 4 --------------------------------------------------------
// What counts as "the same value" for a Set. identityEdge() must return three
// things, computed for real, no hardcoding:
//   [ new Set([{}, {}]).size,
//     new Set([NaN, NaN]).size,
//     NaN === NaN ]
// Two of the three surprise people. Expected: [2, 1, false]

function identityEdge() {
  // here
}

// --- 5, spoken, nothing to write ------------------------------
// Say out loud, before running the tests:
//   a) a Set versus an array for "have I seen this already" - what changes, and
//      at what size does it stop mattering -- Set give 0(1) time compexety
//   b) three concrete reasons to reach for a Map instead of a plain object - 
//      1 just object has only string keys, Map has whatever as keys
//      2 Map not changing the orders of the keys, object always sorting ans ordering it
//      3 do not have proto keys: toString etc + size better than Object.keys(o).length
//      BUT just Object is better then you need JSON.stringify
//   c) how you get a plain array back out of a Set, and out of a Map -- spread instrument [...a]

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

runChecks([
  { name: "unique", fn: unique, run: () => unique([3, 1, 3, 2, 1]), expected: [3, 1, 2] },
  { name: "uniqueBySku", fn: uniqueBySku, run: () => uniqueBySku(rows), expected: [rows[0], rows[1]] },
  { name: "countBy", fn: countBy, run: () => countBy(words), expected: new Map([["tea", 3], ["coffee", 1], ["water", 1]]) },
  { name: "identityEdge", fn: identityEdge, run: () => identityEdge(), expected: [2, 1, false] },
]);
