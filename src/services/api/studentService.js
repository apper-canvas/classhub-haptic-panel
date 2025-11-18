import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const studentService = {
  async getAll() {
    try {
      await delay(300);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.fetchRecords('students_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "firstName_c"}},
          {"field": {"Name": "lastName_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "gradeLevel_c"}},
          {"field": {"Name": "enrolledClasses_c"}},
          {"field": {"Name": "guardianContact_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        firstName: item.firstName_c || "",
        lastName: item.lastName_c || "",
        email: item.email_c || "",
        gradeLevel: item.gradeLevel_c || "",
        enrolledClasses: item.enrolledClasses_c ? item.enrolledClasses_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
        guardianContact: item.guardianContact_c || "",
        createdAt: item.CreatedOn || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.getRecordById('students_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "firstName_c"}},
          {"field": {"Name": "lastName_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "gradeLevel_c"}},
          {"field": {"Name": "enrolledClasses_c"}},
          {"field": {"Name": "guardianContact_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const item = response.data;
      return {
        Id: item.Id,
        firstName: item.firstName_c || "",
        lastName: item.lastName_c || "",
        email: item.email_c || "",
        gradeLevel: item.gradeLevel_c || "",
        enrolledClasses: item.enrolledClasses_c ? item.enrolledClasses_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
        guardianContact: item.guardianContact_c || "",
        createdAt: item.CreatedOn || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(studentData) {
    try {
      await delay(400);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.createRecord('students_c', {
        records: [{
          Name: `${studentData.firstName} ${studentData.lastName}`,
          firstName_c: studentData.firstName,
          lastName_c: studentData.lastName,
          email_c: studentData.email,
          gradeLevel_c: studentData.gradeLevel,
          enrolledClasses_c: "",
          guardianContact_c: studentData.guardianContact
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          const item = result.data;
          return {
            Id: item.Id,
            firstName: item.firstName_c || "",
            lastName: item.lastName_c || "",
            email: item.email_c || "",
            gradeLevel: item.gradeLevel_c || "",
            enrolledClasses: [],
            guardianContact: item.guardianContact_c || "",
            createdAt: item.CreatedOn || new Date().toISOString()
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, data) {
    try {
      await delay(350);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const updateData = {
        Id: parseInt(id)
      };

      if (data.firstName !== undefined || data.lastName !== undefined) {
        const current = await this.getById(id);
        const firstName = data.firstName !== undefined ? data.firstName : current.firstName;
        const lastName = data.lastName !== undefined ? data.lastName : current.lastName;
        updateData.Name = `${firstName} ${lastName}`;
        updateData.firstName_c = firstName;
        updateData.lastName_c = lastName;
      }
      if (data.email !== undefined) updateData.email_c = data.email;
      if (data.gradeLevel !== undefined) updateData.gradeLevel_c = data.gradeLevel;
      if (data.enrolledClasses !== undefined) updateData.enrolledClasses_c = data.enrolledClasses.join(',');
      if (data.guardianContact !== undefined) updateData.guardianContact_c = data.guardianContact;

      const response = await apperClient.updateRecord('students_c', {
        records: [updateData]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          const item = result.data;
          return {
            Id: item.Id,
            firstName: item.firstName_c || "",
            lastName: item.lastName_c || "",
            email: item.email_c || "",
            gradeLevel: item.gradeLevel_c || "",
            enrolledClasses: item.enrolledClasses_c ? item.enrolledClasses_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
            guardianContact: item.guardianContact_c || "",
            createdAt: item.CreatedOn || new Date().toISOString()
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      await delay(250);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.deleteRecord('students_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getByClassId(classId) {
    try {
      await delay(200);
      const allStudents = await this.getAll();
      return allStudents.filter(s => s.enrolledClasses.includes(parseInt(classId)));
    } catch (error) {
      console.error("Error fetching students by class:", error);
      return [];
    }
  },

  async enrollInClass(studentId, classId) {
    try {
      await delay(200);
      const student = await this.getById(studentId);
      if (!student) return false;

      const enrolledClasses = [...student.enrolledClasses];
      if (!enrolledClasses.includes(parseInt(classId))) {
        enrolledClasses.push(parseInt(classId));
        const result = await this.update(studentId, { enrolledClasses });
        return result !== null;
      }
      return true;
    } catch (error) {
      console.error("Error enrolling student in class:", error);
      return false;
    }
  },

  async unenrollFromClass(studentId, classId) {
    try {
      await delay(200);
      const student = await this.getById(studentId);
      if (!student) return false;

      const enrolledClasses = student.enrolledClasses.filter(id => id !== parseInt(classId));
      const result = await this.update(studentId, { enrolledClasses });
      return result !== null;
    } catch (error) {
      console.error("Error unenrolling student from class:", error);
      return false;
    }
  }
};