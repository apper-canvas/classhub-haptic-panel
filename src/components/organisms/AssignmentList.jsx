import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";

const AssignmentList = ({ 
  assignments, 
  loading, 
  error, 
  onRetry, 
  onCreateAssignment,
  onEditAssignment
}) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

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

  if (!assignments || assignments.length === 0) {
    return (
      <Empty
        icon="FileText"
        title="No assignments found"
        description="Create assignments to track student progress and manage coursework."
        actionText="Create Assignment"
        onAction={onCreateAssignment}
      />
    );
  }

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === "all") return true;
    return assignment.status === filter;
  });

  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        return new Date(a.dueDate) - new Date(b.dueDate);
      case "title":
        return a.title.localeCompare(b.title);
      case "points":
        return b.totalPoints - a.totalPoints;
      default:
        return 0;
    }
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case "active": return "success";
      case "draft": return "default";
      default: return "default";
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="form-input text-sm"
              >
                <option value="all">All Assignments</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input text-sm"
              >
                <option value="dueDate">Due Date</option>
                <option value="title">Title</option>
                <option value="points">Points</option>
              </select>
            </div>
          </div>
          <Button onClick={onCreateAssignment} icon="Plus">
            Create Assignment
          </Button>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAssignments.map((assignment) => (
                <tr key={assignment.Id} className="table-row-hover">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <ApperIcon name="FileText" className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {assignment.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {assignment.description?.length > 60 
                            ? `${assignment.description.substring(0, 60)}...` 
                            : assignment.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Class {assignment.classId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(assignment.dueDate), "MMM d, yyyy")}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(assignment.dueDate), "h:mm a")}
                    </div>
                    {isOverdue(assignment.dueDate) && assignment.status === "active" && (
                      <div className="text-xs text-red-600 font-medium">Overdue</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {assignment.totalPoints} pts
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <ApperIcon name="Users" className="h-4 w-4 mr-1 text-gray-400" />
                      {assignment.submissions?.length || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusVariant(assignment.status)}>
                      {assignment.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEditAssignment(assignment)}
                        className="text-primary hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <span className="text-gray-300">|</span>
                      <button className="text-gray-600 hover:text-gray-900">
                        Grades
                      </button>
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

export default AssignmentList;