# FE1 State placement - where each piece of frontend state lives

First pass: theory and a worked example in the session message, then this task cold. Repeat later without the theory.

Why this drill: OLX system design, 15.10.2026, Senior Frontend role. Question: "if you have more app-like functionality, how would you store the local state?" First answer was "local storage, cookies". The interviewer had to ask three times. The knowledge was there; the classification was not ready to say.



# Task 1 - classify (10 minutes)

The OLX search results page for apartments in Warsaw. For each piece of state, name where it lives and say why in one short line.

1. The filters the buyer chose: price range, rooms, district
2. The current page of results (page 3 of 40)
3. The list of listings returned for those filters
4. Whether the "Save search" modal is open
5. The text typed into the "Save search" name field, before submit
6. The logged-in user (id, name, avatar)
7. The listing ids the buyer marked as favourite
8. "Map view" or "list view" toggle, remembered next time the buyer comes back
9. Which listing card the mouse is hovering over (it highlights the pin on the map)
10. Cookie consent accepted or not

Places to choose from: useState in the component · lifted state or Context · global client store (Redux Toolkit or Zustand) · server state cache (React Query) · URL (search params) · localStorage · cookie



# Task 2 - say it (90 seconds, out loud, recorded)

Answer the original question as if Mikołaj asked it again: "If you have more app-like functionality, how would you store the local state?"



# Green - must be heard

1. A sorting question first: "who needs this state, and how long must it live?"
2. useState for state one component owns (modal open, input text, hover)
3. Lift up or Context when a few nearby components share it, and the re-render cost of Context named
4. Server state is not client state: React Query (or SWR) for the listings, with caching, staleness and refetch
5. The URL for filters and pagination, because it is shareable, survives refresh, works with back, and is indexable for SEO
6. A global store only for real cross-page client state, not for copies of server data
7. localStorage only to persist a preference across visits, never as the primary state
8. One concrete OLX example per category

Score: count the greens. 6 or more out of 8 on the first cold pass is good.
