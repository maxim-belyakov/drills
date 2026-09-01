// Drill 17 - useState
//
// First React drill. Real DOM, real React 19, real events - the harness in
// lib/react-harness.js gives you a jsdom page and a real root, nothing is mocked.
//
// Green criterion, two parts: cold from memory, and narrated out loud.
//
// Run:  npm run drill week-4-react/17-usestate.jsx
// Run after EVERY component.

const { React } = require("../lib/react-harness.js");
const { useState } = React;

// --- 1 --------------------------------------------------------
// <StepTwo /> renders a button whose text is exactly `count: N`, starting at 0.
// ONE click must add TWO.
//
//   start        -> "count: 0"
//   after 1 click -> "count: 2"
//   after 3 clicks -> "count: 6"
//
// Write it so that both increments actually land. There is a way to write this
// that looks right and adds one per click - the check will catch it.

function StepTwo() {
  return "__HERE__";
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
  return "__HERE__";
}

// --- 3 --------------------------------------------------------
// <Tags /> keeps a list of strings in state, starting with ["js"].
// It renders:
//   <input id="tag" />, <button id="add">, and one <li> per tag.
// Clicking add appends whatever is in the input and clears the input.
//
//   initial                       -> ["js"]
//   type "css", click add         -> ["js", "css"]
//
// The check also holds on to the FIRST array and compares it afterwards. If you
// mutate the array in state instead of building a new one, that check goes red
// even though the screen looks correct.

function Tags({ initial }) {
  return "__HERE__";
}

// --- 4 --------------------------------------------------------
// <Lazy /> gets an expensive initial value from the function `slowInit` below.
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

function Lazy() {
  return "__HERE__";
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

const { render } = require("../lib/react-harness.js");
const { runChecks } = require("../lib/checks");

const stepTwo = (clicks) => {
  const s = render(<StepTwo />);
  for (let i = 0; i < clicks; i++) s.click("button");
  return s.text();
};

const tagsRun = () => {
  const s = render(<Tags initial={Object.freeze(["js"])} />);
  const before = s.all("li").map((li) => li.textContent);
  s.type("#tag", "css");
  s.click("#add");
  return { before, after: s.all("li").map((li) => li.textContent), inputAfter: s.find("#tag").value };
};

runChecks([
  { name: "StepTwo starts at 0", fn: StepTwo, run: () => stepTwo(0), expected: "count: 0" },
  { name: "StepTwo, one click adds two", fn: StepTwo, run: () => stepTwo(1), expected: "count: 2" },
  { name: "StepTwo, three clicks add six", fn: StepTwo, run: () => stepTwo(3), expected: "count: 6" },

  { name: "Greeter, empty state", fn: Greeter, run: () => {
      const s = render(<Greeter />);
      return { value: s.find("#name").value, out: s.find("#out").textContent };
    }, expected: { value: "", out: "Hello, stranger!" } },
  { name: "Greeter is controlled and reacts to typing", fn: Greeter, run: () => {
      const s = render(<Greeter />);
      s.type("#name", "Ola");
      return { value: s.find("#name").value, out: s.find("#out").textContent };
    }, expected: { value: "Ola", out: "Hello, Ola!" } },

  { name: "Tags appends and clears the input", fn: Tags, run: () => tagsRun(),
    expected: { before: ["js"], after: ["js", "css"], inputAfter: "" } },

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
]);
