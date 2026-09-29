// check.jsx - GIVEN, spec 1. Do not edit.
// Run: npm run drill timed/2026-09-29-dispatch/check.jsx

const { React, render, act } = require("../../lib/react-harness.js");
const { runChecks } = require("../../lib/checks");
const d = require("./dispatch.jsx");
const { Dispatch, sent, resetServer, setListBehaviour } = d;

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

  { name: "6. assigning posts the courier and updates only that row", fn: Dispatch, run: async () => {
      const s = fresh();
      await settle(60);
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
      };
    }, expected: { url: "/orders/o2/assign", type: "application/json", body: '{"courier":"Bo"}',
                   courier: "Bo", buttonGone: true, otherButton: true, listRequests: 1 } },

  { name: "7. the slow answer for the status you left never wins", fn: Dispatch, run: async () => {
      const s = fresh();
      pick(s, "assigned");
      await settle(80);
      return { rows: rows(s), count: s.find("#count").textContent };
    }, expected: { rows: "o9", count: "1" } },
]);
