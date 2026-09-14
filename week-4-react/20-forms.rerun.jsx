// Drill 20 - controlled inputs and lifting state up  (COLD RE-RUN)
//
// The rule this drill exists for: in a controlled field the source of truth is
// React state, not the DOM. The field only SHOWS a value and REPORTS an attempt
// to change it. And when one value is needed by two components, it moves up to
// their nearest common parent.
//
// Green criterion: cold from memory, and narrated out loud.
// No worked examples this time: it has been seen. The checks are harder than on
// 2026-09-04 - each one also sends the input that was missing that day.
//
// Run:  npm run drill week-4-react/20-forms.rerun.jsx

import { use } from "react";

const { React } = require("../lib/react-harness.js");
const { useState } = React;

// --- 1 ----------------------------------------------------------
// <CodeField /> - a single text field that ALWAYS shows UPPER case.
//
//   <input id="code">   the value, always upper case
//   <p id="echo">       the same value
//
// The check types "abC" and expects "ABC" in both. It then types a space and
// one more letter, and expects the space to survive.

function CodeField() {
  const [code, setCode] = useState('');

  return (
    <>
      <input id='code' value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
      <p id='echo'>{code}</p>
    </>
  );
}

// --- 2 ----------------------------------------------------------
// <HoursField /> - an hours field and a total at 4 apiece.
//
//   <input id="hours">  what was typed
//   <p id="total">      hours * 4
//
// The check types "5" and expects "20". Then it clears the field and expects "0".
// e.target.value is ALWAYS a string, and for an empty field it is "".

function HoursField() {
  const [hours, setHours] = useState('');
  const hoursNumber = parseInt(hours);

  return (
    <>
      <input id='hours' value={hours} onChange={(e) => setHours(e.target.value)} />
      <p id='total'>{hoursNumber ? hoursNumber * 4 : '0'}</p>
    </>
  );
}

// --- 3 ----------------------------------------------------------
// <NewsletterBox initial={true | false} /> - an opt-in tick box.
//
//   <input id="optin" type="checkbox">   the state of the box
//   <p id="state">                       "yes" when ticked, "no" when not
//
// The prop is a boolean and is respected AS GIVEN: initial={false} starts
// unticked, initial={true} starts ticked. A click flips it either way.

function NewsletterBox({ initial }) {
  const [tick, setTick] = useState(initial);

  return (
    <>
      <input id='optin' type="checkbox" checked={tick} onChange={(e) => setTick(e.target.checked)} />
      <p id='state'>{tick ? 'yes' : 'no'}</p>
    </>
  );
}

// --- 4 ----------------------------------------------------------
// Lifting state up.
//
// Two fields are given, and they must NOT be edited. Each is controlled from the
// outside: it holds no state of its own and takes value and onChange.
//
//   function KmField({ value, onChange })     -> <input id="km">
//   function MilesField({ value, onChange })  -> <input id="mi">
//
//   type "8" into #km   ->  #km shows "8",  #mi shows "5"
//   type "5" into #mi   ->  #km shows "8",  #mi shows "5"
//   <p id="advice">     ->  "long" at 10 km AND ABOVE, otherwise "short"
//
//   miles = km * 5 / 8        km = miles * 8 / 5
//
// <Odometer /> holds ONE piece of state - kilometres as text - and hands it to
// both fields. An empty field stays empty in both fields.

function KmField({ value, onChange }) {
  return <input id="km" value={value} onChange={(e) => onChange(e.target.value)} />;
}

function MilesField({ value, onChange }) {
  return <input id="mi" value={value} onChange={(e) => onChange(e.target.value)} />;
}

function Odometer() {
  const [kilo, setKilo] = useState('');
  const kiloNumber = parseInt(kilo) || 0;
  const miles = kilo === '' ? '' : kiloNumber * 5 / 8;

  return (
    <>
     <KmField value={kilo} onChange={setKilo} />
     <MilesField value={miles} onChange={(m) => setKilo(m === '' ? '' : parseInt(m) * 8 / 5)} />
     <p id="advice">{kiloNumber >= 10 ? 'long' : 'short'}</p>
    </>
  );
}

// --- 5, spoken, nothing to write --------------------------------
//   a) name the three required parts of a controlled field - and id is not one
//      of them. Then say what exactly breaks if you drop onChange but keep value.
//   b) WHEN is state lifted up, and what does the child get in place of state
//      of its own - a reference to the parent's state, or something else?
//   c) in part 4 there is ONE piece of state and two fields. Where does the
//      second field's value come from, and why is there no second useState.

// ----------------------------------------------------------------
// Do not touch below. This is the check.

const { render } = require("../lib/react-harness.js");
const { runChecks } = require("../lib/checks");

const typeMore = (s, sel, extra) => s.type(sel, s.find(sel).value + extra);

runChecks([
  { name: "CodeField keeps the input itself upper case", fn: CodeField, run: () => {
      const s = render(<CodeField />);
      s.type("#code", "abC");
      const out = { field: s.find("#code").value, echo: s.find("#echo").textContent };
      s.unmount();
      return out;
    }, expected: { field: "ABC", echo: "ABC" } },

  { name: "CodeField lets a space be typed", fn: CodeField, run: () => {
      const s = render(<CodeField />);
      s.type("#code", "ab ");
      typeMore(s, "#code", "c");
      const out = s.find("#code").value;
      s.unmount();
      return out;
    }, expected: "AB C" },

  { name: "HoursField multiplies, and survives an empty field", fn: HoursField, run: () => {
      const s = render(<HoursField />);
      s.type("#hours", "5");
      const filled = s.find("#total").textContent;
      s.type("#hours", "");
      const empty = s.find("#total").textContent;
      s.unmount();
      return { filled, empty };
    }, expected: { filled: "20", empty: "0" } },

  { name: "NewsletterBox respects initial={false}", fn: NewsletterBox, run: () => {
      const s = render(<NewsletterBox initial={false} />);
      const start = { ticked: s.find("#optin").checked, text: s.find("#state").textContent };
      s.click("#optin");
      const after = { ticked: s.find("#optin").checked, text: s.find("#state").textContent };
      s.unmount();
      return { start, after };
    }, expected: { start: { ticked: false, text: "no" }, after: { ticked: true, text: "yes" } } },

  { name: "NewsletterBox respects initial={true}", fn: NewsletterBox, run: () => {
      const s = render(<NewsletterBox initial={true} />);
      const start = { ticked: s.find("#optin").checked, text: s.find("#state").textContent };
      s.click("#optin");
      const after = { ticked: s.find("#optin").checked, text: s.find("#state").textContent };
      s.unmount();
      return { start, after };
    }, expected: { start: { ticked: true, text: "yes" }, after: { ticked: false, text: "no" } } },

  { name: "Odometer fills miles when km is typed", fn: Odometer, run: () => {
      const s = render(<Odometer />);
      s.type("#km", "8");
      const out = { km: s.find("#km").value, mi: s.find("#mi").value, advice: s.find("#advice").textContent };
      s.unmount();
      return out;
    }, expected: { km: "8", mi: "5", advice: "short" } },

  { name: "Odometer works the other way round too", fn: Odometer, run: () => {
      const s = render(<Odometer />);
      s.type("#mi", "5");
      const out = { km: s.find("#km").value, mi: s.find("#mi").value };
      s.unmount();
      return out;
    }, expected: { km: "8", mi: "5" } },

  { name: "Odometer advice: the boundary is 10, and 9.5 is below it", fn: Odometer, run: () => {
      const s = render(<Odometer />);
      s.type("#km", "10");
      const at = s.find("#advice").textContent;
      s.type("#km", "9.5");
      const below = s.find("#advice").textContent;
      s.unmount();
      return { at, below };
    }, expected: { at: "long", below: "short" } },

  { name: "Odometer leaves both fields empty when one is cleared", fn: Odometer, run: () => {
      const s = render(<Odometer />);
      s.type("#km", "20");
      s.type("#km", "");
      const out = { km: s.find("#km").value, mi: s.find("#mi").value };
      s.unmount();
      return out;
    }, expected: { km: "", mi: "" } },
]);
