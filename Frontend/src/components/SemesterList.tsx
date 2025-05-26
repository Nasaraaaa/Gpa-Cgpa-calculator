import React from 'react';
import { CourseForm } from './CourseForm';
import { Course, Semester } from './GpaCalculator';
import { Trash2Icon } from 'lucide-react';
type SemesterListProps = {
  semesters: Semester[];
  addCourse: (semesterId: string, course: Course) => void;
  removeCourse: (semesterId: string, courseId: string) => void;
  removeSemester: (semesterId: string) => void;
};
export const SemesterList: React.FC<SemesterListProps> = ({
  semesters,
  addCourse,
  removeCourse,
  removeSemester
}) => {
  return <div className="space-y-8">
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
    </div>;
};