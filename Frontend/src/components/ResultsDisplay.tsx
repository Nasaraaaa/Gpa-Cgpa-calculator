import React from "react";
import {
  TrophyIcon,
  AwardIcon,
  BarChartIcon,
  TrendingUpIcon,
} from "lucide-react";
import { Semester } from "./GpaCalculator";
type ResultsDisplayProps = {
  cgpa: number;
  rank: number;
  classSize: number;
  degreeClass: string;
  semesters: Semester[];
};
export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  cgpa,
  rank,
  classSize,
  degreeClass,
  semesters,
}) => {
  // Generate color based on CGPA
  const getCgpaColor = () => {
    if (cgpa >= 4.5) return "text-green-600";
    if (cgpa >= 3.5) return "text-blue-600";
    if (cgpa >= 2.5) return "text-yellow-600";
    if (cgpa >= 1.5) return "text-orange-600";
    return "text-red-600";
  };
  return (
    <div className="mt-10 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
        <h3 className="text-xl font-semibold font-poppins text-blue-800">
          Your Academic Results
        </h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CGPA Card */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-600 font-medium font-poppins">
                Cumulative GPA
              </h4>
              <BarChartIcon className="text-blue-500" size={20} />
            </div>
            <p className={`text-3xl font-poppins font-bold ${getCgpaColor()}`}>
              {cgpa.toFixed(2)}
            </p>
            <p className="text-sm font-poppins text-gray-500 mt-1">
              out of 5.00 maximum
            </p>
          </div>
          {/* Class Rank Card */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-600 font-medium font-poppins">
                Class Rank
              </h4>
              <TrophyIcon className="text-yellow-500" size={20} />
            </div>
            <p className="text-3xl font-poppins font-bold text-indigo-600">
              {rank}/{classSize}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Top {Math.round((rank / classSize) * 100)}% of class
            </p>
          </div>
          {/* Degree Classification Card */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-600 font-medium font-poppins">
                Degree Class
              </h4>
              <AwardIcon className="text-purple-500" size={20} />
            </div>
            <p className="text-xl font-bold text-green-600">{degreeClass}</p>
            <p className="text-sm font-poppins text-gray-500 mt-1">
              Projected classification
            </p>
          </div>
          {/* Trend Card */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-600 font-poppins font-medium">
                Performance
              </h4>
              <TrendingUpIcon className="text-green-500" size={20} />
            </div>
            <div className="flex items-center gap-2">
              {semesters.slice(0, 4).map((semester, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gray-100 rounded-md p-2 text-center"
                >
                  <p className="text-xs text-gray-500 font-poppins">
                    S{index + 1}
                  </p>
                  <p
                    className={`text-sm font-poppins font-semibold ${
                      semester.gpa >= 4.0
                        ? "text-green-600"
                        : semester.gpa >= 3.0
                        ? "text-blue-600"
                        : "text-orange-600"
                    }`}
                  >
                    {semester.gpa.toFixed(1)}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-sm font-poppins text-gray-500 mt-3">
              {semesters.length > 1
                ? semesters[semesters.length - 1].gpa >
                  semesters[semesters.length - 2].gpa
                  ? "Your performance is improving!"
                  : "Focus on improving your grades"
                : "Add more semesters to track progress"}
            </p>
          </div>
        </div>
        <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="text-lg font-poppins font-medium text-gray-800 mb-2">
            Recommendations
          </h4>
          <ul className="list-disc list-inside font-poppins space-y-1 text-gray-700">
            {cgpa < 2.0 && (
              <li className="text-red-600 font-poppins">
                Warning: Your CGPA is below 2.0. Consider academic counseling.
              </li>
            )}
            {cgpa >= 2.0 && cgpa < 3.0 && (
              <li className="font-poppins">
                Focus on improving your grades in core courses to boost your
                CGPA.
              </li>
            )}
            {cgpa >= 3.0 && cgpa < 4.0 && (
              <li className="font-poppins">
                You're doing well! Consider aiming for higher grades in your
                remaining courses.
              </li>
            )}
            {cgpa >= 4.0 && (
              <li className=" font-poppins text-green-600">
                Excellent work! Maintain your current study habits.
              </li>
            )}
            <li className="font-poppins">
              To improve your class rank, aim for at least{" "}
              {(cgpa + 0.5).toFixed(2)} CGPA in your next semester.
            </li>
            <li className="font-poppins">
              Consider balancing difficult courses with easier ones each
              semester.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
