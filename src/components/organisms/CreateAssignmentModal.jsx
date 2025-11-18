import { useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";

const CreateAssignmentModal = ({ isOpen, onClose, onCreateAssignment, classes = [] }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    classId: "",
    dueDate: "",
    dueTime: "23:59",
    totalPoints: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Assignment title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.classId) {
      newErrors.classId = "Please select a class";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    
    if (!formData.totalPoints || formData.totalPoints <= 0) {
      newErrors.totalPoints = "Total points must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Combine date and time for due date
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}:00.000Z`);
      
      const assignmentData = {
        title: formData.title,
        description: formData.description,
        classId: parseInt(formData.classId),
        dueDate: dueDateTime.toISOString(),
        totalPoints: parseInt(formData.totalPoints)
      };
      
      await onCreateAssignment(assignmentData);
      toast.success("Assignment created successfully!");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        classId: "",
        dueDate: "",
        dueTime: "23:59",
        totalPoints: ""
      });
      setErrors({});
      onClose();
    } catch (error) {
      toast.error("Failed to create assignment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: "",
        description: "",
        classId: "",
        dueDate: "",
        dueTime: "23:59",
        totalPoints: ""
      });
      setErrors({});
      onClose();
    }
  };

  // Get tomorrow's date as default minimum date
  const tomorrow = format(new Date(Date.now() + 86400000), "yyyy-MM-dd");

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Assignment"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Assignment Title"
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          error={errors.title}
          placeholder="e.g., Chapter 5 Quiz"
          required
        />

        <FormField
          label="Description"
          type="textarea"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          error={errors.description}
          placeholder="Provide detailed instructions for the assignment..."
          required
        />

        <FormField
          label="Class"
          type="select"
          value={formData.classId}
          onChange={(e) => handleInputChange("classId", e.target.value)}
          error={errors.classId}
          required
        >
          <option value="">Select a class</option>
          {classes.map((classItem) => (
            <option key={classItem.Id} value={classItem.Id}>
              {classItem.name} ({classItem.subject})
            </option>
          ))}
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
            error={errors.dueDate}
            min={tomorrow}
            required
          />

          <FormField
            label="Due Time"
            type="time"
            value={formData.dueTime}
            onChange={(e) => handleInputChange("dueTime", e.target.value)}
            required
          />
        </div>

        <FormField
          label="Total Points"
          type="number"
          value={formData.totalPoints}
          onChange={(e) => handleInputChange("totalPoints", e.target.value)}
          error={errors.totalPoints}
          placeholder="100"
          min="1"
          required
        />

        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Create Assignment
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateAssignmentModal;