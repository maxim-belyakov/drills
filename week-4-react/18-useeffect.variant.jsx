// Drill 18 - useEffect and cleanup  (THIRD PASS, NEW DATA)
//
// An effect is not "code that runs after render". It is a SUBSCRIPTION: you
// open something, and you say how to close it.
//
// Same four techniques as 18-useeffect.jsx, different data, and four twists:
// the tick is not one, the second task now OPENS and CLOSES a room, the
// debounce has a boundary, and the loader must fall back to loading while it
// switches. There is no reference answer for this file anywhere.
//
// Run:  npm run drill week-4-react/18-useeffect.variant.jsx

const { React } = require("../lib/react-harness.js");
const { useState, useEffect } = React;

// --- given instruments. Do not edit. --------------------------

const log = { samples: 0, rooms: [], queries: [], loads: [] };

const sample = () => { log.samples++; };
const join = (room) => { log.rooms.push(`join ${room}`); };
const leave = (room) => { log.rooms.push(`leave ${room}`); };
const runQuery = (q) => { log.queries.push(q); return `hits: ${q}`; };
const fetchProfile = (id) =>
  new Promise((r) => setTimeout(() => { log.loads.push(id); r(`profile ${id}`); }, id === 1 ? 70 : 10));

// --- 1 --------------------------------------------------------
// <Meter /> starts an interval of 10 ms on mount. Every tick calls sample()
// AND raises its own number by TWO. It renders <p id="n"> with that number.
//
// When the component is unmounted the interval must STOP. The check unmounts
// it, waits, and looks at whether sample() kept firing.

function Meter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      sample();
      setCount(prev => prev + 2);
    }, 10);

    return () => {
      clearInterval(timer);
    }

  }, [])

  return <p id="n">{count}</p>;
}

// --- 2 --------------------------------------------------------
// <Presence room="..." /> is in exactly one room at a time. On mount it calls
// join(room). When the room prop changes it must LEAVE the old one before
// joining the new one. On unmount it leaves whatever it is in.
//
//   mount with "a", then "a" again, then "b", then unmount
//     -> log.rooms is ["join a", "leave a", "join b", "leave b"]
//
// Note what is NOT there: a second "join a" for the re-render with the same
// room. Nothing happens when nothing changed.
//
// It renders <p id="r"> with the room name.

function Presence({ room }) {  
  useEffect(() => {
    join(room);

    return () => leave(room);
  }, [room]);

  return <p id="r">{room}</p>;
}

// --- 3 --------------------------------------------------------
// <Filter query="..." /> waits 30 ms after the query settles, then calls
// runQuery(query) once and shows the result in <p id="q">.
//
// Two rules:
//   - only the LAST query may reach runQuery; the ones before it are cancelled
//   - an EMPTY query never reaches runQuery at all, and leaves <p id="q"> empty
//
//   "" then "x" then "xy" in quick succession, then wait
//     -> log.queries is ["xy"], and <p id="q"> says "hits: xy"
//   "" alone, then wait
//     -> log.queries is [], and <p id="q"> is empty

function Filter({ query }) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (!query || query.length === 0) return;

    let current = true;
    const timer = setTimeout(async () => {
      const response = runQuery(query);
      setText(response);
    }, 30);

    return () => {
      current = false;
      clearTimeout(timer);
    }
  }, [query])

  return <p id="q">{text}</p>;
}

// --- 4 --------------------------------------------------------
// <Profile id={n} /> calls fetchProfile(id), which resolves after a delay.
// fetchProfile(1) takes 70 ms, fetchProfile(2) takes 10 ms.
//
// <p id="v"> shows "loading" until there is an answer for the CURRENT id, and
// then the answer. Two rules:
//   - switching id goes back to "loading" immediately, it does not keep
//     showing the previous profile while the new one is in flight
//   - the slow answer for an id you have left must NEVER reach the screen
//
// The check mounts with 1, re-renders with 2, and waits.
//   -> <p id="v"> says "profile 2", and stays that way

function Profile({ id }) {
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let current = true;    
    const getUser = async () => {
      try {
        setLoading(true);
        const response = await fetchProfile(id);
        if (current) {
          setUser(response);
          setLoading(false);
        }        
      } catch (e) {
        console.error(e.message);
        setLoading(false);
      }
    }
    getUser();

    return () => {
      current = false;
    }
  }, [id]);

  return <p id="v">{loading ? 'loading' : user}</p>;
}

// --- 5, spoken, nothing to write ------------------------------
//   a) the function you return from an effect - name the TWO moments React
//      calls it, and say which of the two makes task 2 work.
//   b) `useEffect(fn)`, `useEffect(fn, [])`, `useEffect(fn, [x])` - the three
//      behaviours, and how "changed" is decided.
//   c) task 4 - the slow answer still arrives. Your code did not stop it. So
//      what did you actually do to keep it off the screen?

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { render, act } = require("../lib/react-harness.js");
const { runChecks } = require("../lib/checks");

const wait = (ms) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });
const reset = () => { log.samples = 0; log.rooms = []; log.queries = []; log.loads = []; };

runChecks([
  { name: "1. Meter counts by two while mounted", fn: Meter, run: async () => {
      reset();
      const s = render(<Meter />);
      await wait(35);
      const shown = Number(s.find("#n").textContent);
      s.unmount();
      // deliberately not an exact number: the machine decides how many ticks
      // fit in 35 ms. What must hold is that the screen equals two per tick.
      return { ticked: log.samples >= 2, even: shown % 2 === 0, matches: shown === log.samples * 2 };
    }, expected: { ticked: true, even: true, matches: true } },

  { name: "1. Meter stops when unmounted", fn: Meter, run: async () => {
      reset();
      const s = render(<Meter />);
      await wait(35);
      const during = log.samples;
      s.unmount();
      await new Promise((r) => setTimeout(r, 40));
      return log.samples - during;
    }, expected: 0 },

  { name: "2. Presence leaves the old room before joining the new one", fn: Presence, run: async () => {
      reset();
      const s = render(<Presence room="a" />);
      s.rerender(<Presence room="a" />);
      s.rerender(<Presence room="b" />);
      const beforeUnmount = log.rooms.slice();
      s.unmount();
      return { beforeUnmount, afterUnmount: log.rooms };
    }, expected: { beforeUnmount: ["join a", "leave a", "join b"], afterUnmount: ["join a", "leave a", "join b", "leave b"] } },

  { name: "2. leaving straight after joining still leaves the room", fn: Presence, run: async () => {
      reset();
      const s = render(<Presence room="a" />);
      s.unmount();
      return log.rooms;
    }, expected: ["join a", "leave a"] },

  { name: "3. Filter debounces - only the last query runs", fn: Filter, run: async () => {
      reset();
      const s = render(<Filter query="" />);
      s.rerender(<Filter query="x" />);
      s.rerender(<Filter query="xy" />);
      await wait(70);
      return { queries: log.queries, shown: s.find("#q").textContent };
    }, expected: { queries: ["xy"], shown: "hits: xy" } },

  { name: "3. an empty query never reaches runQuery", fn: Filter, run: async () => {
      reset();
      const s = render(<Filter query="" />);
      await wait(70);
      return { queries: log.queries, shown: s.find("#q").textContent };
    }, expected: { queries: [], shown: "" } },

  { name: "4. Profile goes back to loading while it switches", fn: Profile, run: async () => {
      reset();
      const s = render(<Profile id={2} />);
      await wait(40);
      const settled = s.find("#v").textContent;
      s.rerender(<Profile id={1} />);
      const immediately = s.find("#v").textContent;
      await wait(120);
      return { settled, immediately, finally_: s.find("#v").textContent };
    }, expected: { settled: "profile 2", immediately: "loading", finally_: "profile 1" } },

  { name: "4. a stale answer does not end the loading of the current one", fn: Profile, run: async () => {
      reset();
      const s = render(<Profile id={2} />);       // 2 answers at 10 ms
      s.rerender(<Profile id={1} />);             // 1 answers at 70 ms
      await wait(30);                             // 2 has arrived, 1 has not
      const midway = s.find("#v").textContent;
      await wait(100);
      return { midway, finally_: s.find("#v").textContent };
    }, expected: { midway: "loading", finally_: "profile 1" } },

  { name: "4. the slow answer for the id you left never reaches the screen", fn: Profile, run: async () => {
      reset();
      const s = render(<Profile id={1} />);
      s.rerender(<Profile id={2} />);
      await wait(150);
      return { shown: s.find("#v").textContent, arrived: log.loads };
    }, expected: { shown: "profile 2", arrived: [2, 1] } },
]);
