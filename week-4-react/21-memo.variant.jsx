// Drill 21 - useMemo, useCallback and React.memo  (THIRD PASS, NEW DATA)
//
// Same three techniques as 21-memo.jsx, different data and three deliberate
// twists. There is no reference answer for this file anywhere - it is written
// for this session.
//
// Run:  npm run drill week-4-react/21-memo.variant.jsx

const { React } = require("../lib/react-harness.js");
const { useState, useMemo, useCallback, memo } = React;

// --- given instruments. Do not edit. ---------------------------

const log = { scanCalls: 0, badgeRenders: 0, voteRenders: 0 };

const TRACKS = [
  { title: "aurora", genre: "jazz", rating: 5 },
  { title: "bluebird", genre: "jazz", rating: 3 },
  { title: "canyon", genre: "rock", rating: 4 },
  { title: "drift", genre: "jazz", rating: 4 },
];

const slowScan = (tracks, genre, minRating) => {
  log.scanCalls++;
  return tracks.filter((t) => t.genre === genre && t.rating >= minRating);
};

const BadgeChild = memo(function BadgeChild({ tags }) {
  log.badgeRenders++;
  return <p id="badge">{tags.join("/")}</p>;
});

const VoteChild = memo(function VoteChild({ onVote }) {
  log.voteRenders++;
  return (
    <>
      <button id="up" onClick={() => onVote(1)}>up</button>
      <button id="down" onClick={() => onVote(-1)}>down</button>
    </>
  );
});

// --- 1 ----------------------------------------------------------
// <GenreCounter /> renders:
//   <input id="g">        the genre, controlled
//   <input id="r">        the minimum rating, controlled, stored as a NUMBER
//   <button id="skip">    increments an unrelated counter
//   <p id="skips">        that counter
//   <p id="hits">         how many tracks slowScan returned, from TRACKS
//
// slowScan runs on mount, and again whenever EITHER input changes - and never
// when the skip counter changes.

function GenreCounter() {
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState(0);
  const [count, setCount] = useState(0);

  const hits = useMemo(() => slowScan(TRACKS, genre, rating), [genre, rating])

  return (
    <>
      <input id="g" value={genre} onChange={(e) => setGenre(e.target.value)} />
      <input id="r" value={rating} onChange={(e) => setRating(Number(e.target.value))} />
      <button id="skip" value={count} onClick={() => setCount(prev => prev + 1)}>+</button>
      <p id="skips">{count}</p>
      <p id="hits">{hits.length}</p>
    </>
  );
}

// --- 2 ----------------------------------------------------------
// <TonePanel first="warm" second="dry" /> renders:
//   <button id="skip2">   increments an unrelated counter
//   <p id="skips2">       that counter
//   <BadgeChild tags={[first, second]} />
//
// The prop is an ARRAY this time.
//   three clicks on skip2      ->  BadgeChild rendered ONCE in total
//   a changed first or second  ->  BadgeChild renders again

function TonePanel({ first, second }) {
  const [count, setCount] = useState(0);
  const tags = useMemo(() => ([first, second]), [first, second])

  return (
    <>
      <button id="skip2" value={count} onClick={() => setCount(prev => prev + 1)}>+</button>
      <p id="skips2">{count}</p>
      <BadgeChild tags={tags} />
    </>
  );
}

// --- 3 ----------------------------------------------------------
// <VoteBox /> renders:
//   <p id="score">        a score, starts at 0
//   <VoteChild onVote={...} />   its buttons call onVote(1) and onVote(-1)
//
// The callback TAKES AN ARGUMENT this time.
//   up, up, down, up   ->  <p id="score"> says 2
//   and through all of it, VoteChild must have rendered exactly ONCE

function VoteBox() {
  const [score, setScore] = useState(0);
  const update = useCallback((update) => setScore((prev) => prev + update), []);

  return (
    <>
      <p id="score">{score}</p>
      <VoteChild onVote={update} />
    </>
  );
}

// --- 4, spoken, nothing to write --------------------------------
//   a) what does React.memo actually compare, and how deeply? Name the one
//      thing that makes it useless in practice more often than anything else.
//   b) useMemo and useCallback - say the difference in one sentence, and say
//      what useCallback(fn, deps) is in terms of useMemo.
//   c) in task 3, why does an empty dependency array work at all - what would
//      go wrong if the callback read the score directly instead?

// ----------------------------------------------------------------
// Do not touch below. This is the check.

const { render, act } = require("../lib/react-harness.js");
const { runChecks } = require("../lib/checks");

const reset = () => { log.scanCalls = 0; log.badgeRenders = 0; log.voteRenders = 0; };
const click = (s, id, n = 1) => { for (let i = 0; i < n; i++) s.click(id); };
const type = (s, id, value) => s.type(id, value);

runChecks([
  {
    name: "1. the scan ignores unrelated state", fn: GenreCounter, run: async () => {
      reset();
      const s = render(<GenreCounter />);
      const after = log.scanCalls;
      click(s, "#skip", 3);
      return { mounted: after >= 1, extra: log.scanCalls - after, skips: s.find("#skips").textContent };
    }, expected: { mounted: true, extra: 0, skips: "3" }
  },

  {
    name: "1. the scan re-runs for BOTH inputs", fn: GenreCounter, run: async () => {
      reset();
      const s = render(<GenreCounter />);
      type(s, "#g", "jazz");
      const afterGenre = log.scanCalls;
      const hitsAll = s.find("#hits").textContent;
      type(s, "#r", "4");
      const afterRating = log.scanCalls;
      return { ranOnGenre: afterGenre > 1, ranOnRating: afterRating > afterGenre, hitsAll, hitsFiltered: s.find("#hits").textContent };
    }, expected: { ranOnGenre: true, ranOnRating: true, hitsAll: "3", hitsFiltered: "2" }
  },

  {
    name: "2. the memoised child ignores unrelated state", fn: TonePanel, run: async () => {
      reset();
      const s = render(<TonePanel first="warm" second="dry" />);
      click(s, "#skip2", 3);
      return { renders: log.badgeRenders, skips: s.find("#skips2").textContent, badge: s.find("#badge").textContent };
    }, expected: { renders: 1, skips: "3", badge: "warm/dry" }
  },

  {
    name: "2. but it does re-render when a tag changes", fn: TonePanel, run: async () => {
      reset();
      const s = render(<TonePanel first="warm" second="dry" />);
      s.rerender(<TonePanel first="warm" second="dry" />);
      const afterSame = log.badgeRenders;
      s.rerender(<TonePanel first="cold" second="dry" />);
      return { afterSame, afterChange: log.badgeRenders, badge: s.find("#badge").textContent };
    }, expected: { afterSame: 1, afterChange: 2, badge: "cold/dry" }
  },

  {
    name: "3. the score follows the argument", fn: VoteBox, run: async () => {
      reset();
      const s = render(<VoteBox />);
      click(s, "#up"); click(s, "#up"); click(s, "#down"); click(s, "#up");
      return s.find("#score").textContent;
    }, expected: "2"
  },

  {
    name: "3. and the vote child rendered exactly once", fn: VoteBox, run: async () => {
      reset();
      const s = render(<VoteBox />);
      click(s, "#up"); click(s, "#up"); click(s, "#down"); click(s, "#up");
      return log.voteRenders;
    }, expected: 1
  },
]);
