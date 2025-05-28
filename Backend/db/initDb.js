// backend/db/initDb.js
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' }); // Adjust path to your .env file

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false },
});

async function initializeDatabase() {
    console.log('Attempting to initialize database tables...');
    try {
        // Create students table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                matric_number VARCHAR(255) UNIQUE NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Table "students" ensured to exist.');

        // Create semesters table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS semesters (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                gpa NUMERIC(4, 2) DEFAULT 0.00,
                student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Table "semesters" ensured to exist.');

        // Create courses table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS courses (
                id SERIAL PRIMARY KEY,
                semester_id INTEGER REFERENCES semesters(id) ON DELETE CASCADE NOT NULL,
                code VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                credit_units INTEGER NOT NULL,
                grade VARCHAR(5) NOT NULL,
                grade_point NUMERIC(3, 2) NOT NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Table "courses" ensured to exist.');

        console.log('Database initialization complete.');
    } catch (error) {
        console.error('Error initializing database:', error);
        // Depending on severity, you might want to exit the process here
        // process.exit(1);
    } finally {
        // It's usually better to keep the pool open if your server uses it,
        // but for a standalone init script, you might close it.
        // await pool.end();
    }
}

module.exports = initializeDatabase;