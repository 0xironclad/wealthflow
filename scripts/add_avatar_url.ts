
import fs from 'fs';
import path from 'path';

// Load .env file manually
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=');
            process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
        }
    });
    console.log('Loaded env keys:', Object.keys(process.env).filter(k => k.startsWith('DB_')));
    if (!process.env.DB_PASSWORD) {
        console.error('DB_PASSWORD is missing!');
    } else {
        console.log('DB_PASSWORD is present (length: ' + process.env.DB_PASSWORD.length + ')');
    }
}


// import pool from '../src/database/db'; // Removed static import

async function migrate() {
    // Dynamic import to ensure env vars are loaded first
    const { default: pool } = await import('../src/database/db');

    try {
        console.log('Starting migration...');

        // Check if column exists
        const checkQuery = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='users' AND column_name='avatar_url';
    `;
        const checkResult = await pool.query(checkQuery);

        if (checkResult.rows.length === 0) {
            console.log('Adding avatar_url column...');
            await pool.query(`ALTER TABLE users ADD COLUMN avatar_url TEXT;`);
            console.log('Column added successfully.');
        } else {
            console.log('avatar_url column already exists.');
        }

        // List all columns
        const listColumnsQuery = `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name='users';
    `;
        const columnsResult = await pool.query(listColumnsQuery);
        console.log('Columns in users table:', columnsResult.rows.map(r => r.column_name));
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pool.end();
    }
}

migrate();
