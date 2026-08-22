// Drill 14 - sequential versus parallel: why a loop with await inside is slow
//
// Green criterion, two parts: cold from memory, and narrated out loud.
//
// Run:  node week-2-async/14-sequential-vs-parallel.js
// Run after EVERY function.

// each call takes 50 ms and resolves with its own id
const slow = (id) => new Promise((resolve) => setTimeout(() => resolve(id), 50));
const ids = [1, 2, 3, 4];

// --- 1 --------------------------------------------------------
// oneByOne(ids) must fetch them in a for...of loop with await INSIDE, and return
// the array of results.
//   -> [1, 2, 3, 4]
// Four calls of 50 ms each, one after another. Note how long that is.

async function oneByOne(list) {
  let response = [];
  for (item of list) {
    const i = await slow(item);
    response.push(i)
  }
  return response;
}

// --- 2 --------------------------------------------------------
// allAtOnce(ids) must do the same work in parallel and return the same array.
//   -> [1, 2, 3, 4]
// Start every call first, then wait for all of them.

async function allAtOnce(list) {
  const response = (await Promise.all(list.map(slow)))
  return response;
}

// --- 3 --------------------------------------------------------
// Prove it. compare() must time both, and return a two-element array:
//   [ <did oneByOne take at least 190 ms?>, <did allAtOnce take under 120 ms?> ]
// Use Date.now() before and after each. Expected: [true, true]

async function compare() {
  async function oneByOneTime() {
    const oneByOneTime = Date.now();
    let response = [];
    for (item of [1, 2, 3, 4]) {
      const i = await slow(item);
      response.push(i)
    }
    return Date.now() - oneByOneTime;
  }
  async function allAtOnceTime() {
    const oneByOneTime = Date.now();
    const response = (await Promise.all([1, 2, 3, 4]))
    return Date.now() - oneByOneTime;
  }
  const a = await oneByOneTime();
  const b = await allAtOnceTime();

  return [ a > 190, b < 120 ]
}

// --- 4 --------------------------------------------------------
// The trap that looks parallel and is not. Both of these are written with .map,
// but only one of them actually runs in parallel:
//
//   A:  await Promise.all(list.map(async (id) => await slow(id)))
//   B:  const out = []; for (const id of list) { out.push(await slow(id)) }
//
// mapTrap() must time this THIRD version and return true if it finished in
// under 100 ms:
//
//   const out = [];
//   for (const p of list.map(slow)) { out.push(await p) }
//
// Sequential or parallel? Do not guess - run it and let the clock answer.
// Expected: true

async function mapTrap() {
  async function check() {
    const oneByOneTime = Date.now();
    const out = [];
    for (const p of [1, 2, 3, 4].map(slow)) { out.push(await p) }
    return Date.now() - oneByOneTime;
  }
  const a = await check();

  return a < 100;
}

// --- 5, spoken, nothing to write ------------------------------
//   a) at which exact moment does a promise start doing its work - in createation moment, not in await
//   b) why is version 4 above fast, even though it awaits inside a loop - because the engine start slow before the loop
//   c) you have 500 items and an API that allows 5 at a time. Promise.all over
//      all 500 is wrong - what do you do instead, and what is that called - ограниченый параллелизм, bounded cocurrency, libs p-limit, p-map, 
//      only lazy work! pool(list.map(slow)) will not work! but pool(list.map(id => () => slow(id)), 5)

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

runChecks([
  { name: "oneByOne", fn: oneByOne, run: () => oneByOne(ids), expected: [1, 2, 3, 4] },
  { name: "allAtOnce", fn: allAtOnce, run: () => allAtOnce(ids), expected: [1, 2, 3, 4] },
  // it has to actually do the work: four 50 ms calls in parallel is ~50 ms, not 0
  { name: "allAtOnce really calls slow", fn: allAtOnce, run: async () => { const t = Date.now(); await allAtOnce(ids); const ms = Date.now() - t; return ms >= 40 && ms < 120; }, expected: true },
  { name: "compare", fn: compare, run: () => compare(), expected: [true, true] },
  { name: "mapTrap", fn: mapTrap, run: () => mapTrap(), expected: true },
]);
