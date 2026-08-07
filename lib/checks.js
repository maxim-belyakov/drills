// Shared check runner for the drills.
//
//   node week-1-js/05-destructuring.js          run every check
//   node week-1-js/05-destructuring.js head     run only checks whose name contains "head"
//
// A function whose body still contains the `// here` placeholder is reported as
// "not written yet" instead of failing, so a partial file gives a useful report.

const assert = require("node:assert");

const show = (v) =>
  v === undefined ? "undefined"
  : typeof v === "string" ? JSON.stringify(v)
  : Array.isArray(v) ? "[" + v.map((x) => show(x)).join(", ") + "]"
  : typeof v === "object" && v !== null ? JSON.stringify(v)
  : String(v);

const isStub = (fn) => typeof fn === "function" && /\/\/\s*here\b/.test(fn.toString());

function runChecks(checks) {
  const only = process.argv[2];
  const selected = only
    ? checks.filter((c) => c.name.toLowerCase().includes(only.toLowerCase()))
    : checks;

  if (!selected.length) {
    console.log(`\nNo check matches "${only}". Names: ${checks.map((c) => c.name).join(", ")}\n`);
    return;
  }

  let failed = 0;
  let todo = 0;
  let ok = 0;

  for (const { name, fn, run, expected } of selected) {
    if (isStub(fn)) {
      todo++;
      console.log(`  ..   ${name} - not written yet`);
      continue;
    }
    let actual;
    let threw = null;
    try {
      actual = run();
    } catch (err) {
      threw = err;
    }
    if (threw) {
      failed++;
      console.log(`  ERR  ${name} - it threw, so nothing was compared`);
      console.log(`       ${threw.name}: ${threw.message}`);
      continue;
    }
    try {
      assert.deepStrictEqual(actual, expected);
      ok++;
      console.log(`  OK   ${name}`);
    } catch {
      failed++;
      console.log(`  FAIL ${name}`);
      console.log(`       expected: ${show(expected)}`);
      console.log(`       received: ${show(actual)}`);
    }
  }

  console.log("");
  if (failed) console.log(`Failed: ${failed}. Fix and run again.`);
  else if (todo) console.log(`${ok} green, ${todo} still to write. Run again after each one.`);
  else console.log("All green. Was it narrated out loud? If not, it is 🔁");
  console.log("");
}

module.exports = { runChecks, show, isStub };
