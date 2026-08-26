// Assembly 1 - one function, four answers, no async at all.
//
// A NEW TYPE of session, added 2026-08-25. A drill trains ONE move. An assembly
// makes you combine moves you have already closed into a single function, and
// hold the shape of the answer in your head while you do it. Nothing here is new
// syntax: filter (02), reduce (03), a counter object (04), sort with a tie-break (08).
//
// Green criterion, two parts: written cold, and narrated out loud.
//
// Run:  node week-3-assembly/A1-people-summary.js

const people = [
  { name: "Nadia", dept: "eng", salary: 7100, active: true },
  { name: "Ravi", dept: "design", salary: 6100, active: true },
  { name: "Eyal", dept: "design", salary: 12000, active: false },
  { name: "Tomas", dept: "sales", salary: 7400, active: false },
  { name: "Wei", dept: "eng", salary: 8300, active: true },
  { name: "Anke", dept: "design", salary: 5800, active: false },
  { name: "Bruno", dept: "sales", salary: 7100, active: true },
  { name: "Clara", dept: "eng", salary: 9900, active: true },
  { name: "Diego", dept: "sales", salary: 6600, active: true },
  { name: "Ines", dept: "eng", salary: 7000, active: true },
];

// --- 0, do this FIRST, out loud -------------------------------
// Before any logic: read the spec below out loud and type the empty skeleton
//
//   return { headcount: ..., payroll: ..., topEarners: ..., inactive: ... }
//
// then fill it in. This is the rule that came out of timed build 1 on 08-23,
// where two correct values did not count because they came back in an array.

// --- 1 --------------------------------------------------------
// summary(list) returns ONE object with exactly these four keys:
//
//   headcount: { eng: n, design: n, sales: n }
//      how many ACTIVE people per dept. Key order does not matter.
//
//   payroll: number
//      sum of salary over ACTIVE people only.
//
//   topEarners: [{ name, salary }, ...]
//      the 3 best paid ACTIVE people.
//      sort: salary descending; on a tie, name ascending (A before Z).
//
//   inactive: [name, name, ...]
//      names of the NOT active people, ascending.
//
// Everything is already in memory. No await, no promises, nothing to fetch.

function summary(list) {
  let deptMap = new Map();
  let headcount = [];
  let payroll;
  let topEarners;
  let inactive;
  const activePeople = list.filter(line => line.active);

  activePeople.forEach(line => {
    const name = line.dept;
    deptMap.set(name, (deptMap.get(name) ?? 0) + 1);
  })

  headcount = [...deptMap].reduce((acc, line) => {
    acc[line[0]] = line[1];
    return acc;
  }, {})

  payroll = activePeople.reduce((acc, line) => {
    acc += line.salary;
    return acc;
  }, 0);

  topEarners = activePeople.sort((a, b) => {
    return b.salary - a.salary || a.name.localeCompare(b.name)
  }).slice(0, 3).map(item => { return { name: item.name, salary: item.salary } });

  inactive = list.filter(line => !line.active).map(item => item.name).sort();


  return {
    headcount,
    payroll,
    topEarners,
    inactive,
  }
}

// --- 2, spoken, nothing to write ------------------------------
//   a) you wrote several passes over the same array (filter, then reduce, then
//      sort). Say out loud why that is fine here, and name the case where it
//      would stop being fine.
//   b) two people earn the same. What decides their order if your comparator
//      returns 0 - and is that answer stable across engines?
//   c) `inactive` needs a sort too. Which sort, and what would the default
//      `.sort()` with no comparator do to a list of names?

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

const EXPECTED = {
  headcount: { eng: 4, design: 1, sales: 2 },
  payroll: 52100,
  topEarners: [
    { name: "Clara", salary: 9900 },
    { name: "Wei", salary: 8300 },
    { name: "Bruno", salary: 7100 },
  ],
  inactive: ["Anke", "Eyal", "Tomas"],
};

// a second, smaller list - so the function cannot be written against the first one
const other = [
  { name: "Zoe", dept: "ops", salary: 5000, active: true },
  { name: "Adam", dept: "ops", salary: 5000, active: true },
  { name: "Mira", dept: "eng", salary: 9000, active: false },
];

runChecks([
  { name: "summary, whole object", fn: summary, run: () => summary(people), expected: EXPECTED },
  { name: "headcount", fn: summary, run: () => summary(people).headcount, expected: EXPECTED.headcount },
  { name: "payroll", fn: summary, run: () => summary(people).payroll, expected: EXPECTED.payroll },
  { name: "topEarners", fn: summary, run: () => summary(people).topEarners, expected: EXPECTED.topEarners },
  { name: "inactive", fn: summary, run: () => summary(people).inactive, expected: EXPECTED.inactive },
  // it must read its parameter, not the module-level `people`
  {
    name: "works on a different list too", fn: summary, run: () => summary(other), expected: {
      headcount: { ops: 2 },
      payroll: 10000,
      topEarners: [{ name: "Adam", salary: 5000 }, { name: "Zoe", salary: 5000 }],
      inactive: ["Mira"],
    }
  },
]);
