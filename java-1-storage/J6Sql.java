// Java drill J6 - SQL cold, from memory.
//
// Comes from Point72, 11.06.2026: "SQL forgotten completely". Nothing conceptual
// here, this is pure recall. Cheapest of the six Java drills.
//
// Green criterion, two parts: written cold in 90 seconds, and narrated out loud
// while writing. Green in silence is a repeat.
//
// Run:  cd ~/Documents/my-repos/code-challenges/2026.07/drills
//       java -cp lib/h2.jar java-1-storage/J6Sql.java
//
// RUN IT FIRST, BEFORE WRITING ANYTHING. The first line of every session is a
// failing test. Then run it after EVERY query, not at the end.
//
// A query left as `return null;` is reported "not written yet", not FAIL.

import java.math.BigDecimal;
import java.sql.*;
import java.util.*;

public class J6Sql {

    // ================== SCHEMA YOU ARE QUERYING ==================
    //
    //   client(id INT, name VARCHAR, country VARCHAR)
    //   txn(id INT, client_id INT, amount DECIMAL(12,2), currency VARCHAR,
    //       status VARCHAR, created_at DATE)      status in SETTLED | FAILED
    //
    // Data is printed by the runner if you pass "data" as an argument:
    //   java -cp lib/h2.jar java-1-storage/J6Sql.java data

    // --- 1 -------------------------------------------------------
    // JOIN + GROUP BY + HAVING. One statement.
    // Per client: how many SETTLED transactions and their total amount.
    // Keep only clients with 3 or more SETTLED transactions.
    // Columns, in this order: client name, count, total. Order by total, biggest first.
    //
    // Out loud while writing: why the status filter is in WHERE and the count
    // filter is in HAVING, and what would change if you swapped them.

    static String q1() {
        return null; // here
    }

    // --- 2 -------------------------------------------------------
    // Window function. One statement, no subquery needed.
    // For every SETTLED transaction: a running total of amount inside its own
    // client, accumulating in created_at order.
    // Columns, in this order: client name, txn id, amount, running total.
    // Order by client name, then created_at.
    //
    // Out loud: what PARTITION BY does that GROUP BY cannot, in one sentence.

    static String q2() {
        return null; // here
    }

    // --- 3 -------------------------------------------------------
    // Stretch, only if 1 and 2 went fast. The single largest SETTLED transaction
    // per client. Needs ROW_NUMBER() in a subquery, filtered in the outer query.
    // Columns: client name, txn id, amount. Order by client name.
    //
    // Out loud: why the rank cannot be filtered in the same WHERE that produced it.

    static String q3() {
        return null; // here
    }

    // ================== RUNNER - do not edit ==================

    record Check(String name, String sql, List<String> expected) {}

    public static void main(String[] args) throws Exception {
        try (Connection cn = DriverManager.getConnection("jdbc:h2:mem:j6", "sa", "")) {
            seed(cn);
            if (args.length > 0 && args[0].equals("data")) { dump(cn); return; }

            System.out.println();
            System.out.println("  OK   harness - H2 is up, " + scalar(cn, "SELECT count(*) FROM txn") + " transactions seeded");

            List<Check> checks = List.of(
                new Check("q1 join+group+having", q1(), List.of(
                    "Nordwind | 3 | 750",
                    "Vertex | 3 | 60")),
                new Check("q2 running total", q2(), List.of(
                    "Acme | 5 | 900 | 900",
                    "Acme | 6 | 100 | 1000",
                    "Nordwind | 1 | 100 | 100",
                    "Nordwind | 2 | 250 | 350",
                    "Nordwind | 4 | 400 | 750",
                    "Vertex | 7 | 10 | 10",
                    "Vertex | 8 | 20 | 30",
                    "Vertex | 9 | 30 | 60")),
                new Check("q3 top per client", q3(), List.of(
                    "Acme | 5 | 900",
                    "Nordwind | 4 | 400",
                    "Vertex | 9 | 30"))
            );

            int ok = 0, failed = 0, todo = 0;
            for (Check c : checks) {
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
                if (actual.equals(c.expected())) {
                    ok++;
                    System.out.println("  OK   " + c.name());
                } else {
                    failed++;
                    System.out.println("  FAIL " + c.name());
                    System.out.println("       expected:");
                    for (String r : c.expected()) System.out.println("         " + r);
                    System.out.println("       actual:");
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
                CREATE TABLE client (id INT PRIMARY KEY, name VARCHAR(50), country VARCHAR(2));
                CREATE TABLE txn (
                  id INT PRIMARY KEY,
                  client_id INT REFERENCES client(id),
                  amount DECIMAL(12,2),
                  currency VARCHAR(3),
                  status VARCHAR(10),
                  created_at DATE
                );
                INSERT INTO client VALUES (1,'Nordwind','PL'),(2,'Acme','DE'),(3,'Vertex','PL'),(4,'Quill','UK');
                INSERT INTO txn VALUES
                  (1,1, 100.00,'PLN','SETTLED','2026-01-02'),
                  (2,1, 250.00,'PLN','SETTLED','2026-01-03'),
                  (3,1,  50.00,'PLN','FAILED', '2026-01-04'),
                  (4,1, 400.00,'PLN','SETTLED','2026-01-05'),
                  (5,2, 900.00,'EUR','SETTLED','2026-01-02'),
                  (6,2, 100.00,'EUR','SETTLED','2026-01-06'),
                  (7,3,  10.00,'PLN','SETTLED','2026-01-02'),
                  (8,3,  20.00,'PLN','SETTLED','2026-01-03'),
                  (9,3,  30.00,'PLN','SETTLED','2026-01-04'),
                  (10,4,5000.00,'GBP','FAILED', '2026-01-02');
                """);
        }
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

    static String scalar(Connection cn, String sql) throws SQLException {
        return rows(cn, sql).get(0);
    }

    static void dump(Connection cn) throws SQLException {
        System.out.println("\nclient (id | name | country)");
        for (String r : rows(cn, "SELECT * FROM client ORDER BY id")) System.out.println("  " + r);
        System.out.println("\ntxn (id | client_id | amount | currency | status | created_at)");
        for (String r : rows(cn, "SELECT * FROM txn ORDER BY id")) System.out.println("  " + r);
        System.out.println();
    }
}
