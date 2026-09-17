// Drill 17 - useState  (THIRD PASS, NEW DATA)
//
// Same four techniques as 17-usestate.jsx, different data and three twists:
// the delayed step is not 1, the list refuses an empty entry, and the empty
// state of the field has its own sentence. There is no reference answer for
// this file anywhere - it is written for this session.
//
// Run:  npm run drill week-4-react/17-usestate.variant.jsx

const { React } = require("../lib/react-harness.js");
const { useState } = React;

// --- 1 --------------------------------------------------------
// <Pledge /> renders <button id="give"> whose text is exactly `total: N`,
// starting at 0.
//
// A click does NOT change the total immediately. It starts a 25 ms timer, and
// when the timer fires the total goes up by FIVE.
//
//   click three times quickly, wait  ->  "total: 15"
//
// The check clicks three times before any timer has fired.

function Pledge() {
  // TODO
  return <button id="give">total: 0</button>;
}

// --- 2 --------------------------------------------------------
// <Signature /> renders:
//   <input id="city" /> and a <p id="line">
// The paragraph shows `Sent from <what is typed>.`, and `Sent from nowhere.`
// while the field is empty. The input must be CONTROLLED.
//
//   initial              -> input value "",      p "Sent from nowhere."
//   after typing "Lodz"  -> input value "Lodz",  p "Sent from Lodz."

function Signature() {
  // TODO
  return null;
}

// --- 3 --------------------------------------------------------
// <Basket initial={...} /> keeps a list of strings in state, seeded from the
// `initial` prop. It renders:
//   <input id="item" />, <button id="add">, <p id="size"> with the number of
//   items, and one <li> per item.
//
// Clicking add appends whatever is in the input and clears the input - EXCEPT
// when the input is empty, in which case nothing is added at all.
//
//   initial ["bread"]                -> ["bread"]
//   type "milk", click add           -> ["bread", "milk"]
//   click add on an empty field      -> unchanged, still ["bread", "milk"]
//
// The check holds on to the FIRST array and looks at it afterwards.

function Basket({ initial }) {
  // TODO
  return null;
}

// --- 4 --------------------------------------------------------
// <Heavy /> gets an expensive initial value from `slowSeed` below.
// `useEffect` is NOT allowed - the check reads your source. The answer is one
// word long. `slowSeed` must be called EXACTLY ONCE, however many re-renders
// happen.
//
// It renders:
//   <p id="seed"> with the value slowSeed returned
//   <button id="tick"> which changes some OTHER piece of state

let seedCalls = 0;
function slowSeed() {
  seedCalls++;
  return "deep";
}

function Heavy() {
  // TODO
  return null;
}

// --- 5, spoken, nothing to write ------------------------------
//   a) in part 1, why does `setTotal(total + 5)` three times in one burst add
//      five, not fifteen? Name what `total` is at that moment.
//   b) part 3 - if you pushed into the array in state and handed the same array
//      back, the screen would not move. Say what React compares to decide.
//   c) `useState(slowSeed())` versus `useState(slowSeed)`. Say the difference in
//      WHEN the function runs, and why the first spelling still shows the right
//      value on screen.

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { render, act } = require("../lib/react-harness.js");
const { runChecks } = require("../lib/checks");

const pledged = async (clicks) => {
  const s = render(<Pledge />);
  // every click lands inside ONE act, the way a fast user produces them:
  // React gets no chance to re-render between them.
  act(() => {
    const btn = s.find("#give");
    for (let i = 0; i < clicks; i++) btn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  });
  const immediate = s.text();
  await new Promise((r) => setTimeout(r, 90));
  act(() => {});
  return { immediate, after: s.text() };
};

const basketRun = () => {
  const s = render(<Basket initial={Object.freeze(["bread"])} />);
  const before = s.all("li").map((li) => li.textContent);
  s.type("#item", "milk");
  s.click("#add");
  const afterAdd = s.all("li").map((li) => li.textContent);
  s.click("#add");
  return {
    before,
    afterAdd,
    afterEmptyAdd: s.all("li").map((li) => li.textContent),
    size: s.find("#size").textContent,
    inputAfter: s.find("#item").value,
  };
};

runChecks([
  { name: "1. Pledge starts at 0 and waits", fn: Pledge, run: () => pledged(0),
    expected: { immediate: "total: 0", after: "total: 0" } },
  { name: "1. one click moves it by five, but only after the timer", fn: Pledge, run: () => pledged(1),
    expected: { immediate: "total: 0", after: "total: 5" } },
  { name: "1. three fast clicks all land", fn: Pledge, run: () => pledged(3),
    expected: { immediate: "total: 0", after: "total: 15" } },

  { name: "2. Signature, empty state", fn: Signature, run: () => {
      const s = render(<Signature />);
      return { value: s.find("#city").value, line: s.find("#line").textContent };
    }, expected: { value: "", line: "Sent from nowhere." } },
  { name: "2. Signature is controlled and reacts to typing", fn: Signature, run: () => {
      const s = render(<Signature />);
      s.type("#city", "Lodz");
      // the value ATTRIBUTE is only there when React owns the field:
      // an uncontrolled input shows the same text and has no attribute.
      return {
        value: s.find("#city").value,
        drivenByReact: s.find("#city").getAttribute("value") === "Lodz",
        line: s.find("#line").textContent,
      };
    }, expected: { value: "Lodz", drivenByReact: true, line: "Sent from Lodz." } },

  { name: "3. Basket appends, counts, clears, and refuses an empty entry", fn: Basket, run: () => basketRun(),
    expected: { before: ["bread"], afterAdd: ["bread", "milk"], afterEmptyAdd: ["bread", "milk"], size: "2", inputAfter: "" } },

  { name: "4. Heavy shows the value", fn: Heavy, run: () => {
      seedCalls = 0;
      const s = render(<Heavy />);
      return s.find("#seed").textContent;
    }, expected: "deep" },
  { name: "4. slowSeed ran exactly once across five re-renders", fn: Heavy, run: () => {
      seedCalls = 0;
      const s = render(<Heavy />);
      for (let i = 0; i < 5; i++) s.click("#tick");
      return seedCalls;
    }, expected: 1 },
  { name: "4. and it does it without useEffect", fn: Heavy,
    run: () => /useEffect/.test(Heavy.toString()) ? "useEffect is not allowed in this drill" : true,
    expected: true },
]);
