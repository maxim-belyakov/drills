// Drill 4 - reduce into an object: grouping, counting, indexing
//
// First drill where the accumulator is neither a number nor an element,
// but a structure you keep adding to. This is where "forgot to return acc" lives.
//
// Green criterion, two parts, both required:
//   1. all four written from memory, no hints, under 90 seconds each, tests green
//   2. narrated out loud WHILE typing
//
// Run:  node week-1-js/04-group-by.js

const orders = [
  { sku: "A-1", status: "paid", total: 240, priority: 2 },
  { sku: "B-7", status: "pending", total: 180, priority: 1 },
  { sku: "C-2", status: "paid", total: 90, priority: 2 },
];

// --- 1 --------------------------------------------------------
// groupByStatus(orders) -> { paid: [<A-1>, <C-2>], pending: [<B-7>] }
// Whole objects in the buckets, not skus.

function groupByStatus(list) {
  // here
}

// --- 2 --------------------------------------------------------
// countByStatus(orders) -> { paid: 2, pending: 1 }
// Same shape of loop, numbers instead of arrays.

function countByStatus(list) {
  // here
}

// --- 3 --------------------------------------------------------
// indexBySku(orders) -> { "A-1": <A-1>, "B-7": <B-7>, "C-2": <C-2> }
// A lookup map. This is the shape that turns an O(n) find into an O(1) read -
// the same idea as a HashMap. Say that part out loud, it is a known gap.

function indexBySku(list) {
  // here
}

// --- 4 --------------------------------------------------------
// keyTypes() must group `orders` by the NUMERIC field `priority`
// and return Object.keys(...) of the result.
// Two things happen at once here and both are the lesson. Do not hardcode.

function keyTypes() {
  // here
}

// --- 5, spoken, nothing to write ------------------------------
// Say out loud, before running the tests:
//   a) why an arrow function with { braces } needs an explicit return, and what
//      the accumulator becomes on step two if you forget it
//   b) Object.groupBy exists now - what it does, and why you would still write
//      reduce by hand in an interview
//   c) when a lookup object beats calling find in a loop, and what the cost is

// --------------------------------------------------------------
// Do not touch below. This is the check.

const assert = require("node:assert");

const show = (v) =>
  v === undefined ? "undefined"
  : Array.isArray(v) ? "[" + v.map(show).join(", ") + "]"
  : typeof v === "object" && v !== null ? JSON.stringify(v)
  : String(v);

const checks = [
  ["groupByStatus", () => groupByStatus(orders), { paid: [orders[0], orders[2]], pending: [orders[1]] }],
  ["countByStatus", () => countByStatus(orders), { paid: 2, pending: 1 }],
  ["indexBySku", () => indexBySku(orders), { "A-1": orders[0], "B-7": orders[1], "C-2": orders[2] }],
  ["keyTypes", () => keyTypes(), ["1", "2"]],
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
