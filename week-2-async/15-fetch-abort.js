// Drill 15 - fetch: HTTP errors, network errors, and AbortController
//
// The single most common interview trap in this area: `fetch` does NOT reject on
// 404 or 500. A response arrived, so the promise fulfils. You have to look at it.
//
// Green criterion, two parts: cold from memory, and narrated out loud.
//
// Run:  node week-2-async/15-fetch-abort.js
// Run after EVERY function.

// --- a fake fetch, GIVEN. Do not edit. ------------------------
// The url decides what happens:
//   "/ok"       200 after  20 ms, body { id: 1, name: "ok" }
//   "/missing"  404 after  20 ms
//   "/boom"     500 after  20 ms
//   "/slow"     200 after 300 ms, body { id: 2, name: "slow" }
//   "/offline"  the request itself fails: rejects with TypeError("fetch failed")
// It honours options.signal, the same way the real one does.

const abortError = () => {
  const e = new Error("This operation was aborted");
  e.name = "AbortError";
  return e;
};

const PLAN = {
  "/ok": { ms: 20, status: 200, body: { id: 1, name: "ok" } },
  "/missing": { ms: 20, status: 404, body: { error: "not found" } },
  "/boom": { ms: 20, status: 500, body: { error: "server" } },
  "/slow": { ms: 300, status: 200, body: { id: 2, name: "slow" } },
};

const fetch = (url, options = {}) =>
  new Promise((resolve, reject) => {
    const plan = PLAN[url];
    if (!plan) {
      setTimeout(() => reject(new TypeError("fetch failed")), 10);
      return;
    }
    const timer = setTimeout(() => {
      resolve({
        ok: plan.status >= 200 && plan.status < 300,
        status: plan.status,
        json: async () => plan.body,
      });
    }, plan.ms);
    const signal = options.signal;
    if (signal) {
      if (signal.aborted) { clearTimeout(timer); reject(abortError()); return; }
      signal.addEventListener("abort", () => { clearTimeout(timer); reject(abortError()); });
    }
  });

// --- 1 --------------------------------------------------------
// fetchJson(url) awaits the response and returns the parsed body.
// If the server answered with an error status, THROW:
//     new Error("HTTP " + res.status)
//   fetchJson("/ok")      -> { id: 1, name: "ok" }
//   fetchJson("/missing") -> throws Error("HTTP 404")
//   fetchJson("/boom")    -> throws Error("HTTP 500")
// The response object has: res.ok (boolean), res.status (number), res.json().

async function fetchJson(url) {
  // here
}

// --- 2 --------------------------------------------------------
// safeFetchJson(url) never throws. It returns one of two shapes:
//     { ok: true,  data: <parsed body> }
//     { ok: false, error: <the error message, a string> }
//   safeFetchJson("/ok")      -> { ok: true, data: { id: 1, name: "ok" } }
//   safeFetchJson("/missing") -> { ok: false, error: "HTTP 404" }
//   safeFetchJson("/offline") -> { ok: false, error: "fetch failed" }
// Note that the last one is a DIFFERENT kind of failure from the middle one.

async function safeFetchJson(url) {
  // here
}

// --- 3 --------------------------------------------------------
// withTimeout(url, ms) gives the request a deadline.
//   - build an AbortController, pass controller.signal to fetch
//   - start a timer for `ms`; when it fires, controller.abort()
//   - if the body arrives in time, return it
//   - if the request was aborted, return the string "timeout"
//   - CLEAR the timer when the request succeeded
//
//   withTimeout("/ok", 100)   -> { id: 1, name: "ok" }
//   withTimeout("/slow", 100) -> "timeout"
//
// An aborted fetch rejects with an error whose `name` is "AbortError".
// Catch it and tell it apart from every other failure.

async function withTimeout(url, ms) {
  // here
}

// --- 4, spoken, nothing to write ------------------------------
//   a) `fetch("/missing")` where the server answers 404. Does the promise
//      fulfil or reject? Say what that means for a naive
//      `fetch(url).then(r => r.json())`.
//   b) name the two kinds of failure a request can have, and which one
//      `try`/`catch` around `await fetch(...)` catches on its own.
//   c) you forgot the clearTimeout in part 3. The function still returns the
//      right answer. What exactly is wrong then, and when would it hurt?

// --------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

const msg = (p) => p.then(() => "did not throw", (e) => e.message);

runChecks([
  { name: "fetchJson, 200", fn: fetchJson, run: () => fetchJson("/ok"), expected: { id: 1, name: "ok" } },
  { name: "fetchJson throws on 404", fn: fetchJson, run: () => msg(fetchJson("/missing")), expected: "HTTP 404" },
  { name: "fetchJson throws on 500", fn: fetchJson, run: () => msg(fetchJson("/boom")), expected: "HTTP 500" },

  { name: "safeFetchJson, 200", fn: safeFetchJson, run: () => safeFetchJson("/ok"), expected: { ok: true, data: { id: 1, name: "ok" } } },
  { name: "safeFetchJson, 404", fn: safeFetchJson, run: () => safeFetchJson("/missing"), expected: { ok: false, error: "HTTP 404" } },
  { name: "safeFetchJson, network down", fn: safeFetchJson, run: () => safeFetchJson("/offline"), expected: { ok: false, error: "fetch failed" } },

  { name: "withTimeout, arrives in time", fn: withTimeout, run: () => withTimeout("/ok", 100), expected: { id: 1, name: "ok" } },
  { name: "withTimeout, too slow", fn: withTimeout, run: () => withTimeout("/slow", 100), expected: "timeout" },
  // it must ABORT, not sit and wait out the full 300 ms
  { name: "withTimeout really aborts", fn: withTimeout, run: async () => {
      const t = Date.now(); await withTimeout("/slow", 100); return Date.now() - t < 200; }, expected: true },
  // and it must clear its own timer on the happy path
  { name: "withTimeout clears its timer", fn: withTimeout, run: async () => {
      await withTimeout("/ok", 5000);
      await new Promise((r) => setImmediate(r));
      return process.getActiveResourcesInfo().filter((x) => x === "Timeout").length; }, expected: 0 },
]);
