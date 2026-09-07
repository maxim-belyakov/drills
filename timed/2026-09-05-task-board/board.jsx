// Timed build 3 - 2026-09-05 - task board
//
// 45 minutes. You write TaskBoard. Everything else in this file is given and
// must not be edited.
//
// Run the checks:  npm run drill timed/2026-09-05-task-board/check.jsx

import { useEffect, useState } from "react";

const { React } = require("../../lib/react-harness.js");

// --- given: the data. Do not edit. -----------------------------

const TASKS = [
  { id: 1, title: "Fix login redirect", done: false, due: "2026-09-12" },
  { id: 2, title: "Update deploy docs", done: true, due: "2026-09-08" },
  { id: 3, title: "Add retry to uploader", done: false, due: "2026-09-20" },
  { id: 4, title: "Review Ana's PR", done: false, due: "2026-09-08" },
  { id: 5, title: "Drop legacy endpoint", done: true, due: "2026-09-05" },
];

// --- given: one row of the list. Do not edit. ------------------
// It holds state of its own - the star.

function TaskRow({ task }) {
  const [starred, setStarred] = useState(false);
  return (
    <li>
      <button id={"star-" + task.id} onClick={() => setStarred(!starred)}>
        {starred ? "*" : "-"}
      </button>
      <span className="title">{task.title}</span>
    </li>
  );
}

// --- you write this --------------------------------------------
//
// <TaskBoard tasks={TASKS} /> renders:
//
//   <input id="q">                           search by title, CONTROLLED
//   <input id="open-only" type="checkbox">   show unfinished tasks only
//   <ul id="list">                           one <TaskRow /> per visible task
//   <p id="count">                           "visible of total", e.g. "3 of 5"
//   <p id="empty">                           ONLY when no task is visible. When
//                                            there are tasks this element must
//                                            not be in the DOM at all.
//
// Rules:
//   1. Search matches a substring of the title, case-insensitively, BOTH ways.
//   2. The "open only" box keeps tasks with done === false. Search and the box
//      apply AT THE SAME TIME.
//   3. Order: by due ascending. Equal due dates break the tie by title A-Z.
//   4. The tasks array you were handed must come back in the order it was given.
//   5. A row's star belongs to the TASK, not to the position: filter the list
//      and the star stays on the same task.
//   6. count shows "how many are visible of how many there are". The total is
//      the length of the original tasks, not of the filtered list.

function TaskBoard({ tasks }) {
  const [query, setQuery] = useState('');
  const [openOnly, setOpenOnly] = useState(false);
  const [visibleTasks, setVisibleTasks] = useState([...tasks]);

  useEffect(() => {
    let result = [...tasks];
    if (openOnly) {
      result = result.filter(item => !item.done);
    }
    result = result
      .filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
      .toSorted((a, b) => new Date(a.due) - new Date(b.due) || a.title.localeCompare(b.title));
    setVisibleTasks(result);
  }, [query, openOnly, tasks]);

  return (
    <>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} />
      <input id="open-only" type="checkbox" checked={openOnly} onChange={(e) => setOpenOnly(e.target.checked)} />
      <ul id="list">
        {visibleTasks.map(item => (
          <TaskRow key={item.id} task={item} />
        ))}
      </ul>
      <p id="count">{`${visibleTasks.length} of ${tasks.length}`}</p>
      {visibleTasks.length === 0 && <p id="empty">Nothing found</p>}
    </>
  );
}

module.exports = { TASKS, TaskRow, TaskBoard };
