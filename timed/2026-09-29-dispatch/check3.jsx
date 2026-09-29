// check3.jsx - GIVEN, spec 1 + spec 2 + spec 3. Do not edit.
// This replaces check2.jsx as the file you run. It contains everything check2.jsx
// checked plus what spec 3 adds, so green here means all three specs hold.
//
// Run: npm run drill timed/2026-09-29-dispatch/check3.jsx

const { React, render, act } = require("../../lib/react-harness.js");
const { runChecks } = require("../../lib/checks");
const d = require("./dispatch.jsx");
const { Dispatch, sent, resetServer, setListBehaviour, setConflictFor, setAssignDelay } = d;

const settle = (ms) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });
const has = (s, sel) => !!s.all(sel).length;
const shape = (s) => ["#status", "#loading", "#error", "#list"].filter((x) => has(s, x)).join(",") || "nothing";
const rows = (s) => s.all("#list li").map((li) => li.id.replace("o-", "")).sort().join(",");
const pick = (s, value) => act(() => {
  const el = s.find("#status");
  const setter = Object.getOwnPropertyDescriptor(el.constructor.prototype, "value").set;
  setter.call(el, value);
  el.dispatchEvent(new window.Event("change", { bubbles: true }));
});
const fresh = () => { resetServer(); return render(<Dispatch />); };
const calls = () => sent.map((r) => `${r.method} ${r.url}`);
const assigned = (s) => s.find("#assigned-count").textContent;

runChecks([
  { name: "1. mounts, asks for the new orders, renders them", fn: Dispatch, run: async () => {
      const s = fresh();
      await settle(60);
      return { shape: shape(s), rows: rows(s), count: s.find("#count").textContent };
    }, expected: { shape: "#status,#list", rows: "o1,o2,o3", count: "3" } },

  { name: "2. the list request is a plain GET on the right url", fn: Dispatch, run: async () => {
      const s = fresh();
      await settle(60);
      return calls();
    }, expected: ["GET /orders?status=new"] },

  { name: "3. loading is visible while the first request is in flight", fn: Dispatch, run: async () => {
      const s = fresh();
      const immediately = shape(s);
      await settle(60);
      return { immediately, afterwards: shape(s) };
    }, expected: { immediately: "#status,#loading", afterwards: "#status,#list" } },

  { name: "4. switching the status loads that list", fn: Dispatch, run: async () => {
      const s = fresh();
      await settle(60);
      pick(s, "assigned");
      await settle(60);
      return { rows: rows(s), count: s.find("#count").textContent, calls: calls() };
    }, expected: { rows: "o9", count: "1", calls: ["GET /orders?status=new", "GET /orders?status=assigned"] } },

  { name: "5. a failed request shows the error, keeps the page usable, and retry works", fn: Dispatch, run: async () => {
      const s = fresh();
      await settle(60);
      setListBehaviour("fail");
      pick(s, "done");
      await settle(60);
      const broken = { shape: shape(s), text: s.find("#error").textContent.replace("retry", "").trim() };
      setListBehaviour("ok");
      s.click("#retry");
      await settle(60);
      return { ...broken, after: shape(s) };
    }, expected: { shape: "#status,#error", text: "dispatch service is down", after: "#status,#list" } },

  { name: "6. spec 2: assigned-count reads the rows on screen", fn: Dispatch, run: async () => {
      const s = fresh();
      await settle(60);
      const onMount = assigned(s);
      pick(s, "assigned");
      await settle(60);
      return { onMount, onAssigned: assigned(s) };
    }, expected: { onMount: "0 of 3 assigned", onAssigned: "1 of 1 assigned" } },

  { name: "7. spec 2: max-weight filters, and empty or non-numeric filters nothing", fn: Dispatch, run: async () => {
      const s = fresh();
      await settle(60);
      s.type("#max-weight", "7");
      const seven = { rows: rows(s), count: s.find("#count").textContent, assigned: assigned(s) };
      s.type("#max-weight", "");
      const empty = { rows: rows(s), count: s.find("#count").textContent };
      s.type("#max-weight", "abc");
      const junk = { rows: rows(s), count: s.find("#count").textContent };
      return { seven, empty, junk };
    }, expected: {
      seven: { rows: "o1,o3", count: "2", assigned: "0 of 2 assigned" },
      empty: { rows: "o1,o2,o3", count: "3" },
      junk: { rows: "o1,o2,o3", count: "3" },
    } },

  { name: "8. spec 2: the filter survives a status switch and keeps filtering", fn: Dispatch, run: async () => {
      const s = fresh();
      await settle(60);
      s.type("#max-weight", "5");
      pick(s, "assigned");
      await settle(60);
      const there = { rows: rows(s), value: s.find("#max-weight").value, count: s.find("#count").textContent };
      pick(s, "new");
      await settle(60);
      return { there, back: { rows: rows(s), count: s.find("#count").textContent } };
    }, expected: {
      there: { rows: "o9", value: "5", count: "1" },
      back: { rows: "o1", count: "1" },
    } },

  { name: "9. assigning posts the courier, updates only that row, and moves assigned-count", fn: Dispatch, run: async () => {
      const s = fresh();
      await settle(60);
      const before = assigned(s);
      s.click("#assign-o2");
      await settle(60);
      const post = sent.find((r) => r.method === "POST");
      return {
        url: post && post.url,
        type: post && post.type,
        body: post && post.body,
        courier: s.find("#courier-o2").textContent,
        buttonGone: !has(s, "#assign-o2"),
        otherButton: has(s, "#assign-o1"),
        listRequests: calls().filter((c) => c.startsWith("GET /orders?")).length,
        count: `${before} -> ${assigned(s)}`,
      };
    }, expected: { url: "/orders/o2/assign", type: "application/json", body: '{"courier":"Bo"}',
                   courier: "Bo", buttonGone: true, otherButton: true, listRequests: 1,
                   count: "0 of 3 assigned -> 1 of 3 assigned" } },

  { name: "10. the slow answer for the status you left never wins", fn: Dispatch, run: async () => {
      const s = fresh();
      pick(s, "assigned");
      await settle(80);
      return { rows: rows(s), count: s.find("#count").textContent };
    }, expected: { rows: "o9", count: "1" } },

  { name: "11. spec 3: a 409 shows the conflict on that row and reloads that one row", fn: Dispatch, run: async () => {
      const s = fresh();
      await settle(60);
      setConflictFor("o1");
      s.click("#assign-o1");
      await settle(60);
      return {
        conflict: s.find("#conflict-o1").textContent,
        courier: s.find("#courier-o1").textContent,
        buttonGone: !has(s, "#assign-o1"),
        otherRowUntouched: has(s, "#assign-o3"),
        listRequests: calls().filter((c) => c.startsWith("GET /orders?")).length,
        wire: calls(),
      };
    }, expected: { conflict: "already taken by Cez", courier: "Cez", buttonGone: true,
                   otherRowUntouched: true, listRequests: 1,
                   wire: ["GET /orders?status=new", "POST /orders/o1/assign", "GET /orders/o1"] } },

  { name: "12. spec 3: a conflict on one row leaves the rest of the board alone", fn: Dispatch, run: async () => {
      const s = fresh();
      await settle(60);
      setConflictFor("o3");
      s.click("#assign-o3");
      await settle(60);
      return { rows: rows(s), count: s.find("#count").textContent,
               conflictElsewhere: has(s, "#conflict-o1"), shape: shape(s) };
    }, expected: { rows: "o1,o2,o3", count: "3", conflictElsewhere: false, shape: "#status,#list" } },

  { name: "13. spec 3: only the clicked row is disabled while its assign is in flight", fn: Dispatch, run: async () => {
      const s = fresh();
      await settle(60);
      setAssignDelay(40);
      s.click("#assign-o3");
      const inFlight = { clicked: s.find("#assign-o3").disabled, neighbour: s.find("#assign-o1").disabled };
      await settle(80);
      return { inFlight, afterwards: { courier: s.find("#courier-o3").textContent, buttonGone: !has(s, "#assign-o3") } };
    }, expected: { inFlight: { clicked: true, neighbour: false },
                   afterwards: { courier: "Bo", buttonGone: true } } },

  { name: "14. spec 3: two clicks on one button put one POST on the wire", fn: Dispatch, run: async () => {
      const s = fresh();
      await settle(60);
      setAssignDelay(40);
      s.click("#assign-o1");
      s.click("#assign-o1");
      await settle(80);
      return { posts: calls().filter((c) => c === "POST /orders/o1/assign").length,
               courier: s.find("#courier-o1").textContent };
    }, expected: { posts: 1, courier: "Bo" } },
]);
