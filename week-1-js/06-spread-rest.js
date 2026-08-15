// Drill 6 - spread and rest
//
// Green criterion, two parts, both required:
//   1. all four from memory, no hints, under 90 seconds each, tests green
//   2. narrated out loud WHILE typing
//
// SPACED REPEAT - 2026-08-15, six days after it was first closed.
// No example. Task 3 wants rest in the parameter list; name things for what
// they are this time.
//
// Run:  node week-1-js/06-spread-rest.js         all checks
//       node week-1-js/06-spread-rest.js sum     only checks matching "sum"
// Run after EVERY function.

const order = {
  id: "A-1",
  status: "pending",
  customer: { name: "Ada", city: "Warsaw" },
};

// --- 1 --------------------------------------------------------
// withStatus(order, "paid") -> a NEW object, same as order but status "paid".
// The original must not change. This is the immutable update you write daily
// in Redux and useState.

function withStatus(o, status) {
  // here
}

// --- 2 --------------------------------------------------------
// mergeLists([1, 2], [3, 4]) -> [1, 2, 3, 4]
// One new array, neither input touched.

function mergeLists(a, b) {
  // here
}

// --- 3 --------------------------------------------------------
// sum(1, 2, 3) -> 6, sum() -> 0
// Collect the arguments with rest in the parameter list. No `arguments`.

function sum() {
  // here
}

// --- 4 --------------------------------------------------------
// How deep does spread go. shallowProof() must:
//   - make a copy of `order` with spread
//   - change the copy's customer.city to "Krakow"
//   - return [ <the ORIGINAL order's customer.city>, <the copy's customer.city> ]
// Do not hardcode. Expected: ["Krakow", "Krakow"] - and that is the lesson.

function shallowProof() {
  // here
}

// --- 5, spoken, nothing to write ------------------------------
// Say out loud, before running the tests:
//   a) in { ...a, ...b } which side wins on a shared key, and what changes
//      between { ...o, id: 1 } and { id: 1, ...o } - ...b wins, and "...o" wins as last word
//   b) rest in the parameter list vs the old `arguments` object - two differences -- good question, rest is createting a new varible, and arguments is direct call of the props, it's two usful instremnts working differently, i don't know exactly how 
//   c) you need a real deep copy. What do you reach for, and what does it cost -- you need to use Object.assign(), the cost is O(n) for time and space

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

runChecks([
  { name: "withStatus", fn: withStatus, run: () => [withStatus(order, "paid"), order.status], expected: [{ id: "A-1", status: "paid", customer: order.customer }, "pending"] },
  { name: "mergeLists", fn: mergeLists, run: () => mergeLists([1, 2], [3, 4]), expected: [1, 2, 3, 4] },
  { name: "sumEmpty", fn: sum, run: () => sum(), expected: 0 },
  { name: "sumThree", fn: sum, run: () => sum(1, 2, 3), expected: 6 },
  { name: "shallowProof", fn: shallowProof, run: () => shallowProof(), expected: ["Krakow", "Krakow"] },
]);
