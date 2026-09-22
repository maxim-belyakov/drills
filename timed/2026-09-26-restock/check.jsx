// check.jsx - GIVEN. Do not edit.
// Run: npm run drill timed/2026-09-26-restock/check.jsx        (add a word to run one check)

const { React, render, act } = require("../../lib/react-harness.js");
const { runChecks } = require("../../lib/checks");
const { Restock, setFailNext } = require("./restock.jsx");

const settle = (ms) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });
const has = (s, sel) => !!s.all(sel).length;
const shape = (s) => ["#warehouse", "#status", "#error", "#list"].filter((x) => has(s, x)).join(",") || "nothing";
// row ids, sorted, so a check about WHICH rows is not also a check about their order
const rows = (s) => s.all("#list li").map((li) => li.id.replace("p-", "")).sort().join(",");
const order = (s) => s.all("#list li").map((li) => li.id.replace("p-", "")).join(",");
const pick = (s, value) => act(() => {
  const el = s.find("#warehouse");
  const setter = Object.getOwnPropertyDescriptor(el.constructor.prototype, "value").set;
  setter.call(el, value);
  el.dispatchEvent(new window.Event("change", { bubbles: true }));
});
const fresh = () => { setFailNext(null); return render(<Restock />); };

runChecks([
  { name: "1. the first warehouse loads and renders in the order the service gave", fn: Restock, run: async () => {
      const s = fresh();
      await settle(40);
      const out = { shape: shape(s), order: order(s), count: s.find("#count").textContent };
      s.unmount();
      return out;
    }, expected: { shape: "#warehouse,#list", order: "N-1,N-2,N-3,N-4", count: "4 of 4" } },

  { name: "2. a one-letter query filters, ignoring case", fn: Restock, run: async () => {
      const s = fresh();
      await settle(40);
      s.type("#q", "c");
      const out = { rows: rows(s), count: s.find("#count").textContent };
      s.unmount();
      return out;
    }, expected: { rows: "N-4", count: "1 of 4" } },

  { name: "3. a two-letter query filters too", fn: Restock, run: async () => {
      const s = fresh();
      await settle(40);
      s.type("#q", "BE");
      const out = { rows: rows(s), count: s.find("#count").textContent };
      s.unmount();
      return out;
    }, expected: { rows: "N-1,N-2,N-3", count: "3 of 4" } },

  { name: "4. the total is the money of the rows on screen", fn: Restock, run: async () => {
      const s = fresh();
      await settle(40);
      const all = s.find("#total").textContent;
      s.type("#q", "be");
      const out = { all, filtered: s.find("#total").textContent };
      s.unmount();
      return out;
    }, expected: { all: "53.10", filtered: "47.10" } },

  { name: "5. a note belongs to its part and survives a filter", fn: Restock, run: async () => {
      const s = fresh();
      await settle(40);
      s.type("#note-N-4", "order two more");
      s.type("#q", "la");
      const out = { rows: rows(s), note: s.find("#note-N-4").value };
      s.unmount();
      return out;
    }, expected: { rows: "N-4", note: "order two more" } },

  { name: "6. a failed request shows the error AND keeps the page usable", fn: Restock, run: async () => {
      const s = fresh();
      await settle(40);
      setFailNext("south");
      pick(s, "south");
      await settle(40);
      const out = { shape: shape(s), text: s.find("#error").textContent.replace("retry", "") };
      s.unmount();
      return out;
    }, expected: { shape: "#warehouse,#error", text: "stock service is down" } },

  { name: "7. retry after a failure leaves no trace of the error", fn: Restock, run: async () => {
      const s = fresh();
      await settle(40);
      setFailNext("south");
      pick(s, "south");
      await settle(40);
      s.click("#retry");
      await settle(40);
      const out = { shape: shape(s), rows: rows(s), count: s.find("#count").textContent };
      s.unmount();
      return out;
    }, expected: { shape: "#warehouse,#list", rows: "S-1,S-2", count: "2 of 2" } },

  { name: "8. switching the warehouse shows the other list", fn: Restock, run: async () => {
      const s = fresh();
      await settle(40);
      pick(s, "south");
      await settle(40);
      const out = { rows: rows(s), count: s.find("#count").textContent };
      s.unmount();
      return out;
    }, expected: { rows: "S-1,S-2", count: "2 of 2" } },

  { name: "9. the slow answer for the warehouse you left never wins", fn: Restock, run: async () => {
      const s = fresh();
      pick(s, "south");
      await settle(80);
      const out = { shape: shape(s), rows: rows(s), count: s.find("#count").textContent };
      s.unmount();
      return out;
    }, expected: { shape: "#warehouse,#list", rows: "S-1,S-2", count: "2 of 2" } },
]);
