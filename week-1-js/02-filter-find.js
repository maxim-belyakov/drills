// Drill 2 - filter vs find: what they do and what they return
//
// Green criterion, two parts, both required:
//   1. all four written from memory, no hints, under 90 seconds each, tests green
//   2. narrated out loud WHILE typing, not afterwards
// Green but silent counts as 🔁, not ✅. Talking under load is the half that breaks
// in real rounds, so it is trained here.
//
// Run:  node week-1-js/02-filter-find.js

const users = [
  { id: 7, name: "Ada", active: true },
  { id: 12, name: "Linus", active: false },
  { id: 3, name: "Grace", active: true },
];

// --- 1 --------------------------------------------------------
// activeUsers(users) must return the two whole objects whose active is true

function activeUsers(list) {
  return list.filter(item => item.active);
}

// --- 2 --------------------------------------------------------
// findByName(users, "Grace") must return the Grace object itself, not an array

function findByName(list, name) {
  return list.find(item => item.name === name);
}

// --- 3 --------------------------------------------------------
// activeIds(users) must return [7, 3]
// filter first, then map. Say out loud why that order and not the other one.

function activeIds(list) {
  return list.filter(item => item.active).map(item => item.id);
}

// --- 4 --------------------------------------------------------
// The whole point of the drill: what comes back when NOTHING matches.
// noMatch(users) must return a two-element array: [ <filter result>, <find result> ]
// Do not hardcode it. Actually call filter and find with a predicate that never matches.

function noMatch(list) {
  return [ list.filter(item => item.name === 'foobar'), list.find(item => item.id === 1)]
}

// --- 5, spoken, nothing to write ------------------------------
// Say out loud, before running the tests:
//   a) which of the two stops early, and why that matters on a large array = find potentially chiper, filter going to the whole array always
//   b) what findIndex returns when nothing matches, and why it is not undefined = -1
//   c) some vs every in one sentence each - some check the first one catch and every check all the array as well


// --- 6, added after the spoken part came out fuzzy ------------
// some / every. Both return a boolean. Write them from memory, out loud.

// hasInactive(users) -> true   (is there at least one inactive user)
function hasInactive(list) {
  return list.some(item => !item.active);
}

// allHaveId(users) -> true     (does every user have an id)
function allHaveId(list) {
  return list.every(item => item.id)
}

// emptyEdge() -> [false, true]
// Call some and every on an EMPTY array. some with any predicate, every with any predicate.
// Do not hardcode. The result is the whole lesson.
function emptyEdge() {
  return [ [].some(item => item.name === '123'), [].every(item => item.name === '123') ]
}

// --------------------------------------------------------------
// Do not touch below. This is the check.

const assert = require("node:assert");

// honest printer: JSON.stringify turns undefined into null and hides holes
const show = (v) =>
  v === undefined ? "undefined"
  : typeof v === "string" ? JSON.stringify(v)
  : Array.isArray(v) ? "[" + v.map((x) => show(x)).join(", ") + "]"
  : typeof v === "object" && v !== null ? JSON.stringify(v)
  : String(v);

const checks = [
  ["activeUsers", () => activeUsers(users), [users[0], users[2]]],
  ["findByName", () => findByName(users, "Grace"), users[2]],
  ["activeIds", () => activeIds(users), [7, 3]],
  ["noMatch", () => noMatch(users), [[], undefined]],
  ["hasInactive", () => hasInactive(users), true],
  ["allHaveId", () => allHaveId(users), true],
  ["emptyEdge", () => emptyEdge(), [false, true]],
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
console.log(failed === 0 ? "\nAll green. Now: was it narrated out loud? If not, it is 🔁\n" : `\nFailed: ${failed}. Fix and run again.\n`);
