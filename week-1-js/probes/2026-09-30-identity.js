// Probe: <the rule, in one line, as you would say it out loud - write this LAST>
// Written: 2026-09-30, after missing it in the opener for the fourth time.
//
// Run: node week-1-js/probes/2026-09-30-identity.js

// 1. PREDICTION - write it first, and do not edit it after the run.
//    For each of the eleven lines below, write what you expect it to print and WHY.
//    The "why" is the point: name which comparison is being used, not just the value.
//
// false
// true
// true
// false
// -1
// true
// true
// 1
// 1
// undefined
// -1
// 0

// 2. THE MEASUREMENT - given. Run it and read the output against your prediction.

const a = NaN, b = 0, c = -0;
const show = (label, value) => console.log(label.padEnd(34), "->", value);

show("NaN === NaN", NaN === NaN);
show("Object.is(NaN, NaN)", Object.is(NaN, NaN));
show("0 === -0", 0 === -0);
show("Object.is(0, -0)", Object.is(0, -0));
show("[NaN].indexOf(NaN)", [NaN].indexOf(NaN));
show("[NaN].includes(NaN)", [NaN].includes(NaN));
show("[0].includes(-0)", [0].includes(-0));
show("new Set([NaN, NaN]).size", new Set([NaN, NaN]).size);
show("new Set([0, -0]).size", new Set([0, -0]).size);
show("new Map([[NaN, 1]]).get(NaN)", new Map([[NaN, 1]]).get(NaN));
show("new Map([[0, 1]]).get(-0)", new Map([[0, 1]]).get(-0));

// Two more, because this is where it bites in real code: finding a row by a value
// that came out of a broken parse.
const rows = [{ id: "a", w: NaN }, { id: "b", w: 12 }];
show("rows.findIndex(r => r.w === NaN)", rows.findIndex((r) => r.w === NaN));
show("rows.findIndex(r => Number.isNaN(r.w))", rows.findIndex((r) => Number.isNaN(r.w)));

// 3. THE RULE - one sentence, written AFTER seeing the output.
//    Not eleven facts. One rule that produces all eleven. The rule has to name
//    how many comparison algorithms JS has and the ONLY two values they disagree about.
//
// Strict equality	===, indexOf, lastIndexOf, switch
// SameValue	Object.is
// SameValueZero	includes, Set, Map, .has
// 
// Object.is for +0 and -0 are not equal, 
// ===, indexOf, lastIndexOf, switch for NaN and NaN are NOT equal
// EVERTHING ELSE with NaN, 0, -0 is equal
