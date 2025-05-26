import { Course, Semester } from "../components/GpaCalculator";
// Calculate GPA for a single semester
export const calculateGPA = (courses: Course[]): number => {
  if (courses.length === 0) return 0;
  let totalQualityPoints = 0;
  let totalCreditUnits = 0;
  courses.forEach(course => {
    totalQualityPoints += course.gradePoint * course.creditUnits;
    totalCreditUnits += course.creditUnits;
  });
  return totalCreditUnits > 0 ? totalQualityPoints / totalCreditUnits : 0;
};
// Calculate CGPA across all semesters
export const calculateCGPA = (semesters: Semester[]): number => {
  let allCourses: Course[] = [];
  semesters.forEach(semester => {
    allCourses = [...allCourses, ...semester.courses];
  });
  return calculateGPA(allCourses);
};
// Predict degree classification based on CGPA
export const predictDegreeClass = (cgpa: number): string => {
  if (cgpa >= 4.5) return "First Class Honours";
  if (cgpa >= 3.5) return "Second Class Upper";
  if (cgpa >= 2.5) return "Second Class Lower";
  if (cgpa >= 1.5) return "Third Class";
  if (cgpa >= 1.0) return "Pass";
  return "Fail";
};