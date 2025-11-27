import { Pool } from "pg";

const pool = new Pool({
    //     user: process.env.DB_USER,
    //   host: process.env.DB_HOST,
    //   database: process.env.DB_NAME,
    //   password: process.env.DB_PASSWORD,
    //   port: parseInt(process.env.DB_PORT || '5432'),

    connectionString: process.env.SUPABASE_DB_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export default pool;
