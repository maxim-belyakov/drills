// report.reference.js - as a senior would write it. Read AFTER your own is green.
const { fetchOrderIds, fetchOrder } = require("./api.js");

const CONCURRENCY = 5;
const TOP_N = 3;
const round2 = (n) => Math.round(n * 100) / 100;

// Bounded concurrency. Takes a FUNCTION per item, not a ready promise:
// a promise starts working when it is created, so only lazy work can be throttled.
async function mapWithLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;          // claim an index
      out[i] = await fn(items[i]); // and only now start the call
    }
  };
  await Promise.all(Array.from({ length: limit }, worker));
  return out;                    // same order as items, no index juggling needed
}

// One order -> either {ok:true, order} or {ok:false, id}.
// The failure is turned into a value HERE, next to the id that caused it.
const fetchSafely = (id) =>
  fetchOrder(id).then(
    (order) => ({ ok: true, order }),
    () => ({ ok: false, id })
  );

const countBy = (list, keyOf) =>
  list.reduce((acc, x) => { acc[keyOf(x)] = (acc[keyOf(x)] ?? 0) + 1; return acc; }, {});

const sumBy = (list, keyOf, valueOf) =>
  list.reduce((acc, x) => { acc[keyOf(x)] = (acc[keyOf(x)] ?? 0) + valueOf(x); return acc; }, {});

async function buildReport() {
  const ids = await fetchOrderIds();
  const settled = await mapWithLimit(ids, CONCURRENCY, fetchSafely);

  const orders = settled.filter((r) => r.ok).map((r) => r.order);
  const failed = settled.filter((r) => !r.ok).map((r) => r.id);

  const paid = orders.filter((o) => o.status === "paid");

  const totalRevenue = round2(paid.reduce((sum, o) => sum + o.amount, 0));
  const byStatus = countBy(orders, (o) => o.status);

  const spentByCustomer = sumBy(paid, (o) => o.customer, (o) => o.amount);
  const topCustomers = Object.entries(spentByCustomer)
    .map(([name, spent]) => ({ name, spent: round2(spent) }))
    .sort((a, b) => b.spent - a.spent || a.name.localeCompare(b.name))
    .slice(0, TOP_N);

  return { totalRevenue, byStatus, topCustomers, failed };
}

module.exports = { buildReport };
