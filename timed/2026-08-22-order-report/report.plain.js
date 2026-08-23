// report.plain.js - the same result, using ONLY what drills 01-14 already covered.
// No Array.from with a mapper, no two-argument .then, no extracted helpers.
const { fetchOrderIds, fetchOrder } = require("./api.js");

const CONCURRENCY = 5;

// Drill 12: try/catch in async code. A failure becomes a value instead of an exception.
async function fetchSafely(id) {
  try {
    const order = await fetchOrder(id);
    return { ok: true, order };
  } catch {
    return { ok: false, id };
  }
}

// Bounded concurrency, written out longhand.
// `limit` workers share one queue. Each takes the next index and calls for it.
async function mapWithLimit(items, limit, fn) {
  const out = [];
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const i = next;
      next = next + 1;          // claim the index BEFORE awaiting
      out[i] = await fn(items[i]);
    }
  }

  const workers = [];
  for (let w = 0; w < limit; w++) {
    workers.push(worker());     // starts running immediately - promises are eager
  }
  await Promise.all(workers);   // wait for all five to run out of work

  return out;
}

async function buildReport() {
  const ids = await fetchOrderIds();
  const settled = await mapWithLimit(ids, CONCURRENCY, fetchSafely);

  // Drill 02: filter. Split into what we got and what we did not.
  const orders = settled.filter((r) => r.ok).map((r) => r.order);
  const failed = settled.filter((r) => !r.ok).map((r) => r.id);
  const paid = orders.filter((o) => o.status === "paid");

  // Drill 03: reduce to a single value.
  const totalRevenue = paid.reduce((sum, o) => sum + o.amount, 0);

  // Drill 04: reduce to a counter object.
  const byStatus = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  // Drill 04 again, summing instead of counting.
  const spentByCustomer = paid.reduce((acc, o) => {
    acc[o.customer] = (acc[o.customer] ?? 0) + o.amount;
    return acc;
  }, {});

  // Drill 08: sort with a tie-breaker.
  const topCustomers = Object.entries(spentByCustomer)
    .map(([name, spent]) => ({ name, spent }))
    .sort((a, b) => b.spent - a.spent || a.name.localeCompare(b.name))
    .slice(0, 3);

  return { totalRevenue, byStatus, topCustomers, failed };
}

module.exports = { buildReport };
