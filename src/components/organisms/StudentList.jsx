import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";

const StudentList = ({ 
  students, 
  loading, 
  error, 
  onRetry, 
  onCreateStudent,
  viewMode = "table" 
}) => {
  const [localViewMode, setLocalViewMode] = useState(viewMode);

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
        icon="Users"
        title="No students found"
        description="Start by adding students to your school to manage their classes and grades."
        actionText="Add Student"
        onAction={onCreateStudent}
      />
    );
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  if (localViewMode === "cards") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Students</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={localViewMode === "cards" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setLocalViewMode("cards")}
              icon="Grid3x3"
            />
            <Button
              variant={localViewMode === "table" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setLocalViewMode("table")}
              icon="List"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div key={student.Id} className="bg-white rounded-lg shadow-card p-6 hover:shadow-lg transition-shadow duration-150">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                  {getInitials(student.firstName, student.lastName)}
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {student.firstName} {student.lastName}
                  </h4>
                  <p className="text-sm text-gray-600">{student.gradeLevel}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
                  {student.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
                  {student.guardianContact}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="BookOpen" className="h-4 w-4 mr-2" />
                  {student.enrolledClasses?.length || 0} classes enrolled
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Enrolled {new Date(student.createdAt).toLocaleDateString()}
                </div>
                <Link to={`/students/${student.Id}`}>
                  <Button size="sm">
                    View Profile
                    <ApperIcon name="ChevronRight" className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Students</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant={localViewMode === "cards" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setLocalViewMode("cards")}
            icon="Grid3x3"
          />
          <Button
            variant={localViewMode === "table" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setLocalViewMode("table")}
            icon="List"
          />
        </div>
      </div>
      
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guardian Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classes
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
                        {getInitials(student.firstName, student.lastName)}
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.guardianContact}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.enrolledClasses?.length || 0} classes
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
    </div>
  );
};

export default StudentList;