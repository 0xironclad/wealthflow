/**
 * Database Table Creation Script
 *
 * This script creates all necessary database tables for the WealthFlow application.
 * It supports both Supabase and regular PostgreSQL databases.
 *
 * For Supabase:
 *   - Set SUPABASE_DB_URL in your .env file
 *   - Example: SUPABASE_DB_URL=postgresql://user:password@host:port/database
 *
 * For Regular PostgreSQL:
 *   - Set the following in your .env file:
 *     DB_HOST=localhost (or your database host)
 *     DB_USER=postgres (or your database user)
 *     DB_PASSWORD=your_password
 *     DB_NAME=wealthflow (or your database name)
 *     DB_PORT=5432 (optional, defaults to 5432)
 *   - SSL is optional for local databases
 */

import fs from "fs";
import path from "path";
import { Pool } from "pg";

// Load .env file manually
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf8");
    envConfig.split("\n").forEach((line) => {
        const [key, ...valueParts] = line.split("=");
        if (key && valueParts.length > 0) {
            const value = valueParts.join("=");
            process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
        }
    });
}

async function createTables() {
    let pool: Pool;
    let dbType: string;

    // Determine database type and create connection pool
    if (process.env.SUPABASE_DB_URL) {
        // Supabase connection (using connection string)
        dbType = "Supabase";
        pool = new Pool({
            connectionString: process.env.SUPABASE_DB_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        });
    } else if (
        process.env.DB_HOST &&
        process.env.DB_USER &&
        process.env.DB_NAME
    ) {
        dbType = "PostgreSQL";
        pool = new Pool({
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
    } else {
        console.error("Error: Database connection not configured.");
        console.error("\nFor Supabase: Set SUPABASE_DB_URL in your .env file");
        console.error(
            "\nFor Regular PostgreSQL: Set the following in your .env file:"
        );
        console.error("  DB_HOST=your_database_host");
        console.error("  DB_USER=your_database_user");
        console.error("  DB_PASSWORD=your_database_password");
        console.error("  DB_NAME=your_database_name");
        console.error("  DB_PORT=5432 (optional)");
        console.error("  DB_SSL=true (optional, for remote databases)");
        process.exit(1);
    }

    try {
        console.log(`Connecting to ${dbType} database...`);
        const client = await pool.connect();
        console.log("Connected successfully.");

        // For self-hosted PostgreSQL, create auth schema and users table
        if (dbType === "PostgreSQL") {
            console.log("Setting up auth schema for self-hosted PostgreSQL...");

            // Create auth schema
            await client.query("CREATE SCHEMA IF NOT EXISTS auth;");

            // Create a minimal auth.users table for compatibility
            await client.query(`
        CREATE TABLE IF NOT EXISTS auth.users (
          id VARCHAR(36) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          encrypted_password VARCHAR(255),
          email_confirmed_at TIMESTAMP,
          raw_user_meta_data JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

            console.log("Auth schema created successfully.");
        }

        const sqlPath = path.resolve(process.cwd(), "src/database/queries.sql");
        if (!fs.existsSync(sqlPath)) {
            console.error(`Error: SQL file not found at ${sqlPath}`);
            process.exit(1);
        }

        const sql = fs.readFileSync(sqlPath, "utf8");

        // For self-hosted PostgreSQL, we need to handle the trigger differently
        if (dbType === "PostgreSQL") {
            console.log("Adapting SQL for self-hosted PostgreSQL...");
            // The trigger will work now since we created auth.users table
        }

        console.log("Executing SQL from src/database/queries.sql...");
        await client.query(sql);
        console.log("Tables created successfully!");

        // Display helpful information
        if (dbType === "PostgreSQL") {
            console.log("\n✓ Database setup complete!");
            console.log("\nNote: For self-hosted PostgreSQL, you'll need to manually create users.");
            console.log("The auth.users table has been created for compatibility with Supabase triggers.");
            console.log("\nTo create a test user, you can run:");
            console.log("  INSERT INTO users (id, email, password, name) VALUES");
            console.log("  ('test-user-id', 'test@example.com', 'hashed_password', 'Test User');");
        }

        client.release();
    } catch (error) {
        console.error("Error creating tables:", error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

createTables();
