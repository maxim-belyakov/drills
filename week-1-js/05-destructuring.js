// Drill 5 - destructuring: object, array, rename, default, nested, rest
//
// Green criterion, two parts, both required:
//   1. all four from memory, no hints, under 90 seconds each, tests green
//   2. narrated out loud WHILE typing
//
// SPACED REPEAT - 2026-08-13. Task 1 wants the pattern in the PARAMETER LIST.
//
// Run:  node week-1-js/05-destructuring.js         all checks
//       node week-1-js/05-destructuring.js head    only checks matching "head"
// Run after EVERY function. A function you have not written yet reports as
// "not written yet", it does not fail.

const user = {
  name: "Ada",
  address: { city: "Warsaw", zip: "02-703" },
  tags: ["admin", "dev"],
};

// --- 1 --------------------------------------------------------
// greet(user) -> "Ada from Warsaw"
// Destructure in the PARAMETER LIST, not in the body. Nested, two levels.

function greet({}) {
  // here
}

// --- 2 --------------------------------------------------------
// firstTag(user) -> "admin"
// Reach the first element of the tags array by destructuring, with "none" as a
// default in case tags comes back empty. No indexing with [0].

function firstTag(u) {
  // here
}

// --- 3 --------------------------------------------------------
// splitHead([1, 2, 3]) -> { head: 1, tail: [2, 3] }
// Array destructuring with rest. Return an object with both.

function splitHead(list) {
  // here
}

// --- 4 --------------------------------------------------------
// The default value rule. defaultsEdge() must return a two-element array:
//   [ <a destructured out of { a: undefined } with a default of "fallback">,
//     <a destructured out of { a: null }      with a default of "fallback"> ]
// Do not hardcode. Write both destructurings for real.
// One of them is not what most people expect, and that is the whole drill.

function defaultsEdge() {
  // here
}

// --- 5, spoken, nothing to write ------------------------------
// Say out loud, before running the tests:
//   a) the rename syntax, { email: mail }, and which side is the new variable -- left is old, right is new one
//   b) what happens when you destructure a nested object that is not there,
//      and the two ways to keep it from blowing up -- make init value and second one will not give you a way to catch the error
//   c) destructuring in the parameter list vs in the body - what actually changes

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

runChecks([
  // deliberately a DIFFERENT object from the module-level `user`, so a function
  // that ignores its parameter cannot pass
  { name: "greet", fn: greet, run: () => greet({ name: "Linus", address: { city: "Helsinki" } }), expected: "Linus from Helsinki" },
  { name: "firstTag", fn: firstTag, run: () => firstTag(user), expected: "admin" },
  { name: "splitHead", fn: splitHead, run: () => splitHead([1, 2, 3]), expected: { head: 1, tail: [2, 3] } },
  { name: "defaultsEdge", fn: defaultsEdge, run: () => defaultsEdge(), expected: ["fallback", null] },
]);
