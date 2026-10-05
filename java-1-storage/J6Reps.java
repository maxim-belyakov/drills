// Java drill J6Reps - ten short queries, five clauses, nothing else.
//
// Built 2026-10-04 on request: "I need to get better at writing a plain query
// before subqueries." So there are no subqueries here, no window functions and
// no LEFT JOIN. Only the five clauses from J6Steps, on a schema you have not
// seen, ten times over.
//
// THIRTY SECONDS EACH, not ninety. If one takes longer than a minute, stop and
// say which word you are missing - that is the finding, not the query.
//
// Run, from anywhere, no cd needed:
//       ~/Documents/my-repos/code-challenges/2026.07/drills/j J6Reps
//       from inside java-1-storage:  ../j J6Reps
//       one task:  ../j J6Reps 7
//       the data:  ../j J6Reps data
//
// RUN IT FIRST, BEFORE WRITING ANYTHING. Then after every query, not at the end.
// A query left as `return null;` is reported "not written yet", not FAIL.

// CLAUSE ORDER IS FIXED:
//
//     SELECT  ->  FROM  ->  JOIN  ->  WHERE  ->  GROUP BY  ->  HAVING  ->  ORDER BY
//
// written in that order, computed as: FROM, JOIN, WHERE, GROUP BY, HAVING,
// SELECT, ORDER BY. WHERE sees rows, HAVING sees groups.

import java.math.BigDecimal;
import java.sql.*;
import java.util.*;

public class J6Reps {

    // ================== THE SCHEMA ==================
    //
    // item(id INT, name VARCHAR, category VARCHAR, price DECIMAL(6,2))
    // category in coffee | pastry | tea
    //
    // line(id INT, item_id INT, qty INT, sold_on DATE, channel VARCHAR)
    // channel in shop | app
    //
    // A cafe. `item` is the menu, `line` is one position of one receipt.
    // Print both tables with: ../j J6Reps data

    // --- 1 ---------------------------------------------------------
    // Every item: name and price. Most expensive first.
    // 7 rows.

    static String q1() {
        return """
                SELECT name, price FROM item ORDER BY price DESC
                    """;
    }

    // --- 2 ---------------------------------------------------------
    // Only the coffee: name and price, alphabetical by name.
    // 3 rows.

    static String q2() {
        return """
                SELECT name, price FROM item WHERE category = 'coffee' ORDER BY name
                    """;
    }

    // --- 3 ---------------------------------------------------------
    // Items that cost less than 3.00: name and price, cheapest first.
    // 3 rows.

    static String q3() {
        return """
                SELECT name, price FROM item WHERE price < 3.00 ORDER BY price
                """;
    }

    // --- 4 ---------------------------------------------------------
    // How many items are in each category. Columns: category, count.
    // Order by category.
    // 3 rows.

    static String q4() {
        return """
                SELECT category, count(*) FROM item GROUP BY category ORDER BY category
                """;
    }

    // --- 5 ---------------------------------------------------------
    // Per category: how many items and the total of their prices.
    // Keep only categories with 3 or more items. Columns: category, count, total.
    // Order by category.
    // 1 row. Pastry and tea have 2 items each and drop.

    static String q5() {
        return """
                SELECT category, count(*), sum(price) FROM item GROUP BY category 
                HAVING count(*) >= 3 ORDER BY category
                """;
    }

    // --- 6 ---------------------------------------------------------
    // Every app line with the name of its item.
    // Columns: line id, item name, qty. Order by line id.
    // 4 rows.

    static String q6() {
        return """
                SELECT l.id, i.name, l.qty FROM item i JOIN line l
                ON i.id = l.item_id WHERE channel = 'app' ORDER BY l.id
                """;
    }

    // --- 7 ---------------------------------------------------------
    // How many units of each item were sold in total, across both channels.
    // Columns: item name, total qty. Biggest total first, and on a tie the
    // name alphabetically - say the tie-break out loud before you write it.
    // 5 rows. Two items are never on a receipt and are simply absent.
    //
    // MEASURED BLIND SPOT, stated so you do not trust the green: H2 returns
    // groups in key order, so this check passes WITHOUT the tie-break too. Write
    // it because the task asks for it. On Postgres with a parallel plan, or on
    // any engine after the table grows, the same query without `, name` returns
    // the tied rows in whatever order it likes.

    static String q7() {
        return """
                SELECT i.name, sum(l.qty) AS total_qty
                FROM item i 
                JOIN line l ON i.id = l.item_id
                GROUP BY i.name
                ORDER BY total_qty DESC
                """;
    }

    // --- 8 ---------------------------------------------------------
    // Per channel: how many lines and how many units.
    // Columns: channel, lines, units. Order by channel.
    // 2 rows.

    static String q8() {
        return """
                SELECT channel, COUNT(*) AS lines, SUM(qty) AS units
                FROM line
                GROUP BY channel
                ORDER BY channel ASC
                """;
    }

    // --- 9 ---------------------------------------------------------
    // Same as 7, but keep only items with 5 or more units sold in total.
    // Columns: item name, total qty. Biggest first, ties by name.
    // 3 rows.
    //
    // Out loud: which of your two filters is in WHERE and which is in HAVING,
    // and why they cannot swap.

    static String q9() {
        return """
                SELECT i.name, SUM(l.qty) AS total_qty
                FROM item i
                JOIN line l ON i.id = l.item_id
                GROUP BY i.id, i.name
                HAVING SUM(l.qty) >= 5
                ORDER BY total_qty DESC, i.name ASC
                """;
    }

    // --- 10 --------------------------------------------------------
    // The days on which anything was sold through the app, each day once,
    // earliest first. One column. The column is `sold_on` - `day` is a reserved
    // word, which is why it is not called that.
    // 3 rows, and there are 4 app lines - which is the whole point.

    static String q10() {
        return """
                SELECT DISTINCT sold_on
                FROM line
                WHERE channel = 'app'
                ORDER BY sold_on ASC
                """;
    }

    // ================== RUNNER - do not edit ==================

    record Check(String name, String sql, List<String> expected) {
    }

    public static void main(String[] args) throws Exception {
        try (Connection cn = DriverManager.getConnection("jdbc:h2:mem:j6r", "sa", "")) {
            seed(cn);
            if (args.length > 0 && args[0].equals("data")) {
                printData(cn);
                return;
            }

            List<Check> checks = List.of(
                    new Check("1  every item by price", q1(), List.of(
                            "Flat white | 4.8", "Latte | 4.5", "Cheesecake | 4.2", "Croissant | 3.6",
                            "Espresso | 2.9", "Mint tea | 2.8", "Earl Grey | 2.5")),
                    new Check("2  coffee only, alphabetical", q2(), List.of(
                            "Espresso | 2.9", "Flat white | 4.8", "Latte | 4.5")),
                    new Check("3  under three, cheapest first", q3(), List.of(
                            "Earl Grey | 2.5", "Mint tea | 2.8", "Espresso | 2.9")),
                    new Check("4  items per category", q4(), List.of(
                            "coffee | 3", "pastry | 2", "tea | 2")),
                    new Check("5  categories with three or more items", q5(), List.of(
                            "coffee | 3 | 12.2")),
                    new Check("6  app lines with the item name", q6(), List.of(
                            "2 | Latte | 1", "4 | Croissant | 3", "6 | Espresso | 2", "9 | Latte | 4")),
                    new Check("7  units sold per item", q7(), List.of(
                            "Latte | 8", "Croissant | 5", "Espresso | 5", "Cheesecake | 2", "Mint tea | 1")),
                    new Check("8  lines and units per channel", q8(), List.of(
                            "app | 4 | 10", "shop | 5 | 11")),
                    new Check("9  items with five or more units", q9(), List.of(
                            "Latte | 8", "Croissant | 5", "Espresso | 5")),
                    new Check("10 app days, each once", q10(), List.of(
                            "2026-03-02", "2026-03-03", "2026-03-05")));

            String only = args.length > 0 ? args[0] : null;
            System.out.println();
            int ok = 0, failed = 0, todo = 0, skipped = 0;
            for (Check c : checks) {
                if (only != null && !c.name().startsWith(only + " ")) {
                    skipped++;
                    continue;
                }
                if (c.sql() == null || c.sql().isBlank()) {
                    todo++;
                    System.out.println("  ..   " + c.name() + " - not written yet");
                    continue;
                }
                List<String> actual;
                try {
                    actual = rows(cn, c.sql());
                } catch (SQLException e) {
                    failed++;
                    System.out.println("  ERR  " + c.name() + " - " + e.getMessage().split("\n")[0]);
                    continue;
                }
                if (actual.equals(c.expected()) && !c.sql().toLowerCase().contains("order by")) {
                    failed++;
                    System.out.println("  FAIL " + c.name() + " - rows are right, but the order is luck:");
                    System.out.println("       no ORDER BY in the query, so the database may return these");
                    System.out.println("       rows in any order. Every task here names the order it wants.");
                } else if (actual.equals(c.expected())) {
                    ok++;
                    System.out.println("  OK   " + c.name());
                } else {
                    failed++;
                    System.out.println("  FAIL " + c.name());
                    System.out.println("       expected " + c.expected().size() + " rows:");
                    for (String r : c.expected())
                        System.out.println("         " + r);
                    System.out.println("       actual " + actual.size() + " rows:");
                    if (actual.isEmpty())
                        System.out.println("         (no rows)");
                    for (String r : actual)
                        System.out.println("         " + r);
                }
            }
            System.out.println();
            System.out.println("  " + ok + " green, " + failed + " red, " + todo + " not written yet"
                    + (skipped > 0 ? ", " + skipped + " skipped" : ""));
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
                      (1,'Espresso','coffee',2.90),
                      (2,'Latte','coffee',4.50),
                      (3,'Flat white','coffee',4.80),
                      (4,'Croissant','pastry',3.60),
                      (5,'Cheesecake','pastry',4.20),
                      (6,'Earl Grey','tea',2.50),
                      (7,'Mint tea','tea',2.80);
                    INSERT INTO line VALUES
                      (1,1,3,'2026-03-01','shop'),
                      (2,2,1,'2026-03-02','app'),
                      (3,4,2,'2026-03-02','shop'),
                      (4,4,3,'2026-03-03','app'),
                      (5,5,2,'2026-03-03','shop'),
                      (6,1,2,'2026-03-05','app'),
                      (7,2,3,'2026-03-05','shop'),
                      (8,7,1,'2026-03-06','shop'),
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
                for (int i = 1; i <= m.getColumnCount(); i++)
                    h.add(m.getColumnLabel(i));
                System.out.println("    " + h);
                while (rs.next()) {
                    StringJoiner j = new StringJoiner(" | ");
                    for (int i = 1; i <= m.getColumnCount(); i++)
                        j.add(norm(rs.getObject(i)));
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
                for (int i = 1; i <= n; i++)
                    j.add(norm(rs.getObject(i)));
                out.add(j.toString());
            }
        }
        return out;
    }

    static String norm(Object v) {
        if (v == null)
            return "NULL";
        if (v instanceof Number)
            return new BigDecimal(v.toString()).stripTrailingZeros().toPlainString();
        return String.valueOf(v);
    }
}
