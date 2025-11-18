import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gradeService = {
  async getAll() {
    try {
      await delay(300);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.fetchRecords('grades_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "feedback_c"}},
          {"field": {"Name": "gradedAt_c"}},
          {"field": {"Name": "studentId_c"}},
          {"field": {"Name": "assignmentId_c"}},
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
        score: item.score_c || 0,
        feedback: item.feedback_c || "",
        gradedAt: item.gradedAt_c || item.CreatedOn || new Date().toISOString(),
        studentId: item.studentId_c?.Id || item.studentId_c || 0,
        assignmentId: item.assignmentId_c?.Id || item.assignmentId_c || 0,
        classId: item.classId_c?.Id || item.classId_c || 0,
        createdAt: item.CreatedOn || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.getRecordById('grades_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "feedback_c"}},
          {"field": {"Name": "gradedAt_c"}},
          {"field": {"Name": "studentId_c"}},
          {"field": {"Name": "assignmentId_c"}},
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
        score: item.score_c || 0,
        feedback: item.feedback_c || "",
        gradedAt: item.gradedAt_c || item.CreatedOn || new Date().toISOString(),
        studentId: item.studentId_c?.Id || item.studentId_c || 0,
        assignmentId: item.assignmentId_c?.Id || item.assignmentId_c || 0,
        classId: item.classId_c?.Id || item.classId_c || 0,
        createdAt: item.CreatedOn || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(gradeData) {
    try {
      await delay(400);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.createRecord('grades_c', {
        records: [{
          Name: `Grade ${gradeData.studentId} ${gradeData.assignmentId}`,
          score_c: gradeData.score,
          feedback_c: gradeData.feedback || "",
          gradedAt_c: new Date().toISOString(),
          studentId_c: gradeData.studentId,
          assignmentId_c: gradeData.assignmentId,
          classId_c: gradeData.classId
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
            score: item.score_c || 0,
            feedback: item.feedback_c || "",
            gradedAt: item.gradedAt_c || item.CreatedOn || new Date().toISOString(),
            studentId: item.studentId_c?.Id || item.studentId_c || 0,
            assignmentId: item.assignmentId_c?.Id || item.assignmentId_c || 0,
            classId: item.classId_c?.Id || item.classId_c || 0,
            createdAt: item.CreatedOn || new Date().toISOString()
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating grade:", error?.response?.data?.message || error);
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

      if (data.score !== undefined) updateData.score_c = data.score;
      if (data.feedback !== undefined) updateData.feedback_c = data.feedback;
      if (data.gradedAt !== undefined) updateData.gradedAt_c = data.gradedAt;
      if (data.studentId !== undefined) updateData.studentId_c = data.studentId;
      if (data.assignmentId !== undefined) updateData.assignmentId_c = data.assignmentId;
      if (data.classId !== undefined) updateData.classId_c = data.classId;

      const response = await apperClient.updateRecord('grades_c', {
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
            score: item.score_c || 0,
            feedback: item.feedback_c || "",
            gradedAt: item.gradedAt_c || item.CreatedOn || new Date().toISOString(),
            studentId: item.studentId_c?.Id || item.studentId_c || 0,
            assignmentId: item.assignmentId_c?.Id || item.assignmentId_c || 0,
            classId: item.classId_c?.Id || item.classId_c || 0,
            createdAt: item.CreatedOn || new Date().toISOString()
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating grade:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      await delay(250);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.deleteRecord('grades_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting grade:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getByStudentId(studentId) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.fetchRecords('grades_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "feedback_c"}},
          {"field": {"Name": "gradedAt_c"}},
          {"field": {"Name": "studentId_c"}},
          {"field": {"Name": "assignmentId_c"}},
          {"field": {"Name": "classId_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "studentId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(studentId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        score: item.score_c || 0,
        feedback: item.feedback_c || "",
        gradedAt: item.gradedAt_c || item.CreatedOn || new Date().toISOString(),
        studentId: item.studentId_c?.Id || item.studentId_c || 0,
        assignmentId: item.assignmentId_c?.Id || item.assignmentId_c || 0,
        classId: item.classId_c?.Id || item.classId_c || 0,
        createdAt: item.CreatedOn || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching grades by student:", error);
      return [];
    }
  },

  async getByClassId(classId) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.fetchRecords('grades_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "feedback_c"}},
          {"field": {"Name": "gradedAt_c"}},
          {"field": {"Name": "studentId_c"}},
          {"field": {"Name": "assignmentId_c"}},
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
        score: item.score_c || 0,
        feedback: item.feedback_c || "",
        gradedAt: item.gradedAt_c || item.CreatedOn || new Date().toISOString(),
        studentId: item.studentId_c?.Id || item.studentId_c || 0,
        assignmentId: item.assignmentId_c?.Id || item.assignmentId_c || 0,
        classId: item.classId_c?.Id || item.classId_c || 0,
        createdAt: item.CreatedOn || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching grades by class:", error);
      return [];
    }
  },

  async getByAssignmentId(assignmentId) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.fetchRecords('grades_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "feedback_c"}},
          {"field": {"Name": "gradedAt_c"}},
          {"field": {"Name": "studentId_c"}},
          {"field": {"Name": "assignmentId_c"}},
          {"field": {"Name": "classId_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "assignmentId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(assignmentId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        score: item.score_c || 0,
        feedback: item.feedback_c || "",
        gradedAt: item.gradedAt_c || item.CreatedOn || new Date().toISOString(),
        studentId: item.studentId_c?.Id || item.studentId_c || 0,
        assignmentId: item.assignmentId_c?.Id || item.assignmentId_c || 0,
        classId: item.classId_c?.Id || item.classId_c || 0,
        createdAt: item.CreatedOn || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching grades by assignment:", error);
      return [];
    }
  }
};