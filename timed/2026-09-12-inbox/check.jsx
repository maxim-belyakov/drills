// check.jsx - GIVEN. Do not edit.
// Run: npm run drill timed/2026-09-12-inbox/check.jsx        (add a word to run one check)

const { render } = require("../../lib/react-harness.js");
const { runChecks } = require("../../lib/checks");
const { MESSAGES, Inbox } = require("./inbox.jsx");

// every check gets its own untouched copy of the data
const fresh = () => MESSAGES.map((m) => ({ ...m }));
const ids = (s) => s.all("li").map((li) => li.id.replace("m-", "")).join(",");
// types ONE more character into the field, on top of what the field shows right now
const typeMore = (s, extra) => s.type("#q", s.find("#q").value + extra);

runChecks([
  { name: "1. mounts with the box OFF when told so, and shows everything", fn: Inbox, run: () => {
      const s = render(<Inbox messages={fresh()} initialUnreadOnly={false} />);
      const out = { ticked: s.find("#unread-only").checked, order: ids(s), count: s.find("#count").textContent };
      s.unmount();
      return out;
    }, expected: { ticked: false, order: "1,2,3,4,5,6", count: "6 of 6" } },

  { name: "2. mounts with the box ON when told so", fn: Inbox, run: () => {
      const s = render(<Inbox messages={fresh()} initialUnreadOnly={true} />);
      const out = { ticked: s.find("#unread-only").checked, order: ids(s), count: s.find("#count").textContent };
      s.unmount();
      return out;
    }, expected: { ticked: true, order: "1,3,5", count: "3 of 6" } },

  { name: "3. a three-letter query filters the subject, ignoring case", fn: Inbox, run: () => {
      const s = render(<Inbox messages={fresh()} initialUnreadOnly={false} />);
      s.type("#q", "OLA");
      const out = { order: ids(s), count: s.find("#count").textContent };
      s.unmount();
      return out;
    }, expected: { order: "3", count: "1 of 6" } },

  { name: "4. a two-letter query filters too", fn: Inbox, run: () => {
      const s = render(<Inbox messages={fresh()} initialUnreadOnly={false} />);
      s.type("#q", "qa");
      const out = { order: ids(s), count: s.find("#count").textContent };
      s.unmount();
      return out;
    }, expected: { order: "2", count: "1 of 6" } },

  { name: "5. a space can be typed into the field", fn: Inbox, run: () => {
      const s = render(<Inbox messages={fresh()} initialUnreadOnly={false} />);
      s.type("#q", "new ");
      typeMore(s, "h");
      const out = { field: s.find("#q").value, order: ids(s) };
      s.unmount();
      return out;
    }, expected: { field: "new h", order: "3" } },

  { name: "6. clear unticks the BOX, not only the state", fn: Inbox, run: () => {
      const s = render(<Inbox messages={fresh()} initialUnreadOnly={false} />);
      s.click("#unread-only");
      s.type("#q", "new");
      s.click("#clear");
      const out = { ticked: s.find("#unread-only").checked, field: s.find("#q").value, order: ids(s) };
      s.unmount();
      return out;
    }, expected: { ticked: false, field: "", order: "1,2,3,4,5,6" } },

  { name: "7. the star stays on its own message after filtering", fn: Inbox, run: () => {
      const s = render(<Inbox messages={fresh()} initialUnreadOnly={false} />);
      s.click("#star-3");
      s.type("#q", "new");
      const out = { three: s.find("#star-3").textContent, five: s.find("#star-5").textContent, order: ids(s) };
      s.unmount();
      return out;
    }, expected: { three: "*", five: "-", order: "3,5" } },

  { name: "8. a new messages array is shown, and an empty result says so", fn: Inbox, run: () => {
      const s = render(<Inbox messages={fresh()} initialUnreadOnly={false} />);
      s.rerender(<Inbox messages={[{ id: 7, from: "Q", subject: "Ping", unread: true }]} initialUnreadOnly={false} />);
      const after = { order: ids(s), count: s.find("#count").textContent };
      s.type("#q", "zzz");
      const out = { ...after, rows: s.all("li").length, empty: s.container.querySelector("#empty") !== null };
      s.unmount();
      return out;
    }, expected: { order: "7", count: "1 of 1", rows: 0, empty: true } },
]);
