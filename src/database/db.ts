import { Pool } from "pg";

// Helper to mask sensitive info in logs
function maskConnectionString(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.username}:***@${urlObj.hostname}:${urlObj.port}${urlObj.pathname}`;
  } catch {
    return "***";
  }
}

// Validate and log connection info
const dbUrl = process.env.SUPABASE_DB_URL;
if (dbUrl) {
  const isProduction = process.env.NODE_ENV === "production";
  const isPooler =
    dbUrl.includes(":6543") || dbUrl.includes("pooler.supabase.com");

  console.log(`[DB] Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `[DB] Using: ${isPooler ? "Connection Pooler" : "Direct Connection"}`
  );
  console.log(`[DB] Connection: ${maskConnectionString(dbUrl)}`);

  if (isProduction && !isPooler && dbUrl.includes(":5432")) {
    console.warn(
      "⚠️  WARNING: Using direct database URL in production. " +
        "For Vercel/serverless, use the Connection Pooler URL (port 6543) instead."
    );
  }
} else {
  console.warn(
    "[DB] SUPABASE_DB_URL not set, falling back to individual DB_* variables"
  );
}

const pool = dbUrl
  ? new Pool({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false,
      },
      // Connection pool settings optimized for serverless
      max: 1, // Single connection for serverless
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      // Retry connection on failure
      allowExitOnIdle: true,
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl:
        process.env.DB_SSL === "true"
          ? {
              rejectUnauthorized: false,
            }
          : false,
    });

// Test connection on startup (non-blocking)
pool.on("error", (err) => {
  console.error("[DB] Unexpected error on idle client:", err);
});

// Optional: Test connection
if (process.env.NODE_ENV === "production") {
  pool.query("SELECT 1").catch((err) => {
    console.error("[DB] Initial connection test failed:", err.message);
    console.error(
      "[DB] Check your SUPABASE_DB_URL environment variable in Vercel"
    );
  });
}

export default pool;
