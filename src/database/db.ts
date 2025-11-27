import { Pool } from "pg";

// Supabase connection (primary) - uses connection string from SUPABASE_DB_URL
const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Regular PostgreSQL connection (uncomment if not using Supabase)
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: parseInt(process.env.DB_PORT || '5432'),
//   ssl: process.env.DB_SSL === 'true' ? {
//     rejectUnauthorized: false,
//   } : false,
// });

export default pool;
