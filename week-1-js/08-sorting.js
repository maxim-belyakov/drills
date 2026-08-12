// Drill 8 - sort: by number, by string, by object field, and what it does to your array
//
// Green criterion, two parts, both required:
//   1. all four from memory, no hints, under 90 seconds each, tests green
//   2. narrated out loud WHILE typing
//
// SECOND PASS - 2026-08-12. First pass was 🔁: the spelling of localeCompare
// got looked up, and byName mutated the shared array. No example this time.
//
// Run:  node week-1-js/08-sorting.js         all checks
//       node week-1-js/08-sorting.js trap    only checks matching "trap"
// Run after EVERY function.

const items = [
  { sku: "C-2", name: "чай", price: 180 },
  { sku: "A-1", name: "кофе", price: 240 },
  { sku: "B-7", name: "вода", price: 90 },
];

// --- 1 --------------------------------------------------------
// sortedPrices(items) -> [90, 180, 240]
// AND the `items` array must be in its original order afterwards.
// Both are checked separately. The second one is the point of the drill.

function sortedPrices(list) {
  // here
}

// --- 2 --------------------------------------------------------
// byName(items) -> ["вода", "кофе", "чай"]
// Sort the objects by their name field, return just the names.

function byName(list) {
  // here
}

// --- 3 --------------------------------------------------------
// byPriceDesc(items) -> ["A-1", "C-2", "B-7"]
// Sort by price, most expensive first, return the skus.

function byPriceDesc(list) {
  // here
}

// --- 4 --------------------------------------------------------
// The default comparator. defaultTrap() must return the result of calling
// .sort() with NO arguments on [10, 9, 100, 1].
// Do not hardcode, do not pass a comparator. Run it and see.
// The answer looks wrong until you know what sort does before comparing.

function defaultTrap() {
  // here
}

// --- 5, spoken, nothing to write ------------------------------
// Say out loud, before running the tests:
//   a) the comparator gets (a, b) and returns a number. What do a negative,
//      a positive and a zero each mean -- negative - a goes eirlier b, positive - vice versa, zero -- nothing changes
//   b) why [10, 9, 100, 1].sort() gives what it gives - what happens to the
//      elements before they are compared
//   c) sort has been stable since ES2019. What does stable mean, and why does it
//      let you sort by two keys with two separate sorts

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

const originalOrder = items.map((i) => i.sku);

runChecks([
  { name: "sortedPrices", fn: sortedPrices, run: () => sortedPrices(items), expected: [90, 180, 240] },
  { name: "sortedPrices left the input alone", fn: sortedPrices, run: () => { sortedPrices(items); return items.map((i) => i.sku); }, expected: originalOrder },
  { name: "byName", fn: byName, run: () => byName(items), expected: ["вода", "кофе", "чай"] },
  { name: "byName left the input alone", fn: byName, run: () => { byName(items); return items.map((i) => i.sku); }, expected: originalOrder },
  { name: "byPriceDesc", fn: byPriceDesc, run: () => byPriceDesc(items), expected: ["A-1", "C-2", "B-7"] },
  { name: "byPriceDesc left the input alone", fn: byPriceDesc, run: () => { byPriceDesc(items); return items.map((i) => i.sku); }, expected: originalOrder },
  { name: "defaultTrap", fn: defaultTrap, run: () => defaultTrap(), expected: [1, 10, 100, 9] },
]);
