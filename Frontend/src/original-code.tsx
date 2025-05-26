import React, { useState, Component } from 'react';
// This is the original consolidated version of the GPA Calculator code
// You can copy this entire file into a React sandbox environment

import { GraduationCapIcon, CalculatorIcon, PlusIcon, Trash2Icon, TrophyIcon, AwardIcon, BarChartIcon, TrendingUpIcon } from 'lucide-react';
// Types
type Course = {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  grade: string;
  gradePoint: number;
};
type Semester = {
  id: string;
  name: string;
  courses: Course[];
  gpa: number;
};
// Calculation utilities
const calculateGPA = (courses: Course[]): number => {
  if (courses.length === 0) return 0;
  let totalQualityPoints = 0;
  let totalCreditUnits = 0;
  courses.forEach(course => {
    totalQualityPoints += course.gradePoint * course.creditUnits;
    totalCreditUnits += course.creditUnits;
  });
  return totalCreditUnits > 0 ? totalQualityPoints / totalCreditUnits : 0;
};
const calculateCGPA = (semesters: Semester[]): number => {
  let allCourses: Course[] = [];
  semesters.forEach(semester => {
    allCourses = [...allCourses, ...semester.courses];
  });
  return calculateGPA(allCourses);
};
const predictDegreeClass = (cgpa: number): string => {
  if (cgpa >= 4.5) return 'First Class Honours';
  if (cgpa >= 3.5) return 'Second Class Upper';
  if (cgpa >= 2.5) return 'Second Class Lower';
  if (cgpa >= 1.5) return 'Third Class';
  if (cgpa >= 1.0) return 'Pass';
  return 'Fail';
};
// Grade options
const gradeOptions = [{
  label: 'A',
  value: 'A',
  points: 5.0
}, {
  label: 'B',
  value: 'B',
  points: 4.0
}, {
  label: 'C',
  value: 'C',
  points: 3.0
}, {
  label: 'D',
  value: 'D',
  points: 2.0
}, {
  label: 'E',
  value: 'E',
  points: 1.0
}, {
  label: 'F',
  value: 'F',
  points: 0.0
}];
// Components
const Header = () => {
  return <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCapIcon size={32} />
          <h1 className="text-2xl font-bold">GPA Compass</h1>
        </div>
        <div className="flex items-center gap-1">
          <CalculatorIcon size={20} />
          <span className="font-medium">Student Performance Calculator</span>
        </div>
      </div>
    </header>;
};
const Footer = () => {
  return <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} GPA Compass | Helping students track and
          improve their academic performance
        </p>
      </div>
    </footer>;
};
const CourseForm: React.FC<{
  semesterId: string;
  onAddCourse: (semesterId: string, course: Course) => void;
}> = ({
  semesterId,
  onAddCourse
}) => {
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [creditUnits, setCreditUnits] = useState(3);
  const [grade, setGrade] = useState('A');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gradePoint = gradeOptions.find(option => option.value === grade)?.points || 0;
    const newCourse: Course = {
      id: Date.now().toString(),
      code: courseCode,
      title: courseTitle,
      creditUnits,
      grade,
      gradePoint
    };
    onAddCourse(semesterId, newCourse);
    setCourseCode('');
    setCourseTitle('');
    setCreditUnits(3);
    setGrade('A');
  };
  return <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Add New Course</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-1">
            Course Code
          </label>
          <input type="text" id="courseCode" className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. MATH101" value={courseCode} onChange={e => setCourseCode(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Course Title
          </label>
          <input type="text" id="courseTitle" className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Calculus I" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="creditUnits" className="block text-sm font-medium text-gray-700 mb-1">
            Credit Units
          </label>
          <input type="number" id="creditUnits" className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" value={creditUnits} onChange={e => setCreditUnits(Number(e.target.value))} min="1" max="6" required />
        </div>
        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
            Grade
          </label>
          <select id="grade" className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" value={grade} onChange={e => setGrade(e.target.value)} required>
            {gradeOptions.map(option => <option key={option.value} value={option.value}>
                {option.label} ({option.points})
              </option>)}
          </select>
        </div>
      </div>
      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition flex items-center gap-1">
        <PlusIcon size={16} />
        Add Course
      </button>
    </form>;
};
// Main Calculator Component
export function App() {
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
    const calculatedCgpa = calculateCGPA(semesters);
    setCgpa(calculatedCgpa);
    let calculatedRank = Math.max(1, Math.floor((1 - calculatedCgpa / 5) * classSize));
    calculatedRank = Math.min(classSize, calculatedRank);
    setRank(calculatedRank);
    const prediction = predictDegreeClass(calculatedCgpa);
    setDegreeClass(prediction);
  };
  return <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
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
          <div className="space-y-8">
            {semesters.map(semester => <div key={semester.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="bg-gray-100 px-4 py-3 flex justify-between items-center border-b">
                  <h3 className="text-lg font-medium text-gray-800">
                    {semester.name}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="font-medium">GPA:</span>{' '}
                      <span className="font-bold text-blue-600">
                        {semester.gpa.toFixed(2)}
                      </span>
                    </div>
                    {semesters.length > 1 && <button onClick={() => removeSemester(semester.id)} className="text-red-500 hover:text-red-700 transition" aria-label="Remove semester">
                        <Trash2Icon size={18} />
                      </button>}
                  </div>
                </div>
                <div className="p-4">
                  <CourseForm semesterId={semester.id} onAddCourse={addCourse} />
                  {semester.courses.length > 0 && <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-700 mb-2">
                        Courses
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Code
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Units
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Grade
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Points
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {semester.courses.map(course => <tr key={course.id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {course.code}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                  {course.title}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                  {course.creditUnits}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                  {course.grade}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                  {course.gradePoint}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-right">
                                  <button onClick={() => removeCourse(semester.id, course.id)} className="text-red-500 hover:text-red-700 transition" aria-label="Remove course">
                                    <Trash2Icon size={16} />
                                  </button>
                                </td>
                              </tr>)}
                          </tbody>
                        </table>
                      </div>
                    </div>}
                </div>
              </div>)}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={addSemester} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition">
              Add Another Semester
            </button>
            <button onClick={calculateResults} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition" disabled={semesters.some(sem => sem.courses.length === 0)}>
              Calculate Results
            </button>
          </div>
          {cgpa !== null && rank !== null && degreeClass !== null && <div className="mt-10 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <h3 className="text-xl font-semibold text-blue-800">
                  Your Academic Results
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* CGPA Card */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-gray-600 font-medium">
                        Cumulative GPA
                      </h4>
                      <BarChartIcon className="text-blue-500" size={20} />
                    </div>
                    <p className={`text-3xl font-bold ${cgpa >= 4.5 ? 'text-green-600' : cgpa >= 3.5 ? 'text-blue-600' : cgpa >= 2.5 ? 'text-yellow-600' : cgpa >= 1.5 ? 'text-orange-600' : 'text-red-600'}`}>
                      {cgpa.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      out of 5.00 maximum
                    </p>
                  </div>
                  {/* Class Rank Card */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-gray-600 font-medium">Class Rank</h4>
                      <TrophyIcon className="text-yellow-500" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-indigo-600">
                      {rank}/{classSize}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Top {Math.round(rank / classSize * 100)}% of class
                    </p>
                  </div>
                  {/* Degree Classification Card */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-gray-600 font-medium">
                        Degree Class
                      </h4>
                      <AwardIcon className="text-purple-500" size={20} />
                    </div>
                    <p className="text-xl font-bold text-green-600">
                      {degreeClass}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Projected classification
                    </p>
                  </div>
                  {/* Trend Card */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-gray-600 font-medium">Performance</h4>
                      <TrendingUpIcon className="text-green-500" size={20} />
                    </div>
                    <div className="flex items-center gap-2">
                      {semesters.slice(0, 4).map((semester, index) => <div key={index} className="flex-1 bg-gray-100 rounded-md p-2 text-center">
                          <p className="text-xs text-gray-500">S{index + 1}</p>
                          <p className={`text-sm font-semibold ${semester.gpa >= 4.0 ? 'text-green-600' : semester.gpa >= 3.0 ? 'text-blue-600' : 'text-orange-600'}`}>
                            {semester.gpa.toFixed(1)}
                          </p>
                        </div>)}
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      {semesters.length > 1 ? semesters[semesters.length - 1].gpa > semesters[semesters.length - 2].gpa ? 'Your performance is improving!' : 'Focus on improving your grades' : 'Add more semesters to track progress'}
                    </p>
                  </div>
                </div>
                <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">
                    Recommendations
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {cgpa < 2.0 && <li className="text-red-600">
                        Warning: Your CGPA is below 2.0. Consider academic
                        counseling.
                      </li>}
                    {cgpa >= 2.0 && cgpa < 3.0 && <li>
                        Focus on improving your grades in core courses to boost
                        your CGPA.
                      </li>}
                    {cgpa >= 3.0 && cgpa < 4.0 && <li>
                        You're doing well! Consider aiming for higher grades in
                        your remaining courses.
                      </li>}
                    {cgpa >= 4.0 && <li className="text-green-600">
                        Excellent work! Maintain your current study habits.
                      </li>}
                    <li>
                      To improve your class rank, aim for at least{' '}
                      {(cgpa + 0.5).toFixed(2)} CGPA in your next semester.
                    </li>
                    <li>
                      Consider balancing difficult courses with easier ones each
                      semester.
                    </li>
                  </ul>
                </div>
              </div>
            </div>}
        </div>
      </main>
      <Footer />
    </div>;
}