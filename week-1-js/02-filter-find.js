// Drill 2 - filter vs find: what they do and what they return
//
// Green criterion, two parts, both required:
//   1. all four written from memory, no hints, under 90 seconds each, tests green
//   2. narrated out loud WHILE typing, not afterwards
// Green but silent counts as 🔁, not ✅. Talking under load is the half that breaks
// in real rounds, so it is trained here.
//
// SPACED REPEAT #1 - 2026-08-10, six days after it was first closed.
// No example, nothing to look at. Part 6 (some/every) is included - that is the
// half that was fuzzy the first time.
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
//   a) which of the two stops early, and why that matters on a large array = find potentially chiper, filter going to the whole array always
//   b) what findIndex returns when nothing matches, and why it is not undefined = -1
//   c) some vs every in one sentence each - some check the first one catch and every check all the array as well


// --- 6, added after the spoken part came out fuzzy ------------
// some / every. Both return a boolean. Write them from memory, out loud.

// hasInactive(users) -> true   (is there at least one inactive user)
function hasInactive(list) {
  // here
}

// allHaveId(users) -> true     (does every user have an id)
function allHaveId(list) {
  // here
}

// emptyEdge() -> [false, true]
// Call some and every on an EMPTY array. some with any predicate, every with any predicate.
// Do not hardcode. The result is the whole lesson.
function emptyEdge() {
  // here
}

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

runChecks([
  { name: "activeUsers", fn: activeUsers, run: () => activeUsers(users), expected: [users[0], users[2]] },
  { name: "findByName", fn: findByName, run: () => findByName(users, "Grace"), expected: users[2] },
  { name: "activeIds", fn: activeIds, run: () => activeIds(users), expected: [7, 3] },
  { name: "noMatch", fn: noMatch, run: () => noMatch(users), expected: [[], undefined] },
  { name: "hasInactive", fn: hasInactive, run: () => hasInactive(users), expected: true },
  { name: "allHaveId", fn: allHaveId, run: () => allHaveId(users), expected: true },
  { name: "emptyEdge", fn: emptyEdge, run: () => emptyEdge(), expected: [false, true] },
]);
