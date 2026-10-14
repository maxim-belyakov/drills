// J6Win - three shapes the Soda prep sheet asks you to WRITE, not describe.
//
// Built 2026-10-07, 75 minutes before the Soda first tech interview, because the
// prep sheet names three query shapes and none of them has ever been typed:
//   LEFT JOIN + IS NULL  ·  ROW_NUMBER with PARTITION BY  ·  a running total.
//
// SAME SCHEMA AS J6Reps - the cafe. Nothing new to learn, only the three shapes.
//
// Run:  ./j J6Win        from inside java-1-storage:  ../j J6Win
//       ../j J6Win data  to see the tables again
//
// TWENTY MINUTES TOTAL. If one does not come in five, read the hint under it.

import java.math.BigDecimal;
import java.sql.*;
import java.util.*;

public class J6Win {

    // item(id, name, category, price)        category: coffee | pastry | tea
    // line(id, item_id, qty, sold_on, channel)   channel: shop | app

    // --- 1. The anti-join -----------------------------------------
    // Items that have NEVER been sold. Columns: name. Order by name.
    //   2 rows.
    //
    // Shape: LEFT JOIN keeps every row of the LEFT table even when the right
    // side has no match, and fills the right columns with NULL. So "never sold"
    // is "the join found nothing", which you test with IS NULL on a right-hand
    // column. Say it out loud before typing: "every item, plus its lines if any,
    // then keep only the ones where there is no line".

    static String q1() {
        return """
                SELECT i.name
                FROM item i
                LEFT JOIN line l ON i.id = l.item_id
                WHERE l.id IS NULL
                ORDER BY i.name
                """;
    }

    // --- 2. Top one per group -------------------------------------
    // The single biggest line (largest qty) in each channel.
    // Columns: channel, line id, qty. Order by channel.
    //   2 rows.
    //
    // Shape: number the rows inside each channel with
    //   row_number() OVER (PARTITION BY channel ORDER BY qty DESC)
    // and keep number 1. The numbering cannot be filtered in the same WHERE
    // that produced it, so it goes in a subquery and the filter goes outside:
    //
    //   SELECT ... FROM ( SELECT ..., row_number() OVER (...) AS rn FROM ... ) x
    //   WHERE rn = 1
    //
    // Out loud: why rn is invisible to WHERE in the inner query.

    static String q2() {
        return """
                SELECT channel, id, qty
                FROM (
                    SELECT channel, id, qty,
                        ROW_NUMBER() OVER (PARTITION BY channel ORDER BY qty DESC) AS rn
                    FROM line
                ) x
                WHERE rn = 1
                ORDER BY channel
                """;
    }

    // --- 3. The running total -------------------------------------
    // For every line, in date order, the running total of qty inside its own
    // channel. Columns: channel, sold_on, line id, qty, running total.
    // Order by channel, then sold_on, then line id.
    //   9 rows.
    //
    // Shape: sum(qty) OVER (PARTITION BY channel ORDER BY sold_on, id).
    // ORDER BY inside the brackets is what turns a total into a running total:
    // the window becomes "from the start of the group up to this row".

    static String q3() {
        return """
                SELECT channel, sold_on, id, qty,
                    SUM(qty) OVER (PARTITION BY channel ORDER BY sold_on, id) AS running_total
                FROM line
                ORDER BY channel, sold_on, id
                """;
    }

    // ================== RUNNER - do not edit ==================

    record Check(String name, String sql, List<String> expected) {}

    public static void main(String[] args) throws Exception {
        try (Connection cn = DriverManager.getConnection("jdbc:h2:mem:j6w", "sa", "")) {
            seed(cn);
            if (args.length > 0 && args[0].equals("data")) { printData(cn); return; }

            List<Check> checks = List.of(
                new Check("1  items never sold (LEFT JOIN + IS NULL)", q1(), List.of(
                    "Earl Grey", "Flat white")),
                new Check("2  biggest line per channel (ROW_NUMBER)", q2(), List.of(
                    "app | 9 | 4", "shop | 1 | 3")),
                new Check("3  running total of qty per channel", q3(), List.of(
                    "app | 2026-03-02 | 2 | 1 | 1",
                    "app | 2026-03-03 | 4 | 3 | 4",
                    "app | 2026-03-05 | 6 | 2 | 6",
                    "app | 2026-03-05 | 9 | 4 | 10",
                    "shop | 2026-03-01 | 1 | 3 | 3",
                    "shop | 2026-03-02 | 3 | 2 | 5",
                    "shop | 2026-03-03 | 5 | 2 | 7",
                    "shop | 2026-03-05 | 7 | 3 | 10",
                    "shop | 2026-03-06 | 8 | 1 | 11"))
            );

            System.out.println();
            int ok = 0, failed = 0, todo = 0;
            for (Check c : checks) {
                if (c.sql() == null || c.sql().isBlank()) {
                    todo++;
                    System.out.println("  ..   " + c.name() + " - not written yet");
                    continue;
                }
                List<String> actual;
                try { actual = rows(cn, c.sql()); }
                catch (SQLException e) {
                    failed++;
                    System.out.println("  ERR  " + c.name() + " - " + e.getMessage().split("\n")[0]);
                    continue;
                }
                if (actual.equals(c.expected()) && !c.sql().toLowerCase().contains("order by")) {
                    failed++;
                    System.out.println("  FAIL " + c.name() + " - right rows, but no ORDER BY, so the order is luck");
                } else if (actual.equals(c.expected())) {
                    ok++;
                    System.out.println("  OK   " + c.name());
                } else {
                    failed++;
                    System.out.println("  FAIL " + c.name());
                    System.out.println("       expected " + c.expected().size() + " rows:");
                    for (String r : c.expected()) System.out.println("         " + r);
                    System.out.println("       actual " + actual.size() + " rows:");
                    if (actual.isEmpty()) System.out.println("         (no rows)");
                    for (String r : actual) System.out.println("         " + r);
                }
            }
            System.out.println();
            System.out.println("  " + ok + " green, " + failed + " red, " + todo + " not written yet");
            System.out.println();
        }
    }

    static void seed(Connection cn) throws SQLException {
        try (Statement st = cn.createStatement()) {
            st.execute("""
                CREATE TABLE item (id INT PRIMARY KEY, name VARCHAR(30),
                                   category VARCHAR(10), price DECIMAL(6,2));
                CREATE TABLE line (id INT PRIMARY KEY, item_id INT REFERENCES item(id),
                                   qty INT, sold_on DATE, channel VARCHAR(5));
                INSERT INTO item VALUES
                  (1,'Espresso','coffee',2.90),(2,'Latte','coffee',4.50),
                  (3,'Flat white','coffee',4.80),(4,'Croissant','pastry',3.60),
                  (5,'Cheesecake','pastry',4.20),(6,'Earl Grey','tea',2.50),
                  (7,'Mint tea','tea',2.80);
                INSERT INTO line VALUES
                  (1,1,3,'2026-03-01','shop'),(2,2,1,'2026-03-02','app'),
                  (3,4,2,'2026-03-02','shop'),(4,4,3,'2026-03-03','app'),
                  (5,5,2,'2026-03-03','shop'),(6,1,2,'2026-03-05','app'),
                  (7,2,3,'2026-03-05','shop'),(8,7,1,'2026-03-06','shop'),
                  (9,2,4,'2026-03-05','app');
                """);
        }
    }

    static void printData(Connection cn) throws SQLException {
        for (String t : List.of("item", "line")) {
            System.out.println("\n--- " + t);
            try (Statement st = cn.createStatement();
                 ResultSet rs = st.executeQuery("SELECT * FROM " + t + " ORDER BY id")) {
                ResultSetMetaData m = rs.getMetaData();
                StringJoiner h = new StringJoiner(" | ");
                for (int i = 1; i <= m.getColumnCount(); i++) h.add(m.getColumnLabel(i));
                System.out.println("    " + h);
                while (rs.next()) {
                    StringJoiner j = new StringJoiner(" | ");
                    for (int i = 1; i <= m.getColumnCount(); i++) j.add(norm(rs.getObject(i)));
                    System.out.println("    " + j);
                }
            }
        }
        System.out.println();
    }

    static List<String> rows(Connection cn, String sql) throws SQLException {
        List<String> out = new ArrayList<>();
        try (Statement st = cn.createStatement(); ResultSet rs = st.executeQuery(sql)) {
            int n = rs.getMetaData().getColumnCount();
            while (rs.next()) {
                StringJoiner j = new StringJoiner(" | ");
                for (int i = 1; i <= n; i++) j.add(norm(rs.getObject(i)));
                out.add(j.toString());
            }
        }
        return out;
    }

    static String norm(Object v) {
        if (v == null) return "NULL";
        if (v instanceof Number) return new BigDecimal(v.toString()).stripTrailingZeros().toPlainString();
        return String.valueOf(v);
    }
}
