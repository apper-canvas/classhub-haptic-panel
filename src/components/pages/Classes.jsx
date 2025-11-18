import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ClassList from "@/components/organisms/ClassList";
import CreateClassModal from "@/components/organisms/CreateClassModal";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import { classService } from "@/services/api/classService";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadClasses = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await classService.getAll();
      setClasses(data);
      setFilteredClasses(data);
    } catch (err) {
      setError("Failed to load classes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    if (!searchTerm.trim()) {
      setFilteredClasses(classes);
      return;
    }

    const filtered = classes.filter(classItem =>
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.grade.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClasses(filtered);
  };

  const handleCreateClass = async (classData) => {
    try {
      const newClass = await classService.create(classData);
      setClasses(prev => [newClass, ...prev]);
      setFilteredClasses(prev => [newClass, ...prev]);
      toast.success("Class created successfully!");
    } catch (error) {
      toast.error("Failed to create class. Please try again.");
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Classes</h1>
            <p className="text-gray-600">
              Manage your school classes and course schedules.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button 
              onClick={() => setShowCreateModal(true)}
              icon="Plus"
            >
              Create Class
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search classes by name, subject, or grade..."
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {filteredClasses.length} of {classes.length} classes
              </div>
            </div>
          </div>
        </div>

        {/* Classes List */}
        <ClassList
          classes={filteredClasses}
          loading={loading}
          error={error}
          onRetry={loadClasses}
          onCreateClass={() => setShowCreateModal(true)}
        />

        {/* Create Class Modal */}
        <CreateClassModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateClass={handleCreateClass}
        />
      </div>
    </div>
  );
};

export default Classes;