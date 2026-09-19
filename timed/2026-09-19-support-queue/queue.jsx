// Timed build 5 - 2026-09-19 - 45 minutes, out loud.
//
// A support queue: fetch a list, let the user switch which list, and escalate
// one ticket. React plus HTTP in one build, which is what a real round asks.
//
// You write everything between the two markers. Nothing above or below.
//
// Run:  npm run drill timed/2026-09-19-support-queue/check.jsx

import { Fragment, use } from "react";

const { React } = require("../../lib/react-harness.js");
const { useState, useEffect } = React;

// --- the server. Do not edit. ----------------------------------
// A fake fetch. It records every request it receives in `sent`, so the checks
// can assert what you actually put on the wire.

const sent = [];

const TICKETS = {
  open: [
    { id: "t1", title: "printer on fire", priority: "normal" },
    { id: "t2", title: "vpn drops", priority: "normal" },
  ],
  closed: [{ id: "t9", title: "old laptop", priority: "low" }],
  archived: [],
};

let escalateBehaviour = "ok";     // the checks flip this to "fail"
let listBehaviour = "ok";         // and this, to make the list answer 500
let slowFirstList = false;        // and this, to test the race

// installed as the global `fetch`, so you write normal fetch calls.
globalThis.fetch = fakeFetch;

function fakeFetch(url, options = {}) {
  sent.push({ url, method: options.method || "GET", type: (options.headers || {})["Content-Type"], body: options.body });

  if (url.startsWith("/tickets?status=")) {
    const status = url.slice("/tickets?status=".length);
    if (listBehaviour === "fail") return respond(500, { error: "server on fire" }, 5);
    const list = TICKETS[status] || [];
    const delay = slowFirstList && status === "open" ? 60 : 5;
    return respond(200, list, delay);
  }

  if (url.startsWith("/tickets/") && url.endsWith("/escalate")) {
    const id = url.slice("/tickets/".length, -"/escalate".length);
    if (escalateBehaviour === "fail") return respond(422, { error: "already escalated" }, 5);
    return respond(200, { id, priority: "urgent" }, 5);
  }

  return respond(404, { error: "no such route" }, 5);
}

const respond = (status, payload, delay) =>
  new Promise((resolve) =>
    setTimeout(() => resolve({
      ok: status >= 200 && status < 300,
      status,
      json: async () => payload,
    }), delay)
  );

// ================= YOUR CODE STARTS HERE =======================
//
// Build <SupportQueue />. It renders, always:
//
//   <select id="status">   with three options, values "open", "closed",
//                          "archived", controlled, starting at "open"
//
// and then exactly ONE of these four, depending on where the request is:
//
//   <p id="loading">   the text "loading"
//   <p id="error">     the text `HTTP <status>` when the server answered
//                      with a non-2xx, for example "HTTP 500"
//   <p id="empty">     the text "nothing here" when the list came back empty
//   <ul id="list">     one <li> per ticket when there is something to show
//
// Each <li> has:
//   - an id of `row-<ticket id>`, for example id="row-t1"
//   - the text `<title> (<priority>)`, for example "printer on fire (normal)"
//   - a <button> inside it with id `esc-<ticket id>`, text "escalate"
//
// THE REQUESTS
//
//   the list:   GET  /tickets?status=<the selected status>
//               refetched whenever the selection changes
//
//   escalate:   POST /tickets/<id>/escalate
//               Content-Type: application/json
//               body: JSON with one field, { reason: "manual" }
//
//               on success the server answers { id, priority: "urgent" }
//               and that ticket's row must show the new priority, without
//               refetching the whole list
//
//               on failure the row must NOT change, and <p id="escerror">
//               must appear with the text `HTTP <status>`
//
// THE TRAPS, all of which the checks send:
//
//   - `fetch` here behaves like the real one: it does NOT reject on 500
//   - switching the selection fast means an older, slower answer can arrive
//     after a newer one. The newer list must win
//   - an empty list is not an error and not "loading"
//   - what the server hands you is data, not your state
//
// You may use useState and useEffect. Nothing else is needed.

// Each <li> has:
//   - an id of `row-<ticket id>`, for example id="row-t1"
//   - the text `<title> (<priority>)`, for example "printer on fire (normal)"
//   - a <button> inside it with id `esc-<ticket id>`, text "escalate"

function SupportQueue() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [supportOption, setSupportOption] = useState('open');
  const potentialOptions = ["open", "closed", "archived"];

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setError('');
        setLoading(true);
        const response = await fetch(`/tickets?status=${supportOption}`, {
          method: 'GET'
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        setTickets(result);
      } catch (e) {
        console.log('e.message', e.message)
        setError(e.message)
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, [supportOption])

  if (error.length !== 0) return <p id="error">{error}</p>

  if (loading) return <p id="loading">loading</p>

  return (
    <>
      <select id="status" size={potentialOptions.length} onChange={(e) => setSupportOption(e.target.value)}>
        {potentialOptions.map(item => <option key={item} value={item} >{item}</option>)}
      </select>
      {tickets.length === 0 ? (
        <p id="empty">nothing here</p>
      ) : (<ul id="list">
        {tickets.map(item => (
          <SupportTicket key={item.id} ticket={item} />
        ))}
      </ul>)}
    </>
  );
}

const SupportTicket = ({ ticket }) => {
  const [escalete, setEscalete] = useState(null);
  const [escerror, setEscerror] = useState('');

  const handleEscalate = async (user) => {
    try {
      setEscerror('');
      const response = await fetch(`/tickets/${user.id}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: "manual" })
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      setEscalete(result);
    } catch (e) {
      setEscerror(e.message)
    }
  }

  return (
    <Fragment key={ticket.id}>
      <li key={ticket.id} id={`row-${ticket.id}`}>
        {ticket.title} ({escalete ? escalete.priority : ticket.priority})
        <button id={`esc-${ticket.id}`} onClick={() => handleEscalate(ticket)}>escalate</button>
      </li>
      {escerror.length !== 0 && <p id="escerror">{escerror}</p>}
    </Fragment>
  )
}

// ================= YOUR CODE ENDS HERE =========================

module.exports = {
  SupportQueue, sent, TICKETS,
  setEscalateBehaviour: (v) => { escalateBehaviour = v; },
  setSlowFirstList: (v) => { slowFirstList = v; },
  setListBehaviour: (v) => { listBehaviour = v; },
  resetSent: () => { sent.length = 0; },
};
