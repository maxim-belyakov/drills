// Drill 23 - debounce in React  (THIRD PASS, NEW DATA)
//
// The rule this drill exists for: a debounce is a timer plus the cleanup that
// cancels it. Everything else is where you put those two lines.
//
// Same three techniques as 23-debounce.jsx, different data, and three twists:
// the delay itself can change, the callback carries TWO arguments, and the
// editor must refuse an empty save while accepting a one-letter one. There is
// no reference answer for this file anywhere.
//
// Run:  npm run drill week-4-react/23-debounce.variant.jsx

const { React } = require("../lib/react-harness.js");
const { useState, useEffect, useRef, useCallback } = React;

// --- given instruments. Do not edit. ---------------------------
// save() stands for the expensive thing - a request. log.saves is every time
// it actually ran, with exactly the arguments it was called with.

const log = { saves: [] };
const save = (...args) => { log.saves.push(args); };

// given consumer for task 1
function Readout({ value, ms }) {
  const shown = useLaggingValue(value, ms);
  return <p id="shown">{String(shown)}</p>;
}

// given consumer for task 2
function FieldSaver() {
  const push = useDebouncedCallback((field, text) => save(field, text), 40);
  return (
    <>
      <button id="t1" onClick={() => push("title", "h")}>t1</button>
      <button id="t2" onClick={() => push("title", "he")}>t2</button>
      <button id="t3" onClick={() => push("title", "hey")}>t3</button>
    </>
  );
}

// given consumer for task 2, second check: its function READS a prop
function Pinger({ user }) {
  const ping = useDebouncedCallback(() => save("ping", user), 40);
  return <button id="ping" onClick={() => ping()}>ping</button>;
}

// --- 1 ----------------------------------------------------------
// useLaggingValue(value, ms) returns a value that LAGS behind the one it is
// given:
//
//   on mount            ->  returns value straight away, no delay
//   value changes       ->  keeps returning the OLD one for ms
//   changes again first ->  the wait starts over
//   ms of quiet passes  ->  returns the newest value
//
// The twist: `ms` is a prop too, and it can change. If the delay changes while
// a value is waiting, the wait starts over WITH THE NEW DELAY.

function useLaggingValue(value, ms) {
  const [vl, setVl] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVl(value);
    }, ms)

    return () => {
      clearTimeout(timer);
    }
  }, [value, ms, vl])

  return vl;
}

// --- 2 ----------------------------------------------------------
// useDebouncedCallback(fn, ms) returns a FUNCTION. Calling it repeatedly runs
// fn only once, ms after the last call, with that last call's arguments -
// ALL of them, however many there are.
//
//   three calls in a row  ->  fn runs once, with the third call's arguments
//   component unmounts    ->  a pending call must NOT fire afterwards

function useDebouncedCallback(fn, ms) {
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const localFn = useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), ms)
  }, [ms])

  return localFn;
}

// --- 3 ----------------------------------------------------------
// <DraftEditor /> renders:
//
//   <input id="draft">   shows EVERY keystroke immediately, with no delay
//   <p id="saved">       the last draft that actually reached save()
//
// It calls save("draft", text) once the text has been quiet for 40 ms.
// Two rules at the edges:
//   - an EMPTY draft is never saved - not on mount, and not after deleting
//     everything
//   - a draft of ONE letter IS saved; there is no minimum length
//
// Reuse what you built above.

function DraftEditor() {
  const [draft, setDraft] = useState('');
  const [saved, setSaved] = useState('');

  const debouncedSave = useDebouncedCallback((text) => {
    if (text.length > 0) {
      save("draft", text);
      setSaved(text);
    }
  }, 40);
  
  const handleChange = (e) => {
    const val = e.target.value;
    setDraft(val);
    debouncedSave(val);
  };

  return (
    <>
      <input id="draft" value={draft} onChange={handleChange} />
      <p id="saved">{saved}</p>
    </>
  );
}

// --- 4, spoken, nothing to write --------------------------------
//   a) in task 2 the timer id has to survive between renders. Why is useRef
//      the right box for it and useState the wrong one?
//   b) in task 1, what goes in the dependency array, and what exactly breaks
//      if `ms` is left out of it?
//   c) debounce against throttle - say the difference in one sentence each, and
//      name one place in a UI where you would want each.

// ----------------------------------------------------------------
// Do not touch below. This is the check.

const { render, act } = require("../lib/react-harness.js");
const { runChecks } = require("../lib/checks");

const wait = (ms) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });
const reset = () => { log.saves = []; };

runChecks([
  {
    name: "1. the lagging value starts on the first value and settles on the last", fn: useLaggingValue, run: async () => {
      const seen = [];
      const s = render(<Readout value="a" ms={40} />);
      seen.push(s.find("#shown").textContent);
      s.rerender(<Readout value="b" ms={40} />);
      await wait(15);
      seen.push(s.find("#shown").textContent);
      s.rerender(<Readout value="c" ms={40} />);
      await wait(30);          // past the moment "b" would have landed if it were not cancelled
      seen.push(s.find("#shown").textContent);
      await wait(60);
      seen.push(s.find("#shown").textContent);
      return seen;
    }, expected: ["a", "a", "a", "c"]
  },

  {
    name: "1. a changed delay restarts the wait with the new delay", fn: useLaggingValue, run: async () => {
      const s = render(<Readout value="a" ms={20} />);
      s.rerender(<Readout value="b" ms={20} />);
      await wait(10);
      s.rerender(<Readout value="b" ms={80} />);       // same value, longer delay
      await wait(30);                                  // past the OLD delay, not the new one
      const early = s.find("#shown").textContent;
      await wait(80);
      return { early, late: s.find("#shown").textContent };
    }, expected: { early: "a", late: "b" }
  },

  {
    name: "2. three calls run once, with ALL of the last call's arguments", fn: useDebouncedCallback, run: async () => {
      reset();
      const s = render(<FieldSaver />);
      s.click("#t1"); s.click("#t2"); s.click("#t3");
      await wait(80);
      return log.saves;
    }, expected: [["title", "hey"]]
  },

  {
    name: "2. a pending call does not fire after unmount", fn: useDebouncedCallback, run: async () => {
      reset();
      const s = render(<FieldSaver />);
      s.click("#t1");
      s.unmount();
      await new Promise((r) => setTimeout(r, 80));
      return log.saves;
    }, expected: []
  },

  {
    name: "2. the callback uses the LATEST function, not the first one", fn: useDebouncedCallback, run: async () => {
      reset();
      const s = render(<Pinger user="ola" />);
      s.rerender(<Pinger user="max" />);      // the user changed before the click
      s.click("#ping");
      await wait(80);
      return log.saves;
    }, expected: [["ping", "max"]]
  },

  {
    name: "3. the field repaints on every keystroke, the save waits", fn: DraftEditor, run: async () => {
      reset();
      const s = render(<DraftEditor />);
      s.type("#draft", "n"); s.type("#draft", "no"); s.type("#draft", "not");
      const fieldNow = s.find("#draft").value;
      const savesNow = log.saves.length;
      await wait(80);
      return { fieldNow, savesNow, saves: log.saves, shown: s.find("#saved").textContent };
    }, expected: { fieldNow: "not", savesNow: 0, saves: [["draft", "not"]], shown: "not" }
  },

  {
    name: "3. nothing is saved on mount, and nothing after clearing the field", fn: DraftEditor, run: async () => {
      reset();
      const s = render(<DraftEditor />);
      await wait(80);
      const afterMount = log.saves.slice();
      s.type("#draft", "x");
      await wait(80);
      s.type("#draft", "");
      await wait(80);
      return { afterMount, saves: log.saves };
    }, expected: { afterMount: [], saves: [["draft", "x"]] }
  },

  {
    name: "3. a one-letter draft is saved", fn: DraftEditor, run: async () => {
      reset();
      const s = render(<DraftEditor />);
      s.type("#draft", "q");
      await wait(80);
      return log.saves;
    }, expected: [["draft", "q"]]
  },
]);
