// check.js - GIVEN. Do not edit. Run it: node check.js
const assert = require("node:assert");
const { PRODUCTS, findByName, topRated, priceBands, stockSummary } = require("./catalog.js");

const show = (v) => JSON.stringify(v);
// every check gets its own untouched copy - one function mutating the list must not
// change what the next check sees
const fresh = () => PRODUCTS.map((p) => ({ ...p }));
let ok = 0, bad = 0;
const check = (name, run, expected) => {
  let actual;
  try { actual = run(); } catch (e) { bad++; console.log(`  ERR  ${name}\n       ${e.name}: ${e.message}`); return; }
  try { assert.deepStrictEqual(actual, expected); ok++; console.log(`  OK   ${name}`); }
  catch { bad++; console.log(`  FAIL ${name}\n       expected: ${show(expected)}\n       received: ${show(actual)}`); }
};

check("findByName is case-insensitive", () => findByName(fresh(), "laptop"), [1, 2]);
check("findByName, upper case query", () => findByName(fresh(), "LAMP"), [7]);
check("findByName, no match", () => findByName(fresh(), "zzz"), []);

check("topRated breaks ties by name", () => topRated(fresh(), 3), [
  { name: "Keyboard", rating: 4.8 },
  { name: "laptop Air", rating: 4.8 },
  { name: "Laptop Pro", rating: 4.6 },
]);
check("topRated does not touch the list it was given", () => {
  const mine = fresh();
  const before = mine.map((p) => p.id);
  topRated(mine, 3);
  return mine.map((p) => p.id).join() === before.join();
}, true);

check("priceBands, 500 belongs to mid", () => priceBands(fresh()),
  { cheap: [3, 8], mid: [4, 5, 6, 7], pricey: [1, 2] });

check("stockSummary counts only what is in stock", () => stockSummary(fresh()).count, 6);
check("stockSummary average is a NUMBER, two decimals", () => stockSummary(fresh()).averagePrice, 600.83);

console.log(`\n  ${ok} ok, ${bad} failed`);
if (!bad) console.log("\n  GREEN. Stop the timer and write down the number.");
process.exit(bad ? 1 : 0);
