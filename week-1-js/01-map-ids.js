// Приём 1 - массив id из массива объектов (map)
//
// Критерий зелёного: пишу все три с нуля, без подсказок, за 90 секунд каждое,
// тесты зелёные с первого запуска.
//
// Правила: пишешь по памяти, вслух проговаривая что делаешь.
// Полез подсматривать - это 🔁, приём вернётся через день. Это нормально.
//
// Запуск:  node week-1-js/01-map-ids.js

const users = [
  { id: 7, name: "Ada", active: true },
  { id: 12, name: "Linus", active: false },
  { id: 3, name: "Grace", active: true },
];

// ─── 1 ─────────────────────────────────────────────────────────
// getIds(users) должен вернуть [7, 12, 3]

function getIds(list) {
  // сюда
}

// ─── 2 ─────────────────────────────────────────────────────────
// getNames(users) должен вернуть ["Ada", "Linus", "Grace"]
// Тот же приём, другое поле. Пиши не глядя наверх.

function getNames(list) {
  // сюда
}

// ─── 3 ─────────────────────────────────────────────────────────
// toLabels(users) должен вернуть ["7: Ada", "12: Linus", "3: Grace"]
// map плюс шаблонная строка.

function toLabels(list) {
  // сюда
}

// ─── 4, устно, ничего не пишем ─────────────────────────────────
// Проговори вслух, до запуска тестов:
//   а) чем map отличается от forEach
//   б) что вернёт users.map(u => { u.id }) и почему именно это

// ───────────────────────────────────────────────────────────────
// Ниже не трогаем. Это проверка.

const assert = require("node:assert");

const checks = [
  ["getIds", () => getIds(users), [7, 12, 3]],
  ["getNames", () => getNames(users), ["Ada", "Linus", "Grace"]],
  ["toLabels", () => toLabels(users), ["7: Ada", "12: Linus", "3: Grace"]],
];

let failed = 0;
for (const [name, run, expected] of checks) {
  try {
    assert.deepStrictEqual(run(), expected);
    console.log(`  OK  ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL ${name}`);
    console.log(`       ждали:   ${JSON.stringify(expected)}`);
    console.log(`       вернулось: ${JSON.stringify(e.actual)}`);
  }
}
console.log(failed === 0 ? "\nВсё зелёное. Ставь ✅\n" : `\nПровалено: ${failed}. Чини и запускай снова.\n`);
