// Timed build 7 - 2026-09-29 - 90 minutes, out loud. Drill 26 of the programme.
//
// The one drill where the REQUIREMENTS CHANGE while you build. You get the first
// spec now; a second arrives around minute 30 and a third around minute 60, the
// way they do in a real round. The first version is not wasted work, but it is
// also not the last version - build so that the next change is cheap.
//
// You write everything between the two markers. Nothing above or below.
//
// Run:  npm run drill timed/2026-09-29-dispatch/check.jsx

import { Fragment } from "react/jsx-runtime";

const { React } = require("../../lib/react-harness.js");
const { useState, useEffect } = React;

// --- the server. Do not edit. ----------------------------------
// A fake fetch installed as globalThis.fetch. It records every request in `sent`,
// so the checks can assert what you actually put on the wire.

const sent = [];

const ORDERS = {
  new: [
    { id: "o1", address: "Nowy Swiat 12", weight: 3, courier: null },
    { id: "o2", address: "Marszalkowska 5", weight: 12, courier: null },
    { id: "o3", address: "Prosta 51", weight: 7, courier: null },
  ],
  assigned: [{ id: "o9", address: "Pulawska 2", weight: 4, courier: "Ala" }],
  done: [],
};

let listBehaviour = "ok";     // the checks flip this to "fail"
let conflictFor = null;       // assigning this id answers 409
let assignDelay = 5;          // the checks raise this to test the in-flight state

const resetServer = () => { sent.length = 0; listBehaviour = "ok"; conflictFor = null; assignDelay = 5; };
const setListBehaviour = (v) => { listBehaviour = v; };
const setConflictFor = (id) => { conflictFor = id; };
const setAssignDelay = (ms) => { assignDelay = ms; };

globalThis.fetch = function fakeFetch(url, options = {}) {
  const method = options.method || "GET";
  sent.push({ url, method, type: (options.headers || {})["Content-Type"], body: options.body });

  if (url.startsWith("/orders?status=")) {
    const status = url.slice("/orders?status=".length);
    if (listBehaviour === "fail") return respond(500, { error: "dispatch service is down" }, 5);
    // the "new" shelf is slow, the others are fast - so a race is reachable
    return respond(200, (ORDERS[status] || []).map((o) => ({ ...o })), status === "new" ? 25 : 5);
  }

  const assign = url.match(/^\/orders\/([^/]+)\/assign$/);
  if (assign) {
    const id = assign[1];
    if (conflictFor === id) return respond(409, { error: "already taken by Cez" }, assignDelay);
    const courier = JSON.parse(options.body || "{}").courier;
    for (const list of Object.values(ORDERS)) {
      const found = list.find((o) => o.id === id);
      if (found) found.courier = courier;
    }
    return respond(200, { id, courier }, assignDelay);
  }

  const one = url.match(/^\/orders\/([^/]+)$/);
  if (one) {
    for (const list of Object.values(ORDERS)) {
      const found = list.find((o) => o.id === one[1]);
      if (found) return respond(200, { ...found, courier: found.courier ?? "Cez" }, 5);
    }
  }

  return respond(404, { error: "no such route" }, 5);
};

const respond = (status, payload, delay) =>
  new Promise((resolve) =>
    setTimeout(() => resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(payload),
    }), delay));

// --- YOUR CODE STARTS HERE ------------------------------------

const OrderRow = ({ order, onAssignSuccess }) => {
  const [courier, setCourier] = useState(order.courier);
  const [assigning, setAssigning] = useState(false);
  const [conflictError, setConflictError] = useState(null);

  const assignCourier = async (id) => {
    if (assigning) return;

    setAssigning(true);
    setConflictError(null);

    try {
      const response = await fetch(`/orders/${id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "courier": "Bo" })
      });

      if (response.status === 409) {
        const errorData = await response.json();
        setConflictError(errorData.error);

        const singleResponse = await fetch(`/orders/${id}`);
        if (singleResponse.ok) {
          const freshData = await singleResponse.json();
          setCourier(freshData.courier);
          onAssignSuccess(id, freshData.courier);
        }
        return;
      }

      if (!response.ok) {
        throw new Error('dispatch service is down');
      }
      const result = await response.json();
      setCourier(result.courier);
      onAssignSuccess(id, result.courier);
    } catch (e) {
      console.error(e.message)
    } finally {
      setAssigning(false);
    }
  }

  return (
    <Fragment>
      <li id={`o-${order.id}`}>
        <span id="address">{order.address}</span >
        {conflictError && <span id={`conflict-${order.id}`}>{conflictError}</span>}
        {courier ? (
          <span id={`courier-${order.id}`}>{courier}</span>
        ) : (
          <button
            id={`assign-${order.id}`}
            disabled={assigning}
            onClick={() => assignCourier(order.id)}
          >
            Assign the courier
          </button>
        )}
      </li>
    </Fragment>
  );
}

function Dispatch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('new');
  const [retryTrigger, setRetryTrigger] = useState(0);
  const [weight, setWeight] = useState('');

  useEffect(() => {
    let ignore = false;

    const fetchOrders = async () => {
      try {
        setError(null);
        setLoading(true);
        const response = await fetch(`/orders?status=${status}`);
        if (!response.ok) {
          throw new Error('dispatch service is down');
        }
        const result = await response.json();

        if (!ignore) {
          setOrders(result);
        }
      } catch (e) {
        if (!ignore) {
          setError(e.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      ignore = true;
    };
  }, [status, retryTrigger]);

  const handleAssignSuccess = (orderId, courierName) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, courier: courierName } : o))
    );
  };

  const parsedWeight = parseFloat(weight);
  const isWeightValid = weight.trim() !== '' && !isNaN(parsedWeight);

  const visibleOrders = isWeightValid
    ? orders.filter((o) => o.weight <= parsedWeight)
    : orders;

  const assignedCount = orders.reduce((sum, order) => {
    if (order.courier) sum = sum + 1;
    return sum;
  }, 0)

  const courierStatuses = [`new`, `assigned`, `done`];

  return (
    <>
      <select id="status" size={courierStatuses.length} onChange={(e) => setStatus(e.target.value)} >
        {courierStatuses.map(item => <option key={item} value={item}>{item}</option>)}
      </select>
      <input id="max-weight" value={weight} onChange={(e) => setWeight(e.target.value.trim())} ></input>
      {loading && <span id="loading">Loading...</span>}
      {error && <>
        <span id="error">{error}</span>
        <button id="retry" onClick={() => setRetryTrigger(c => c + 1)}>Retry</button>
      </>}
      <span id="count">{visibleOrders.length}</span>
      <span id="assigned-count">{`${assignedCount} of ${visibleOrders.length} assigned`}</span>
      {(!loading && !error) && (
        <ul id="list">
          {visibleOrders.map(item => <OrderRow key={`o-${item.id}`} order={item} onAssignSuccess={handleAssignSuccess} />)}
        </ul>
      )}
    </>
  );
}

// --- YOUR CODE ENDS HERE --------------------------------------

module.exports = { Dispatch, sent, resetServer, setListBehaviour, setConflictFor, setAssignDelay };
