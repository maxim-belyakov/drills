// Java drill J7 - grouping with streams, cold.
//
// Built 28.09.2026, the evening of the Fresha Stage 1 round. The practical block
// there was one query - top venues by number of bookings in the last 30 days -
// and it did not get written. This drill is the SAME shape in Java, where the
// hands already live: filter rows, pile them by key, count the piles, sort, cut.
// SQL and streams are the same four moves in a different order of words.
//
// Green criterion, two parts: written cold, and narrated out loud while writing.
// Green in silence is a repeat.
//
// Run, from anywhere:
//       ~/Documents/my-repos/code-challenges/2026.07/drills/j J7Streams
//       from inside java-1-storage:  ../j J7Streams
//
// RUN IT FIRST, BEFORE WRITING ANYTHING. A method left as `return null;` is
// reported "not written yet", not FAIL. Run after EVERY method, not at the end.
//
// The four moves, and their SQL twins:
//     .filter(...)                        WHERE
//     .collect(groupingBy(key, ...))      GROUP BY
//     .sorted(comparator)                 ORDER BY
//     .limit(n)                           LIMIT

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.*;

import javax.print.Doc;

import static java.util.stream.Collectors.*;

public class J7Streams {

    record Booking(String venue, LocalDate date, BigDecimal amount) {}

    // --- 1 ----------------------------------------------------------
    // How many bookings each venue has.
    // countByVenue(DATA) -> {Aurora=2, Bliss=2, Cocoon=2, Dew=1}
    // One collector, no loop.
    static Map<String, Long> countByVenue(List<Booking> bookings) {
        return bookings.stream().collect(groupingBy(Booking::venue, counting()));
    }

    // --- 2 ----------------------------------------------------------
    // Only the bookings ON or AFTER the given date. The boundary is INCLUSIVE:
    // a booking exactly on `from` stays.
    // bookingsSince(DATA, 2026-09-11) -> 4 bookings
    static List<Booking> bookingsSince(List<Booking> bookings, LocalDate from) {
        return bookings.stream().filter(b -> !b.date().isBefore(from)).toList();
    }

    // --- 3 ----------------------------------------------------------
    // The n venues with the most bookings, most first.
    // Equal counts are broken by name, A before Z - so the answer is stable
    // rather than "whatever the map happened to give".
    // topVenues(DATA, 2) -> [Aurora, Bliss]
    static List<String> topVenues(List<Booking> bookings, int n) {
        return countByVenue(bookings).entrySet().stream()
        .sorted(Map.Entry.<String, Long>comparingByValue().reversed()
                .thenComparing(Map.Entry.comparingByKey()))
        .limit(n)
        .map(Map.Entry::getKey)
        .toList();
    }

    // --- 4 ----------------------------------------------------------
    // Money per venue, EXACT. Aurora is 19.99 + 0.01, and the expected answer
    // is 20.00 - not 20.000000000000004.
    // revenueByVenue(DATA) -> {Aurora=20.00, Bliss=150.00, Cocoon=20.30, Dew=5.00}
    static Map<String, BigDecimal> revenueByVenue(List<Booking> bookings) {
        return bookings.stream()
        .collect(groupingBy(Booking::venue,
                 reducing(BigDecimal.ZERO, Booking::amount, BigDecimal::add)));
    }

    // --- 5 ----------------------------------------------------------
    // Every venue name once, alphabetical, comma and space between them.
    // venueLine(DATA) -> "Aurora, Bliss, Cocoon, Dew"
    static String venueLine(List<Booking> bookings) {
        return bookings.stream()
        .map(Booking::venue)
        .distinct()
        .sorted()
        .collect(joining(", "));
    }

    // --- 6, spoken, nothing to write --------------------------------
    // Say out loud, before running the checks:
    //   a) groupingBy takes a key function and a DOWNSTREAM collector. Name three
    //      downstream collectors and what each one leaves in the map.
    //   b) A stream is consumed once. What happens if you reuse it, and what is
    //      the difference between an intermediate and a terminal operation?
    //   c) Write the same answer as task 3 in SQL, out loud, clause by clause.

    // ================================================================
    // Do not touch below. This is the check.

    static final List<Booking> DATA = List.of(
        new Booking("Aurora", LocalDate.of(2026, 9, 1),  new BigDecimal("19.99")),
        new Booking("Bliss",  LocalDate.of(2026, 8, 20), new BigDecimal("50.00")),
        new Booking("Cocoon", LocalDate.of(2026, 9, 10), new BigDecimal("10.10")),
        new Booking("Cocoon", LocalDate.of(2026, 9, 11), new BigDecimal("10.20")),
        new Booking("Dew",    LocalDate.of(2026, 9, 12), new BigDecimal("5.00")),
        new Booking("Aurora", LocalDate.of(2026, 9, 15), new BigDecimal("0.01")),
        new Booking("Bliss",  LocalDate.of(2026, 9, 20), new BigDecimal("100.00"))
    );

    public static void main(String[] args) {
        int ok = 0, failed = 0, todo = 0;

        Object[][] cases = {
            {"1. countByVenue", (Supplier) () -> countByVenue(DATA),
                "{Aurora=2, Bliss=2, Cocoon=2, Dew=1}"},
            {"2. bookingsSince keeps the boundary day", (Supplier) () -> {
                List<Booking> r = bookingsSince(DATA, LocalDate.of(2026, 9, 11));
                return r == null ? null : r.stream().map(Booking::venue).sorted().collect(joining(","));
            }, "Aurora,Bliss,Cocoon,Dew"},
            {"3. topVenues, ties broken by name", (Supplier) () -> topVenues(DATA, 2),
                List.of("Aurora", "Bliss")},
            {"4. revenueByVenue is exact", (Supplier) () -> {
                Map<String, BigDecimal> r = revenueByVenue(DATA);
                return r == null ? null : sorted(r);
            }, "{Aurora=20.00, Bliss=150.00, Cocoon=20.30, Dew=5.00}"},
            {"5. venueLine", (Supplier) () -> venueLine(DATA), "Aurora, Bliss, Cocoon, Dew"},
        };

        for (Object[] c : cases) {
            String name = (String) c[0];
            Object expected = c[2];
            Object actual;
            try {
                actual = ((Supplier) c[1]).get();
            } catch (Throwable t) {
                failed++;
                System.out.println("  ERR  " + name + " - it threw, so nothing was compared");
                System.out.println("       " + t.getClass().getSimpleName() + ": " + t.getMessage());
                continue;
            }
            if (actual == null) {
                todo++;
                System.out.println("  ..   " + name + " - not written yet");
                continue;
            }
            Object a = actual instanceof Map<?, ?> m ? sorted(m) : actual;
            if (a.toString().equals(expected.toString())) {
                ok++;
                System.out.println("  OK   " + name);
            } else {
                failed++;
                System.out.println("  FAIL " + name);
                System.out.println("       expected: " + expected);
                System.out.println("       received: " + a);
            }
        }

        System.out.println();
        if (failed > 0) System.out.println("Failed: " + failed + ". Fix and run again.");
        else if (todo > 0) System.out.println(ok + " green, " + todo + " still to write. Run again after each one.");
        else System.out.println("All green. Was it narrated out loud? If not, it is a repeat.");
        System.out.println();
    }

    // a map printed in a stable order, so the comparison does not depend on hashing
    static String sorted(Map<?, ?> m) {
        return m.entrySet().stream()
                .sorted(Comparator.comparing(e -> String.valueOf(e.getKey())))
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(joining(", ", "{", "}"));
    }

    interface Supplier { Object get(); }
}
