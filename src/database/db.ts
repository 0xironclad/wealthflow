import { Pool } from "pg";



const pool = process.env.SUPABASE_DB_URL
  ? new Pool({
      connectionString: process.env.SUPABASE_DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === "true" ? {
        rejectUnauthorized: false,
      } : false,
    });

export default pool;
