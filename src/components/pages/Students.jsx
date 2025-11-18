import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import StudentList from "@/components/organisms/StudentList";
import CreateStudentModal from "@/components/organisms/CreateStudentModal";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import { studentService } from "@/services/api/studentService";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");

  const loadStudents = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const applyFilters = () => {
    let filtered = [...students];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.guardianContact.includes(searchTerm)
      );
    }

    // Apply grade filter
    if (gradeFilter) {
      filtered = filtered.filter(student => student.gradeLevel === gradeFilter);
    }

    setFilteredStudents(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, gradeFilter, students]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleGradeFilter = (grade) => {
    setGradeFilter(grade);
  };

  const handleCreateStudent = async (studentData) => {
    try {
      const newStudent = await studentService.create(studentData);
      setStudents(prev => [newStudent, ...prev]);
      toast.success("Student added successfully!");
    } catch (error) {
      toast.error("Failed to add student. Please try again.");
      throw error;
    }
  };

  const gradeOptions = [
    { value: "", label: "All Grades" },
    { value: "9th Grade", label: "9th Grade" },
    { value: "10th Grade", label: "10th Grade" },
    { value: "11th Grade", label: "11th Grade" },
    { value: "12th Grade", label: "12th Grade" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Students</h1>
            <p className="text-gray-600">
              Manage student information and enrollment.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button 
              onClick={() => setShowCreateModal(true)}
              icon="Plus"
            >
              Add Student
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search students by name, email, or contact..."
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Grade:</label>
                <Select
                  value={gradeFilter}
                  onChange={(e) => handleGradeFilter(e.target.value)}
                  className="w-32"
                >
                  {gradeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="text-sm text-gray-600">
                {filteredStudents.length} of {students.length} students
              </div>
            </div>
          </div>
        </div>

        {/* Students List */}
        <StudentList
          students={filteredStudents}
          loading={loading}
          error={error}
          onRetry={loadStudents}
          onCreateStudent={() => setShowCreateModal(true)}
        />

        {/* Create Student Modal */}
        <CreateStudentModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateStudent={handleCreateStudent}
        />
      </div>
    </div>
  );
};

export default Students;