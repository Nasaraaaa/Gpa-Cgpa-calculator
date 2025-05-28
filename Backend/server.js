// backend/server.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const initializeDatabase = require('./db/initDb'); // Import the database initialization script

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false },
});

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'GPA Calculator API',
            version: '1.0.0',
            description: 'API for managing student academic results and GPA calculations.',
            contact: {
                name: 'Vicky API Docs',
                email: 'vicky email',
            },
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Development server',
            },
            {
                url: 'https://gpa-cgpa-calculator-e7jw.onrender.com',
                description: 'Production server',
            },
        ],
        components: {
            schemas: {
                Student: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        matricNumber: { type: 'string' },
                        fullName: { type: 'string' },
                    },
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['matricNumber', 'fullName', 'password'],
                    properties: {
                        matricNumber: { type: 'string' },
                        fullName: { type: 'string' },
                        password: { type: 'string', format: 'password' },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['matricNumber', 'password'],
                    properties: {
                        matricNumber: { type: 'string' },
                        password: { type: 'string', format: 'password' },
                    },
                },
                Semester: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        gpa: { type: 'number' },
                        student_id: { type: 'integer' },
                    },
                },
                Course: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        semester_id: { type: 'integer' },
                        code: { type: 'string' },
                        title: { type: 'string' },
                        credit_units: { type: 'integer' },
                        grade: { type: 'string' },
                        grade_point: { type: 'number' },
                    },
                },
                AcademicResults: {
                    type: 'object',
                    properties: {
                        cgpa: { type: 'string' },
                        rank: { type: 'string' },
                        topPercent: { type: 'string' },
                        degreeClass: { type: 'string' },
                        performance: {
                            type: 'object',
                            additionalProperties: { type: 'string' },
                        },
                        recommendations: {
                            type: 'array',
                            items: { type: 'string' },
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new student
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 student:
 *                   $ref: '#/components/schemas/Student'
 *       409:
 *         description: Matric number already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Registration failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/register', async (req, res) => {
    const { matricNumber, fullName, password } = req.body;

    try {
        const existing = await pool.query(
            'SELECT * FROM students WHERE matric_number = $1',
            [matricNumber]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ message: 'Matric number already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO students (matric_number, full_name, password_hash) VALUES ($1, $2, $3) RETURNING id, matric_number, full_name',
            [matricNumber, fullName, hashedPassword]
        );

        res.status(201).json({
            message: 'Registration successful!',
            data: {
                id: result.rows[0].id,
                matricNumber: result.rows[0].matric_number,
                fullName: result.rows[0].full_name,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a student
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 student:
 *                   $ref: '#/components/schemas/Student'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Login failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/login', async (req, res) => {
    const { matricNumber, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM students WHERE matric_number = $1',
            [matricNumber]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid matric number or password.' });
        }

        const student = result.rows[0];
        const valid = await bcrypt.compare(password, student.password_hash);

        if (!valid) {
            return res.status(401).json({ message: 'Invalid matric number or password.' });
        }

        res.status(200).json({
            message: 'Login successful!',
            data: {
                id: student.id,
                matricNumber: student.matric_number,
                fullName: student.full_name,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

/**
 * @swagger
 * /semesters:
 *   get:
 *     summary: Retrieve all semesters
 *     tags: [Semesters]
 *     responses:
 *       200:
 *         description: A list of semesters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Semester'
 *       500:
 *         description: Could not get semesters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/semesters', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM semesters');
        res.status(200).json({ data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not get semesters.' });
    }
});

// Start server
async function startServer() {
    await initializeDatabase();
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
        console.log(`Swagger docs at http://localhost:${port}/api-docs`);
    });
}

startServer();
