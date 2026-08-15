// Drill 10 - closures: a function that remembers where it was born
//
// Last drill of week 1.
//
// Green criterion, two parts, both required:
//   1. all four from memory, no hints, under 90 seconds each, tests green
//   2. narrated out loud WHILE typing
//
// Run:  node week-1-js/10-closures.js         all checks
//       node week-1-js/10-closures.js trap    only checks matching "trap"
// Run after EVERY function.

// --- 1 --------------------------------------------------------
// makeCounter() returns a FUNCTION. Calling it returns 1, then 2, then 3...
// Two counters made separately must not share their number.

function makeCounter() {
  // here
}

// --- 2 --------------------------------------------------------
// once(fn) returns a wrapped function that runs fn only on the FIRST call.
// Every later call returns the first result again without running fn.
//   const init = once(() => "ready");
//   init(); init(); init();   ->  "ready" every time, but fn ran once

function once(fn) {
  // here
}

// --- 3 --------------------------------------------------------
// makeAdder(10) returns a function; that function adds 10 to whatever it gets.
//   makeAdder(10)(5)  ->  15

function makeAdder(n) {
  // here
}

// --- 4 --------------------------------------------------------
// The classic. loopTrap() must build three functions in a `var` loop and three
// in a `let` loop, call all six, and return the two arrays of results:
//   [ <results from the var loop>, <results from the let loop> ]
// Each loop counts 0, 1, 2 and each function returns the loop variable.
// Write both loops for real. Expected: [[3, 3, 3], [0, 1, 2]]

function loopTrap() {
  // here
}

// --- 5, spoken, nothing to write ------------------------------
// Say out loud, before running the tests:
//   a) what a closure is, in one sentence, without the word "closure"
//   b) why the var loop gives three identical numbers - what exactly got
//      captured, and how many of that thing existed
//   c) one place you have actually used a closure in production code, and what
//      it bought you there

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

let ranTimes = 0;
const wrapped = () => { ranTimes++; return "ready"; };

runChecks([
  { name: "makeCounter counts up", fn: makeCounter, run: () => { const c = makeCounter(); return [c(), c(), c()]; }, expected: [1, 2, 3] },
  { name: "makeCounter is independent", fn: makeCounter, run: () => { const a = makeCounter(); const b = makeCounter(); a(); a(); return [a(), b()]; }, expected: [3, 1] },
  { name: "once returns the same result", fn: once, run: () => { ranTimes = 0; const f = once(wrapped); return [f(), f(), f()]; }, expected: ["ready", "ready", "ready"] },
  { name: "once really ran fn once", fn: once, run: () => { ranTimes = 0; const f = once(wrapped); f(); f(); f(); return ranTimes; }, expected: 1 },
  { name: "makeAdder", fn: makeAdder, run: () => [makeAdder(10)(5), makeAdder(-1)(5)], expected: [15, 4] },
  { name: "loopTrap", fn: loopTrap, run: () => loopTrap(), expected: [[3, 3, 3], [0, 1, 2]] },
]);
