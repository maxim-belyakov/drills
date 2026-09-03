// Drill 18 - useEffect and cleanup
//
// The rule this drill exists for: an effect is not "code that runs after render".
// It is a SUBSCRIPTION. You open something, and you say how to close it.
//
// Green criterion, two parts: cold from memory, and narrated out loud.
//
// Run:  npm run drill week-4-react/18-useeffect.jsx

const { React } = require("../lib/react-harness.js");
const { useState, useEffect } = React;

// --- given instruments. Do not edit. --------------------------
// They record what you did, and the checks read those records.

const log = { ticks: 0, titles: [], searches: [], loads: [] };

const tick = () => { log.ticks++; };
const setTitle = (text) => { log.titles.push(text); };
const runSearch = (q) => { log.searches.push(q); return `found: ${q}`; };
const load = (id) =>
  new Promise((r) => setTimeout(() => { log.loads.push(id); r(`item ${id}`); }, id === 1 ? 60 : 10));

// --- 1 --------------------------------------------------------
// <Clock /> counts ticks. On mount it starts an interval of 10 ms; on every tick
// it increments its own state AND calls tick(). It renders <p id="n"> with the
// number.
//
// When the component is unmounted the interval must STOP. The check unmounts it,
// waits, and looks at whether tick() kept firing.

function Clock() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
      tick()
    }, 10);

    return () => {
      clearInterval(timer);
    }
  }, [])
  return (
    <p id="n">{count}</p>
  );
}

// --- 2 --------------------------------------------------------
// <Title text="..." /> calls setTitle(text) - but ONLY when `text` actually
// changed, not on every re-render. It renders <p id="t"> with the text.
//
//   mount with "a"      -> setTitle("a")
//   re-render with "a"  -> nothing new
//   re-render with "b"  -> setTitle("b")
//
// The check reads log.titles and expects exactly ["a", "b"].

function Title({ text }) {
  useEffect(() => {
    setTitle(text)
  }, [text])

  return (
    <p id="t">{text}</p>
  );
}

// --- 3 --------------------------------------------------------
// <Search query="..." /> waits 30 ms after the query settles, then calls
// runSearch(query) once and shows the result in <p id="r">.
//
// The check changes the query three times in quick succession, then waits.
// Only the LAST query may reach runSearch - the two before it must be cancelled.
//
//   "a", "ab", "abc" in quick succession
//     -> log.searches is ["abc"], and <p id="r"> says "found: abc"
//
// This is a debounce, and the cancelling half is the point.

function Search({ query }) {
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchResult(runSearch(query));
    }, 30)

    return () => {
      clearTimeout(timer);
    }
  }, [query])

  return (
    <p id="r">{searchResult}</p>
  );
}

// --- 4 --------------------------------------------------------
// <Loader id={n} /> calls load(id), which resolves with a string after a delay.
// It shows the result in <p id="v">, and "loading" until there is one.
//
// The trap: load(1) takes 60 ms, load(2) takes 10 ms. The check mounts with
// id 1, immediately re-renders with id 2, and waits.
//
//   -> <p id="v"> must say "item 2", and must NEVER be overwritten by the slow
//      answer for id 1 that arrives afterwards.
//
// An effect cannot un-await a promise. What it CAN do is refuse the answer.

function Loader({ id }) {
  const [value, setValue] = useState('loading');

  useEffect(() => {
    let current = true;

    load(id).then((answer) => {
      if (current) setValue(answer);
    });

    return () => {
      current = false;
    };
  }, [id])


  return <p id="v">{value}</p>;
}

// --- 5, spoken, nothing to write ------------------------------
//   a) what exactly does the function you return from an effect do, and name the
//      TWO moments React calls it - one of them is not "on unmount". -- after next start of useEffect and before unmount
//   b) `useEffect(fn)` with no second argument, `useEffect(fn, [])` and
//      `useEffect(fn, [x])` - say the three behaviours out loud. -- 1 after each re-render, 2 one time after mount, 3 after mount and each time when x changes
//   c) part 4 - the slow answer for id 1 still arrives. Your code did not stop
//      it. So what did you actually do to keep it off the screen? I refuse to take the answer, 

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { render, act } = require("../lib/react-harness.js");
const { runChecks } = require("../lib/checks");

const wait = (ms) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });
const reset = () => { log.ticks = 0; log.titles = []; log.searches = []; log.loads = []; };

runChecks([
  { name: "Clock counts while it is mounted", fn: Clock, run: async () => {
      reset();
      const s = render(<Clock />);
      await wait(35);
      const shown = Number(s.find("#n").textContent);
      s.unmount();
      return shown >= 2 && log.ticks >= 2;
    }, expected: true },
  { name: "Clock stops when unmounted", fn: Clock, run: async () => {
      reset();
      const s = render(<Clock />);
      await wait(35);
      const during = log.ticks;
      s.unmount();
      await new Promise((r) => setTimeout(r, 40));
      return log.ticks - during;
    }, expected: 0 },

  { name: "Title fires only when the text changes", fn: Title, run: async () => {
      reset();
      const s = render(<Title text="a" />);
      s.rerender(<Title text="a" />);
      s.rerender(<Title text="b" />);
      return log.titles;
    }, expected: ["a", "b"] },

  { name: "Search debounces - only the last query runs", fn: Search, run: async () => {
      reset();
      const s = render(<Search query="a" />);
      s.rerender(<Search query="ab" />);
      s.rerender(<Search query="abc" />);
      await wait(60);
      return { searches: log.searches, shown: s.find("#r").textContent };
    }, expected: { searches: ["abc"], shown: "found: abc" } },

  { name: "Loader ignores the stale answer", fn: Loader, run: async () => {
      reset();
      const s = render(<Loader id={1} />);
      s.rerender(<Loader id={2} />);
      await wait(120);
      return { shown: s.find("#v").textContent, arrived: log.loads };
    }, expected: { shown: "item 2", arrived: [2, 1] } },
]);
