// Drill 13 - Promise.all against Promise.allSettled
//
// Green criterion, two parts: cold from memory, and narrated out loud.
//
// SECOND PASS - 2026-08-21. First pass was 🔁: happyAll was looked up after two
// attempts passing loose arguments instead of one array. No example now.
//
// Run:  node week-2-async/13-all-vs-allsettled.js
// Run after EVERY function.

const ok = (v) => Promise.resolve(v);
const bad = (m) => Promise.reject(new Error(m));

// --- 1 --------------------------------------------------------
// happyAll() must run Promise.all over three fulfilled promises - ok(1), ok(2),
// ok(3) - and return the array of their values.`
//   -> [1, 2, 3]

function happyAll() {
  const response = Promise.all([ok(1), ok(2), ok(3)]);
  return response
}

// --- 2 --------------------------------------------------------
// The failure mode. brokenAll() must run Promise.all over ok(1), bad("no disk"),
// ok(3), catch what comes out, and return a two-element array:
//   [ <what the catch received: the error message>,
//     <how many results you got back from all: a number> ]
// Expected: ["no disk", 0]
// Say out loud what happened to the two promises that DID succeed.

async function brokenAll() {
  let response
  try {
    response = await Promise.all([ok(1), bad("no disk"), ok(3)]);
    return response
  } catch (e) {
    return [e.message, response ? response : 0]
  }
}

// --- 3 --------------------------------------------------------
// Same three promises through Promise.allSettled. Return the raw array it gives.
// Do not reshape it - the shape of each entry is the lesson.
// Expected: three objects. Work out what they look like by running it.

function settled() {
  const response = Promise.allSettled([ok(1), bad("no disk"), ok(3)])
  return response
}

// --- 4 --------------------------------------------------------
// The practical version. Given the same three, return only the values that
// succeeded, using allSettled.
//   -> [1, 3]

async function onlyGood() {
  let response
  try {
    response = await Promise.allSettled([ok(1), bad("no disk"), ok(3)])
    return response.filter(item => item.status === 'fulfilled').map(item => item.value)
  } catch (e) {
    return e.message
  }
}

// --- 5, spoken, nothing to write ------------------------------
//   a) when the first promise rejects, what happens to the others - are they
//      cancelled, and does their work stop -- undefined fir the value and reject with the error
//   b) the shape of an allSettled entry, both cases, field by field
//   c) `Promise.race` and `Promise.any` - one sentence each, and how they differ
//      from these two

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

runChecks([
  { name: "happyAll", fn: happyAll, run: () => happyAll(), expected: [1, 2, 3] },
  { name: "brokenAll", fn: brokenAll, run: () => brokenAll(), expected: ["no disk", 0] },
  {
    name: "settled", fn: settled, run: () => settled(), expected: [
      { status: "fulfilled", value: 1 },
      { status: "rejected", reason: new Error("no disk") },
      { status: "fulfilled", value: 3 },
    ]
  },
  { name: "onlyGood", fn: onlyGood, run: () => onlyGood(), expected: [1, 3] },
]);
