// Assembly 2 - the same kind of work as A1, plus exactly ONE await.
//
// One new thing beyond A1: the data does not sit in a variable, it comes from an
// async function you are handed. And one field can be null, which is the trap.
//
// Green criterion, two parts: written cold, and narrated out loud.
//
// Run:  node week-3-assembly/A2-ticket-report.js

// this is what a caller will hand you - an async function returning the array
const loadTickets = async () => [
  { id: 12, project: "web", hours: 3, assignee: "Ola" },
  { id: 4, project: "api", hours: 8, assignee: "Pim" },
  { id: 31, project: "web", hours: 12, assignee: null },
  { id: 7, project: "ops", hours: 5, assignee: "Ola" },
  { id: 25, project: "api", hours: 6, assignee: "Nils" },
  { id: 3, project: "web", hours: 9, assignee: "Pim" },
  { id: 5, project: "ops", hours: 9, assignee: null },
  { id: 9, project: "api", hours: 4, assignee: "Nils" },
  { id: 22, project: "web", hours: 7, assignee: "Kaya" },
  { id: 15, project: "ops", hours: 3, assignee: "Kaya" },
];

// --- 0, do this FIRST, out loud -------------------------------
// Read the spec out loud, type the empty skeleton, then fill it in.
// Same rule as A1. It is the first step, not a suggestion.

// --- 1 --------------------------------------------------------
// report(load) is ASYNC. `load` is a function you must CALL and await once.
// It returns ONE object with exactly these four keys:
//
//   byProject: { web: [id, id, ...], api: [...], ops: [...] }
//      ticket ids grouped by project. Ids ASCENDING inside each group.
//      Key order does not matter.
//
//   totalHours: number
//      sum of hours over ALL tickets.
//
//   busiest: [{ assignee, hours }, { assignee, hours }]
//      the 2 people with the most hours summed across their tickets.
//      sort: hours descending; on a tie, assignee ascending (A before Z).
//      A ticket with no assignee belongs to nobody.
//
//   unassigned: [id, id, ...]
//      ids of tickets whose assignee is null, ASCENDING.

async function report(load) {
  const orders = await load();
  const assignedOrders = orders.filter(item => item.assignee);

  const byProject = orders
  .reduce((acc, line) => {
    acc[line.project] = acc[line.project] ?? [];
    acc[line.project].push(line.id);
    return acc;
  }, {});

  for (const key in byProject) {
    byProject[key].sort((a, b) => a - b);
  }

  const totalHours = orders.reduce((acc, line) => {
    acc += line.hours
    return acc;
  }, 0);

  const hoursByAssignee = assignedOrders
    .reduce((acc, line) => {
      acc[line.assignee] = (acc[line.assignee] ?? 0) + line.hours
      return acc;
    }, {});

  const busiest = Object.entries(hoursByAssignee)
    .sort((a, b) => {
      return b[1] - a[1] || a[0].localeCompare(b[0])
    })
    .slice(0, 2)
    .map(item => ({
      assignee: item[0],
      hours: item[1]
    }));

  const unassigned = orders.filter(item => !item.assignee).map(item => item.id).sort((a, b) => a - b);

  return {
    byProject: byProject,
    totalHours,
    busiest,
    unassigned
  }
}

// --- 2, spoken, nothing to write ------------------------------
//   a) `[3, 12, 22, 31].sort()` with no comparator - what comes out, and why.
//   b) a ticket has `assignee: null`. If you build a counter object without
//      filtering it out, what key appears and what type is it? Say what that
//      would have done to `busiest` here.
//   c) you awaited `load()` once, at the top. What would `await load()` inside
//      the grouping loop have cost you, and would the result still be correct?

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

const EXPECTED = {
  byProject: { web: [3, 12, 22, 31], api: [4, 9, 25], ops: [5, 7, 15] },
  totalHours: 66,
  busiest: [
    { assignee: "Pim", hours: 17 },
    { assignee: "Kaya", hours: 10 },
  ],
  unassigned: [5, 31],
};

// a second loader - so the function cannot be written against the first data
const loadOther = async () => [
  { id: 40, project: "ml", hours: 4, assignee: "Iva" },
  { id: 8, project: "ml", hours: 4, assignee: "Ada" },
  { id: 2, project: "ml", hours: 1, assignee: null },
];

runChecks([
  { name: "report, whole object", fn: report, run: () => report(loadTickets), expected: EXPECTED },
  { name: "byProject", fn: report, run: async () => (await report(loadTickets)).byProject, expected: EXPECTED.byProject },
  { name: "totalHours", fn: report, run: async () => (await report(loadTickets)).totalHours, expected: EXPECTED.totalHours },
  { name: "busiest", fn: report, run: async () => (await report(loadTickets)).busiest, expected: EXPECTED.busiest },
  { name: "unassigned", fn: report, run: async () => (await report(loadTickets)).unassigned, expected: EXPECTED.unassigned },
  {
    name: "works with a different loader too", fn: report, run: () => report(loadOther), expected: {
      byProject: { ml: [2, 8, 40] },
      totalHours: 9,
      busiest: [{ assignee: "Ada", hours: 4 }, { assignee: "Iva", hours: 4 }],
      unassigned: [2],
    }
  },
]);
