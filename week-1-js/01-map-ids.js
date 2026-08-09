// Drill 1 - array of ids from an array of objects (map)
//
// Green criterion: write all three from scratch, no hints, under 90 seconds each,
// tests green on the first run.
//
// Rules: write from memory, saying out loud what you are doing.
// Peeked - that is 🔁, the drill comes back in a day. That is fine.
//
// SPACED REPEAT #1 - 2026-08-09, six days after it was first closed.
// Closed drills come back: a day later, then a week later. Nothing to look at,
// no example. Should take about five minutes. If it takes longer, it needed to
// come back.
//
// Run:  node week-1-js/01-map-ids.js

const users = [
  { id: 7, name: "Ada", active: true },
  { id: 12, name: "Linus", active: false },
  { id: 3, name: "Grace", active: true },
];

// --- 1 --------------------------------------------------------
// getIds(users) must return [7, 12, 3]

function getIds(list) {
  // here
}

// --- 2 --------------------------------------------------------
// getNames(users) must return ["Ada", "Linus", "Grace"]
// Same drill, different field. Write it without looking up.

function getNames(list) {
  // here
}

// --- 3 --------------------------------------------------------
// toLabels(users) must return ["7: Ada", "12: Linus", "3: Grace"]
// map plus a template literal.

function toLabels(list) {
  // here
}

// --- 4, spoken, nothing to write ------------------------------
// Say out loud, before running the tests:
//   a) how map differs from forEach
//   b) what users.map(u => { u.id }) returns, and why exactly that

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

runChecks([
  { name: "getIds", fn: getIds, run: () => getIds(users), expected: [7, 12, 3] },
  { name: "getNames", fn: getNames, run: () => getNames(users), expected: ["Ada", "Linus", "Grace"] },
  { name: "toLabels", fn: toLabels, run: () => toLabels(users), expected: ["7: Ada", "12: Linus", "3: Grace"] },
]);
