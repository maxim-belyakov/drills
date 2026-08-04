// Drill 2 - filter vs find: what they do and what they return
//
// Green criterion, two parts, both required:
//   1. all four written from memory, no hints, under 90 seconds each, tests green
//   2. narrated out loud WHILE typing, not afterwards
// Green but silent counts as 🔁, not ✅. Talking under load is the half that breaks
// in real rounds, so it is trained here.
//
// Run:  node week-1-js/02-filter-find.js

const users = [
  { id: 7, name: "Ada", active: true },
  { id: 12, name: "Linus", active: false },
  { id: 3, name: "Grace", active: true },
];

// --- 1 --------------------------------------------------------
// activeUsers(users) must return the two whole objects whose active is true

function activeUsers(list) {
  // here
}

// --- 2 --------------------------------------------------------
// findByName(users, "Grace") must return the Grace object itself, not an array

function findByName(list, name) {
  // here
}

// --- 3 --------------------------------------------------------
// activeIds(users) must return [7, 3]
// filter first, then map. Say out loud why that order and not the other one.

function activeIds(list) {
  // here
}

// --- 4 --------------------------------------------------------
// The whole point of the drill: what comes back when NOTHING matches.
// noMatch(users) must return a two-element array: [ <filter result>, <find result> ]
// Do not hardcode it. Actually call filter and find with a predicate that never matches.

function noMatch(list) {
  // here
}

// --- 5, spoken, nothing to write ------------------------------
// Say out loud, before running the tests:
//   a) which of the two stops early, and why that matters on a large array
//   b) what findIndex returns when nothing matches, and why it is not undefined
//   c) some vs every in one sentence each

// --------------------------------------------------------------
// Do not touch below. This is the check.

const assert = require("node:assert");

// honest printer: JSON.stringify turns undefined into null and hides holes
const show = (v) =>
  v === undefined ? "undefined"
  : Array.isArray(v) ? "[" + v.map(show).join(", ") + "]"
  : typeof v === "object" && v !== null ? JSON.stringify(v)
  : String(v);

const checks = [
  ["activeUsers", () => activeUsers(users), [users[0], users[2]]],
  ["findByName", () => findByName(users, "Grace"), users[2]],
  ["activeIds", () => activeIds(users), [7, 3]],
  ["noMatch", () => noMatch(users), [[], undefined]],
];

let failed = 0;
for (const [name, run, expected] of checks) {
  try {
    assert.deepStrictEqual(run(), expected);
    console.log(`  OK  ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL ${name}`);
    console.log(`       expected: ${show(expected)}`);
    console.log(`       received: ${show(e.actual)}`);
  }
}
console.log(failed === 0 ? "\nAll green. Now: was it narrated out loud? If not, it is 🔁\n" : `\nFailed: ${failed}. Fix and run again.\n`);
