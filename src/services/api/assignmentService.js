import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const assignmentService = {
  async getAll() {
    try {
      await delay(300);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.fetchRecords('assignments_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "totalPoints_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "submissions_c"}},
          {"field": {"Name": "classId_c"}},
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
        title: item.title_c || "",
        description: item.description_c || "",
        dueDate: item.dueDate_c || new Date().toISOString(),
        totalPoints: item.totalPoints_c || 0,
        status: item.status_c || "active",
        submissions: item.submissions_c ? item.submissions_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
        classId: item.classId_c?.Id || item.classId_c || 0,
        className: item.classId_c?.Name || "",
        createdAt: item.CreatedOn || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.getRecordById('assignments_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "totalPoints_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "submissions_c"}},
          {"field": {"Name": "classId_c"}},
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
        title: item.title_c || "",
        description: item.description_c || "",
        dueDate: item.dueDate_c || new Date().toISOString(),
        totalPoints: item.totalPoints_c || 0,
        status: item.status_c || "active",
        submissions: item.submissions_c ? item.submissions_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
        classId: item.classId_c?.Id || item.classId_c || 0,
        className: item.classId_c?.Name || "",
        createdAt: item.CreatedOn || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(assignmentData) {
    try {
      await delay(400);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.createRecord('assignments_c', {
        records: [{
          Name: assignmentData.title,
          title_c: assignmentData.title,
          description_c: assignmentData.description,
          dueDate_c: assignmentData.dueDate,
          totalPoints_c: assignmentData.totalPoints,
          status_c: "active",
          submissions_c: "",
          classId_c: assignmentData.classId
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
            title: item.title_c || "",
            description: item.description_c || "",
            dueDate: item.dueDate_c || new Date().toISOString(),
            totalPoints: item.totalPoints_c || 0,
            status: item.status_c || "active",
            submissions: [],
            classId: item.classId_c?.Id || item.classId_c || 0,
            className: item.classId_c?.Name || "",
            createdAt: item.CreatedOn || new Date().toISOString()
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error);
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

      if (data.title !== undefined) {
        updateData.Name = data.title;
        updateData.title_c = data.title;
      }
      if (data.description !== undefined) updateData.description_c = data.description;
      if (data.dueDate !== undefined) updateData.dueDate_c = data.dueDate;
      if (data.totalPoints !== undefined) updateData.totalPoints_c = data.totalPoints;
      if (data.status !== undefined) updateData.status_c = data.status;
      if (data.submissions !== undefined) updateData.submissions_c = data.submissions.join(',');
      if (data.classId !== undefined) updateData.classId_c = data.classId;

      const response = await apperClient.updateRecord('assignments_c', {
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
            title: item.title_c || "",
            description: item.description_c || "",
            dueDate: item.dueDate_c || new Date().toISOString(),
            totalPoints: item.totalPoints_c || 0,
            status: item.status_c || "active",
            submissions: item.submissions_c ? item.submissions_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
            classId: item.classId_c?.Id || item.classId_c || 0,
            className: item.classId_c?.Name || "",
            createdAt: item.CreatedOn || new Date().toISOString()
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      await delay(250);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.deleteRecord('assignments_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getByClassId(classId) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.fetchRecords('assignments_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "dueDate_c"}},
          {"field": {"Name": "totalPoints_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "submissions_c"}},
          {"field": {"Name": "classId_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "classId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(classId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        title: item.title_c || "",
        description: item.description_c || "",
        dueDate: item.dueDate_c || new Date().toISOString(),
        totalPoints: item.totalPoints_c || 0,
        status: item.status_c || "active",
        submissions: item.submissions_c ? item.submissions_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
        classId: item.classId_c?.Id || item.classId_c || 0,
        className: item.classId_c?.Name || "",
        createdAt: item.CreatedOn || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching assignments by class:", error);
      return [];
    }
  },

  async getUpcoming(days = 7) {
    try {
      await delay(250);
      const assignments = await this.getAll();
      const now = new Date();
      const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
      
      return assignments.filter(a => {
        const dueDate = new Date(a.dueDate);
        return dueDate >= now && dueDate <= futureDate && a.status === "active";
      });
    } catch (error) {
      console.error("Error fetching upcoming assignments:", error);
      return [];
    }
  },

  async submitAssignment(assignmentId, studentId) {
    try {
      await delay(200);
      const assignment = await this.getById(assignmentId);
      if (!assignment) return false;

      const submissions = [...assignment.submissions];
      if (!submissions.includes(parseInt(studentId))) {
        submissions.push(parseInt(studentId));
        const result = await this.update(assignmentId, { submissions });
        return result !== null;
      }
      return true;
    } catch (error) {
      console.error("Error submitting assignment:", error);
      return false;
    }
  }
};