// Drill 23 - debounce
//
// The rule this drill exists for: debounce delays the EXPENSIVE thing, never
// the thing the user is looking at. The field must repaint on every keystroke;
// only the search behind it waits. Debounce the field itself and you have
// built a laggy input, which is the exact bug the technique is meant to avoid.
//
// Three tasks. Green criterion: cold from memory, and narrated out loud.
//
// Run:  npm run drill week-4-react/23-debounce.jsx

const { React } = require("../lib/react-harness.js");
const { useState, useEffect, useRef, useCallback } = React;

// --- given instruments. Do not edit. ---------------------------
// record() stands for the expensive thing - a request, a report, an analytics
// event. log.runs is every time it actuallцy ran.

const log = { runs: [] };
const record = (label) => { log.runs.push(label); };

// given consumer for task 1
function DebouncedEcho({ text }) {
  const shown = useDebouncedValue(text, 50);
  useEffect(() => { record(shown); }, [shown]);
  return <p id="out">{shown}</p>;
}

// given consumer for task 2
function PingBox() {
  const [n, setN] = useState(0);
  const ping = useDebouncedCallback((label) => record(label), 50);
  return (
    <button id="ping" onClick={() => { ping("call-" + n); setN(n + 1); }}>ping</button>
  );
}

// --- 1 ----------------------------------------------------------
// useDebouncedValue(value, ms) returns a value that LAGS behind the one it is
// given.
//
//   on mount            ->  returns value straight away, no delay
//   value changes       ->  keeps returning the OLD one for ms
//   changes again first ->  the wait starts over
//   ms of quiet passes  ->  returns the newest value
//
// The check changes the text three times in quick succession and expects the
// settled sequence to be the first value and then the last one - nothing in
// between ever appears.
//
// The shape of the answer, on unrelated data:
//
//   function useSettledZoom(zoom, ms) {
//     const [settled, setSettled] = useState(zoom);
//     useEffect(() => {
//       const timer = setTimeout(() => setSettled(zoom), ms);
//       return () => clearTimeout(timer);
//     }, [zoom, ms]);
//     return settled;
//   }
//
// The cleanup is the whole technique: every new value cancels the timer the
// previous one started.

function useDebouncedValue(value, ms) {
  const [text, setText] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setText(value);
    }, ms)

    return () => {
      clearTimeout(timer);
    }
  }, [value, ms])
  
  return text;
}

// --- 2 ----------------------------------------------------------
// useDebouncedCallback(fn, ms) returns a FUNCTION. Calling it repeatedly must
// run fn only once, ms after the last call, with that last call's arguments.
//
//   three calls in a row  ->  fn runs once, with the third call's argument
//   component unmounts    ->  a pending call must NOT fire afterwards
//
// A timer id has to survive between renders without causing one. That is what
// useRef is for: a box React keeps for you, whose .current you may write to,
// and writing to it never triggers a render.
//
// The shape of the answer, on unrelated data:
//
//   function useDelayedSave(save, ms) {
//     const timer = useRef(null);
//     useEffect(() => () => clearTimeout(timer.current), []);
//     return useCallback((draft) => {
//       clearTimeout(timer.current);
//       timer.current = setTimeout(() => save(draft), ms);
//     }, [save, ms]);
//   }
//
// Read the effect in the middle carefully: it has an empty dependency array and
// its ONLY job is the cleanup on unmount.

function useDebouncedCallback(fn, ms) {
  const timer = useRef(null);
  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  const dc = useCallback((label) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(label), ms)
  }, [fn, ms])
  return dc;
}

// --- 3 ----------------------------------------------------------
// <SearchBox /> is where the rule at the top gets tested.
//
//   <input id="q">     shows EVERY keystroke immediately, with no delay
//   <p id="fired">     the last query that actually reached record()
//
// The check types "a", "ab", "abc" in quick succession and looks at the input
// BEFORE the delay has passed: it must already read "abc". Only after the quiet
// period may record() run, once, with "abc".
//
// Use 50 ms, and reuse what you built above.
//
// The shape of the answer, on unrelated data:
//
//   function ZoomBar() {
//     const [zoom, setZoom] = useState(1);          // repaints instantly
//     const settled = useSettledZoom(zoom, 50);     // lags on purpose
//     useEffect(() => { if (settled !== 1) redraw(settled); }, [settled]);
//     return <input id="z" value={zoom} onChange={(e) => setZoom(e.target.value)} />;
//   }
//
// Two values, not one: the immediate one drives the control, the lagging one
// drives the work.

function SearchBox() {
  const [query, setQuery] = useState('');
  const settled = useDebouncedValue(query, 50);

  useEffect(() => {
    if (query.length > 2) {
      record(query);
    }
  }, [settled])

  return (
    <>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} />
      <p id="fired">{settled}</p>
    </>
  );
}

// --- 4, spoken, nothing to write --------------------------------
//   a) say what debounce does in one sentence, then say how throttle differs
//      and give one job each is right for.
//   b) in task 2 the timer id lives in a useRef, not in useState. What would
//      break if you used useState instead? Name both problems.
//   c) task 3 has two values for the same text. Say why, and say what the user
//      sees if you debounce the input's own value instead.

// ----------------------------------------------------------------
// Do not touch below. This is the check.

const { render, act } = require("../lib/react-harness.js");
const { runChecks } = require("../lib/checks");

const wait = (ms) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });
const reset = () => { log.runs = []; };

runChecks([
  { name: "1. only the first and the last value ever settle", fn: useDebouncedValue, run: async () => {
      reset();
      const s = render(<DebouncedEcho text="a" />);
      await wait(20);
      s.rerender(<DebouncedEcho text="ab" />);
      await wait(20);
      s.rerender(<DebouncedEcho text="abc" />);
      const before = s.find("#out").textContent;
      await wait(35);
      const mid = log.runs.join(",");
      await wait(60);
      const out = { before, mid, after: s.find("#out").textContent, runs: log.runs.join(",") };
      s.unmount();
      return out;
    }, expected: { before: "a", mid: "a", after: "abc", runs: "a,abc" } },

  { name: "2. a change that stands alone gets through", fn: useDebouncedValue, run: async () => {
      reset();
      const s = render(<DebouncedEcho text="a" />);
      await wait(80);
      s.rerender(<DebouncedEcho text="b" />);
      await wait(80);
      const out = { after: s.find("#out").textContent, runs: log.runs.join(",") };
      s.unmount();
      return out;
    }, expected: { after: "b", runs: "a,b" } },

  { name: "3. three calls collapse into the last one", fn: useDebouncedCallback, run: async () => {
      reset();
      const s = render(<PingBox />);
      s.click("#ping"); s.click("#ping"); s.click("#ping");
      const during = log.runs.length;
      await wait(80);
      const out = { during, after: log.runs.join(",") };
      s.unmount();
      return out;
    }, expected: { during: 0, after: "call-2" } },

  { name: "4. a pending call does not fire after unmount", fn: useDebouncedCallback, run: async () => {
      reset();
      const s = render(<PingBox />);
      s.click("#ping");
      s.unmount();
      await wait(80);
      return log.runs.length;
    }, expected: 0 },

  { name: "5. the input never lags", fn: SearchBox, run: async () => {
      reset();
      const s = render(<SearchBox />);
      s.type("#q", "a"); s.type("#q", "ab"); s.type("#q", "abc");
      const out = { field: s.find("#q").value, ranSoFar: log.runs.length };
      s.unmount();
      return out;
    }, expected: { field: "abc", ranSoFar: 0 } },

  { name: "6. and the search runs once, with the last query", fn: SearchBox, run: async () => {
      reset();
      const s = render(<SearchBox />);
      s.type("#q", "a"); s.type("#q", "ab"); s.type("#q", "abc");
      await wait(80);
      const out = { runs: log.runs.join(","), fired: s.find("#fired").textContent };
      s.unmount();
      return out;
    }, expected: { runs: "abc", fired: "abc" } },
]);
