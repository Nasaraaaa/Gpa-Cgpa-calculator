// Constants
const GRADE_POINTS = {
  'A': 5.0,
  'B': 4.0,
  'C': 3.0,
  'D': 2.0,
  'E': 1.0,
  'F': 0.0
};
// State Management
let semesters = [{
  id: '1',
  name: 'Semester 1',
  courses: [],
  gpa: 0
}];
// Utility Functions
function calculateGPA(courses) {
  if (courses.length === 0) return 0;
  let totalQualityPoints = 0;
  let totalCreditUnits = 0;
  courses.forEach(course => {
    totalQualityPoints += course.gradePoint * course.creditUnits;
    totalCreditUnits += course.creditUnits;
  });
  return totalCreditUnits > 0 ? totalQualityPoints / totalCreditUnits : 0;
}
function calculateCGPA(semesters) {
  const allCourses = semesters.flatMap(semester => semester.courses);
  return calculateGPA(allCourses);
}
function predictDegreeClass(cgpa) {
  if (cgpa >= 4.5) return "First Class Honours";
  if (cgpa >= 3.5) return "Second Class Upper";
  if (cgpa >= 2.5) return "Second Class Lower";
  if (cgpa >= 1.5) return "Third Class";
  if (cgpa >= 1.0) return "Pass";
  return "Fail";
}
// DOM Functions
function createSemesterElement(semester) {
  const template = document.getElementById('semesterTemplate');
  const semesterElement = template.content.cloneNode(true);
  const semesterCard = semesterElement.querySelector('.semester-card');
  semesterCard.dataset.semesterId = semester.id;
  semesterCard.querySelector('.semester-title').textContent = semester.name;
  semesterCard.querySelector('.semester-gpa').textContent = semester.gpa.toFixed(2);
  // Add event listeners
  semesterCard.querySelector('.course-form').addEventListener('submit', handleAddCourse);
  semesterCard.querySelector('.remove-semester')?.addEventListener('click', () => removeSemester(semester.id));
  return semesterCard;
}
function updateSemesterDisplay(semester) {
  const semesterElement = document.querySelector(`[data-semester-id="${semester.id}"]`);
  if (!semesterElement) return;
  semesterElement.querySelector('.semester-gpa').textContent = semester.gpa.toFixed(2);
  const coursesTable = semesterElement.querySelector('.courses-table tbody');
  coursesTable.innerHTML = '';
  semester.courses.forEach(course => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${course.code}</td>
            <td>${course.title}</td>
            <td>${course.creditUnits}</td>
            <td>${course.grade}</td>
            <td>${course.gradePoint}</td>
            <td>
                <button onclick="removeCourse('${semester.id}', '${course.id}')" class="btn-danger">
                    <i data-lucide="trash-2"></i>
                </button>
            </td>
        `;
    coursesTable.appendChild(row);
  });
  semesterElement.querySelector('.courses-table').classList.toggle('hidden', semester.courses.length === 0);
}
// Event Handlers
function handleAddCourse(e) {
  e.preventDefault();
  const form = e.target;
  const semesterId = form.closest('.semester-card').dataset.semesterId;
  const course = {
    id: Date.now().toString(),
    code: form.courseCode.value,
    title: form.courseTitle.value,
    creditUnits: parseInt(form.creditUnits.value),
    grade: form.grade.value,
    gradePoint: GRADE_POINTS[form.grade.value]
  };
  const semesterIndex = semesters.findIndex(s => s.id === semesterId);
  if (semesterIndex === -1) return;
  semesters[semesterIndex].courses.push(course);
  semesters[semesterIndex].gpa = calculateGPA(semesters[semesterIndex].courses);
  updateSemesterDisplay(semesters[semesterIndex]);
  form.reset();
  form.creditUnits.value = "3";
  form.grade.value = "A";
}
function removeCourse(semesterId, courseId) {
  const semesterIndex = semesters.findIndex(s => s.id === semesterId);
  if (semesterIndex === -1) return;
  semesters[semesterIndex].courses = semesters[semesterIndex].courses.filter(c => c.id !== courseId);
  semesters[semesterIndex].gpa = calculateGPA(semesters[semesterIndex].courses);
  updateSemesterDisplay(semesters[semesterIndex]);
}
function removeSemester(semesterId) {
  if (semesters.length <= 1) return;
  semesters = semesters.filter(s => s.id !== semesterId);
  document.querySelector(`[data-semester-id="${semesterId}"]`).remove();
}
function calculateResults() {
  const classSize = parseInt(document.getElementById('classSize').value);
  const cgpa = calculateCGPA(semesters);
  const rank = Math.min(classSize, Math.max(1, Math.floor((1 - cgpa / 5) * classSize)));
  const degreeClass = predictDegreeClass(cgpa);
  displayResults(cgpa, rank, classSize, degreeClass);
}
function displayResults(cgpa, rank, classSize, degreeClass) {
  const resultsDisplay = document.getElementById('resultsDisplay');
  resultsDisplay.classList.remove('hidden');
  const cgpaColor = cgpa >= 4.5 ? 'text-green-600' : cgpa >= 3.5 ? 'text-blue-600' : cgpa >= 2.5 ? 'text-yellow-600' : cgpa >= 1.5 ? 'text-orange-600' : 'text-red-600';
  resultsDisplay.innerHTML = `
        <div class="results-header">
            <h3>Your Academic Results</h3>
        </div>
        <div class="results-grid">
            <div class="result-card">
                <div class="result-card-header">
                    <h4>Cumulative GPA</h4>
                    <i data-lucide="bar-chart"></i>
                </div>
                <p class="result-value ${cgpaColor}">${cgpa.toFixed(2)}</p>
                <p class="result-description">out of 5.00 maximum</p>
            </div>
            <div class="result-card">
                <div class="result-card-header">
                    <h4>Class Rank</h4>
                    <i data-lucide="trophy"></i>
                </div>
                <p class="result-value">${rank}/${classSize}</p>
                <p class="result-description">Top ${Math.round(rank / classSize * 100)}% of class</p>
            </div>
            <div class="result-card">
                <div class="result-card-header">
                    <h4>Degree Class</h4>
                    <i data-lucide="award"></i>
                </div>
                <p class="result-value">${degreeClass}</p>
                <p class="result-description">Projected classification</p>
            </div>
        </div>
    `;
  // Refresh Lucide icons
  lucide.createIcons();
}
// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  // Initialize Lucide icons
  lucide.createIcons();
  // Render initial semester
  const semestersList = document.getElementById('semestersList');
  semestersList.appendChild(createSemesterElement(semesters[0]));
  // Add event listeners
  document.getElementById('addSemester').addEventListener('click', () => {
    const newSemester = {
      id: Date.now().toString(),
      name: `Semester ${semesters.length + 1}`,
      courses: [],
      gpa: 0
    };
    semesters.push(newSemester);
    semestersList.appendChild(createSemesterElement(newSemester));
  });
  document.getElementById('calculateResults').addEventListener('click', calculateResults);
});