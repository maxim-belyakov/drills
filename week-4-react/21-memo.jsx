// Drill 21 - useMemo, useCallback and React.memo
//
// The rule this drill exists for: none of these three change what your code
// COMPUTES. They change how often it is recomputed and how often a child is
// re-rendered. They are about identity and cost, never about correctness.
//
// Three tasks, not four - this one is dense.
//
// Green criterion: cold from memory, and narrated out loud.
//
// Run:  npm run drill week-4-react/21-memo.jsx

const { React } = require("../lib/react-harness.js");
const { useState, useMemo, useCallback, memo } = React;

// --- given instruments. Do not edit. ---------------------------
// They count how many times the expensive work ran and how many times each
// memoised child re-rendered.

const log = { filterCalls: 0, optionRenders: 0, stepRenders: 0 };

const ITEMS = ["alpha", "bravo", "charlie", "delta"];

const slowFilter = (items, query) => {
  log.filterCalls++;
  return items.filter((i) => i.includes(query));
};

const OptionsChild = memo(function OptionsChild({ options }) {
  log.optionRenders++;
  return <p id="opt">{options.label}</p>;
});

const StepChild = memo(function StepChild({ onStep }) {
  log.stepRenders++;
  return <button id="step" onClick={onStep}>step</button>;
});

// --- 1 ----------------------------------------------------------
// <FilteredList /> renders:
//
//   <input id="q">        the query, controlled
//   <button id="bump">    increments an unrelated counter
//   <p id="clicks">       that counter
//   <p id="found">        how many items slowFilter returned, from ITEMS
//
// slowFilter must run when the component mounts and every time the query
// changes - and NOT when the bump counter changes. The check clicks bump three
// times and reads log.filterCalls.
//
// The shape of the answer, on unrelated data:
//
//   function Report() {
//     const [rows, setRows] = useState(SOURCE);
//     const [tab, setTab] = useState("a");
//     const total = useMemo(() => expensiveSum(rows), [rows]);
//     return <p>{tab}: {total}</p>;
//   }
//
// Switching the tab re-renders, but expensiveSum does not run again: its
// dependency did not change.

function FilteredList() {
  return "__HERE__";
}

// --- 2 ----------------------------------------------------------
// <OptionsPanel label="one" /> renders:
//
//   <button id="bump2">   increments an unrelated counter
//   <p id="clicks2">      that counter
//   <OptionsChild options={{ label }} />
//
// OptionsChild is wrapped in memo, so it re-renders only when its props are not
// shallowly equal to last time. An object literal written inline is a NEW object
// on every render, so memo would compare {label:"one"} with a different
// {label:"one"} and see two different things.
//
//   clicking bump2 three times   ->  OptionsChild must render ONCE in total
//   changing the label prop      ->  OptionsChild MUST render again
//
// The shape of the answer, on unrelated data:
//
//   function Chart({ unit }) {
//     const [zoom, setZoom] = useState(1);
//     const axis = useMemo(() => ({ unit }), [unit]);
//     return <MemoAxis axis={axis} />;
//   }
//
// useMemo here is not about cost. It is about handing the child the SAME object
// as long as the data behind it has not changed.

function OptionsPanel({ label }) {
  return "__HERE__";
}

// --- 3 ----------------------------------------------------------
// <StepPanel /> renders:
//
//   <p id="n">            a counter, starts at 0
//   <StepChild onStep={...} />    its button adds 1 to that counter
//
//   three clicks on #step   ->  <p id="n"> says 3
//   and through all of it   ->  StepChild must have rendered exactly ONCE
//
// A function literal is also new on every render, so it needs useCallback. But
// there is a second half: if your callback READS the counter, then it has to
// list the counter as a dependency, and then it is a new function after every
// click anyway - and memo is defeated. Drill 17 has the way out.
//
// The shape of the answer, on unrelated data:
//
//   function Basket() {
//     const [items, setItems] = useState([]);
//     const add = useCallback((x) => setItems((prev) => [...prev, x]), []);
//     return <MemoAddButton onAdd={add} />;
//   }
//
// Empty dependency array, and the updater form reads the previous value instead
// of closing over it. One function for the whole life of the component.

function StepPanel() {
  return "__HERE__";
}

// --- 4, spoken, nothing to write --------------------------------
//   a) what does React.memo actually compare, and how deeply? Name the one
//      thing that makes it useless in practice more often than anything else.
//   b) useMemo and useCallback - say the difference in one sentence, and say
//      what useCallback(fn, deps) is in terms of useMemo.
//   c) in task 3, why does an empty dependency array work at all - what would
//      go wrong if the callback read the counter directly instead?

// ----------------------------------------------------------------
// Do not touch below. This is the check.

const { render } = require("../lib/react-harness.js");
const { runChecks } = require("../lib/checks");

const reset = () => { log.filterCalls = 0; log.optionRenders = 0; log.stepRenders = 0; };

runChecks([
  { name: "1. the filter does not re-run on unrelated state", fn: FilteredList, run: () => {
      reset();
      const s = render(<FilteredList />);
      s.click("#bump"); s.click("#bump"); s.click("#bump");
      const out = { calls: log.filterCalls, clicks: s.find("#clicks").textContent, found: s.find("#found").textContent };
      s.unmount();
      return out;
    }, expected: { calls: 1, clicks: "3", found: "4" } },

  { name: "2. the filter does re-run when the query changes", fn: FilteredList, run: () => {
      reset();
      const s = render(<FilteredList />);
      s.type("#q", "el");
      const out = { calls: log.filterCalls, found: s.find("#found").textContent };
      s.unmount();
      return out;
    }, expected: { calls: 2, found: "1" } },

  { name: "3. the memoised child ignores unrelated state", fn: OptionsPanel, run: () => {
      reset();
      const s = render(<OptionsPanel label="one" />);
      s.click("#bump2"); s.click("#bump2"); s.click("#bump2");
      const out = { renders: log.optionRenders, clicks: s.find("#clicks2").textContent, text: s.find("#opt").textContent };
      s.unmount();
      return out;
    }, expected: { renders: 1, clicks: "3", text: "one" } },

  { name: "4. but it does re-render when the label changes", fn: OptionsPanel, run: () => {
      reset();
      const s = render(<OptionsPanel label="one" />);
      s.rerender(<OptionsPanel label="two" />);
      const out = { renders: log.optionRenders, text: s.find("#opt").textContent };
      s.unmount();
      return out;
    }, expected: { renders: 2, text: "two" } },

  { name: "5. the step button counts", fn: StepPanel, run: () => {
      reset();
      const s = render(<StepPanel />);
      s.click("#step"); s.click("#step"); s.click("#step");
      const out = s.find("#n").textContent;
      s.unmount();
      return out;
    }, expected: "3" },

  { name: "6. and the step child rendered exactly once", fn: StepPanel, run: () => {
      reset();
      const s = render(<StepPanel />);
      s.click("#step"); s.click("#step"); s.click("#step");
      const out = log.stepRenders;
      s.unmount();
      return out;
    }, expected: 1 },
]);
