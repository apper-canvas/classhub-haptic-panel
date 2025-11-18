import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AssignmentList from "@/components/organisms/AssignmentList";
import CreateAssignmentModal from "@/components/organisms/CreateAssignmentModal";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import { assignmentService } from "@/services/api/assignmentService";
import { classService } from "@/services/api/classService";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      const [assignmentsData, classesData] = await Promise.all([
        assignmentService.getAll(),
        classService.getAll()
      ]);
      setAssignments(assignmentsData);
      setClasses(classesData);
      setFilteredAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load assignments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const applyFilters = () => {
    let filtered = [...assignments];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply class filter
    if (classFilter) {
      filtered = filtered.filter(assignment => assignment.classId === parseInt(classFilter));
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(assignment => assignment.status === statusFilter);
    }

    setFilteredAssignments(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, classFilter, statusFilter, assignments]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleClassFilter = (classId) => {
    setClassFilter(classId);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleCreateAssignment = async (assignmentData) => {
    try {
      const newAssignment = await assignmentService.create(assignmentData);
      setAssignments(prev => [newAssignment, ...prev]);
      toast.success("Assignment created successfully!");
    } catch (error) {
      toast.error("Failed to create assignment. Please try again.");
      throw error;
    }
  };

  const handleEditAssignment = (assignment) => {
    // Placeholder for edit functionality
    toast.info("Edit functionality coming soon!");
  };

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
            <p className="text-gray-600">
              Create and manage assignments for your classes.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button 
              onClick={() => setShowCreateModal(true)}
              icon="Plus"
            >
              Create Assignment
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search assignments by title or description..."
                className="w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Class:</label>
                <Select
                  value={classFilter}
                  onChange={(e) => handleClassFilter(e.target.value)}
                  className="w-40"
                >
                  <option value="">All Classes</option>
                  {classes.map((classItem) => (
                    <option key={classItem.Id} value={classItem.Id}>
                      {classItem.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <Select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="w-32"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="text-sm text-gray-600 whitespace-nowrap">
                {filteredAssignments.length} of {assignments.length} assignments
              </div>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <AssignmentList
          assignments={filteredAssignments}
          loading={loading}
          error={error}
          onRetry={loadData}
          onCreateAssignment={() => setShowCreateModal(true)}
          onEditAssignment={handleEditAssignment}
        />

        {/* Create Assignment Modal */}
        <CreateAssignmentModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateAssignment={handleCreateAssignment}
          classes={classes}
        />
      </div>
    </div>
  );
};

export default Assignments;