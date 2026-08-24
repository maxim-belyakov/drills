const items = ["a","b","c","d","e","f","g","h","i","j","k","l"];
const t0 = Date.now();
const ms = () => String(Date.now() - t0).padStart(4);
const work = (x) => new Promise(r => setTimeout(() => r(x), 100));

async function mapWithLimit(items, limit, fn) {
  const out = [];
  let next = 0;                       // ОДНА переменная на всех

  async function worker(tag) {
    while (next < items.length) {
      const i = next;
      next = next + 1;
      console.log(`${ms()} мс  воркер ${tag} взял индекс ${i} (${items[i]}),  next теперь ${next}`);
      out[i] = await fn(items[i]);
    }
    console.log(`${ms()} мс  воркер ${tag} закончил, работы больше нет`);
  }

  const workers = [];
  for (let w = 1; w <= limit; w++) workers.push(worker(w));
  await Promise.all(workers);
  return out;
}

mapWithLimit(items, 5, work).then(r => console.log("\nрезультат:", r.join(",")));
