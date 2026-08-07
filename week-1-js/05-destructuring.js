// Drill 5 - destructuring: object, array, rename, default, nested, rest
//
// Green criterion, two parts, both required:
//   1. all four from memory, no hints, under 90 seconds each, tests green
//   2. narrated out loud WHILE typing
//
// Run:  node week-1-js/05-destructuring.js

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
//   a) the rename syntax, { email: mail }, and which side is the new variable
//   b) what happens when you destructure a nested object that is not there,
//      and the two ways to keep it from blowing up
//   c) destructuring in the parameter list vs in the body - what actually changes

// --------------------------------------------------------------
// Do not touch below. This is the check.

const assert = require("node:assert");

const show = (v) =>
  v === undefined ? "undefined"
  : typeof v === "string" ? JSON.stringify(v)
  : Array.isArray(v) ? "[" + v.map((x) => show(x)).join(", ") + "]"
  : typeof v === "object" && v !== null ? JSON.stringify(v)
  : String(v);

const checks = [
  ["greet", () => greet(user), "Ada from Warsaw"],
  ["firstTag", () => firstTag(user), "admin"],
  ["splitHead", () => splitHead([1, 2, 3]), { head: 1, tail: [2, 3] }],
  ["defaultsEdge", () => defaultsEdge(), ["fallback", null]],
];

let failed = 0;
for (const [name, run, expected] of checks) {
  let actual, threw = null;
  try {
    actual = run();
  } catch (err) {
    threw = err;
  }
  if (threw) {
    failed++;
    console.log(`  ERR  ${name} - it threw, so nothing was compared`);
    console.log(`       ${threw.name}: ${threw.message}`);
    continue;
  }
  try {
    assert.deepStrictEqual(actual, expected);
    console.log(`  OK  ${name}`);
  } catch {
    failed++;
    console.log(`  FAIL ${name}`);
    console.log(`       expected: ${show(expected)}`);
    console.log(`       received: ${show(actual)}`);
  }
}
console.log(failed === 0 ? "\nAll green. Was it narrated out loud? If not, it is 🔁\n" : `\nFailed: ${failed}. Fix and run again.\n`);
