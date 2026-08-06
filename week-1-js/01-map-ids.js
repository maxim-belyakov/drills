// Drill 1 - array of ids from an array of objects (map)
//
// Green criterion: write all three from scratch, no hints, under 90 seconds each,
// tests green on the first run.
//
// Rules: write from memory, saying out loud what you are doing.
// Peeked - that is 🔁, the drill comes back in a day. That is fine.
//
// Run:  node week-1-js/01-map-ids.js

const users = [
  { id: 7, name: "Ada", active: true },
  { id: 12, name: "Linus", active: false },
  { id: 3, name: "Grace", active: true },
];

// --- 1 --------------------------------------------------------
// getIds(users) must return [7, 12, 3]

function getIds(list) {
  return list.map(item => item.id)
}

// --- 2 --------------------------------------------------------
// getNames(users) must return ["Ada", "Linus", "Grace"]
// Same drill, different field. Write it without looking up.

function getNames(list) {
  return list.map(item => item.name)
}

// --- 3 --------------------------------------------------------
// toLabels(users) must return ["7: Ada", "12: Linus", "3: Grace"]
// map plus a template literal.

function toLabels(list) {
  return list.map(item => `${item.id}: ${item.name}`)
}

// --- 4, spoken, nothing to write ------------------------------
// Say out loud, before running the tests:
//   a) how map differs from forEach
//   b) what users.map(u => { u.id }) returns, and why exactly that

// --------------------------------------------------------------
// Do not touch below. This is the check.

const assert = require("node:assert");

const checks = [
  ["getIds", () => getIds(users), [7, 12, 3]],
  ["getNames", () => getNames(users), ["Ada", "Linus", "Grace"]],
  ["toLabels", () => toLabels(users), ["7: Ada", "12: Linus", "3: Grace"]],
];

let failed = 0;
for (const [name, run, expected] of checks) {
  try {
    assert.deepStrictEqual(run(), expected);
    console.log(`  OK  ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL ${name}`);
    console.log(`       expected: ${JSON.stringify(expected)}`);
    console.log(`       received: ${e instanceof assert.AssertionError ? JSON.stringify(e.actual) : e.name + ": " + e.message}`);
  }
}
console.log(failed === 0 ? "\nAll green. Mark it ✅\n" : `\nFailed: ${failed}. Fix and run again.\n`);
