// Drill 19 - keys in a list
//
// The rule this drill exists for: a key is not a label for React's benefit.
// It is the ANSWER to "which of these is the same thing I had last time".
// Get it wrong and state, focus and DOM nodes follow POSITION instead of the item.
//
// Green criterion, two parts: cold from memory, and narrated out loud.
//
// Run:  npm run drill week-4-react/19-keys.jsx

const { React } = require("../lib/react-harness.js");
const { useState, Fragment } = React;

// --- given components. Do not edit. ---------------------------
// Row holds its OWN state. That is what makes a wrong key visible.

function Row({ person }) {
  const [n, setN] = useState(0);
  return (
    <li>
      <button id={"b-" + person.name} onClick={() => setN(n + 1)}>
        {person.name}:{n}
      </button>
    </li>
  );
}

// Draft also holds its own state - an uncontrolled-looking note field.

function Draft({ user }) {
  const [note, setNote] = useState("");
  return (
    <div>
      <span id="who">{user.name}</span>
      <input id="note" value={note} onChange={(ev) => setNote(ev.target.value)} />
    </div>
  );
}

// --- 1 --------------------------------------------------------
// <Roster people={[{ id, name }, ...]} /> renders a <ul> with one <Row /> per
// person.
//
// The check clicks bo's button three times, then re-renders with a NEW person
// added at the FRONT of the list. bo must still show "bo:3".
//
// The check also renders a list where two different people are both called
// "bo", and fails if React logs a key warning.

function Roster({ people }) {
  return "__HERE__";
}

// --- 2 --------------------------------------------------------
// <Pairs rows={[{ id, term, def }, ...]} /> renders a <dl>, and for each row
// TWO elements: <dt>{term}</dt> and <dd>{def}</dd>.
//
// A <dl> may contain only <dt> and <dd> as direct children, so you cannot wrap
// each pair in a <div>. The check reads the direct children of the <dl> and
// expects exactly dt,dd,dt,dd - and no key warning.
//
// The shorthand <>...</> takes no attributes. There is a longer spelling that
// does.

function Pairs({ rows }) {
  return "__HERE__";
}

// --- 3 --------------------------------------------------------
// <Profile user={{ id, name }} /> renders the given <Draft />.
//
// The check types "hello" into the note, then re-renders with a DIFFERENT user.
// The name must change to the new user AND the note must be empty again.
//
// You are not allowed to touch Draft, and Draft has no idea the user changed.
// Make React throw the old one away.

function Profile({ user }) {
  return "__HERE__";
}

// --- 4 --------------------------------------------------------
// <SortedRoster people={[{ id, name, score }, ...]} by="name" | "score" />
// renders the same <ul> of <Row />, ordered by name A-Z when by is "name", and
// by score HIGH TO LOW when by is "score".
//
// The check clicks cy twice under by="name", then re-renders with by="score",
// which puts cy last. cy must still show "cy:2".
//
// A second check compares the array it passed in before and after. It must come
// back in the order it was given.

function SortedRoster({ people, by }) {
  return "__HERE__";
}

// --- 5, spoken, nothing to write ------------------------------
//   a) what does React actually DO with a key? Say it as a question React is
//      answering. Then: why is the array index a bad key, and name the one
//      situation where it is genuinely fine.
//   b) why can <>...</> not carry a key, and what do you write instead?
//   c) in part 3 you changed a key on purpose. Say what React does to the old
//      component - and which of yesterday's two cleanup moments fires.

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { render } = require("../lib/react-harness.js");
const { runChecks } = require("../lib/checks");

const catchWarn = (fn) => {
  const errs = [];
  const orig = console.error;
  console.error = (...a) => errs.push(String(a[0]));
  try { fn(); } finally { console.error = orig; }
  return errs.some((x) => /key/i.test(x));
};

const THREE = () => [{ id: 1, name: "ann" }, { id: 2, name: "bo" }, { id: 3, name: "cy" }];
const SCORED = () => [
  { id: 1, name: "ann", score: 5 },
  { id: 2, name: "bo", score: 9 },
  { id: 3, name: "cy", score: 1 },
];

runChecks([
  { name: "Roster keeps a row's own state when the list grows", fn: Roster, run: () => {
      const people = THREE();
      const s = render(<Roster people={people} />);
      s.click("#b-bo"); s.click("#b-bo"); s.click("#b-bo");
      s.rerender(<Roster people={[{ id: 9, name: "zed" }, ...people]} />);
      const shown = s.find("#b-bo").textContent;
      s.unmount();
      return shown;
    }, expected: "bo:3" },

  { name: "Roster survives two people with the same name", fn: Roster, run: () => {
      const people = [{ id: 1, name: "ann" }, { id: 2, name: "bo" }, { id: 3, name: "bo" }];
      const warned = catchWarn(() => { render(<Roster people={people} />).unmount(); });
      return warned ? "warned" : "quiet";
    }, expected: "quiet" },

  { name: "Pairs puts dt and dd straight into the dl", fn: Pairs, run: () => {
      const rows = [{ id: 1, term: "a", def: "1" }, { id: 2, term: "b", def: "2" }];
      let tags = "";
      const warned = catchWarn(() => {
        const s = render(<Pairs rows={rows} />);
        tags = [...s.find("dl").children].map((c) => c.tagName.toLowerCase()).join(",");
        s.unmount();
      });
      return { tags, warned };
    }, expected: { tags: "dt,dd,dt,dd", warned: false } },

  { name: "Profile clears the draft when the user changes", fn: Profile, run: () => {
      const s = render(<Profile user={{ id: 1, name: "ann" }} />);
      s.type("#note", "hello");
      s.rerender(<Profile user={{ id: 2, name: "bo" }} />);
      const out = { who: s.find("#who").textContent, note: s.find("#note").value };
      s.unmount();
      return out;
    }, expected: { who: "bo", note: "" } },

  { name: "SortedRoster keeps each count through a re-sort", fn: SortedRoster, run: () => {
      const people = SCORED();
      const s = render(<SortedRoster people={people} by="name" />);
      s.click("#b-cy"); s.click("#b-cy");
      s.rerender(<SortedRoster people={people} by="score" />);
      const out = {
        cy: s.find("#b-cy").textContent,
        order: s.all("button").map((b) => b.id).join(","),
      };
      s.unmount();
      return out;
    }, expected: { cy: "cy:2", order: "b-bo,b-ann,b-cy" } },

  { name: "SortedRoster does not touch the array it was given", fn: SortedRoster, run: () => {
      const people = SCORED();
      const before = people.map((p) => p.name).join(",");
      const s = render(<SortedRoster people={people} by="score" />);
      s.unmount();
      return people.map((p) => p.name).join(",") === before;
    }, expected: true },
]);
