// Drill 24 - POST with a body
//
// The rule this drill exists for: a request that carries data is THREE things
// that must agree with each other - the method, the Content-Type header, and
// the body. Get one of them wrong and the server does not fail loudly; it
// answers 400, 415 or, worst of all, stores "[object Object]".
//
// Green criterion: cold from memory, and narrated out loud.
//
// Run:  node week-5-http/24-post.js

// --- given: a fake server. Do not edit. ------------------------
// It records exactly what you sent, and answers like a real one would.

const sent = [];

const typeOf = (headers = {}) => {
  const key = Object.keys(headers).find((k) => k.toLowerCase() === "content-type");
  return key ? String(headers[key]).split(";")[0].trim() : undefined;
};

const reply = (status, body, isJson = true) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: { get: (h) => (h.toLowerCase() === "content-type" ? (isJson ? "application/json" : "text/html") : null) },
  json: async () => {
    if (body === undefined) throw new SyntaxError("Unexpected end of JSON input");
    if (!isJson) throw new SyntaxError("Unexpected token < in JSON at position 0");
    return body;
  },
  text: async () => (body === undefined ? "" : isJson ? JSON.stringify(body) : body),
});

global.fetch = async (url, options = {}) => {
  const method = options.method || "GET";
  const type = typeOf(options.headers);
  sent.push({ url, method, type, body: options.body });

  const parse = () => { try { return JSON.parse(options.body); } catch { return null; } };

  if (url === "/users" && method === "POST") {
    if (type !== "application/json") return reply(415, { error: "send json" });
    const data = parse();
    if (!data || typeof data !== "object") return reply(400, { error: "bad body" });
    return reply(201, { id: 7, ...data });
  }

  if (url === "/drafts/9" && method === "PUT") {
    return reply(204, undefined);          // No Content - there is NO body to parse
  }

  if (url === "/forms" && method === "POST") {
    const data = parse() || {};
    if (data.email === "boom@x") return reply(500, "<html>oops</html>", false);
    if (!String(data.email).includes("@")) return reply(422, { errors: { email: "invalid" } });
    return reply(200, { ok: true });
  }

  if (url === "/notes" && method === "POST") {
    if (type !== "text/plain") return reply(415, { error: "send text/plain" });
    return reply(200, { length: String(options.body).length });
  }

  return reply(404, { error: "no route" });
};

// --- 1 ----------------------------------------------------------
// createUser(user) POSTs to "/users" and returns the created object.
//
//   createUser({ name: "ann" })  ->  { id: 7, name: "ann" }
//   a non-2xx answer             ->  throw Error(`HTTP ${status}`)
//
// Three things must agree: method, Content-Type, body. The server answers 415
// without the header and 400 if the body is not JSON text.
//
// The shape of the answer, on unrelated data:
//
//   async function createOrder(order) {
//     const res = await fetch("/orders", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(order),
//     });
//     if (!res.ok) throw new Error(`HTTP ${res.status}`);
//     return res.json();
//   }
//
// Note JSON.stringify. Handing the object straight to `body` sends the string
// "[object Object]" - no error anywhere, just nonsense in the database.

async function createUser(user) {
  // here
}

// --- 2 ----------------------------------------------------------
// saveDraft(text) PUTs to "/drafts/9" and returns true.
//
// The server answers 204 No Content: a success WITH NO BODY. Calling res.json()
// on it throws SyntaxError - there is nothing to parse.
//
//   saveDraft("hello")  ->  true
//
// Decide what to return by the STATUS, not by the body.

async function saveDraft(text) {
  // here
}

// --- 3 ----------------------------------------------------------
// submitForm(payload) POSTs to "/forms". Three outcomes, three shapes:
//
//   accepted            ->  { ok: true }
//   422, validation     ->  { ok: false, errors: { email: "invalid" } }
//   anything else       ->  throw Error(`HTTP ${status}`)
//
// The 422 answer carries a JSON body that says WHICH field is wrong - that body
// is the whole point of a 422 and must be read. The 500 answer carries HTML, so
// res.json() on it throws; do not let that throw escape as a parse error.
//
//   submitForm({ email: "ann@example.com" })  ->  { ok: true }
//   submitForm({ email: "nope" })             ->  { ok: false, errors: { email: "invalid" } }
//   submitForm({ email: "boom@x" })           ->  throws Error("HTTP 500")

async function submitForm(payload) {
  // here
}

// --- 4 ----------------------------------------------------------
// sendText(text) POSTs to "/notes" with a PLAIN TEXT body and returns the
// length the server reports.
//
//   sendText("hello")  ->  5
//
// JSON is a convention, not a rule. Here the header must say text/plain and the
// body must be the raw string - no JSON.stringify, which would add quotes and
// make the length 7.

async function sendText(text) {
  // here
}

// --- 5, spoken, nothing to write --------------------------------
//   a) name the three parts of a request that carries data, and say what the
//      server does when each one alone is wrong.
//   b) 204 and 200 are both success. What is the difference for the code that
//      reads the answer?
//   c) a 422 and a 500 are both non-2xx. Why does one of them deserve its body
//      read and the other does not?

// ----------------------------------------------------------------
// Do not touch below. This is the check.

const { runChecks } = require("../lib/checks");

const last = () => sent[sent.length - 1];
const reset = () => { sent.length = 0; };
const msg = (p) => p.then(() => "no throw", (e) => e.message);

runChecks([
  { name: "1. createUser sends method, type and a JSON body", fn: createUser, run: async () => {
      reset();
      const out = await createUser({ name: "ann" });
      return { out, method: last().method, type: last().type, body: last().body };
    }, expected: { out: { id: 7, name: "ann" }, method: "POST", type: "application/json", body: '{"name":"ann"}' } },

  { name: "2. createUser throws on a non-2xx", fn: createUser, run: () => msg(createUser("not an object")),
    expected: "HTTP 400" },

  { name: "3. saveDraft survives 204 No Content", fn: saveDraft, run: async () => {
      reset();
      const out = await saveDraft("hello");
      return { out, method: last().method };
    }, expected: { out: true, method: "PUT" } },

  { name: "4. submitForm accepts a valid payload", fn: submitForm,
    run: () => submitForm({ email: "ann@example.com" }), expected: { ok: true } },

  { name: "5. submitForm reads the 422 body", fn: submitForm,
    run: () => submitForm({ email: "nope" }), expected: { ok: false, errors: { email: "invalid" } } },

  { name: "6. submitForm throws on a 500 that is not JSON", fn: submitForm,
    run: () => msg(submitForm({ email: "boom@x" })), expected: "HTTP 500" },

  { name: "7. sendText sends raw text, not JSON", fn: sendText, run: async () => {
      reset();
      const out = await sendText("hello");
      return { out, type: last().type, body: last().body };
    }, expected: { out: 5, type: "text/plain", body: "hello" } },
]);
