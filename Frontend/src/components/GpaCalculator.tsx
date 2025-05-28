import { useEffect, useState } from "react";
import { ResultsDisplay } from "./ResultsDisplay";
import { SemesterList } from "./SemesterList";
import { calculateGPA } from "../utils/calculations";
import axios from "axios";
import { toast } from "react-toastify";
type PredictResultResponse = {
  data: {
    cgpa: string;
    rank: string;
    topPercent: string;
    degreeClass: string;
    performance: { semester: string; gpa: number }[];
    recommendations: string[];
  };
};

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
  const [semesters, setSemesters] = useState<Semester[]>(() => {
    const saved = localStorage.getItem("gpa_semesters");
    return saved
      ? JSON.parse(saved)
      : [{ id: "1", name: "Semester 1", courses: [], gpa: 0 }];
  });
  const [classSize, setClassSize] = useState<number>(() => {
    const saved = localStorage.getItem("gpa_classSize");
    return saved ? JSON.parse(saved) : 65;
  });
  // // Other state
  // const [rank, setRank] = useState<number | null>(null);
  // const [cgpa, setCgpa] = useState<number | null>(null);
  // const [degreeClass, setDegreeClass] = useState<string | null>(null);

  // 2) Whenever semesters *or* classSize change, persist them
  useEffect(() => {
    localStorage.setItem("gpa_semesters", JSON.stringify(semesters));
  }, [semesters]);

  useEffect(() => {
    localStorage.setItem("gpa_classSize", JSON.stringify(classSize));
  }, [classSize]);

  // 3) Your existing handlers now automatically trigger a save via the effects
  const addSemester = () => {
    setSemesters([
      ...semesters,
      {
        id: Date.now().toString(),
        name: `Semester ${semesters.length + 1}`,
        courses: [],
        gpa: 0,
      },
    ]);
  };
  const addCourse = (semesterId: string, course: Course) => {
    setSemesters(
      semesters.map((sem) => {
        if (sem.id === semesterId) {
          const courses = [...sem.courses, course];
          return { ...sem, courses, gpa: calculateGPA(courses) };
        }
        return sem;
      })
    );
  };
  const removeCourse = (semesterId: string, courseId: string) => {
    setSemesters(
      semesters.map((sem) => {
        if (sem.id === semesterId) {
          const courses = sem.courses.filter((c) => c.id !== courseId);
          return { ...sem, courses, gpa: calculateGPA(courses) };
        }
        return sem;
      })
    );
  };
  const removeSemester = (semesterId: string) => {
    setSemesters(semesters.filter((sem) => sem.id !== semesterId));
  };
  // const calculateResults = () => {
  //   const calculatedCgpa = calculateCGPA(semesters);
  //   setCgpa(calculatedCgpa);
  //   let calculatedRank = Math.max(
  //     1,
  //     Math.floor((1 - calculatedCgpa / 5) * classSize)
  //   );
  //   calculatedRank = Math.min(classSize, calculatedRank);
  //   setRank(calculatedRank);
  //   setDegreeClass(predictDegreeClass(calculatedCgpa));
  // };
  const [loading, setLoading] = useState(false);
  const [predictResult, setPredictResult] =
    useState<PredictResultResponse | null>(null);

  const calculateResults = async () => {
    if (!user) return;
    setLoading(true);

    const payload = {
      no_of_semeter: semesters.length,
      semesters: semesters.map((sem) => ({
        id: sem.id,
        name: sem.name,
        courses: sem.courses.map((c) => ({
          id: c.id,
          code: c.code,
          title: c.title,
          creditUnits: c.creditUnits,
          grade: c.grade,
          gradePoint: c.gradePoint,
        })),
      })),
    };

    try {
      const res = await axios.post<PredictResultResponse>(
        "https://gpa-cgpa-calculator-e7jw.onrender.com/predict-results",
        payload
      );

      setPredictResult(res.data);
    } catch (error: any) {
      toast(error?.response?.data?.message || "Failed to fetch results", {
        type: "error",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [user, setUser] = useState<{
    message: string;
    data: {
      id: number;
      matricNumber: string;
      fullName: string;
    };
  } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-3xl font-poppins font-semibold text-gray-800">
            Hello, {user?.data.fullName}
          </h2>
          <h2 className="text-3xl font-poppins font-semibold text-gray-800">
            Matric Number: {user?.data.matricNumber}
          </h2>
        </div>
        <p className="text-gray-600 font-poppins text-sm">
          Enter your course details for each semester to calculate your GPA,
          CGPA, class rank, and projected degree classification.
        </p>
      </div>
      <div className="mb-6">
        <label
          htmlFor="classSize"
          className="block font-poppins text-sm font-medium text-gray-700 mb-1"
        >
          Class Size (Total number of students)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            id="classSize"
            className="border border-gray-300 rounded-md px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={classSize}
            onChange={(e) => setClassSize(Number(e.target.value))}
            min="1"
          />
          <span className="text-gray-500 font-poppins">students</span>
        </div>
      </div>
      <SemesterList
        semesters={semesters}
        addCourse={addCourse}
        removeCourse={removeCourse}
        removeSemester={removeSemester}
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={addSemester}
          className="bg-gray-200 font-poppins hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition"
        >
          Add Another Semester
        </button>
        <button
          onClick={calculateResults}
          className="bg-blue-600 font-poppins hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50"
          disabled={
            semesters.some((sem) => sem.courses.length === 0) || loading
          }
        >
          {loading ? "Calculating..." : "Calculate Results"}
        </button>
      </div>
      {predictResult && (
        <ResultsDisplay
          cgpa={parseFloat(predictResult.data.cgpa)}
          rank={predictResult.data.rank}
          classSize={classSize}
          performance={predictResult.data.performance}
          topPercent={predictResult.data.topPercent}
          degreeClass={predictResult.data.degreeClass}
          semesters={semesters}
          recommendations={predictResult.data.recommendations}
        />
      )}
    </div>
  );
};
