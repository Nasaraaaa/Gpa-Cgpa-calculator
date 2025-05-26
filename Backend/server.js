// This tells our brain to use the tools we installed
require('dotenv').config(); // Loads our secret database details
const express = require('express'); // The tool to make doorways (endpoints)
const { Pool } = require('pg'); // The tool to talk to PostgreSQL
const cors = require('cors'); // The friendly security guard

const app = express(); // We're making our brain!
const port = 3001; // This is the number for our brain's address

// This makes sure our brain can understand messages sent to it
app.use(express.json());
// This lets our frontend (calculator) talk to our backend (brain)
app.use(cors());

// Setting up how our brain connects to the PostgreSQL filing cabinet
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});




// Get semesters 

app.get('/semesters', async (req, res) => {
    try {
        // Retrieve all semesters from the database
        const newSemester = await pool.query('SELECT * FROM semesters');

        // Send the semesters back to the client
        res.status(200).json({
            data: newSemester.rows
        });
    } catch (err) {
        console.error('Error getting semesters:', err);
        res.status(500).json({ message: 'Oops! Could not get semesters' });
    }
});




// Add semester


app.post('/semesters', async (req, res) => {
    const { id, name, gpa } = req.body; // Get the new semester's details from the calculator
    try {
        // Tell the filing cabinet to save this new semester
        const newSemester = await pool.query(
            'INSERT INTO semesters (id, name, gpa) VALUES ($1, $2, $3) RETURNING *',
            [id, name, gpa]
        );
        // Send the new semester back to the calculator to confirm it's saved
        res.status(201).json(newSemester.rows[0]);
    } catch (err) {
        console.error('Error adding new semester:', err);
        res.status(500).json({ message: 'Oops! Could not add the new semester.' });
    }
});



// Delete semester


app.delete('/semesters/:id', async (req, res) => {
    const { id } = req.params; // Get the ID of the semester to delete
    try {
        // Tell the filing cabinet to throw away this semester (and its courses too, thanks to ON DELETE CASCADE!)
        await pool.query('DELETE FROM semesters WHERE id = $1', [id]);
        res.status(204).send(); // Send a message saying it's gone! (204 means No Content)
    } catch (err) {
        console.error('Error deleting semester:', err);
        res.status(500).json({ message: 'Oops! Could not delete the semester.' });
    }
});


// Add a course

app.post('/semesters/:semesterId/courses', async (req, res) => {
    const { semesterId } = req.params;
    const { id, code, title, creditUnits, grade, gradePoint } = req.body; // Get the course details
    try {
        // Tell the filing cabinet to save this new course
        const newCourse = await pool.query(
            'INSERT INTO courses (id, semester_id, code, title, credit_units, grade, grade_point) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [id, semesterId, code, title, creditUnits, grade, gradePoint]
        );

        // After adding a course, we need to update the semester's GPA
        // First, get all courses for this semester
        const semesterCoursesResult = await pool.query(
            'SELECT credit_units, grade_point FROM courses WHERE semester_id = $1',
            [semesterId]
        );
        const semesterCourses = semesterCoursesResult.rows;

        // Calculate the new GPA (just like your frontend logic)
        let totalQualityPoints = 0;
        let totalCreditUnits = 0;
        semesterCourses.forEach(course => {
            totalQualityPoints += course.grade_point * course.credit_units;
            totalCreditUnits += course.credit_units;
        });
        const newGpa = totalCreditUnits > 0 ? totalQualityPoints / totalCreditUnits : 0;

        // Update the semester's GPA in the filing cabinet
        await pool.query(
            'UPDATE semesters SET gpa = $1 WHERE id = $2',
            [newGpa, semesterId]
        );

        // Send the new course and the updated GPA back to the calculator
        res.status(201).json({ course: newCourse.rows[0], gpa: newGpa });
    } catch (err) {
        console.error('Error adding new course or updating GPA:', err);
        res.status(500).json({ message: 'Oops! Could not add the new course or update GPA.' });
    }
});


// Delete a course

app.delete('/semesters/:semesterId/courses/:courseId', async (req, res) => {
    const { semesterId, courseId } = req.params; // Get the IDs of the semester and course to delete
    try {
        // Tell the filing cabinet to throw away this course
        await pool.query('DELETE FROM courses WHERE id = $1', [courseId]);

        // After deleting a course, we need to update the semester's GPA
        // First, get all remaining courses for this semester
        const semesterCoursesResult = await pool.query(
            'SELECT credit_units, grade_point FROM courses WHERE semester_id = $1',
            [semesterId]
        );
        const semesterCourses = semesterCoursesResult.rows;

        // Calculate the new GPA
        let totalQualityPoints = 0;
        let totalCreditUnits = 0;
        semesterCourses.forEach(course => {
            totalQualityPoints += course.grade_point * course.credit_units;
            totalCreditUnits += course.credit_units;
        });
        const newGpa = totalCreditUnits > 0 ? totalQualityPoints / totalCreditUnits : 0;

        // Update the semester's GPA in the filing cabinet
        await pool.query(
            'UPDATE semesters SET gpa = $1 WHERE id = $2',
            [newGpa, semesterId]
        );

        res.status(200).json({ gpa: newGpa }); // Send the updated GPA back
    } catch (err) {
        console.error('Error deleting course or updating GPA:', err);
        res.status(500).json({ message: 'Oops! Could not delete the course or update GPA.' });
    }
});


app.get('/academic-results', async (req, res) => {
    const { semesterIds } = req.query; // e.g. ?semesterIds=1,2

    try {
        const semesterIdList = semesterIds.split(',').map(id => parseInt(id));

        // 1. Fetch courses with grades and units for each semester
        const gradesQuery = await pool.query(`
            SELECT semester_id, grade_point, unit
            FROM courses
            WHERE  semester_id = ANY($2)
        `, [semesterIdList]);

        const courseData = gradesQuery.rows;

        // 2. Calculate CGPA
        let totalPoints = 0;
        let totalUnits = 0;
        const semesterPerformance = {};

        courseData.forEach(({ semester_id, grade_point, unit }) => {
            const semesterKey = `S${semester_id}`;
            if (!semesterPerformance[semesterKey]) {
                semesterPerformance[semesterKey] = { points: 0, units: 0 };
            }

            semesterPerformance[semesterKey].points += grade_point * unit;
            semesterPerformance[semesterKey].units += unit;

            totalPoints += grade_point * unit;
            totalUnits += unit;
        });

        const cgpa = totalPoints / totalUnits;

        // 3. Rank calculation (simplified: your GPA vs others)
        const rankQuery = await pool.query(`
            SELECT  SUM(grade_point * unit)::float / SUM(unit) AS grade_point
            FROM courses
            WHERE semester_id = ANY($1)
            ORDER BY grade_point DESC
        `, [semesterIdList]);

        const rankList = rankQuery.rows;
        const rank = rankList.findIndex(row => row.student_id === studentId) + 1;

        const totalStudents = rankList.length;
        const topPercent = ((rank / totalStudents) * 100).toFixed(2);

        // 4. Degree Class (example thresholds)
        let degreeClass = 'Second Class Lower';
        if (cgpa >= 4.5) degreeClass = 'First Class Honours';
        else if (cgpa >= 3.5) degreeClass = 'Second Class Upper';
        else if (cgpa >= 2.5) degreeClass = 'Second Class Lower';

        // 5. GPA per semester
        const semesterGPA = {};
        for (const [key, data] of Object.entries(semesterPerformance)) {
            semesterGPA[key] = (data.points / data.units).toFixed(2);
        }

        // 6. Recommendations
        const recommendations = [
            'Excellent work! Maintain your current study habits.',
            'To improve your class rank, aim for a higher CGPA in your next semester.',
            'Consider balancing difficult courses with easier ones each semester.'
        ];

        // Final response
        res.status(200).json({
            cgpa: cgpa.toFixed(2),
            rank: `${rank}/${totalStudents}`,
            topPercent: `Top ${topPercent}% of class`,
            degreeClass,
            performance: semesterGPA,
            recommendations
        });

    } catch (err) {
        console.error('Error fetching academic results:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// sample response 

// {
//   "cgpa": "5.00",
//   "rank": "1/65",
//   "topPercent": "Top 2.00% of class",
//   "degreeClass": "First Class Honours",
//   "performance": {
//     "S1": "5.00",
//     "S2": "5.00"
//   },
//   "recommendations": [
//     "Excellent work! Maintain your current study habits.",
//     "To improve your class rank, aim for a higher CGPA in your next semester.",
//     "Consider balancing difficult courses with easier ones each semester."
//   ]
// }




// This tells our brain to listen for messages at its address
app.listen(port, () => {
    console.log(`GPA Brain is listening at http://localhost:${port}`);
});

