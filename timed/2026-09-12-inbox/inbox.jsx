// inbox.jsx - THIS is the file you fix. Someone else wrote it, it mostly works,
// and the checks say otherwise. Do not rewrite it from scratch: find the line,
// change the line.

const { React } = require("../../lib/react-harness.js");
const { useState } = React;

const MESSAGES = [
  { id: 1, from: "Alex",   subject: "Offer: LocalStack", unread: true  },
  { id: 2, from: "Inna",   subject: "QA sync on Monday", unread: false },
  { id: 3, from: "Ola",    subject: "New hire: Ola",     unread: true  },
  { id: 4, from: "Marta",  subject: "Re: invoice",       unread: false },
  { id: 5, from: "Sylwia", subject: "New laptop",        unread: true  },
  { id: 6, from: "Bot",    subject: "Weekly digest",     unread: false },
];

// One row. The star is local to the row - nobody else needs to know about it.
function Row({ message }) {
  const [starred, setStarred] = useState(false);
  return (
    <li id={`m-${message.id}`}>
      <button id={`star-${message.id}`} onClick={() => setStarred((s) => !s)}>
        {starred ? "*" : "-"}
      </button>
      {" "}{message.from}: {message.subject}
    </li>
  );
}

function Inbox({ messages, initialUnreadOnly }) {
  const [query, setQuery] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(initialUnreadOnly || true);

  const q = query.toLowerCase();
  const visible = messages.filter((m) => {
    if (q.length > 2 && !m.subject.toLowerCase().includes(q)) return false;
    if (unreadOnly && !m.unread) return false;
    return true;
  });

  const clear = () => {
    setQuery("");
    setUnreadOnly(false);
  };

  return (
    <div>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value.trim())} />
      <label>
        <input
          id="unread-only"
          type="checkbox"
          value={unreadOnly}
          onChange={(e) => setUnreadOnly(e.target.checked)}
        />
        unread only
      </label>
      <button id="clear" onClick={clear}>clear</button>
      <p id="count">{visible.length} of {messages.length}</p>
      {visible.length === 0 && <p id="empty">Nothing found</p>}
      <ul>
        {visible.map((m, i) => <Row key={i} message={m} />)}
      </ul>
    </div>
  );
}

module.exports = { MESSAGES, Inbox };
