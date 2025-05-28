import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Course } from "./GpaCalculator";
const gradeOptions = [
  {
    label: "A",
    value: "A",
    points: 5.0,
  },
  {
    label: "B",
    value: "B",
    points: 4.0,
  },
  {
    label: "C",
    value: "C",
    points: 3.0,
  },
  {
    label: "D",
    value: "D",
    points: 2.0,
  },
  {
    label: "E",
    value: "E",
    points: 1.0,
  },
  {
    label: "F",
    value: "F",
    points: 0.0,
  },
];
type CourseFormProps = {
  semesterId: string;
  onAddCourse: (semesterId: string, course: Course) => void;
};
export const CourseForm: React.FC<CourseFormProps> = ({
  semesterId,
  onAddCourse,
}) => {
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [creditUnits, setCreditUnits] = useState(3);
  const [grade, setGrade] = useState("A");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Find grade point for selected grade
    const gradePoint =
      gradeOptions.find((option) => option.value === grade)?.points || 0;
    const newCourse: Course = {
      id: Date.now().toString(),
      code: courseCode,
      title: courseTitle,
      creditUnits,
      grade,
      gradePoint,
    };
    onAddCourse(semesterId, newCourse);
    // Reset form
    setCourseCode("");
    setCourseTitle("");
    setCreditUnits(3);
    setGrade("A");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-md shadow-sm border border-gray-200"
    >
      <h3 className="text-lg font-medium text-gray-800 mb-3 font-poppins">
        Add New Course
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="courseCode"
            className="block text-sm font-poppins font-medium text-gray-700 mb-1"
          >
            Course Code
          </label>
          <input
            type="text"
            id="courseCode"
            className="border border-gray-300 font-poppins rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. MATH101"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            htmlFor="courseTitle"
            className="block text-sm font-poppins font-medium text-gray-700 mb-1"
          >
            Course Title
          </label>
          <input
            type="text"
            id="courseTitle"
            className="border border-gray-300 font-poppins rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Calculus I"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            htmlFor="creditUnits"
            className="block text-sm font-poppins font-medium text-gray-700 mb-1"
          >
            Credit Units
          </label>
          <input
            type="number"
            id="creditUnits"
            className="border border-gray-300 font-poppins rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={creditUnits}
            onChange={(e) => setCreditUnits(Number(e.target.value))}
            min="1"
            max="6"
            required
          />
        </div>
        <div>
          <label
            htmlFor="grade"
            className="block text-sm font-poppins font-medium text-gray-700 mb-1"
          >
            Grade
          </label>
          <select
            id="grade"
            className="border border-gray-300 font-poppins rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
          >
            {gradeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.points})
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition flex items-center gap-1"
      >
        <PlusIcon size={16} />
        Add Course
      </button>
    </form>
  );
};
