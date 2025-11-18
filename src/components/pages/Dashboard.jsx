import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { classService } from "@/services/api/classService";
import { studentService } from "@/services/api/studentService";
import { assignmentService } from "@/services/api/assignmentService";
import { attendanceService } from "@/services/api/attendanceService";
import { gradeService } from "@/services/api/gradeService";

const Dashboard = () => {
  const [data, setData] = useState({
    classes: [],
    students: [],
    assignments: [],
    attendance: [],
    grades: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);

      const [classes, students, assignments, attendance, grades] = await Promise.all([
        classService.getAll(),
        studentService.getAll(),
        assignmentService.getAll(),
        attendanceService.getAll(),
        gradeService.getAll()
      ]);

      setData({
        classes,
        students,
        assignments,
        attendance,
        grades
      });
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="animate-pulse h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="animate-pulse h-4 bg-gray-100 rounded w-96"></div>
          </div>
          <Loading variant="stats" />
          <div className="mt-8">
            <Loading variant="cards" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <ErrorView message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalClasses = data.classes.length;
  const totalStudents = data.students.length;
  const totalAssignments = data.assignments.length;
  
  // Calculate average attendance rate
  const attendanceStats = data.attendance.reduce((acc, record) => {
    acc.total++;
    if (record.status === "present" || record.status === "late") {
      acc.present++;
    }
    return acc;
  }, { total: 0, present: 0 });
  
  const attendanceRate = attendanceStats.total > 0 ? 
    Math.round((attendanceStats.present / attendanceStats.total) * 100) : 0;

  // Get upcoming assignments (next 7 days)
  const upcomingAssignments = data.assignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const nextWeek = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
    return dueDate >= now && dueDate <= nextWeek && assignment.status === "active";
  }).slice(0, 5);

  // Get recent activity (recent grades)
  const recentActivity = data.grades
    .sort((a, b) => new Date(b.gradedAt) - new Date(a.gradedAt))
    .slice(0, 5);

  // Get class with most students
  const classEnrollments = data.classes.map(classItem => ({
    ...classItem,
    enrollmentCount: classItem.studentIds?.length || 0
  })).sort((a, b) => b.enrollmentCount - a.enrollmentCount);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening in your school today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Classes"
            value={totalClasses}
            icon="BookOpen"
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
          />
          <StatCard
            title="Total Students"
            value={totalStudents}
            icon="Users"
            iconColor="text-green-600"
            iconBg="bg-green-50"
          />
          <StatCard
            title="Active Assignments"
            value={totalAssignments}
            icon="FileText"
            iconColor="text-purple-600"
            iconBg="bg-purple-50"
          />
          <StatCard
            title="Attendance Rate"
            value={`${attendanceRate}%`}
            icon="Calendar"
            iconColor="text-orange-600"
            iconBg="bg-orange-50"
            change={attendanceRate >= 90 ? "+2%" : "-1%"}
            changeType={attendanceRate >= 90 ? "positive" : "negative"}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Assignments */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h3>
                <Link 
                  to="/assignments" 
                  className="text-primary hover:text-blue-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
              
              {upcomingAssignments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAssignments.map((assignment) => (
                    <div key={assignment.Id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-150">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {assignment.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {assignment.description?.length > 80 
                              ? `${assignment.description.substring(0, 80)}...` 
                              : assignment.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <ApperIcon name="BookOpen" className="h-4 w-4 mr-1" />
                              Class {assignment.classId}
                            </span>
                            <span className="flex items-center">
                              <ApperIcon name="Clock" className="h-4 w-4 mr-1" />
                              Due {format(new Date(assignment.dueDate), "MMM d, yyyy")}
                            </span>
                            <span className="flex items-center">
                              <ApperIcon name="Target" className="h-4 w-4 mr-1" />
                              {assignment.totalPoints} pts
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Badge variant="active">
                            {assignment.submissions?.length || 0} submissions
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="FileText" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No upcoming assignments</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white rounded-lg shadow-card p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Grades</h3>
                <Link 
                  to="/grades" 
                  className="text-primary hover:text-blue-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
              
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((grade) => {
                    const student = data.students.find(s => s.Id === grade.studentId);
                    const assignment = data.assignments.find(a => a.Id === grade.assignmentId);
                    
                    return (
                      <div key={grade.Id} className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">
                            {student ? `${student.firstName[0]}${student.lastName[0]}` : "?"}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {student ? `${student.firstName} ${student.lastName}` : "Unknown Student"}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {assignment ? assignment.title : "Unknown Assignment"}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Badge 
                            variant={grade.score >= (assignment?.totalPoints * 0.9) ? "success" : 
                                    grade.score >= (assignment?.totalPoints * 0.7) ? "warning" : "error"}
                          >
                            {grade.score}/{assignment?.totalPoints || 0}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="GraduationCap" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent grades</p>
                </div>
              )}
            </div>

            {/* Top Classes */}
            <div className="bg-white rounded-lg shadow-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Classes Overview</h3>
              
              {classEnrollments.length > 0 ? (
                <div className="space-y-4">
                  {classEnrollments.slice(0, 4).map((classItem) => (
                    <div key={classItem.Id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <ApperIcon name="BookOpen" className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {classItem.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {classItem.subject} • {classItem.grade}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500">
                        {classItem.enrollmentCount} students
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="BookOpen" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No classes found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;