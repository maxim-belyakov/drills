// Drill 7 - optional chaining and nullish coalescing
//
// Green criterion, two parts, both required:
//   1. all four from memory, no hints, under 90 seconds each, tests green
//   2. narrated out loud WHILE typing
//
// Run:  node week-1-js/07-optional-nullish.js        all checks
//       node week-1-js/07-optional-nullish.js city   only checks matching "city"
// Run after EVERY function.

const full = { name: "Ada", address: { city: "Warsaw" }, greet: () => "hi" };
const bare = { name: "Linus" };
// a real city that is an empty string - a legitimate value, not a missing one
const blank = { name: "Grace", address: { city: "" } };

// --- 1 --------------------------------------------------------
// cityOf(full) -> "Warsaw"
// cityOf(bare) -> "unknown"      (no address at all)
// cityOf(null)  -> "unknown"     (nothing at all, must not throw)
// cityOf(blank) -> ""            (the city IS an empty string - keep it)
// One expression, no if. Pick the operator that can tell "empty" from "absent".

function cityOf(u) {
  return u?.address?.city ?? 'unknown';
}

// --- 2 --------------------------------------------------------
// callGreet(full) -> "hi"
// callGreet(bare) -> undefined   (no greet method, must not throw)
// Call the method optionally. No typeof check, no if.

function callGreet(u) {
  return u.greet?.();
}

// --- 3 --------------------------------------------------------
// The difference that matters. nullishVsOr() must return four values, in order:
//   [ 0  ?? "fallback",  0  || "fallback",
//     "" ?? "fallback",  "" || "fallback" ]
// Write the operators for real, do not hardcode. Expected: [0, "fallback", "", "fallback"]

function nullishVsOr() {
  return [
    0 ?? 'fallback', 0 || 'fallback',
    '' ?? 'fallback', '' || 'fallback'
  ]
}

// --- 4 --------------------------------------------------------
// How far does one ?. reach. chainTrap() must return a two-element array:
//   [ <the value of  missing?.a.b  where missing is null>,
//     <true if       present?.a.b  THROWS, where present is {} - no `a` on it> ]
// Wrap the second in try/catch and run it for real. Expected: [undefined, true]
// One ?. guards ONE step, and that is the whole drill.

function chainTrap() {
  let present = {};
  let missing = null;
  try {
    a = {}?.a.b;
  } catch {
    a = true;
  }
  return [
    missing?.a.b, a
  ]
}

// --- 5, spoken, nothing to write ------------------------------
// Say out loud, before running the tests:
//   a) ?? and || in one sentence each, plus one real bug each of them causes
//   b) ?.() and ?.[ ] - what they are for, with an example of each
//   c) a ?? b || c does not compile. Why, and what the fix is

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

runChecks([
  { name: "cityOf full", fn: cityOf, run: () => cityOf(full), expected: "Warsaw" },
  { name: "cityOf bare", fn: cityOf, run: () => cityOf(bare), expected: "unknown" },
  { name: "cityOf null", fn: cityOf, run: () => cityOf(null), expected: "unknown" },
  { name: "cityOf blank", fn: cityOf, run: () => cityOf(blank), expected: "" },
  { name: "callGreet full", fn: callGreet, run: () => callGreet(full), expected: "hi" },
  { name: "callGreet bare", fn: callGreet, run: () => callGreet(bare), expected: undefined },
  { name: "nullishVsOr", fn: nullishVsOr, run: () => nullishVsOr(), expected: [0, "fallback", "", "fallback"] },
  { name: "chainTrap", fn: chainTrap, run: () => chainTrap(), expected: [undefined, true] },
]);
