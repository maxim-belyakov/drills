// Shared check runner for the drills.
//
//   node week-1-js/05-destructuring.js          run every check
// Async-aware: a check whose run() returns a promise is awaited, and a rejected
// promise is reported as ERR just like a thrown error.
//   node week-1-js/05-destructuring.js head     run only checks whose name contains "head"
//
// A function whose body still contains the `// here` placeholder is reported as
// "not written yet" instead of failing, so a partial file gives a useful report.

const assert = require("node:assert");

// A drill may deliberately create a rejection nobody handles - that is the whole
// point of some of them. Node kills the process for that, which hides the report.
// Collect them instead and print them as information at the end.
const unhandled = [];
process.on("unhandledRejection", (reason) => {
  unhandled.push(reason instanceof Error ? `${reason.name}: ${reason.message}` : String(reason));
});

const show = (v) =>
  v === undefined ? "undefined"
  : typeof v === "string" ? JSON.stringify(v)
  : Array.isArray(v) ? "[" + v.map((x) => show(x)).join(", ") + "]"
  : v instanceof Error ? `${v.name}("${v.message}")`
  : Array.isArray(v) === false && typeof v === "object" && v !== null && Object.values(v).some((x) => x instanceof Error)
      ? "{" + Object.entries(v).map(([k, x]) => `${k}: ${show(x)}`).join(", ") + "}"
  : typeof v === "object" && v !== null ? JSON.stringify(v)
  : String(v);

// A drill file may be JSX, and esbuild strips comments while transpiling it, so the
// "// here" marker does not survive there. JSX stubs return the string marker instead.
const isStub = (fn) => typeof fn === "function" && /\/\/\s*here\b|__HERE__/.test(fn.toString());

async function runChecks(checks) {
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
      actual = await run();          // works for both sync and async drills
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

  // report after the microtask queue has drained
  setTimeout(() => {
    if (unhandled.length) {
      console.log(`  ⚠  ${unhandled.length} unhandled rejection(s) escaped: ${unhandled.join(", ")}`);
      console.log("     In a real service this is what kills the process. Node has exited on it since v15.");
      console.log("");
    }
  }, 0);
}

module.exports = { runChecks, show, isStub };
