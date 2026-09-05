// Drill 20 - controlled inputs and lifting state up
//
// The rule this drill exists for: in a controlled field the source of truth is
// React state, not the DOM. The field only SHOWS a value and REPORTS an attempt
// to change it. And when one value is needed by two components, it moves up to
// their nearest common parent.
//
// Green criterion: cold from memory, and narrated out loud.
//
// Run:  npm run drill week-4-react/20-forms.jsx

const { React } = require("../lib/react-harness.js");
const { useState } = React;

// --- 1 ----------------------------------------------------------
// <SearchField /> - a single text field that ALWAYS shows lower case.
//
//   <input id="q">      the value, always lower case
//   <p id="echo">       the same value
//
// The check types "AbC" and expects "abc" in both the field and the echo.
// An uncontrolled field cannot pass: the browser would leave "AbC" in it.
//
// The shape of the answer, on unrelated data:
//
//   function CityField() {
//     const [city, setCity] = useState("");
//     return (
//       <div>
//         <input id="city" value={city} onChange={(e) => setCity(e.target.value.toUpperCase())} />
//         <p id="shown">{city}</p>
//       </div>
//     );
//   }
//
// Three required parts: the state, value taken from it, onChange writing back to it.

function SearchField() {
  const [query, setQuery] = useState('');

  return (
    <div>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value.trim().toLowerCase())} />
      <p id="echo">{query}</p>
    </div>
  );
}

// --- 2 ----------------------------------------------------------
// <QuantityField /> - a quantity field and a total at 3 apiece.
//
//   <input id="qty">    what was typed
//   <p id="total">      quantity * 3
//
// The check types "5" and expects "15" in total. Then it clears the field and
// expects "0".
//
// The trap: e.target.value is ALWAYS a string - with type="number" too, and for
// an empty field as well (there it is the empty string "").
//
// The shape of the answer, on unrelated data:
//
//   function MinutesField() {
//     const [text, setText] = useState("");
//     const seconds = Number(text || 0) * 60;
//     return (
//       <div>
//         <input id="min" value={text} onChange={(e) => setText(e.target.value)} />
//         <p id="sec">{seconds}</p>
//       </div>
//     );
//   }
//
// Note: the state holds the field's TEXT, and the number is computed during
// render. You do not keep a second piece of state for the number.

function QuantityField() {
  const [num, setNum] = useState('');
  const sum = Number((num || 0) * 3);

  return (
    <div>
      <input id='qty' value={num} onChange={(e) => setNum(e.target.value)} />
      <p id="total">{sum || 0}</p>
    </div>
  );
}

// --- 3 ----------------------------------------------------------
// <AgreementBox initial={true | false} /> - a consent tick box.
//
//   <input id="agree" type="checkbox">   the state of the box
//   <p id="state">                       "yes" when ticked, "no" when not
//
// The check renders with initial={true} and expects the box to be ticked
// ALREADY. Then it clicks and expects "no".
//
// The trap: on a checkbox the controlled attribute is called checked, not value.
// And the handler reads e.target.checked, not e.target.value.
//
// The shape of the answer, on unrelated data:
//
//   function NightMode({ startsOn }) {
//     const [on, setOn] = useState(startsOn);
//     return (
//       <div>
//         <input id="night" type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} />
//         <p id="mode">{on ? "dark" : "light"}</p>
//       </div>
//     );
//   }

function AgreementBox({ initial }) {
  const [on, setOn] = useState(initial || true);
  return (
    <div>
      <input id="agree" type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} />
      <p id="state">{on ? "yes" : "no"}</p>
    </div>
  );
}

// --- 4 ----------------------------------------------------------
// Lifting state up.
//
// Two fields are given, and they must NOT be edited. Each is controlled from the
// outside: it holds no state of its own and takes value and onChange - the same
// contract a plain <input> has.
//
//   function CelsiusField({ value, onChange })     -> <input id="c">
//   function FahrenheitField({ value, onChange })  -> <input id="f">
//
//   type "100" into #c  ->  #c shows "100", #f shows "212"
//   type "32"  into #f  ->  #c shows "0",   #f shows "32"
//   <p id="advice">     ->  "boiling" at 100 and above, otherwise "not boiling"
//
//   f = c * 9 / 5 + 32       c = (f - 32) * 5 / 9
//
// <Thermometer /> holds ONE piece of state - celsius as text - and hands it to
// both fields.
//
// An empty field stays empty in both fields.
//
// The shape of the answer, on unrelated data:
//
//   // given, do not edit
//   function MetersField({ value, onChange }) {
//     return <input id="m" value={value} onChange={(e) => onChange(e.target.value)} />;
//   }
//   function FeetField({ value, onChange }) {
//     return <input id="ft" value={value} onChange={(e) => onChange(e.target.value)} />;
//   }
//
//   // and this is what you write
//   function Distance() {
//     const [meters, setMeters] = useState("");
//     const feet = meters === "" ? "" : String(Number(meters) * 3);
//     return (
//       <div>
//         <MetersField value={meters} onChange={setMeters} />
//         <FeetField value={feet} onChange={(v) => setMeters(v === "" ? "" : String(Number(v) / 3))} />
//       </div>
//     );
//   }
//
// There is ONE piece of state. The second field is computed from it, and its
// onChange converts back into that single source of truth.

function CelsiusField({ value, onChange }) {
  return <input id="c" value={value} onChange={(e) => onChange(e.target.value)} />;
}

function FahrenheitField({ value, onChange }) {
  return <input id="f" value={value} onChange={(e) => onChange(e.target.value)} />;
}

function Thermometer() {
  const [celsius, setCelsius] = useState('');
  const fahrenheit = celsius === '' ? '' : Number(celsius) * 9 / 5 + 32;

  return (
    <div>
      <CelsiusField value={celsius} onChange={setCelsius} />
      <FahrenheitField value={fahrenheit} onChange={(f) => setCelsius(f === '' ? '' : String((Number(f) - 32) * 5 / 9))} />
      <p id="advice">{Number(celsius) > 99 ? 'boiling' : 'not boiling'}</p>
    </div>
  );
}

// --- 5, spoken, nothing to write --------------------------------
//   a) name the three required parts of a controlled field. Then say what
//      exactly breaks if you drop onChange but keep value.
//   b) when is state lifted up, and what does the child get in place of state
//      of its own.
//   c) in part 4 there is ONE piece of state and two fields. Where does the
//      second field's value come from, and why is there no second useState.

// ----------------------------------------------------------------
// Do not touch below. This is the check.

const { render } = require("../lib/react-harness.js");
const { runChecks } = require("../lib/checks");

runChecks([
  {
    name: "SearchField keeps the input itself lowercase", fn: SearchField, run: () => {
      const s = render(<SearchField />);
      s.type("#q", "AbC");
      const out = { field: s.find("#q").value, echo: s.find("#echo").textContent };
      s.unmount();
      return out;
    }, expected: { field: "abc", echo: "abc" }
  },

  {
    name: "QuantityField multiplies, and survives an empty field", fn: QuantityField, run: () => {
      const s = render(<QuantityField />);
      s.type("#qty", "5");
      const filled = s.find("#total").textContent;
      s.type("#qty", "");
      const empty = s.find("#total").textContent;
      s.unmount();
      return { filled, empty };
    }, expected: { filled: "15", empty: "0" }
  },

  {
    name: "AgreementBox starts already ticked and can be unticked", fn: AgreementBox, run: () => {
      const s = render(<AgreementBox initial={true} />);
      const start = { ticked: s.find("#agree").checked, text: s.find("#state").textContent };
      s.click("#agree");
      const after = { ticked: s.find("#agree").checked, text: s.find("#state").textContent };
      s.unmount();
      return { start, after };
    }, expected: { start: { ticked: true, text: "yes" }, after: { ticked: false, text: "no" } }
  },

  {
    name: "Thermometer fills fahrenheit when celsius is typed", fn: Thermometer, run: () => {
      const s = render(<Thermometer />);
      s.type("#c", "100");
      const out = { c: s.find("#c").value, f: s.find("#f").value, advice: s.find("#advice").textContent };
      s.unmount();
      return out;
    }, expected: { c: "100", f: "212", advice: "boiling" }
  },

  {
    name: "Thermometer works the other way round too", fn: Thermometer, run: () => {
      const s = render(<Thermometer />);
      s.type("#f", "32");
      const out = { c: s.find("#c").value, f: s.find("#f").value, advice: s.find("#advice").textContent };
      s.unmount();
      return out;
    }, expected: { c: "0", f: "32", advice: "not boiling" }
  },

  {
    name: "Thermometer leaves both fields empty when one is cleared", fn: Thermometer, run: () => {
      const s = render(<Thermometer />);
      s.type("#c", "20");
      s.type("#c", "");
      const out = { c: s.find("#c").value, f: s.find("#f").value };
      s.unmount();
      return out;
    }, expected: { c: "", f: "" }
  },
]);
