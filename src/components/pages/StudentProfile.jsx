import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";
import { gradeService } from "@/services/api/gradeService";
import { attendanceService } from "@/services/api/attendanceService";

const StudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const loadStudentData = async () => {
    try {
      setError("");
      setLoading(true);

      const [studentData, allClasses, studentGrades, attendanceData] = await Promise.all([
        studentService.getById(id),
        classService.getAll(),
        gradeService.getByStudentId(id),
        attendanceService.getByStudentId(id)
      ]);

      if (!studentData) {
        setError("Student not found.");
        return;
      }

      // Filter classes the student is enrolled in
      const studentClasses = allClasses.filter(classItem => 
        studentData.enrolledClasses?.includes(classItem.Id)
      );

      // Calculate attendance statistics
      const stats = await attendanceService.getAttendanceStats(parseInt(id));

      setStudent(studentData);
      setEnrolledClasses(studentClasses);
      setGrades(studentGrades);
      setAttendanceStats(stats);
    } catch (err) {
      setError("Failed to load student profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadStudentData();
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
          <ErrorView message={error} onRetry={loadStudentData} />
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Empty
            icon="User"
            title="Student not found"
            description="The student you're looking for doesn't exist or has been removed."
            actionText="Back to Students"
            onAction={() => window.history.back()}
          />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: "User" },
    { id: "classes", name: "Classes", icon: "BookOpen" },
    { id: "grades", name: "Grades", icon: "GraduationCap" },
    { id: "attendance", name: "Attendance", icon: "Calendar" }
  ];

  const getStudentInitials = () => {
    return `${student.firstName?.[0] || ""}${student.lastName?.[0] || ""}`.toUpperCase();
  };

  const calculateOverallAverage = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + grade.score, 0);
    return Math.round(total / grades.length);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <ApperIcon name="BookOpen" className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Enrolled Classes</p>
              <p className="text-2xl font-bold text-gray-900">{enrolledClasses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <ApperIcon name="GraduationCap" className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overall Average</p>
              <p className="text-2xl font-bold text-gray-900">{calculateOverallAverage()}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <ApperIcon name="Calendar" className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{attendanceStats.attendanceRate || 0}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <ApperIcon name="Award" className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Grades</p>
              <p className="text-2xl font-bold text-gray-900">{grades.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Mail" className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-gray-900">{student.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ApperIcon name="GraduationCap" className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Grade Level</p>
                <p className="text-gray-900">{student.gradeLevel}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ApperIcon name="Phone" className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Guardian Contact</p>
                <p className="text-gray-900">{student.guardianContact}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ApperIcon name="Calendar" className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Enrolled Since</p>
                <p className="text-gray-900">
                  {new Date(student.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Performance</h3>
          {grades.length > 0 ? (
            <div className="space-y-3">
              {grades.slice(0, 5).map((grade) => (
                <div key={grade.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Assignment {grade.assignmentId}</p>
                    <p className="text-sm text-gray-600">
                      Class {grade.classId}
                    </p>
                  </div>
                  <Badge variant={grade.score >= 90 ? "success" : grade.score >= 70 ? "warning" : "error"}>
                    {grade.score}%
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No grades recorded yet</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderClasses = () => (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Enrolled Classes</h3>
      </div>
      {enrolledClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {enrolledClasses.map((classItem) => (
            <div key={classItem.Id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-150">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <ApperIcon name="BookOpen" className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">{classItem.name}</h4>
                    <p className="text-sm text-gray-600">{classItem.grade}</p>
                  </div>
                </div>
                <Badge variant="default">{classItem.subject}</Badge>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
                  {classItem.schedule}
                </div>
              </div>
              <Link to={`/classes/${classItem.Id}`}>
                <Button size="sm" variant="outline" className="w-full">
                  View Class Details
                </Button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12">
          <Empty
            icon="BookOpen"
            title="No classes enrolled"
            description="This student is not enrolled in any classes yet."
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
            <Link to="/students" className="hover:text-gray-700">Students</Link>
            <ApperIcon name="ChevronRight" className="h-4 w-4" />
            <span className="text-gray-900">{student.firstName} {student.lastName}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                {getStudentInitials()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {student.firstName} {student.lastName}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="flex items-center">
                    <ApperIcon name="GraduationCap" className="h-4 w-4 mr-1" />
                    {student.gradeLevel}
                  </span>
                  <span className="flex items-center">
                    <ApperIcon name="BookOpen" className="h-4 w-4 mr-1" />
                    {enrolledClasses.length} classes
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button icon="Edit">
                Edit Profile
              </Button>
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
          {activeTab === "classes" && renderClasses()}
          {activeTab === "grades" && (
            <div className="text-center py-12">
              <ApperIcon name="GraduationCap" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Detailed grade view coming soon</p>
            </div>
          )}
          {activeTab === "attendance" && (
            <div className="text-center py-12">
              <ApperIcon name="Calendar" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Attendance history coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;