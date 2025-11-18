import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";
import { assignmentService } from "@/services/api/assignmentService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";

const ClassDetail = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const loadClassData = async () => {
    try {
      setError("");
      setLoading(true);

      const [classInfo, allStudents, classAssignments, classGrades, classAttendance] = await Promise.all([
        classService.getById(id),
        studentService.getAll(),
        assignmentService.getByClassId(id),
        gradeService.getByClassId(id),
        attendanceService.getByClassId(id)
      ]);

      if (!classInfo) {
        setError("Class not found.");
        return;
      }

      // Filter students enrolled in this class
      const enrolledStudents = allStudents.filter(student => 
        student.enrolledClasses?.includes(parseInt(id))
      );

      setClassData(classInfo);
      setStudents(enrolledStudents);
      setAssignments(classAssignments);
      setGrades(classGrades);
      setAttendance(classAttendance);
    } catch (err) {
      setError("Failed to load class details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadClassData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-100 rounded w-96 mb-8"></div>
          </div>
          <Loading variant="cards" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <ErrorView message={error} onRetry={loadClassData} />
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Empty
            icon="BookOpen"
            title="Class not found"
            description="The class you're looking for doesn't exist or has been removed."
            actionText="Back to Classes"
            onAction={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: "LayoutDashboard" },
    { id: "students", name: "Students", icon: "Users" },
    { id: "assignments", name: "Assignments", icon: "FileText" },
    { id: "grades", name: "Grades", icon: "GraduationCap" },
    { id: "attendance", name: "Attendance", icon: "Calendar" }
  ];

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
  };

  const getStudentInitials = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    if (!student) return "?";
    return `${student.firstName?.[0] || ""}${student.lastName?.[0] || ""}`.toUpperCase();
  };

  const calculateClassAverage = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + grade.score, 0);
    const totalPossible = grades.length * 100; // Assuming normalized to 100
    return Math.round((total / totalPossible) * 100);
  };

  const getAttendanceRate = () => {
    if (attendance.length === 0) return 0;
    const presentCount = attendance.filter(a => a.status === "present" || a.status === "late").length;
    return Math.round((presentCount / attendance.length) * 100);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <ApperIcon name="Users" className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Students</p>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <ApperIcon name="FileText" className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <ApperIcon name="GraduationCap" className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Class Average</p>
              <p className="text-2xl font-bold text-gray-900">{calculateClassAverage()}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <ApperIcon name="Calendar" className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{getAttendanceRate()}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Assignments</h3>
          {assignments.length > 0 ? (
            <div className="space-y-3">
              {assignments.slice(0, 5).map((assignment) => (
                <div key={assignment.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{assignment.title}</p>
                    <p className="text-sm text-gray-600">
                      Due {format(new Date(assignment.dueDate), "MMM d, yyyy")}
                    </p>
                  </div>
                  <Badge variant={assignment.status === "active" ? "success" : "default"}>
                    {assignment.totalPoints} pts
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No assignments yet</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Grades</h3>
          {grades.length > 0 ? (
            <div className="space-y-3">
              {grades.slice(0, 5).map((grade) => (
                <div key={grade.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">
                      {getStudentInitials(grade.studentId)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{getStudentName(grade.studentId)}</p>
                      <p className="text-sm text-gray-600">
                        {assignments.find(a => a.Id === grade.assignmentId)?.title || "Unknown Assignment"}
                      </p>
                    </div>
                  </div>
                  <Badge variant={grade.score >= 90 ? "success" : grade.score >= 70 ? "warning" : "error"}>
                    {grade.score}%
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No grades yet</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Enrolled Students</h3>
      </div>
      {students.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.Id} className="table-row-hover">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                          {getStudentInitials(student.Id)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="default">{student.gradeLevel}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/students/${student.Id}`}
                      className="text-primary hover:text-blue-700"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12">
          <Empty
            icon="Users"
            title="No students enrolled"
            description="This class doesn't have any students enrolled yet."
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link to="/classes" className="hover:text-gray-700">Classes</Link>
            <ApperIcon name="ChevronRight" className="h-4 w-4" />
            <span className="text-gray-900">{classData.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{classData.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center">
                  <ApperIcon name="Book" className="h-4 w-4 mr-1" />
                  {classData.subject}
                </span>
                <span className="flex items-center">
                  <ApperIcon name="GraduationCap" className="h-4 w-4 mr-1" />
                  {classData.grade}
                </span>
                <span className="flex items-center">
                  <ApperIcon name="Users" className="h-4 w-4 mr-1" />
                  {students.length} students
                </span>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button icon="Settings">
                Manage Class
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <ApperIcon name="Clock" className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Schedule</p>
                <p className="text-blue-700">{classData.schedule}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <ApperIcon name={tab.icon} className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && renderOverview()}
          {activeTab === "students" && renderStudents()}
          {activeTab === "assignments" && (
            <div className="text-center py-12">
              <ApperIcon name="FileText" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Assignment management coming soon</p>
            </div>
          )}
          {activeTab === "grades" && (
            <div className="text-center py-12">
              <ApperIcon name="GraduationCap" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Grade management coming soon</p>
            </div>
          )}
          {activeTab === "attendance" && (
            <div className="text-center py-12">
              <ApperIcon name="Calendar" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Attendance tracking coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;