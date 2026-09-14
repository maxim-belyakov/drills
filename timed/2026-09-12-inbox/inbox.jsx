// inbox.jsx - THIS is the file you fix. Someone else wrote it, it mostly works,
// and the checks say otherwise. Do not rewrite it from scratch: find the line,
// change the line.

const { React } = require("../../lib/react-harness.js");
const { useState } = React;

const MESSAGES = [
  { id: 1, from: "Alex", subject: "Offer: LocalStack", unread: true },
  { id: 2, from: "Inna", subject: "QA sync on Monday", unread: false },
  { id: 3, from: "Ola", subject: "New hire: Ola", unread: true },
  { id: 4, from: "Marta", subject: "Re: invoice", unread: false },
  { id: 5, from: "Sylwia", subject: "New laptop", unread: true },
  { id: 6, from: "Bot", subject: "Weekly digest", unread: false },
];

// One row. The star is local to the row - nobody else needs to know about it.
function Row({ message }) {
  const [starred, setStarred] = useState(false);
  return (
    <li id={`m-${message.id}`}>
      <button id={`star-${message.id}`} onClick={() => setStarred(prev => !prev)}>
        {starred ? "*" : "-"}
      </button>
      {" "}{message.from}: {message.subject}
    </li>
  );
}

function Inbox({ messages, initialUnreadOnly }) {
  const [query, setQuery] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(initialUnreadOnly || false);
  const q = query.trim().toLowerCase();

  const visibleMessages = messages.filter((m) => {
    if (q && !m.subject.toLowerCase().includes(q)) return false;
    if (unreadOnly && !m.unread) return false;

    return true;
  });

  const handleClear = () => {
    setQuery("");
    setUnreadOnly(false);
  };


  return (
    <div>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} />
      <label>
        <input
          id="unread-only"
          type="checkbox"
          checked={unreadOnly}
          onChange={(e) => setUnreadOnly(e.target.checked)}
        />
        unread only
      </label>
      <button id="clear" onClick={handleClear}>clear</button>
      <p id="count">{visibleMessages.length} of {messages.length}</p>
      {visibleMessages.length === 0 && <p id="empty">Nothing found</p>}
      <ul>
        {visibleMessages.map((m) => <Row key={m.id} message={m} />)}
      </ul>
    </div>
  );
}

module.exports = { MESSAGES, Inbox };
