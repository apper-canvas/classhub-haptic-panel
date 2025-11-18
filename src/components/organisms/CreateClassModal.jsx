import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";

const CreateClassModal = ({ isOpen, onClose, onCreateClass }) => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    grade: "",
    schedule: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const subjects = [
    { value: "Mathematics", label: "Mathematics" },
    { value: "English", label: "English" },
    { value: "Science", label: "Science" },
    { value: "History", label: "History" },
    { value: "Physical Education", label: "Physical Education" },
    { value: "Art", label: "Art" },
    { value: "Music", label: "Music" }
  ];

  const grades = [
    { value: "9th Grade", label: "9th Grade" },
    { value: "10th Grade", label: "10th Grade" },
    { value: "11th Grade", label: "11th Grade" },
    { value: "12th Grade", label: "12th Grade" }
  ];

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
    
    if (!formData.name.trim()) {
      newErrors.name = "Class name is required";
    }
    
    if (!formData.subject) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formData.grade) {
      newErrors.grade = "Grade level is required";
    }
    
    if (!formData.schedule.trim()) {
      newErrors.schedule = "Schedule is required";
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
      await onCreateClass(formData);
      toast.success("Class created successfully!");
      
      // Reset form
      setFormData({
        name: "",
        subject: "",
        grade: "",
        schedule: ""
      });
      setErrors({});
      onClose();
    } catch (error) {
      toast.error("Failed to create class. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: "",
        subject: "",
        grade: "",
        schedule: ""
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Class"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Class Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          error={errors.name}
          placeholder="e.g., Advanced Mathematics"
          required
        />

        <FormField
          label="Subject"
          type="select"
          value={formData.subject}
          onChange={(e) => handleInputChange("subject", e.target.value)}
          error={errors.subject}
          options={subjects}
          required
        >
          <option value="">Select a subject</option>
        </FormField>

        <FormField
          label="Grade Level"
          type="select"
          value={formData.grade}
          onChange={(e) => handleInputChange("grade", e.target.value)}
          error={errors.grade}
          options={grades}
          required
        >
          <option value="">Select grade level</option>
        </FormField>

        <FormField
          label="Schedule"
          type="text"
          value={formData.schedule}
          onChange={(e) => handleInputChange("schedule", e.target.value)}
          error={errors.schedule}
          placeholder="e.g., Monday, Wednesday, Friday 9:00 AM - 10:30 AM"
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
            Create Class
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateClassModal;