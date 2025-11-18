import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";

const CreateStudentModal = ({ isOpen, onClose, onCreateStudent }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gradeLevel: "",
    guardianContact: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.gradeLevel) {
      newErrors.gradeLevel = "Grade level is required";
    }
    
    if (!formData.guardianContact.trim()) {
      newErrors.guardianContact = "Guardian contact is required";
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
      await onCreateStudent(formData);
      toast.success("Student added successfully!");
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        gradeLevel: "",
        guardianContact: ""
      });
      setErrors({});
      onClose();
    } catch (error) {
      toast.error("Failed to add student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        gradeLevel: "",
        guardianContact: ""
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Student"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            error={errors.firstName}
            placeholder="Enter first name"
            required
          />

          <FormField
            label="Last Name"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            error={errors.lastName}
            placeholder="Enter last name"
            required
          />
        </div>

        <FormField
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          error={errors.email}
          placeholder="student@example.com"
          required
        />

        <FormField
          label="Grade Level"
          type="select"
          value={formData.gradeLevel}
          onChange={(e) => handleInputChange("gradeLevel", e.target.value)}
          error={errors.gradeLevel}
          options={grades}
          required
        >
          <option value="">Select grade level</option>
        </FormField>

        <FormField
          label="Guardian Contact"
          type="tel"
          value={formData.guardianContact}
          onChange={(e) => handleInputChange("guardianContact", e.target.value)}
          error={errors.guardianContact}
          placeholder="(555) 123-4567"
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
            Add Student
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateStudentModal;