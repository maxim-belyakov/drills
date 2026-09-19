// Do not touch. This is the check for timed build 5.

const { React, render, act } = require("../../lib/react-harness.js");
const { runChecks } = require("../../lib/checks");
const q = require("./queue.jsx");
const { SupportQueue, sent, TICKETS, resetSent, setEscalateBehaviour, setSlowFirstList, setListBehaviour } = q;

const settle = (ms) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });
const pick = (s, value) => act(() => {
  const el = s.find("#status");
  const setter = Object.getOwnPropertyDescriptor(el.constructor.prototype, "value").set;
  setter.call(el, value);
  el.dispatchEvent(new window.Event("change", { bubbles: true }));
});
const has = (s, sel) => !!s.all(sel).length;
const shape = (s) => ["#loading", "#error", "#empty", "#list"].filter((x) => has(s, x)).join(",") || "nothing";
const fresh = () => { resetSent(); setEscalateBehaviour("ok"); setSlowFirstList(false); setListBehaviour("ok"); return render(<SupportQueue />); };

runChecks([
  { name: "1. loading is shown while the first request is in flight", fn: SupportQueue, run: async () => {
      const s = fresh();
      const immediately = shape(s);
      await settle(40);
      return { immediately, afterwards: shape(s) };
    }, expected: { immediately: "#loading", afterwards: "#list" } },

  { name: "2. the open list renders one row per ticket, with ids and text", fn: SupportQueue, run: async () => {
      const s = fresh();
      await settle(40);
      return {
        rows: s.all("#list li").length,
        first: s.find("#row-t1").textContent.replace("escalate", "").trim(),
        button: has(s, "#esc-t1"),
      };
    }, expected: { rows: 2, first: "printer on fire (normal)", button: true } },

  { name: "3. the list request is a plain GET on the right url", fn: SupportQueue, run: async () => {
      const s = fresh();
      await settle(40);
      return sent.filter((r) => r.url.startsWith("/tickets?")).map((r) => `${r.method} ${r.url}`);
    }, expected: ["GET /tickets?status=open"] },

  { name: "4. an empty list is its own state, not loading and not an error", fn: SupportQueue, run: async () => {
      const s = fresh();
      await settle(40);
      pick(s, "archived");
      await settle(40);
      return { shape: shape(s), text: s.find("#empty").textContent };
    }, expected: { shape: "#empty", text: "nothing here" } },

  { name: "5. a non-2xx answer becomes an error state with the status", fn: SupportQueue, run: async () => {
      const s = fresh();
      await settle(40);
      setListBehaviour("fail");
      pick(s, "closed");
      await settle(40);
      return { shape: shape(s), text: s.find("#error").textContent };
    }, expected: { shape: "#error", text: "HTTP 500" } },

  { name: "6. the slow answer for the earlier selection never wins", fn: SupportQueue, run: async () => {
      resetSent(); setEscalateBehaviour("ok"); setListBehaviour("ok"); setSlowFirstList(true);
      const s = render(<SupportQueue />);          // open, answers in 60 ms
      await settle(10);
      pick(s, "closed");                            // closed, answers in 5 ms
      await settle(120);
      return { shape: shape(s), rows: s.all("#list li").length, has9: has(s, "#row-t9") };
    }, expected: { shape: "#list", rows: 1, has9: true } },

  { name: "7. escalate posts json to the right url", fn: SupportQueue, run: async () => {
      const s = fresh();
      await settle(40);
      act(() => { s.find("#esc-t1").dispatchEvent(new window.MouseEvent("click", { bubbles: true })); });
      await settle(40);
      const r = sent.find((x) => x.url.includes("/escalate"));
      return { url: r && r.url, method: r && r.method, type: r && r.type, body: r && r.body };
    }, expected: { url: "/tickets/t1/escalate", method: "POST", type: "application/json", body: JSON.stringify({ reason: "manual" }) } },

  { name: "8. a successful escalate updates only that row; a failed one changes nothing and reports", fn: SupportQueue, run: async () => {
      const s = fresh();
      await settle(40);
      act(() => { s.find("#esc-t1").dispatchEvent(new window.MouseEvent("click", { bubbles: true })); });
      await settle(40);
      const afterOk = { t1: s.find("#row-t1").textContent.replace("escalate", "").trim(),
                        t2: s.find("#row-t2").textContent.replace("escalate", "").trim(),
                        err: has(s, "#escerror") };
      setEscalateBehaviour("fail");
      act(() => { s.find("#esc-t2").dispatchEvent(new window.MouseEvent("click", { bubbles: true })); });
      await settle(40);
      return { ...afterOk,
               t2AfterFail: s.find("#row-t2").textContent.replace("escalate", "").trim(),
               failErr: s.find("#escerror").textContent,
               // what came back from the server is data, not your state:
               // mutating it in place corrupts the next request's answer.
               serverDataUntouched: TICKETS.open[0].priority === "normal" };
    }, expected: { t1: "printer on fire (urgent)", t2: "vpn drops (normal)", err: false,
                   t2AfterFail: "vpn drops (normal)", failErr: "HTTP 422",
                   serverDataUntouched: true } },
]);
