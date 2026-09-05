// The check. Do not touch.

const { render } = require("../../lib/react-harness.js");
const { runChecks } = require("../../lib/checks");
const { TASKS, TaskBoard } = require("./board.jsx");

const fresh = () => TASKS.map((t) => ({ ...t }));
const ids = (s) => s.all("li button").map((b) => b.id.replace("star-", "")).join(",");
const has = (s, sel) => s.container.querySelector(sel) !== null;

runChecks([
  { name: "1. shows everything, ordered by due, ties broken by title", fn: TaskBoard, run: () => {
      const s = render(<TaskBoard tasks={fresh()} />);
      const out = { order: ids(s), count: s.find("#count").textContent, empty: has(s, "#empty") };
      s.unmount();
      return out;
    }, expected: { order: "5,4,2,1,3", count: "5 of 5", empty: false } },

  { name: "2. search ignores case in the TITLE", fn: TaskBoard, run: () => {
      const s = render(<TaskBoard tasks={fresh()} />);
      s.type("#q", "ana");
      const out = { order: ids(s), count: s.find("#count").textContent };
      s.unmount();
      return out;
    }, expected: { order: "4", count: "1 of 5" } },

  { name: "3. search ignores case in the QUERY", fn: TaskBoard, run: () => {
      const s = render(<TaskBoard tasks={fresh()} />);
      s.type("#q", "DEPLOY");
      const out = { order: ids(s), count: s.find("#count").textContent };
      s.unmount();
      return out;
    }, expected: { order: "2", count: "1 of 5" } },

  { name: "4. the box keeps only unfinished tasks", fn: TaskBoard, run: () => {
      const s = render(<TaskBoard tasks={fresh()} />);
      s.click("#open-only");
      const out = { order: ids(s), count: s.find("#count").textContent, ticked: s.find("#open-only").checked };
      s.unmount();
      return out;
    }, expected: { order: "4,1,3", count: "3 of 5", ticked: true } },

  { name: "5. search and the box apply together", fn: TaskBoard, run: () => {
      const s = render(<TaskBoard tasks={fresh()} />);
      s.click("#open-only");
      s.type("#q", "d");
      const out = { order: ids(s), count: s.find("#count").textContent };
      s.unmount();
      return out;
    }, expected: { order: "1,3", count: "2 of 5" } },

  { name: "6. the star stays on its own task after filtering", fn: TaskBoard, run: () => {
      const s = render(<TaskBoard tasks={fresh()} />);
      s.click("#star-3");
      s.type("#q", "d");
      const out = { three: s.find("#star-3").textContent, one: s.find("#star-1").textContent, order: ids(s) };
      s.unmount();
      return out;
    }, expected: { three: "*", one: "-", order: "5,2,1,3" } },

  { name: "7. an empty result shows #empty and no rows", fn: TaskBoard, run: () => {
      const s = render(<TaskBoard tasks={fresh()} />);
      s.type("#q", "zzz");
      const out = { rows: s.all("li").length, empty: has(s, "#empty"), count: s.find("#count").textContent };
      s.unmount();
      return out;
    }, expected: { rows: 0, empty: true, count: "0 of 5" } },

  { name: "8. the array you were handed is not reordered", fn: TaskBoard, run: () => {
      const given = fresh();
      const before = given.map((t) => t.id).join(",");
      const s = render(<TaskBoard tasks={given} />);
      s.type("#q", "e");
      s.click("#open-only");
      s.unmount();
      return given.map((t) => t.id).join(",") === before;
    }, expected: true },
]);
