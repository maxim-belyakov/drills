// Drill 4 - reduce into an object: grouping, counting, indexing
//
// SECOND PASS, 2026-08-07. First pass was 🔁 - the example got opened.
// This time: no example, nothing above, from memory only.
// Yesterday's misses, in case they repeat - do not look them up, just notice:
// the initial value went missing in all four.
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
  return list.reduce((acc, line) => {
    (acc[line.status] ??= []).push(line);
    return acc;
  }, {})
}

// --- 2 --------------------------------------------------------
// countByStatus(orders) -> { paid: 2, pending: 1 }
// Same shape of loop, numbers instead of arrays.

function countByStatus(list) {
  return list.reduce((acc, line) => {
    acc[line.status] ??= 0;
    acc[line.status] += 1 
    return acc;
  }, {})
}

// --- 3 --------------------------------------------------------
// indexBySku(orders) -> { "A-1": <A-1>, "B-7": <B-7>, "C-2": <C-2> }
// A lookup map. This is the shape that turns an O(n) find into an O(1) read -
// the same idea as a HashMap. Say that part out loud, it is a known gap.

function indexBySku(list) {
  return list.reduce((acc, line) => {
    acc[line.sku] = line;
    return acc;
  }, {})
}

// --- 4 --------------------------------------------------------
// keyTypes() must group `orders` by the NUMERIC field `priority`
// and return Object.keys(...) of the result.
// Two things happen at once here and both are the lesson. Do not hardcode.

function keyTypes() {
  const numListPriority = orders.reduce((acc, line) => {
    (acc[line.priority] ??= []).push(line);
    return acc;
  }, {})

  return Object.keys(numListPriority);
}

// --- 5, spoken, nothing to write ------------------------------
// Say out loud, before running the tests:
//   a) why an arrow function with { braces } needs an explicit return, and what
//      the accumulator becomes on step two if you forget it -- because arrow function has another context borders, it will not return automatically your context so you need return accumulator if you want to save it for next steps
//   b) Object.groupBy exists now - what it does, and why you would still write
//      reduce by hand in an interview -- groupBy is strict, if you want do something more while you grouping it's better to write groupBy itself with side effects
//   c) when a lookup object beats calling find in a loop, and what the cost is - to make one time reduce is O(n) but then cost to find by froup will be 0(1)

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

runChecks([
  { name: "groupByStatus", fn: groupByStatus, run: () => groupByStatus(orders), expected: { paid: [orders[0], orders[2]], pending: [orders[1]] } },
  { name: "countByStatus", fn: countByStatus, run: () => countByStatus(orders), expected: { paid: 2, pending: 1 } },
  { name: "indexBySku", fn: indexBySku, run: () => indexBySku(orders), expected: { "A-1": orders[0], "B-7": orders[1], "C-2": orders[2] } },
  { name: "keyTypes", fn: keyTypes, run: () => keyTypes(), expected: ["1", "2"] },
]);
