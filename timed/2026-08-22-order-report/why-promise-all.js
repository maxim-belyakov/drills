const items = ["a","b","c","d"];
const work = (x) => new Promise(r => setTimeout(() => r(x.toUpperCase()), 100));

async function mapWithLimit(items, limit, fn, waitForThem) {
  const out = [];
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const i = next; next = next + 1;
      out[i] = await fn(items[i]);
    }
  }

  const workers = [];
  for (let w = 0; w < limit; w++) workers.push(worker());

  console.log("  после цикла:            out =", JSON.stringify(out), "  workers =", workers.map(String));

  if (waitForThem) await Promise.all(workers);

  return out;
}

(async () => {
  console.log("БЕЗ Promise.all:");
  const a = await mapWithLimit(items, 2, work, false);
  console.log("  что вернула функция:    out =", JSON.stringify(a));

  await new Promise(r => setTimeout(r, 400));
  console.log("  тот же массив 400 мс спустя:", JSON.stringify(a), " <- работа шла, просто её не дождались\n");

  console.log("С Promise.all:");
  const b = await mapWithLimit(items, 2, work, true);
  console.log("  что вернула функция:    out =", JSON.stringify(b));
})();
