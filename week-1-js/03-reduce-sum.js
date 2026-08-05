// Drill 3 - reduce: sum and aggregate over an array of objects
//
// Green criterion, two parts, both required:
//   1. all four written from memory, no hints, under 90 seconds each, tests green
//   2. narrated out loud WHILE typing
// Green but silent is 🔁, not ✅.
//
// Run:  node week-1-js/03-reduce-sum.js

const cart = [
  { sku: "A-1", price: 240, qty: 2 },
  { sku: "B-7", price: 180, qty: 1 },
  { sku: "C-2", price: 90, qty: 3 },
];

// --- 1 --------------------------------------------------------
// totalPrice(cart) -> 510        (just the prices, ignore qty)

function totalPrice(list) {
  // here
}

// --- 2 --------------------------------------------------------
// orderTotal(cart) -> 930        (price * qty for each line, then summed)

function orderTotal(list) {
  // here
}

// --- 3 --------------------------------------------------------
// mostExpensive(cart) -> the whole OBJECT with the highest price.
// Use reduce, not sort - the point is that the accumulator does not have to be
// a number. It can be an object, and it starts as one of the items.

function mostExpensive(list) {
  // here
}

// --- 4 --------------------------------------------------------
// The initial value. emptyBehaviour() must return a two-element array:
//   [ <sum of an EMPTY array WITH an initial value of 0>,
//     <true if reducing an EMPTY array WITHOUT an initial value throws> ]
// Wrap the second one in try/catch and actually run it. Do not hardcode.
// Expected: [0, true]

function emptyBehaviour() {
  // here
}

// --- 5, spoken, nothing to write ------------------------------
// Say out loud, before running the tests:
//   a) the two parameters of the reduce callback, in order, and what each one is
//   b) what happens if you forget to return the accumulator
//   c) why an initial value is not optional in real code, even when the array
//      looks like it can never be empty

// --------------------------------------------------------------
// Do not touch below. This is the check.

const assert = require("node:assert");

const show = (v) =>
  v === undefined ? "undefined"
  : Array.isArray(v) ? "[" + v.map(show).join(", ") + "]"
  : typeof v === "object" && v !== null ? JSON.stringify(v)
  : String(v);

const checks = [
  ["totalPrice", () => totalPrice(cart), 510],
  ["orderTotal", () => orderTotal(cart), 930],
  ["mostExpensive", () => mostExpensive(cart), cart[0]],
  ["emptyBehaviour", () => emptyBehaviour(), [0, true]],
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
console.log(failed === 0 ? "\nAll green. Was it narrated out loud? If not, it is 🔁\n" : `\nFailed: ${failed}. Fix and run again.\n`);
