// Drill 7, cold re-run - optional chaining and nullish coalescing
//
// Closed on 2026-08-10 and not touched since. It comes back because of the opener
// on 2026-09-22: `"" ?? "anonymous"` was answered "false", and the empty string is
// exactly what tells these two operators apart.
//
// New data, same technique. Nothing here is written for you: every function is a
// stub. Write it from memory, narrating out loud, and run after EVERY function.
//
// Green criterion, two parts, both required:
//   1. all five from memory, no hints, under 90 seconds each, checks green
//   2. narrated out loud WHILE typing
//
// Run:  node week-1-js/07-optional-nullish.rerun.js         all checks
//       node week-1-js/07-optional-nullish.rerun.js theme   only checks matching "theme"

const full = { user: "kim", prefs: { theme: "dark", size: 14 }, sync: () => "synced" };
const bare = { user: "sam" };
// a real theme that is an empty string - a legitimate value, not a missing one
const blank = { user: "raj", prefs: { theme: "", size: 0 } };

// --- 1 --------------------------------------------------------
// themeOf(full)  -> "dark"
// themeOf(bare)  -> "system"     (no prefs at all)
// themeOf(null)  -> "system"     (nothing at all, must not throw)
// themeOf(blank) -> ""           (the theme IS an empty string - keep it)
// One expression, no if. Pick the operator that can tell "empty" from "absent".

function themeOf(u) {
  // here
}

// --- 2 --------------------------------------------------------
// callSync(full) -> "synced"
// callSync(bare) -> undefined    (no sync method, must not throw)
// Call the method optionally. No typeof check, no if.

function callSync(u) {
  // here
}

// --- 3 --------------------------------------------------------
// The difference that matters. nullishVsOr() must return six values, in order:
//   [ "" ?? "fallback",   "" || "fallback",
//     0  ?? "fallback",   0  || "fallback",
//     null ?? "fallback", undefined || "fallback" ]
// Write the operators for real, do not hardcode the answers.
// Expected: ["", "fallback", 0, "fallback", "fallback", "fallback"]

function nullishVsOr() {
  // here
}

// --- 4 --------------------------------------------------------
// How far does one ?. reach. reachTrap() must return a two-element array:
//   [ <the value of  missing?.prefs.theme  where missing is null>,
//     <true if       present?.prefs.theme  THROWS, where present is {} - no prefs> ]
// Wrap the second one in try/catch and run it for real. Expected: [undefined, true]
// One ?. guards ONE step, and that is the whole drill.

function reachTrap() {
  // here
}

// --- 5 --------------------------------------------------------
// The index form. firstName(list) reads the name of the first entry:
// firstName([{ name: "Ann" }, { name: "Bo" }]) -> "Ann"
// firstName([])                                -> "nobody"   (no first entry)
// firstName(null)                              -> "nobody"   (no list, must not throw)
// firstName([{ name: "" }])                    -> ""         (an empty name is a name)
// One expression. The list may be absent, the entry may be absent, the name may be empty.

function firstName(list) {
  // here
}

// --- 6, spoken, nothing to write ------------------------------
// Say out loud, before running the checks:
//   a) ?? and || in one sentence each, and for each of them name the INPUT CLASS
//      that breaks it - not an example, the class
//   b) ?.() and ?.[ ] - what each is for, with one example of each
//   c) a ?? b || c does not compile. Why, and what the fix is

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

runChecks([
  { name: "themeOf full", fn: themeOf, run: () => themeOf(full), expected: "dark" },
  { name: "themeOf bare", fn: themeOf, run: () => themeOf(bare), expected: "system" },
  { name: "themeOf null", fn: themeOf, run: () => themeOf(null), expected: "system" },
  { name: "themeOf blank keeps the empty string", fn: themeOf, run: () => themeOf(blank), expected: "" },
  { name: "callSync full", fn: callSync, run: () => callSync(full), expected: "synced" },
  { name: "callSync bare", fn: callSync, run: () => callSync(bare), expected: undefined },
  { name: "nullishVsOr", fn: nullishVsOr, run: () => nullishVsOr(), expected: ["", "fallback", 0, "fallback", "fallback", "fallback"] },
  { name: "reachTrap", fn: reachTrap, run: () => reachTrap(), expected: [undefined, true] },
  { name: "firstName list", fn: firstName, run: () => firstName([{ name: "Ann" }, { name: "Bo" }]), expected: "Ann" },
  { name: "firstName empty list", fn: firstName, run: () => firstName([]), expected: "nobody" },
  { name: "firstName no list", fn: firstName, run: () => firstName(null), expected: "nobody" },
  { name: "firstName keeps an empty name", fn: firstName, run: () => firstName([{ name: "" }]), expected: "" },
]);
