// restock.jsx - THIS is the file you fix. Someone else wrote it, it mostly works,
// and the checks say otherwise. Do not rewrite it from scratch: find the line,
// change the line.
//
// Run: npm run drill timed/2026-09-26-restock/check.jsx

const { React } = require("../../lib/react-harness.js");
const { useState, useEffect } = React;

// --- the stock service. Do not edit. ---------------------------
// loadStock resolves with the parts of that warehouse: north is a slow shelf and
// answers in 30 ms, south answers in 5 ms. The checks flip `failNext` to make
// exactly one request fail, the way a real service does.

const STOCK = {
  north: [
    { sku: "N-1", name: "Bearing", price: 4.5, qty: 3 },
    { sku: "N-2", name: "Belt", price: 12.25, qty: 2 },
    { sku: "N-3", name: "Bearing", price: 9.1, qty: 1 },
    { sku: "N-4", name: "Clamp", price: 0.75, qty: 8 },
  ],
  south: [
    { sku: "S-1", name: "Gasket", price: 2.4, qty: 5 },
    { sku: "S-2", name: "Filter", price: 15.5, qty: 1 },
  ],
};

let failNext = null;
const setFailNext = (warehouse) => { failNext = warehouse; };

function loadStock(warehouse) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (failNext === warehouse) {
        failNext = null;
        reject(new Error("stock service is down"));
        return;
      }
      resolve(STOCK[warehouse]);
    }, warehouse === "north" ? 30 : 5);
  });
}

// --- the component. THIS is where the faults are. --------------

// One row. The note is local to the row - nobody else needs to know about it.
function Row({ part }) {
  const [note, setNote] = useState("");
  return (
    <li id={`p-${part.sku}`}>
      {part.name} {part.qty} x {part.price.toFixed(2)}
      <input id={`note-${part.sku}`} value={note} onChange={(e) => setNote(e.target.value)} />
    </li>
  );
}

function Restock({ warehouses = ["north", "south"] }) {
  const [warehouse, setWarehouse] = useState(warehouses[0]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let current = true;
    setLoading(true);
    loadStock(warehouse)
      .then((list) => {
        if (current) {
          setParts(list);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (current) {
          setError(e.message);
          setParts([]);
          setLoading(false);
        }
      });
    return () => { current = false; };
  }, [warehouse, attempt]);

  const q = query.trim().toLowerCase();
  const shown = q.length >= 2 ? parts.filter((p) => p.name.toLowerCase().includes(q)) : parts;
  const total = shown.reduce((sum, p) => sum + parseInt(p.price) * p.qty, 0);

  if (error) {
    return (
      <p id="error">
        {error}
        <button id="retry" onClick={() => setAttempt((n) => n + 1)}>retry</button>
      </p>
    );
  }

  return (
    <div>
      <select id="warehouse" value={warehouse} onChange={(e) => setWarehouse(e.target.value)}>
        {warehouses.map((w) => <option key={w} value={w}>{w}</option>)}
      </select>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} />
      {loading && <p id="status">loading</p>}
      <p id="count">{shown.length} of {parts.length}</p>
      <p id="total">{total.toFixed(2)}</p>
      {!loading && (
        <ul id="list">
          {shown.map((p, i) => <Row key={`${p.name}-${i}`} part={p} />)}
        </ul>
      )}
    </div>
  );
}

module.exports = { Restock, STOCK, setFailNext };
