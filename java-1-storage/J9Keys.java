// J9 - keys and lists. A probe, not a drill: nothing to write, everything to predict.
//
// Built 2026-10-05, the evening before the EPAM Java round. Two topics only,
// the two most likely to be asked and the two with the shortest answers.
//
// Run:  ./j J9Keys          from inside java-1-storage:  ../j J9Keys
//
// HOW TO USE IT, and the order matters:
//   1. Read block 1 below and write your prediction for all nine lines INTO THE
//      COMMENT at the top of block 1. Do not edit it afterwards.
//   2. Run the file. Compare.
//   3. Write the rule at the bottom, in your own words, after seeing the output.
//
// This is the same format as the two JS probes that worked: 2026-09-25 took him
// from 4 of 9 to 8 of 9 in one hour, 2026-09-30 closed a four-time miss.

import java.util.*;

public class J9Keys {

    // ===================== BLOCK 1: keys =====================
    //
    // YOUR PREDICTION - write it here first, nine lines, then run.
    // For each line: the value, and in three words WHY.
    //
    //   1.
    //   2.
    //   3.
    //   4.
    //   5.
    //   6.
    //   7.
    //   8.
    //   9.

    // Only equals is overridden. hashCode is whatever Object gave it.
    static final class Half {
        final String sku;
        Half(String sku) { this.sku = sku; }
        @Override public boolean equals(Object o) { return o instanceof Half h && h.sku.equals(sku); }
    }

    // Both overridden, the way the contract asks.
    static final class Whole {
        final String sku;
        Whole(String sku) { this.sku = sku; }
        @Override public boolean equals(Object o) { return o instanceof Whole w && w.sku.equals(sku); }
        @Override public int hashCode() { return sku.hashCode(); }
    }

    // A record writes equals and hashCode for you, from its components.
    record Rec(String sku) {}

    static void blockOne() {
        say("--- BLOCK 1: keys");

        Map<Half, String> half = new HashMap<>();
        half.put(new Half("N-1"), "bearing");
        show("1. new Half(N-1).equals(new Half(N-1))", new Half("N-1").equals(new Half("N-1")));
        show("2. half.get(new Half(N-1))", half.get(new Half("N-1")));
        show("3. half.size()", half.size());

        Map<Whole, String> whole = new HashMap<>();
        whole.put(new Whole("N-1"), "bearing");
        show("4. whole.get(new Whole(N-1))", whole.get(new Whole("N-1")));

        Map<Rec, String> rec = new HashMap<>();
        rec.put(new Rec("N-1"), "bearing");
        show("5. rec.get(new Rec(N-1))", rec.get(new Rec("N-1")));

        // the other half of the contract: a key that changes after the put
        List<String> movable = new ArrayList<>(List.of("a"));
        Map<List<String>, String> byList = new HashMap<>();
        byList.put(movable, "found me");
        show("6. byList.get(movable), before the change", byList.get(movable));
        movable.add("b");
        show("7. byList.get(movable), after movable.add(b)", byList.get(movable));
        show("8. byList.size() after the change", byList.size());
        show("9. byList.remove(movable)", byList.remove(movable));
    }

    // ===================== BLOCK 2: lists =====================
    //
    // YOUR PREDICTION - for each of the four rows, which of the two is faster,
    // and roughly by how much. Order of magnitude is enough: same, ten times,
    // a thousand times.
    //
    //   get(i) by index      :
    //   add at the front     :
    //   remove from middle   :
    //   walk the whole list  :

    static void blockTwo() {
        say("\n--- BLOCK 2: lists, 200000 elements");
        int n = 200_000;
        List<Integer> al = new ArrayList<>(), ll = new LinkedList<>();
        for (int i = 0; i < n; i++) { al.add(i); ll.add(i); }

        row("get(i) by index   ",
            ms(() -> { Random r = new Random(1); long t = 0;
                       for (int i = 0; i < 20_000; i++) t += al.get(r.nextInt(n)); return t; }),
            ms(() -> { Random r = new Random(1); long t = 0;
                       for (int i = 0; i < 20_000; i++) t += ll.get(r.nextInt(n)); return t; }));
        row("add at the front  ",
            ms(() -> { List<Integer> x = new ArrayList<>(al);
                       for (int i = 0; i < 20_000; i++) x.add(0, i); return (long) x.size(); }),
            ms(() -> { List<Integer> x = new LinkedList<>(ll);
                       for (int i = 0; i < 20_000; i++) x.add(0, i); return (long) x.size(); }));
        row("remove from middle",
            ms(() -> { List<Integer> x = new ArrayList<>(al);
                       for (int i = 0; i < 10_000; i++) x.remove(x.size() / 2); return (long) x.size(); }),
            ms(() -> { List<Integer> x = new LinkedList<>(ll);
                       for (int i = 0; i < 10_000; i++) x.remove(x.size() / 2); return (long) x.size(); }));
        row("walk the whole one",
            ms(() -> { long t = 0; for (int v : al) t += v; return t; }),
            ms(() -> { long t = 0; for (int v : ll) t += v; return t; }));

        say("\n    and the one case where LinkedList really is cheap to remove from:");
        row("remove via iterator",
            ms(() -> { List<Integer> x = new ArrayList<>(al); int k = 0;
                       for (Iterator<Integer> it = x.iterator(); it.hasNext(); ) { it.next();
                           if (k++ % 20 == 0) it.remove(); } return (long) x.size(); }),
            ms(() -> { List<Integer> x = new LinkedList<>(ll); int k = 0;
                       for (Iterator<Integer> it = x.iterator(); it.hasNext(); ) { it.next();
                           if (k++ % 20 == 0) it.remove(); } return (long) x.size(); }));
    }

    // ===================== THE RULES =====================
    //
    // Write these AFTER the run, in your own words. One sentence each, no lists.
    //
    //   Keys:
    //
    //   Lists:
    //
    // And the two sentences you will actually say out loud on a call:
    //
    //   "..."
    //
    //   "..."

    public static void main(String[] a) { blockOne(); blockTwo(); }

    // --- plumbing, ignore -----------------------------------------
    static void say(String s) { System.out.println(s); }
    static void show(String label, Object v) {
        System.out.println("    " + pad(label, 44) + " -> " + v);
    }
    static void row(String label, double arr, double lin) {
        System.out.printf("    %s : ArrayList %8.1f ms    LinkedList %8.1f ms%n", label, arr, lin);
    }
    static String pad(String s, int n) {
        StringBuilder b = new StringBuilder(s);
        while (b.length() < n) b.append(' ');
        return b.toString();
    }
    static double ms(java.util.function.Supplier<Long> body) {
        body.get();
        long t0 = System.nanoTime();
        body.get();
        return (System.nanoTime() - t0) / 1e6;
    }
}
