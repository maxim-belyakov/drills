// Drill 16 - the event loop, out loud
//
// This one is different: you PREDICT first, then the file runs the real thing and
// compares. No guessing your way to green - a wrong prediction is a red line.
//
// Green criterion, two parts: predicted cold, and narrated out loud while predicting.
//
// Run:  node week-2-async/16-event-loop.js
//
// The three rules you need, and nothing else:
//   1. All synchronous code runs to the end first.
//   2. Then the MICROTASK queue drains COMPLETELY - `.then`, `await` continuations,
//      `queueMicrotask`. A microtask that queues another microtask is also drained now.
//   3. Only then ONE macrotask runs - `setTimeout`, `setInterval`, I/O. After it,
//      the microtask queue is drained again, before the next macrotask.

// --- the snippets, GIVEN. Do not edit. ------------------------

function snippet1(log) {
  log("A");
  setTimeout(() => log("B"), 0);
  Promise.resolve().then(() => log("C"));
  log("D");
}

async function snippet2(log) {
  log("1");
  const p = (async () => {
    log("2");
    await null;
    log("3");
  })();
  log("4");
  await p;
  log("5");
} 

function snippet3(log) {
  setTimeout(() => {
    log("t1");
    Promise.resolve().then(() => log("t1-micro"));
  }, 0);
  setTimeout(() => log("t2"), 0);
  Promise.resolve().then(() => log("micro"));
  log("sync");
} 

// --- 1 --------------------------------------------------------
// Fill in the order snippet1 prints. Say each step out loud as you write it.
// Do NOT run it first.

const guess1 = ['A', 'D', 'C', 'B'];

// --- 2 --------------------------------------------------------
// Same for snippet2. Note that `await null` still suspends - awaiting a
// non-promise still hands control back and continues in a microtask.

const guess2 = ['1', '2', '4', '3', '5'];

// --- 3 --------------------------------------------------------
// Same for snippet3. Two timers, and one of them queues a microtask of its own.

const guess3 = ['sync', 'micro', 't1', 't1-micro', 't2'];

// --- 4, this one you write ------------------------------------
// schedule(log) must produce exactly ["now", "micro", "macro"].
// Call log("now") directly, and schedule the other two so that they land in
// that order. Pick the right primitive for each - do not use two setTimeouts
// with different delays, that is guessing, not scheduling.

function schedule(log) {
  log("now");
  Promise.resolve().then(() => log("micro"))
  setTimeout(() => log("macro"), 0)
}

// --- 5, spoken, nothing to write ------------------------------
//   a) a microtask queues another microtask, which queues another, forever.
//      What happens to the timers? Name the failure mode.
//   b) `setTimeout(fn, 0)` - why is it not "run immediately"? What is the 0 for?
//   c) you have a list of 10 000 items to process and the page must stay
//      responsive. Would you split the work into microtasks or macrotasks, and why?

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

const settle = () => new Promise((r) => setTimeout(r, 40));

const actual = async (fn) => {
  const out = [];
  await fn((x) => out.push(x));
  await settle();
  return out;
};

// Compares WITHOUT showing you the real order. On a mismatch it tells you the
// first position that is wrong and what YOU put there - work out the rest yourself.
const verdict = async (snippet, guess) => {
  const real = await actual(snippet);
  if (!Array.isArray(guess) || guess.length === 0) return "not predicted yet";
  for (let i = 0; i < Math.max(real.length, guess.length); i++) {
    if (real[i] !== guess[i]) {
      const yours = i < guess.length ? JSON.stringify(guess[i]) : "nothing";
      return `first difference at position ${i}, where you put ${yours}`;
    }
  }
  return true;
};

runChecks([
  { name: "snippet1", fn: snippet1, run: () => verdict(snippet1, guess1), expected: true },
  { name: "snippet2", fn: snippet2, run: () => verdict(snippet2, guess2), expected: true },
  { name: "snippet3", fn: snippet3, run: () => verdict(snippet3, guess3), expected: true },
  { name: "schedule produces now, micro, macro", fn: schedule,
    run: () => actual(schedule), expected: ["now", "micro", "macro"] },
]);
