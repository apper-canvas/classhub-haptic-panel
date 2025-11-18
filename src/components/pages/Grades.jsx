import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import GradeBook from "@/components/organisms/GradeBook";
import { gradeService } from "@/services/api/gradeService";
import { studentService } from "@/services/api/studentService";
import { assignmentService } from "@/services/api/assignmentService";
import { classService } from "@/services/api/classService";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [allGrades, allStudents, allAssignments, allClasses] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll(),
        assignmentService.getAll(),
        classService.getAll()
      ]);

      setGrades(allGrades);
      setStudents(allStudents);
      setAssignments(allAssignments);
      setClasses(allClasses);
      
      // Set default class if available
      if (allClasses.length > 0 && !selectedClass) {
        setSelectedClass(allClasses[0].Id.toString());
      }
    } catch (err) {
      setError("Failed to load grades data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
  };

  const handleGradeUpdate = async (studentId, assignmentId, score) => {
    try {
      // Check if grade already exists
      const existingGrade = grades.find(g => 
        g.studentId === studentId && g.assignmentId === assignmentId
      );

      if (existingGrade) {
        // Update existing grade
        const updatedGrade = await gradeService.update(existingGrade.Id, { score });
        setGrades(prev => prev.map(g => 
          g.Id === existingGrade.Id ? updatedGrade : g
        ));
        toast.success("Grade updated successfully!");
      } else {
        // Create new grade
        const newGrade = await gradeService.create({
          studentId,
          assignmentId,
          classId: parseInt(selectedClass),
          score,
          feedback: ""
        });
        setGrades(prev => [...prev, newGrade]);
        toast.success("Grade recorded successfully!");
      }
    } catch (error) {
      toast.error("Failed to save grade. Please try again.");
    }
  };

  // Filter data based on selected class
  const filteredStudents = selectedClass ? 
    students.filter(s => s.enrolledClasses?.includes(parseInt(selectedClass))) : 
    [];
  
  const filteredAssignments = selectedClass ? 
    assignments.filter(a => a.classId === parseInt(selectedClass)) : 
    [];
  
  const filteredGrades = selectedClass ? 
    grades.filter(g => g.classId === parseInt(selectedClass)) : 
    [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Grade Book</h1>
          <p className="text-gray-600">
            Record and manage student grades for assignments and assessments.
          </p>
        </div>

        {/* Grade Book */}
        <GradeBook
          grades={filteredGrades}
          students={filteredStudents}
          assignments={filteredAssignments}
          selectedClass={selectedClass}
          onClassChange={handleClassChange}
          loading={loading}
          error={error}
          onRetry={loadData}
          onGradeUpdate={handleGradeUpdate}
        />
      </div>
    </div>
  );
};

export default Grades;