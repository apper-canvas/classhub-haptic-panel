import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";

const ClassList = ({ 
  classes, 
  loading, 
  error, 
  onRetry, 
  onCreateClass,
  viewMode = "grid" 
}) => {
  const [localViewMode, setLocalViewMode] = useState(viewMode);

  if (loading) {
    return <Loading variant="cards" />;
  }

  if (error) {
    return (
      <ErrorView 
        message={error} 
        onRetry={onRetry}
      />
    );
  }

  if (!classes || classes.length === 0) {
    return (
      <Empty
        icon="BookOpen"
        title="No classes found"
        description="Start by creating your first class to organize students and assignments."
        actionText="Create Class"
        onAction={onCreateClass}
      />
    );
  }

  if (localViewMode === "table") {
    return (
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Classes</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={localViewMode === "grid" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setLocalViewMode("grid")}
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
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classes.map((classItem) => (
                <tr key={classItem.Id} className="table-row-hover">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <ApperIcon name="BookOpen" className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {classItem.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="default">{classItem.subject}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {classItem.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {classItem.studentIds?.length || 0} students
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {classItem.schedule}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/classes/${classItem.Id}`}
                      className="text-primary hover:text-blue-700"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Classes</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant={localViewMode === "grid" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setLocalViewMode("grid")}
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
        {classes.map((classItem) => (
          <div key={classItem.Id} className="bg-white rounded-lg shadow-card p-6 hover:shadow-lg transition-shadow duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <ApperIcon name="BookOpen" className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {classItem.name}
                  </h4>
                  <p className="text-sm text-gray-600">{classItem.grade}</p>
                </div>
              </div>
              <Badge variant="default">{classItem.subject}</Badge>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="Users" className="h-4 w-4 mr-2" />
                {classItem.studentIds?.length || 0} students enrolled
              </div>
              <div className="flex items-start text-sm text-gray-600">
                <ApperIcon name="Clock" className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span className="break-words">{classItem.schedule}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Created {new Date(classItem.createdAt).toLocaleDateString()}
              </div>
              <Link to={`/classes/${classItem.Id}`}>
                <Button size="sm">
                  View Details
                  <ApperIcon name="ChevronRight" className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassList;