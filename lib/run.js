// Entry point for the React drills: registers JSX, then runs the file you name.
//   npm run drill week-4-react/17-usestate.jsx
//   npm run drill week-4-react/17-usestate.jsx Greeter     <- run one check only
require("./react-harness.js");
const path = require("node:path");
const [file] = process.argv.splice(2, 1);
if (!file) { console.log("usage: npm run drill <file.jsx> [name filter]"); process.exit(1); }
require(path.resolve(process.cwd(), file));
