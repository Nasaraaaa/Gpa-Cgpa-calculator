import React, { useState } from 'react';
import { CourseForm } from './CourseForm';
import { ResultsDisplay } from './ResultsDisplay';
import { SemesterList } from './SemesterList';
import { calculateGPA, calculateCGPA, predictDegreeClass } from '../utils/calculations';
export type Course = {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  grade: string;
  gradePoint: number;
};
export type Semester = {
  id: string;
  name: string;
  courses: Course[];
  gpa: number;
};
export const GpaCalculator = () => {
  const [semesters, setSemesters] = useState<Semester[]>([{
    id: '1',
    name: 'Semester 1',
    courses: [],
    gpa: 0
  }]);
  const [classSize, setClassSize] = useState<number>(65);
  const [rank, setRank] = useState<number | null>(null);
  const [cgpa, setCgpa] = useState<number | null>(null);
  const [degreeClass, setDegreeClass] = useState<string | null>(null);
  const addSemester = () => {
    setSemesters([...semesters, {
      id: Date.now().toString(),
      name: `Semester ${semesters.length + 1}`,
      courses: [],
      gpa: 0
    }]);
  };
  const addCourse = (semesterId: string, course: Course) => {
    setSemesters(semesters.map(semester => {
      if (semester.id === semesterId) {
        const updatedCourses = [...semester.courses, course];
        const gpa = calculateGPA(updatedCourses);
        return {
          ...semester,
          courses: updatedCourses,
          gpa
        };
      }
      return semester;
    }));
  };
  const removeCourse = (semesterId: string, courseId: string) => {
    setSemesters(semesters.map(semester => {
      if (semester.id === semesterId) {
        const updatedCourses = semester.courses.filter(course => course.id !== courseId);
        const gpa = calculateGPA(updatedCourses);
        return {
          ...semester,
          courses: updatedCourses,
          gpa
        };
      }
      return semester;
    }));
  };
  const removeSemester = (semesterId: string) => {
    setSemesters(semesters.filter(semester => semester.id !== semesterId));
  };
  const calculateResults = () => {
    // Calculate CGPA from all semesters
    const calculatedCgpa = calculateCGPA(semesters);
    setCgpa(calculatedCgpa);
    // Generate a random but realistic class rank based on CGPA
    // Higher CGPA = better rank
    let calculatedRank = Math.max(1, Math.floor((1 - calculatedCgpa / 5) * classSize));
    // Ensure rank doesn't exceed class size
    calculatedRank = Math.min(classSize, calculatedRank);
    setRank(calculatedRank);
    // Predict degree class
    const prediction = predictDegreeClass(calculatedCgpa);
    setDegreeClass(prediction);
  };
  return <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          GPA & CGPA Calculator
        </h2>
        <p className="text-gray-600">
          Enter your course details for each semester to calculate your GPA,
          CGPA, class rank, and projected degree classification.
        </p>
      </div>
      <div className="mb-6">
        <label htmlFor="classSize" className="block text-sm font-medium text-gray-700 mb-1">
          Class Size (Total number of students)
        </label>
        <div className="flex items-center gap-3">
          <input type="number" id="classSize" className="border border-gray-300 rounded-md px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500" value={classSize} onChange={e => setClassSize(Number(e.target.value))} min="1" />
          <span className="text-gray-500">students</span>
        </div>
      </div>
      <SemesterList semesters={semesters} addCourse={addCourse} removeCourse={removeCourse} removeSemester={removeSemester} />
      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={addSemester} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition">
          Add Another Semester
        </button>
        <button onClick={calculateResults} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition" disabled={semesters.some(sem => sem.courses.length === 0)}>
          Calculate Results
        </button>
      </div>
      {cgpa !== null && rank !== null && degreeClass !== null && <ResultsDisplay cgpa={cgpa} rank={rank} classSize={classSize} degreeClass={degreeClass} semesters={semesters} />}
    </div>;
};