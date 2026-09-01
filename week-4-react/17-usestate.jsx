// Drill 17 - useState
//
// First React drill. Real DOM, real React 19, real events - the harness in
// lib/react-harness.js gives you a jsdom page and a real root, nothing is mocked.
//
// Green criterion, two parts: cold from memory, and narrated out loud.
//
// Run:  npm run drill week-4-react/17-usestate.jsx
// Run after EVERY component.

import { useEffect } from "react";

const { React } = require("../lib/react-harness.js");
const { useState } = React;

// --- 1 --------------------------------------------------------
// <Delayed /> renders <button id="bump"> whose text is exactly `count: N`,
// starting at 0.
//
// A click does NOT change the count immediately. It starts a 20 ms timer, and
// when the timer fires the count goes up by one.
//
//   click three times quickly, wait  ->  "count: 3"
//
// The check clicks three times before any timer has fired. There is an obvious
// way to write this in which all three clicks land on the same value and you
// end up at 1. No arithmetic trick gets you out of it - the fix is in HOW you
// tell React what the next value is.

function Delayed() {
  const [count, setCount] = useState(0);

  const bump = () => {
    setTimeout(() => {
      setCount(prev => prev + 1);
    }, 20)
  }

  return <button id="bump" onClick={bump}>count: {count}</button>;
}

// --- 2 --------------------------------------------------------
// <Greeter /> renders:
//   <input id="name" /> and a <p id="out">
// The paragraph shows `Hello, <what is typed>!`, and `Hello, stranger!` while
// the field is empty. The input must be CONTROLLED - its value comes from state.
//
//   initial            -> input value "",     p "Hello, stranger!"
//   after typing "Ola" -> input value "Ola",  p "Hello, Ola!"

function Greeter() {
  const [name, setName] = useState('');

  const handleChange = (newName) => {
    setName(newName);
  }

  return (
    <>
      <input
        id="name"
        value={name}
        onChange={(e) => handleChange(e.target.value)} />
      <p id="out">{`Hello, ${!!name ? name : 'stranger'}!`}</p>
    </>
  );
}

// --- 3 --------------------------------------------------------
// <Tags /> keeps a list of strings in state, starting with ["js"].
// It renders:
//   <input id="tag" />, <button id="add">, <p id="count"> with the number of
//   tags, and one <li> per tag.
// Clicking add appends whatever is in the input and clears the input.
//
//   initial                       -> ["js"]
//   type "css", click add         -> ["js", "css"]
//
// The check also holds on to the FIRST array and compares it afterwards. If you
// mutate the array in state instead of building a new one, that check goes red
// even though the screen looks correct.

const Tags = ({ initial }) => {
  const [tags, setTags] = useState(initial);
  const [newTag, setNewTag] = useState('');

  const handleChange = (tag) => {
    setNewTag(tag);
  }

  const handleClick = () => {
    if (!newTag) return
    setTags([...tags, newTag]);
    setNewTag('');
  }

  return (
    <>
      <input id="tag" value={newTag} onChange={(e) => handleChange(e.target.value)} />
      <button id="add" onClick={handleClick}>Add</button>
      <p id="count">{tags.length}</p>
      <ul>
        {tags?.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
}

// --- 4 --------------------------------------------------------
// <Lazy /> gets an expensive initial value from the function `slowInit` below.
// `useEffect` is NOT allowed here - this drill is about useState, and the check
// reads your source to enforce it. The answer is one word long.
// `slowInit` must be called EXACTLY ONCE, no matter how many times the component
// re-renders.
//
// It renders:
//   <p id="value"> with the value slowInit returned
//   <button id="bump"> which changes some OTHER piece of state, forcing re-renders
//
// The naive spelling calls slowInit on every single render. The check counts.

let initCalls = 0;
function slowInit() {
  initCalls++;
  return "heavy";
}

const Lazy = () => {
  const [render, setRender] = useState(0);
  const [value, setValue] = useState(slowInit);

  return (
    <>
      <p id="value">{value}</p>
      <button id="bump" onClick={() => setRender(render + 1)}>Bump</button>
    </>
  );
}

// --- 5, spoken, nothing to write ------------------------------
//   a) in part 1, why does `setCount(count + 1)` twice in one handler add one,
//      not two? Name what `count` is at that moment.
//   b) part 3 - the screen updated but the check on the old array went red.
//      Explain what React compares to decide whether to re-render.
//   c) `useState(slowInit())` versus `useState(slowInit)`. What is the difference
//      in when the function runs, and why does the first one still show the right
//      value on screen?

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { render, act } = require("../lib/react-harness.js");
const { runChecks } = require("../lib/checks");

const delayed = async (clicks) => {
  const s = render(<Delayed />);
  for (let i = 0; i < clicks; i++) s.click("#bump");
  await new Promise((r) => setTimeout(r, 80));
  act(() => {});
  return s.text();
};

const tagsRun = () => {
  const s = render(<Tags initial={Object.freeze(["js"])} />);
  const before = s.all("li").map((li) => li.textContent);
  s.type("#tag", "css");
  s.click("#add");
  return {
    before,
    after: s.all("li").map((li) => li.textContent),
    count: s.find("#count").textContent,
    inputAfter: s.find("#tag").value,
  };
};

runChecks([
  { name: "Delayed starts at 0", fn: Delayed, run: () => delayed(0), expected: "count: 0" },
  { name: "Delayed, one click then one tick", fn: Delayed, run: () => delayed(1), expected: "count: 1" },
  { name: "Delayed, three fast clicks all land", fn: Delayed, run: () => delayed(3), expected: "count: 3" },

  { name: "Greeter, empty state", fn: Greeter, run: () => {
      const s = render(<Greeter />);
      return { value: s.find("#name").value, out: s.find("#out").textContent };
    }, expected: { value: "", out: "Hello, stranger!" } },
  { name: "Greeter is controlled and reacts to typing", fn: Greeter, run: () => {
      const s = render(<Greeter />);
      s.type("#name", "Ola");
      return { value: s.find("#name").value, out: s.find("#out").textContent };
    }, expected: { value: "Ola", out: "Hello, Ola!" } },

  { name: "Tags appends, shows the count and clears the input", fn: Tags, run: () => tagsRun(),
    expected: { before: ["js"], after: ["js", "css"], count: "2", inputAfter: "" } },

  { name: "Lazy shows the value", fn: Lazy, run: () => {
      initCalls = 0;
      const s = render(<Lazy />);
      return s.find("#value").textContent;
    }, expected: "heavy" },
  { name: "slowInit ran exactly once across five re-renders", fn: Lazy, run: () => {
      initCalls = 0;
      const s = render(<Lazy />);
      for (let i = 0; i < 5; i++) s.click("#bump");
      return initCalls;
    }, expected: 1 },
  { name: "Lazy does it without useEffect", fn: Lazy,
    run: () => /useEffect/.test(Lazy.toString()) ? "useEffect is not allowed in this drill" : true,
    expected: true },
]);
