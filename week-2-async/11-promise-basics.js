// Drill 11 - a promise from scratch, and the same thing written two ways
//
// First drill of the async block. Green criterion, two parts, both required:
//   1. all four from memory, no hints, under 90 seconds each, tests green
//   2. narrated out loud WHILE typing
//
// Run:  node week-2-async/11-promise-basics.js        all checks
//       node week-2-async/11-promise-basics.js order  only checks matching "order"
// Run after EVERY function.

// --- 1 --------------------------------------------------------
// ok(value) returns a PROMISE that fulfils with value.
// Build it with `new Promise`, not with Promise.resolve - the point is the executor.
//   await ok("hi")  ->  "hi"

function ok(value) {
  return new Promise((resolve, reject) => {
    resolve(value);
  })
}

// --- 2 --------------------------------------------------------
// fail(message) returns a PROMISE that rejects with `new Error(message)`.
//   await fail("boom")  ->  throws Error("boom")

function fail(message) {
  return new Promise((resolve, reject) => {
    reject(new Error(message));
  })
}

// --- 3 --------------------------------------------------------
// The same transformation, written twice. Both take a promise of a number
// and give back a promise of that number doubled.
//   viaThen(ok(21))   ->  42     written with .then, no async/await
//   viaAwait(ok(21))  ->  42     written with async/await, no .then

function viaThen(p) {
  return p.then((number) => number * 2);
}

async function viaAwait(p) {
  const number = await p;
  return number * 2;
}

// --- 4 --------------------------------------------------------
// When does the code inside `new Promise` actually run?
// order() must push three strings into an array, in the order they really
// happen, and return that array (awaited):
//   "executor"  - from inside the new Promise callback
//   "after"     - a plain line written AFTER the promise is created
//   "then"      - from inside .then on that promise
// Do not hardcode. Build the array for real and return it.
// Two of these three are not where people expect. Expected: ["executor", "after", "then"]

async function order() {
  const log = [];
  const prom = new Promise((resolve) => {
    log.push('executor')
    resolve();
  });
  prom.then(() => {
    log.push('then')
  })
  log.push('after');

  await prom;
  return log;
}

// --- 5, spoken, nothing to write ------------------------------
// Say out loud, before running the tests:
//   a) the executor - the function you pass to `new Promise` - when does it run,
//      and on which turn of the loop
//   b) a promise has three states. Name them, and say which transitions exist
//   c) `return` inside .then versus `return` inside an async function - what does
//      the caller get in each case

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

runChecks([
  { name: "ok fulfils with what it was given", fn: ok, run: () => ok("anything at all"), expected: "anything at all" },
  { name: "ok returns a promise", fn: ok, run: () => ok("hi") instanceof Promise, expected: true },
  { name: "fail rejects with the message it was given", fn: fail, run: async () => { try { await fail("disk on fire"); return "did not throw"; } catch (e) { return [e instanceof Error, e.message]; } }, expected: [true, "disk on fire"] },
  { name: "viaThen", fn: viaThen, run: () => viaThen(Promise.resolve(21)), expected: 42 },
  { name: "viaAwait", fn: viaAwait, run: () => viaAwait(Promise.resolve(21)), expected: 42 },
  { name: "order", fn: order, run: () => order(), expected: ["executor", "after", "then"] },
]);
