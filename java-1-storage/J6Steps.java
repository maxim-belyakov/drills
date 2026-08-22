// J6, ladder. Five steps to the query in J6Sql task 1, one new word each.
//
// Built 21.08.2026 because the drill was too big in one bite. Each step is one
// clause added to the previous one. Copy your previous answer down, add the new
// bit, run. Twenty seconds each, not ninety.
//
// Run:  cd ~/Documents/my-repos/code-challenges/2026.07/drills
//       java -cp lib/h2.jar java-1-storage/J6Steps.java
//
// The tables:
//   client(id, name, country)
//   txn(id, client_id, amount, currency, status, created_at)   status: SETTLED | FAILED
//
// One rule for reading SQL, and it is the whole thing:
//   SQL never "takes a client and then looks up his transactions". It builds ONE
//   flat table of rows, then throws rows away, then glues the survivors into piles.
//   Every step below does exactly one of those.

import java.math.BigDecimal;
import java.sql.*;
import java.util.*;

public class J6Steps {

    // --- step 1: one table, nothing else -------------------------
    // Every transaction: its id and its amount. No client, no filter.
    // Order by id.
    //   10 rows out.

    static String s1() {
        return null; // here
    }

    // --- step 2: throw rows away ---------------------------------
    // Same as step 1, plus: keep only rows whose status is SETTLED.
    // The new word is WHERE. String values go in single quotes: 'SETTLED'.
    //   8 rows out. Two transactions were FAILED.

    static String s2() {
        return null; // here
    }

    // --- step 3: glue the client's name onto every row ------------
    // Same as step 2, but each row must also carry the client's NAME.
    // The name does not live in txn, it lives in client. The new word is JOIN:
    //
    //     FROM txn t JOIN client c ON c.id = t.client_id
    //
    // Read it as: for every row of txn, find the one row of client whose id equals
    // this row's client_id, and stick its columns onto the end. Still one flat table,
    // still one row per transaction - just wider.
    // Columns: client name, txn id, amount. Order by txn id.
    //   Still 8 rows. Names repeat, because one client has several transactions.

    static String s3() {
        return null; // here
    }

    // --- step 4: glue rows into piles ----------------------------
    // Now collapse. All the rows with the same client name become ONE row.
    // The new word is GROUP BY. Once rows are in piles, you cannot ask about a
    // single row any more - only count(*), sum(...), min, max, avg over the pile.
    // Columns: client name, count of transactions, sum of amount. Order by name.
    //   3 rows out. Quill is not here at all - his only transaction was FAILED and
    //   step 2 already threw it away.

    static String s4() {
        return null; // here
    }

    // --- step 5: throw piles away --------------------------------
    // Same as step 4, plus: keep only clients with 3 or more transactions.
    // The new word is HAVING. WHERE filters rows before the piles exist, HAVING
    // filters the piles after. count(*) has no meaning before the piles exist,
    // which is exactly why it cannot go in WHERE.
    // Order by name.
    //   2 rows out. Acme had 2 transactions and drops.

    static String s5() {
        return null; // here
    }

    // Step 5 plus "ORDER BY total DESC" IS task 1 of J6Sql. Nothing else is missing.

    // ================== RUNNER - do not edit ==================

    record Check(String name, String sql, List<String> expected) {}

    public static void main(String[] args) throws Exception {
        try (Connection cn = DriverManager.getConnection("jdbc:h2:mem:j6s", "sa", "")) {
            seed(cn);
            List<Check> checks = List.of(
                new Check("s1 all transactions", s1(), List.of(
                    "1 | 100", "2 | 250", "3 | 50", "4 | 400", "5 | 900",
                    "6 | 100", "7 | 10", "8 | 20", "9 | 30", "10 | 5000")),
                new Check("s2 only settled", s2(), List.of(
                    "1 | 100", "2 | 250", "4 | 400", "5 | 900",
                    "6 | 100", "7 | 10", "8 | 20", "9 | 30")),
                new Check("s3 with client name", s3(), List.of(
                    "Nordwind | 1 | 100", "Nordwind | 2 | 250", "Nordwind | 4 | 400",
                    "Acme | 5 | 900", "Acme | 6 | 100",
                    "Vertex | 7 | 10", "Vertex | 8 | 20", "Vertex | 9 | 30")),
                new Check("s4 grouped", s4(), List.of(
                    "Acme | 2 | 1000", "Nordwind | 3 | 750", "Vertex | 3 | 60")),
                new Check("s5 having", s5(), List.of(
                    "Nordwind | 3 | 750", "Vertex | 3 | 60"))
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
                CREATE TABLE client (id INT PRIMARY KEY, name VARCHAR(50), country VARCHAR(2));
                CREATE TABLE txn (
                  id INT PRIMARY KEY, client_id INT REFERENCES client(id),
                  amount DECIMAL(12,2), currency VARCHAR(3),
                  status VARCHAR(10), created_at DATE
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
}
