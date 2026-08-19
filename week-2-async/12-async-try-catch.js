// Drill 12 - try/catch in async code: where an error is caught and where it is not
//
// Green criterion, two parts: cold from memory, and narrated out loud.
//
// Run:  node week-2-async/12-async-try-catch.js
// Run after EVERY function.

const boom = () => Promise.reject(new Error("boom"));
const fine = () => Promise.resolve("ok");

// --- 1 --------------------------------------------------------
// safeAwait() must await boom() inside try/catch and return the caught message.
//   -> "boom"

async function safeAwait() {
  try {
    await boom();
  } catch (e) {
    return e.message;
  }
}

// --- 2 --------------------------------------------------------
// The trap. missedCatch() must show that a try/catch does NOT catch a rejection
// when the promise is not awaited inside the try. Do this:
//   - inside try, call boom() WITHOUT await, and store the returned promise
//   - catch is written but will not fire
//   - return the two-element array: [ <did catch fire? true/false>,
//                                     <what the stored value is: "promise" or "value"> ]
// Then await the stored promise separately so node does not warn, ignoring the error.
// Expected: [false, "promise"]

async function missedCatch() {
  let catchFire = false;
  let re;
  try {
    re = boom();
    re.catch(() => {});
    return [ catchFire, re instanceof Promise ? 'promise' : '' ];
  } catch (e) {
    catchFire = true;
    return [ catchFire, re instanceof Promise ? 'promise' : '' ];
  }

  
}

// --- 3 --------------------------------------------------------
// finallyRuns() must return the order of three markers: "try", "catch", "finally".
// Call boom() with await inside a try/catch/finally, pushing a marker in each
// block that actually executes, and return the array.
// One of the three does not run. Expected: ["catch", "finally"]

async function finallyRuns() {
  let log = [];
  try {
    await boom();
    log.push('try');
  } catch {
    log.push('catch');
  } finally {
    log.push('finally');
  }
  return log;
}

// --- 4 --------------------------------------------------------
// Rejections inside a callback. forgotten() must show that a try/catch around a
// forEach does NOT catch an async error thrown inside the callback:
//   - inside try, run [1].forEach(async () => { throw new Error("inside") })
//   - catch is written but will not fire
//   - return true if catch did NOT fire
// Expected: true. Say out loud why, and what you would use instead of forEach.

async function forgotten() {
  let testCatch = true;
  try {
    [1].forEach(async () => { throw new Error('inside') })
  } catch (e) {
    testCatch = false;
    return e.message;
  }
  return testCatch;
}

const test = require("node:test");
// --- 5, spoken, nothing to write ------------------------------
//   a) what does `await` actually do to a rejected promise -- it catch default errors
//   b) why does a try/catch not see an error from an un-awaited call -- because try is a sugar for promise object, it gives you possibility to add wait response into microtask list
//   c) `.catch()` versus try/catch - when is each the better fit - don't know

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

runChecks([
  { name: "safeAwait", fn: safeAwait, run: () => safeAwait(), expected: "boom" },
  { name: "missedCatch", fn: missedCatch, run: () => missedCatch(), expected: [false, "promise"] },
  { name: "finallyRuns", fn: finallyRuns, run: () => finallyRuns(), expected: ["catch", "finally"] },
  { name: "forgotten", fn: forgotten, run: () => forgotten(), expected: true },
]);
