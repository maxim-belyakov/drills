// report.js - THIS is the file you write. 45 minutes on the clock.
//
// You have api.js. It gives you three things:
//
//   fetchOrderIds()   -> Promise<number[]>          all order ids
//   fetchOrder(id)    -> Promise<Order>             one order, ~40 ms
//                        THROWS for some ids (the upstream is flaky)
//
//   Order = { id, customer, amount, status }
//   status is one of "paid" | "pending" | "cancelled"
//
// Build and export ONE function:
//
//   async function buildReport() -> {
//     totalRevenue: number,
//        sum of `amount` over PAID orders only, rounded to 2 decimals
//
//     byStatus: { paid: number, pending: number, cancelled: number },
//        how many orders in each status. Only orders you actually got.
//        Key order in the object does not matter.
//
//     topCustomers: [{ name: string, spent: number }, ...],
//        3 biggest spenders, counting PAID orders only.
//        spent rounded to 2 decimals.
//        sort: spent descending; on a tie, name ascending (A before Z).
//
//     failed: number[],
//        ids that could not be fetched, ascending.
//   }
//
// HARD CONSTRAINTS - check.js enforces all of them:
//   1. one fetchOrder call per id. Not zero, not two.
//   2. never more than 5 requests in flight at the same time.
//   3. never fewer than 2 in flight at peak. One-at-a-time is a fail.
//   4. whole thing under 500 ms.
//   5. a failing order must not kill the report.
//
// Run: node check.js
// Narrate out loud while you type.

const { fetchOrderIds, fetchOrder } = require("./api");

async function buildReport() {
  let totalRevenue = 0;
  let byStatus = {};
  let topCustomers;
  let failed = [];

  const orderIds = await fetchOrderIds();
  const orders = [];
  for (let i = 1; i < orderIds.length; i += 5) {
    let potentialIds = []
    for (let j = i; j < i + 5; j++) {
      if (!!orderIds[j - 1]) potentialIds.push(j);
    }
    const promises = potentialIds.map(o => fetchOrder(o));
    const response = await Promise.allSettled(promises);
    orders.push(...response.map((item, index) => {
      return { ...item, id: i + index }
    }))
  }

  orders.forEach(item => {
    if (item.reason) {
      failed.push(item.id);
    }
    if (item?.value?.status) {
      byStatus[item?.value?.status] ??= 0;
      byStatus[item?.value?.status] = byStatus[item?.value?.status] + 1
    }
    if (item?.value?.amount) {
      console.log('item?.value?.amount', item?.value?.amount)
      totalRevenue += item.value.amount
    }

  });
  
  return [
    totalRevenue,
    byStatus,
    failed
  ]

}

module.exports = { buildReport };
