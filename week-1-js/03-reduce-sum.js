// Drill 3 - reduce: sum and aggregate over an array of objects
//
// Green criterion, two parts, both required:
//   1. all four written from memory, no hints, under 90 seconds each, tests green
//   2. narrated out loud WHILE typing
// Green but silent is 🔁, not ✅.
//
// SPACED REPEAT #1 - 2026-08-11, six days after it was first closed.
// No example. Watch what the hand does when it reaches the closing bracket.
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
   return list.reduce((acc, line) => acc + line.price, 0);
}

// --- 2 --------------------------------------------------------
// orderTotal(cart) -> 930        (price * qty for each line, then summed)

function orderTotal(list) {
  return list.reduce((acc, line) => acc + (line.price * line.qty), 0)
}

// --- 3 --------------------------------------------------------
// mostExpensive(cart) -> the whole OBJECT with the highest price.
// Use reduce, not sort - the point is that the accumulator does not have to be
// a number. It can be an object, and it starts as one of the items.

function mostExpensive(list) {
  return list.reduce((acc, line) => acc?.price > line.price ? acc : line, 0);
}

// --- 4 --------------------------------------------------------
// The initial value. emptyBehaviour() must return a two-element array:
//   [ <sum of an EMPTY array WITH an initial value of 0>,
//     <true if reducing an EMPTY array WITHOUT an initial value throws> ]
// Wrap the second one in try/catch and actually run it. Do not hardcode.
// Expected: [0, true]

function emptyBehaviour() {
  try {
    let emptyArrayWithoutInitialValue = [].reduce((acc, line) => acc + line)
  } catch {
    emptyArrayWithoutInitialValue = true;
  }

  return [
    [].reduce((acc, line) => acc + line, 0),
    emptyArrayWithoutInitialValue
  ]
}

// --- 5, spoken, nothing to write ------------------------------
// Say out loud, before running the tests:
//   a) the two parameters of the reduce callback, in order, and what each one is -- first is sum and second is current item
//   b) what happens if you forget to return the accumulator -- the accum became undefined in the next itteration
//   c) why an initial value is not optional in real code, even when the array
//      looks like it can never be empty -- because IF the array is empty and you not put init reduce with throw a error

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

runChecks([
  { name: "totalPrice", fn: totalPrice, run: () => totalPrice(cart), expected: 510 },
  { name: "orderTotal", fn: orderTotal, run: () => orderTotal(cart), expected: 930 },
  { name: "mostExpensive", fn: mostExpensive, run: () => mostExpensive(cart), expected: cart[0] },
  { name: "emptyBehaviour", fn: emptyBehaviour, run: () => emptyBehaviour(), expected: [0, true] },
]);
