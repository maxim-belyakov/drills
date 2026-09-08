// Drill 22 - a custom useFetch with loading, error and empty
//
// The rule this drill exists for: a data hook has FOUR states, not two. idle,
// loading, error, and success - and success splits again into "there is data"
// and "the list came back empty". A component that only knows data and !data
// lies to the user twice: it shows a spinner forever on failure, and it shows
// "nothing found" while the request is still in the air.
//
// Green criterion: cold from memory, and narrated out loud.
//
// Run:  npm run drill week-4-react/22-usefetch.jsx

const { React } = require("../lib/react-harness.js");
const { useState, useEffect } = React;

// --- given instruments. Do not edit. ---------------------------
// log.calls records every url that was actually requested.

const log = { calls: [] };

const DB = {
  "/users": [{ id: 1, name: "ann" }, { id: 2, name: "bo" }],
  "/none": [],
};

const fetchJson = (url) =>
  new Promise((resolve, reject) => {
    log.calls.push(url);
    setTimeout(() => {
      if (url === "/boom") reject(new Error("http 500"));
      else if (url === "/slow") resolve([{ id: 9, name: "slowpoke" }]);
      else if (DB[url]) resolve(DB[url]);
      else reject(new Error("http 404"));
    }, url === "/slow" ? 60 : 10);
  });

// --- 1 ----------------------------------------------------------
// useFetch(url) returns an object: { data, error, loading }.
//
//   url is falsy       ->  { data: null, error: null, loading: false }
//                          and fetchJson is NOT called at all
//   request in flight  ->  { data: null, error: null, loading: true }
//   resolved           ->  { data: <the value>, error: null, loading: false }
//   rejected           ->  { data: null, error: <the Error>, loading: false }
//
// When url changes, it requests the new one and goes back to loading.
// A slow answer for an old url must NEVER land - drill 18 has the technique.
//
// The shape of the answer, on unrelated data:
//
//   function useProfile(id) {
//     const [state, setState] = useState({ data: null, error: null, loading: false });
//     useEffect(() => {
//       if (!id) { setState({ data: null, error: null, loading: false }); return; }
//       let current = true;
//       setState({ data: null, error: null, loading: true });
//       loadProfile(id)
//         .then((p) => { if (current) setState({ data: p, error: null, loading: false }); })
//         .catch((e) => { if (current) setState({ data: null, error: e, loading: false }); });
//       return () => { current = false; };
//     }, [id]);
//     return state;
//   }
//
// One piece of state holding all three fields, not three separate useState -
// that way the three can never disagree with each other.

function useFetch(url) {
  return "__HERE__";
}

// --- 2 ----------------------------------------------------------
// <UserList url="..." /> uses the hook and renders exactly one of five states.
//
//   <p id="state">   "idle" | "loading" | "error" | "empty" | "ready"
//   <p id="msg">     the error message - ONLY in the error state
//   <ul id="list">   one <li> per user - ONLY in the ready state
//
//   no url                  ->  idle
//   request in flight       ->  loading
//   rejected                ->  error, and #msg carries error.message
//   resolved, array empty   ->  empty
//   resolved, array has rows->  ready, and #list has one <li> per row
//
// The order you test these in matters. Ask which check comes first: an empty
// array is falsy in no sense at all - [] is truthy, and [].length is 0.
//
// The shape of the answer, on unrelated data:
//
//   function Orders({ customerId }) {
//     const { data, error, loading } = useOrders(customerId);
//     if (!customerId) return <p id="s">idle</p>;
//     if (loading) return <p id="s">loading</p>;
//     if (error) return <p id="s">error</p>;
//     if (data.length === 0) return <p id="s">empty</p>;
//     return <ul>{data.map((o) => <li key={o.id}>{o.total}</li>)}</ul>;
//   }
//
// Early returns, most specific first. Note that data is only safe to read
// AFTER loading and error have been ruled out.

function UserList({ url }) {
  return "__HERE__";
}

// --- 3, spoken, nothing to write --------------------------------
//   a) name the five states and say what the screen shows in each. Then say
//      which two a naive `data ? list : spinner` gets wrong, and how.
//   b) why is all of it in ONE useState object rather than three separate
//      pieces of state?
//   c) the slow answer for the old url still arrives. What stops it from
//      reaching the screen, and which cleanup moment does the work?

// ----------------------------------------------------------------
// Do not touch below. This is the check.

const { render, act } = require("../lib/react-harness.js");
const { runChecks } = require("../lib/checks");

const wait = (ms) => act(async () => { await new Promise((r) => setTimeout(r, ms)); });
const reset = () => { log.calls = []; };
const rows = (s) => s.all("li").map((li) => li.textContent).join(",");
const has = (s, sel) => s.container.querySelector(sel) !== null;

runChecks([
  { name: "1. loading first, then the rows", fn: UserList, run: async () => {
      reset();
      const s = render(<UserList url="/users" />);
      const first = s.find("#state").textContent;
      await wait(40);
      const out = { first, then: s.find("#state").textContent, rows: rows(s), msg: has(s, "#msg") };
      s.unmount();
      return out;
    }, expected: { first: "loading", then: "ready", rows: "ann,bo", msg: false } },

  { name: "2. an empty array is its own state", fn: UserList, run: async () => {
      reset();
      const s = render(<UserList url="/none" />);
      await wait(40);
      const out = { state: s.find("#state").textContent, list: has(s, "#list") };
      s.unmount();
      return out;
    }, expected: { state: "empty", list: false } },

  { name: "3. a rejection becomes the error state, with its message", fn: UserList, run: async () => {
      reset();
      const s = render(<UserList url="/boom" />);
      await wait(40);
      const out = { state: s.find("#state").textContent, msg: s.find("#msg").textContent, list: has(s, "#list") };
      s.unmount();
      return out;
    }, expected: { state: "error", msg: "http 500", list: false } },

  { name: "4. no url means no request at all", fn: UserList, run: async () => {
      reset();
      const s = render(<UserList url="" />);
      await wait(40);
      const out = { state: s.find("#state").textContent, calls: log.calls.length };
      s.unmount();
      return out;
    }, expected: { state: "idle", calls: 0 } },

  { name: "5. a new url refetches and goes back to loading", fn: UserList, run: async () => {
      reset();
      const s = render(<UserList url="/users" />);
      await wait(40);
      s.rerender(<UserList url="/none" />);
      const during = s.find("#state").textContent;
      await wait(40);
      const out = { during, then: s.find("#state").textContent, calls: log.calls.join(",") };
      s.unmount();
      return out;
    }, expected: { during: "loading", then: "empty", calls: "/users,/none" } },

  { name: "6. the slow answer for the old url never lands", fn: UserList, run: async () => {
      reset();
      const s = render(<UserList url="/slow" />);
      s.rerender(<UserList url="/users" />);
      await wait(120);
      const out = { state: s.find("#state").textContent, rows: rows(s), calls: log.calls.join(",") };
      s.unmount();
      return out;
    }, expected: { state: "ready", rows: "ann,bo", calls: "/slow,/users" } },
]);
