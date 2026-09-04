// Приём 20 - управляемая форма и подъём состояния наверх
// (drill 20 - controlled inputs and lifting state up)
//
// Правило, ради которого существует приём: в управляемом поле источник истины -
// состояние React, а не DOM. Поле только ПОКАЗЫВАЕТ значение и СООБЩАЕТ о попытке
// его изменить. А когда одно значение нужно двум компонентам, оно переезжает в
// их ближайшего общего родителя.
//
// Зелёный критерий: холодно по памяти и проговорено вслух.
//
// Запуск:  npm run drill week-4-react/20-forms.jsx

const { React } = require("../lib/react-harness.js");
const { useState } = React;

// --- 1 ----------------------------------------------------------
// <SearchField /> - одно текстовое поле, которое ВСЕГДА показывает строчные буквы.
//
//   <input id="q">      значение всегда в нижнем регистре
//   <p id="echo">       то же самое значение
//
// Проверка печатает "AbC" и ждёт, что и в поле, и в эхо будет "abc".
// Неуправляемое поле здесь не пройдёт: браузер оставит в нём "AbC".
//
// Пример формы ответа, на посторонних данных:
//
//   function CityField() {
//     const [city, setCity] = useState("");
//     return (
//       <div>
//         <input id="city" value={city} onChange={(e) => setCity(e.target.value.trim())} />
//         <p id="shown">{city}</p>
//       </div>
//     );
//   }
//
// Три обязательные части: состояние, value из состояния, onChange обратно в состояние.

function SearchField() {
  return "__HERE__";
}

// --- 2 ----------------------------------------------------------
// <QuantityField /> - поле количества и посчитанная сумма по 3 за штуку.
//
//   <input id="qty">    то, что ввели
//   <p id="total">      количество * 3
//
// Проверка печатает "5" и ждёт в total "15". Потом стирает всё и ждёт "0".
//
// Ловушка: e.target.value - это ВСЕГДА строка, даже у type="number" и даже у
// пустого поля (там пустая строка "").
//
// Пример формы ответа, на посторонних данных:
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
// Обрати внимание: в состоянии лежит ТЕКСТ поля, а число вычисляется при рендере.
// Второго состояния под число не заводят.

function QuantityField() {
  return "__HERE__";
}

// --- 3 ----------------------------------------------------------
// <AgreementBox initial={true | false} /> - галочка согласия.
//
//   <input id="agree" type="checkbox">   состояние галочки
//   <p id="state">                       "yes" когда стоит, "no" когда снята
//
// Проверка рендерит с initial={true} и ждёт, что галочка УЖЕ стоит. Потом кликает
// и ждёт "no".
//
// Ловушка: у чекбокса управляемый атрибут называется checked, а не value.
// А в обработчике читают e.target.checked, а не e.target.value.
//
// Пример формы ответа, на посторонних данных:
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
  return "__HERE__";
}

// --- 4 ----------------------------------------------------------
// Подъём состояния наверх.
//
// Даны два поля, править их НЕЛЬЗЯ. Каждое из них управляется снаружи: оно не
// имеет своего состояния, а принимает value и onChange - тот же договор, что у
// обычного <input>.
//
//   function CelsiusField({ value, onChange })     -> <input id="c">
//   function FahrenheitField({ value, onChange })  -> <input id="f">
//
// <Thermometer /> держит ОДНО состояние - градусы Цельсия в виде текста - и
// раздаёт его обоим полям.
//
//   печатаем "100" в #c  ->  #c показывает "100", #f показывает "212"
//   печатаем "32"  в #f  ->  #c показывает "0",   #f показывает "32"
//   <p id="advice">      ->  "boiling" при 100 и выше, иначе "not boiling"
//
//   f = c * 9 / 5 + 32       c = (f - 32) * 5 / 9
//
// Пустое поле остаётся пустым в обоих полях.
//
// Пример формы ответа, на посторонних данных:
//
//   // дано, править нельзя
//   function MetersField({ value, onChange }) {
//     return <input id="m" value={value} onChange={(e) => onChange(e.target.value)} />;
//   }
//   function FeetField({ value, onChange }) {
//     return <input id="ft" value={value} onChange={(e) => onChange(e.target.value)} />;
//   }
//
//   // а это пишешь ты
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
// Состояние ОДНО. Второе поле - вычисленное из него, и его onChange пересчитывает
// обратно в единственный источник истины.

function CelsiusField({ value, onChange }) {
  return <input id="c" value={value} onChange={(e) => onChange(e.target.value)} />;
}

function FahrenheitField({ value, onChange }) {
  return <input id="f" value={value} onChange={(e) => onChange(e.target.value)} />;
}

function Thermometer() {
  return "__HERE__";
}

// --- 5, проговариваемая часть, писать нечего --------------------
//   a) назови три обязательные части управляемого поля. И скажи, что именно
//      сломается, если убрать onChange, но оставить value.
//   b) когда состояние поднимают наверх, и что при этом получает ребёнок вместо
//      собственного состояния.
//   c) в четвёртом задании состояние ОДНО, а полей два. Откуда берётся значение
//      второго поля, и почему для него не завели второй useState.

// ----------------------------------------------------------------
// Ниже не трогать. Это проверка.

const { render } = require("../lib/react-harness.js");
const { runChecks } = require("../lib/checks");

runChecks([
  { name: "SearchField keeps the input itself lowercase", fn: SearchField, run: () => {
      const s = render(<SearchField />);
      s.type("#q", "AbC");
      const out = { field: s.find("#q").value, echo: s.find("#echo").textContent };
      s.unmount();
      return out;
    }, expected: { field: "abc", echo: "abc" } },

  { name: "QuantityField multiplies, and survives an empty field", fn: QuantityField, run: () => {
      const s = render(<QuantityField />);
      s.type("#qty", "5");
      const filled = s.find("#total").textContent;
      s.type("#qty", "");
      const empty = s.find("#total").textContent;
      s.unmount();
      return { filled, empty };
    }, expected: { filled: "15", empty: "0" } },

  { name: "AgreementBox starts already ticked and can be unticked", fn: AgreementBox, run: () => {
      const s = render(<AgreementBox initial={true} />);
      const start = { ticked: s.find("#agree").checked, text: s.find("#state").textContent };
      s.click("#agree");
      const after = { ticked: s.find("#agree").checked, text: s.find("#state").textContent };
      s.unmount();
      return { start, after };
    }, expected: { start: { ticked: true, text: "yes" }, after: { ticked: false, text: "no" } } },

  { name: "Thermometer fills fahrenheit when celsius is typed", fn: Thermometer, run: () => {
      const s = render(<Thermometer />);
      s.type("#c", "100");
      const out = { c: s.find("#c").value, f: s.find("#f").value, advice: s.find("#advice").textContent };
      s.unmount();
      return out;
    }, expected: { c: "100", f: "212", advice: "boiling" } },

  { name: "Thermometer works the other way round too", fn: Thermometer, run: () => {
      const s = render(<Thermometer />);
      s.type("#f", "32");
      const out = { c: s.find("#c").value, f: s.find("#f").value, advice: s.find("#advice").textContent };
      s.unmount();
      return out;
    }, expected: { c: "0", f: "32", advice: "not boiling" } },

  { name: "Thermometer leaves both fields empty when one is cleared", fn: Thermometer, run: () => {
      const s = render(<Thermometer />);
      s.type("#c", "20");
      s.type("#c", "");
      const out = { c: s.find("#c").value, f: s.find("#f").value };
      s.unmount();
      return out;
    }, expected: { c: "", f: "" } },
]);
