import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";

const GradeBook = ({ 
  grades, 
  students, 
  assignments, 
  selectedClass,
  onClassChange,
  loading, 
  error, 
  onRetry,
  onGradeUpdate
}) => {
  const [editingGrade, setEditingGrade] = useState(null);
  const [editValue, setEditValue] = useState("");

  if (loading) {
    return <Loading variant="table" />;
  }

  if (error) {
    return (
      <ErrorView 
        message={error} 
        onRetry={onRetry}
      />
    );
  }

  if (!students || students.length === 0) {
    return (
      <Empty
        icon="GraduationCap"
        title="No students in selected class"
        description="Add students to this class to start recording grades."
        actionText="Manage Students"
      />
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <Empty
        icon="FileText"
        title="No assignments found"
        description="Create assignments for this class to start grading."
        actionText="Create Assignment"
      />
    );
  }

  const handleGradeClick = (studentId, assignmentId) => {
    const existingGrade = grades.find(g => 
      g.studentId === studentId && g.assignmentId === assignmentId
    );
    setEditingGrade({ studentId, assignmentId });
    setEditValue(existingGrade ? existingGrade.score.toString() : "");
  };

  const handleGradeUpdate = async (studentId, assignmentId, score) => {
    const numericScore = parseFloat(score);
    if (isNaN(numericScore) || numericScore < 0) return;

    const assignment = assignments.find(a => a.Id === assignmentId);
    if (numericScore > assignment?.totalPoints) {
      alert(`Score cannot exceed ${assignment.totalPoints} points`);
      return;
    }

    await onGradeUpdate(studentId, assignmentId, numericScore);
    setEditingGrade(null);
    setEditValue("");
  };

  const handleKeyDown = (e, studentId, assignmentId) => {
    if (e.key === "Enter") {
      handleGradeUpdate(studentId, assignmentId, editValue);
    } else if (e.key === "Escape") {
      setEditingGrade(null);
      setEditValue("");
    }
  };

  const getGradeForStudent = (studentId, assignmentId) => {
    return grades.find(g => g.studentId === studentId && g.assignmentId === assignmentId);
  };

  const calculateStudentAverage = (studentId) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return "-";
    
    let totalPoints = 0;
    let totalPossible = 0;
    
    studentGrades.forEach(grade => {
      const assignment = assignments.find(a => a.Id === grade.assignmentId);
      if (assignment) {
        totalPoints += grade.score;
        totalPossible += assignment.totalPoints;
      }
    });
    
    return totalPossible > 0 ? Math.round((totalPoints / totalPossible) * 100) : 0;
  };

  const getGradeColor = (score, totalPoints) => {
    const percentage = (score / totalPoints) * 100;
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
  };

  const getStudentInitials = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    if (!student) return "?";
    return `${student.firstName?.[0] || ""}${student.lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Grade Book</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Class:</label>
                <Select
                  value={selectedClass}
                  onChange={(e) => onClassChange(e.target.value)}
                  className="w-48"
                >
                  <option value="">Select a class</option>
                  <option value="1">Mathematics 101</option>
                  <option value="2">English Literature</option>
                  <option value="3">Biology Basics</option>
                </Select>
              </div>
              <Button size="sm" variant="outline" icon="Download">
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                  Student
                </th>
                {assignments.map((assignment) => (
                  <th key={assignment.Id} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    <div className="truncate" title={assignment.title}>
                      {assignment.title.length > 10 ? 
                        `${assignment.title.substring(0, 10)}...` : 
                        assignment.title
                      }
                    </div>
                    <div className="text-gray-400 font-normal">
                      {assignment.totalPoints}pts
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.Id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10 border-r border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">
                          {getStudentInitials(student.Id)}
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {getStudentName(student.Id)}
                        </div>
                      </div>
                    </div>
                  </td>
                  {assignments.map((assignment) => {
                    const grade = getGradeForStudent(student.Id, assignment.Id);
                    const isEditing = editingGrade?.studentId === student.Id && 
                                    editingGrade?.assignmentId === assignment.Id;
                    
                    return (
                      <td key={assignment.Id} className="px-3 py-4 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleGradeUpdate(student.Id, assignment.Id, editValue)}
                            onKeyDown={(e) => handleKeyDown(e, student.Id, assignment.Id)}
                            className="w-16 px-2 py-1 text-sm text-center border border-primary rounded focus:outline-none"
                            min="0"
                            max={assignment.totalPoints}
                            autoFocus
                          />
                        ) : (
                          <button
                            onClick={() => handleGradeClick(student.Id, assignment.Id)}
                            className={cn(
                              "w-16 px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors duration-150",
                              grade ? getGradeColor(grade.score, assignment.totalPoints) : "text-gray-400"
                            )}
                          >
                            {grade ? `${grade.score}/${assignment.totalPoints}` : "-"}
                          </button>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {calculateStudentAverage(student.Id)}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GradeBook;