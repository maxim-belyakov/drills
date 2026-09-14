// Drill 19 - keys in a list  (COLD RE-RUN)
//
// The rule this drill exists for: a key is not a label for React's benefit.
// It is the ANSWER to "which of these is the same thing I had last time".
// Get it wrong and state, focus and DOM nodes follow POSITION instead of the item.
//
// Green criterion, two parts: cold from memory, and narrated out loud.
// No worked example this time: it has been seen.
//
// Run:  npm run drill week-4-react/19-keys.rerun.jsx

const { React } = require("../lib/react-harness.js");
const { useState, Fragment } = React;

// --- given components. Do not edit. ---------------------------
// Before writing a line: for each given component write down its name, its
// props, what it reads off each prop, and what it renders. Four lines, one minute.

// Row holds its OWN state. That is what makes a wrong key visible.
function Row({ member }) {
  const [n, setN] = useState(0);
  return (
    <li>
      <button id={"b-" + member.name} onClick={() => setN(n + 1)}>
        {member.name}:{n}
      </button>
    </li>
  );
}

// Note also holds its own state - a scratch field that belongs to one author.
function Note({ author }) {
  const [text, setText] = useState("");
  return (
    <div>
      <span id="who">{author.name}</span>
      <input id="text" value={text} onChange={(ev) => setText(ev.target.value)} />
    </div>
  );
}

// --- 1 --------------------------------------------------------
// <Team members={[{ id, name }, ...]} /> renders a <ul> with one <Row /> per
// member.
//
// The check clicks ben's button three times, then re-renders with a NEW member
// added at the FRONT of the list. ben must still show "ben:3".
//
// The check also renders a list where two different members are both called
// "ben", and fails if React logs a key warning.

function Team({ members }) {
  return (
    <ul>
      {members.map(item => (
        <Row key={item.id} member={item} />
      ))}
    </ul>
  );
}

// --- 2 --------------------------------------------------------
// <Glossary rows={[{ id, term, def }, ...]} /> renders a <dl>, and for each row
// TWO elements: <dt>{term}</dt> and <dd>{def}</dd>.
//
// A <dl> may contain only <dt> and <dd> as direct children, so you cannot wrap
// each pair in a <div>. The check reads the direct children of the <dl> and
// expects exactly dt,dd,dt,dd - and no key warning.

function Glossary({ rows }) {
  return (<dl>
    {rows.map(item => (
      <Fragment key={item.id}>
        <dt>{item.term}</dt>
        <dd>{item.def}</dd>
      </Fragment>
    ))}
  </dl>);
}

// --- 3 --------------------------------------------------------
// <Editor author={{ id, name }} /> renders the given <Note />.
//
// The check types "hello" into the text field, then re-renders with a
// DIFFERENT author. The name must change to the new author AND the field must
// be empty again.
//
// You are not allowed to touch Note, and Note has no idea the author changed.
// Make React throw the old one away.

function Editor({ author }) {
  return (
    <Note key={author.id} author={author} />
  );
}

// --- 4 --------------------------------------------------------
// <RankedTeam members={[{ id, name, points }, ...]} by="name" | "points" />
// renders the same <ul> of <Row />, ordered by name A-Z when by is "name", and
// by points HIGH TO LOW when by is "points".
//
// The check clicks cid twice under by="name", then re-renders with by="points",
// which puts cid last. cid must still show "cid:2".
//
// A second check compares the array it passed in before and after. It must come
// back in the order it was given.

function RankedTeam({ members, by }) {
  const sortedMembers = [...members].sort((a, b) => {
    if (by === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return b.points - a.points
    }
  });

  return (
    <ul>
      {sortedMembers.map(item => <Row key={item.id} member={item} />)}
    </ul>
  );
}

// --- 5, spoken, nothing to write ------------------------------
//   a) what does React actually DO with a key? Say it as the question React is
//      answering. Then: why is the array index a bad key, and name the one
//      situation where it is genuinely fine.
//   b) why can <>...</> not carry a key, and what do you write instead?
//   c) in part 3 you changed a key on purpose. Say what React does to the old
//      component - mount, unmount, cleanup - and which cleanup moment fires.

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

const THREE = () => [{ id: 1, name: "ada" }, { id: 2, name: "ben" }, { id: 3, name: "cid" }];
const SCORED = () => [
  { id: 1, name: "ada", points: 5 },
  { id: 2, name: "ben", points: 9 },
  { id: 3, name: "cid", points: 1 },
];

runChecks([
  { name: "Team keeps a row's own state when the list grows", fn: Team, run: () => {
      const members = THREE();
      const s = render(<Team members={members} />);
      s.click("#b-ben"); s.click("#b-ben"); s.click("#b-ben");
      s.rerender(<Team members={[{ id: 9, name: "zed" }, ...members]} />);
      const shown = s.find("#b-ben").textContent;
      s.unmount();
      return shown;
    }, expected: "ben:3" },

  { name: "Team survives two members with the same name", fn: Team, run: () => {
      const members = [{ id: 1, name: "ada" }, { id: 2, name: "ben" }, { id: 3, name: "ben" }];
      const warned = catchWarn(() => { render(<Team members={members} />).unmount(); });
      return warned ? "warned" : "quiet";
    }, expected: "quiet" },

  { name: "Glossary puts dt and dd straight into the dl", fn: Glossary, run: () => {
      const rows = [{ id: 1, term: "a", def: "1" }, { id: 2, term: "b", def: "2" }];
      let tags = "";
      const warned = catchWarn(() => {
        const s = render(<Glossary rows={rows} />);
        tags = [...s.find("dl").children].map((c) => c.tagName.toLowerCase()).join(",");
        s.unmount();
      });
      return { tags, warned };
    }, expected: { tags: "dt,dd,dt,dd", warned: false } },

  { name: "Editor clears the text when the author changes", fn: Editor, run: () => {
      const s = render(<Editor author={{ id: 1, name: "ada" }} />);
      s.type("#text", "hello");
      s.rerender(<Editor author={{ id: 2, name: "ben" }} />);
      const out = { who: s.find("#who").textContent, text: s.find("#text").value };
      s.unmount();
      return out;
    }, expected: { who: "ben", text: "" } },

  { name: "RankedTeam keeps each count through a re-sort", fn: RankedTeam, run: () => {
      const members = SCORED();
      const s = render(<RankedTeam members={members} by="name" />);
      s.click("#b-cid"); s.click("#b-cid");
      s.rerender(<RankedTeam members={members} by="points" />);
      const out = { cid: s.find("#b-cid").textContent, order: s.all("button").map((b) => b.id).join(",") };
      s.unmount();
      return out;
    }, expected: { cid: "cid:2", order: "b-ben,b-ada,b-cid" } },

  { name: "RankedTeam does not touch the array it was given", fn: RankedTeam, run: () => {
      const members = SCORED();
      const before = members.map((p) => p.name).join(",");
      const s = render(<RankedTeam members={members} by="points" />);
      s.unmount();
      return members.map((p) => p.name).join(",") === before;
    }, expected: true },
]);
