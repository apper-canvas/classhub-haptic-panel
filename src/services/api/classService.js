import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";
import { create, getAll, getById, update } from "@/services/api/activityService";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const classService = {
  async getAll() {
    try {
      await delay(300);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.fetchRecords('classes_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "teacherId_c"}},
          {"field": {"Name": "studentIds_c"}},
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
        name: item.Name || "",
        subject: item.subject_c || "",
        grade: item.grade_c || "",
        schedule: item.schedule_c || "",
        teacherId: item.teacherId_c || "",
        studentIds: item.studentIds_c ? item.studentIds_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
        createdAt: item.CreatedOn || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching classes:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.getRecordById('classes_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "teacherId_c"}},
          {"field": {"Name": "studentIds_c"}},
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
        name: item.Name || "",
        subject: item.subject_c || "",
        grade: item.grade_c || "",
        schedule: item.schedule_c || "",
        teacherId: item.teacherId_c || "",
        studentIds: item.studentIds_c ? item.studentIds_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
        createdAt: item.CreatedOn || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching class ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(classData) {
    try {
      await delay(400);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.createRecord('classes_c', {
        records: [{
          Name: classData.name,
          subject_c: classData.subject,
          grade_c: classData.grade,
          schedule_c: classData.schedule,
          teacherId_c: classData.teacherId || "",
          studentIds_c: ""
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
            name: item.Name || "",
            subject: item.subject_c || "",
            grade: item.grade_c || "",
            schedule: item.schedule_c || "",
            teacherId: item.teacherId_c || "",
            studentIds: [],
            createdAt: item.CreatedOn || new Date().toISOString()
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating class:", error?.response?.data?.message || error);
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

      if (data.name !== undefined) updateData.Name = data.name;
      if (data.subject !== undefined) updateData.subject_c = data.subject;
      if (data.grade !== undefined) updateData.grade_c = data.grade;
      if (data.schedule !== undefined) updateData.schedule_c = data.schedule;
      if (data.teacherId !== undefined) updateData.teacherId_c = data.teacherId;
      if (data.studentIds !== undefined) updateData.studentIds_c = data.studentIds.join(',');

      const response = await apperClient.updateRecord('classes_c', {
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
            name: item.Name || "",
            subject: item.subject_c || "",
            grade: item.grade_c || "",
            schedule: item.schedule_c || "",
            teacherId: item.teacherId_c || "",
            studentIds: item.studentIds_c ? item.studentIds_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
            createdAt: item.CreatedOn || new Date().toISOString()
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating class:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      await delay(250);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.deleteRecord('classes_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting class:", error?.response?.data?.message || error);
      return false;
    }
  },

  async addStudentToClass(classId, studentId) {
    try {
      await delay(200);
      // Get current class data first
      const currentClass = await this.getById(classId);
      if (!currentClass) return false;

      const studentIds = [...currentClass.studentIds];
      if (!studentIds.includes(parseInt(studentId))) {
        studentIds.push(parseInt(studentId));
        const result = await this.update(classId, { studentIds });
        return result !== null;
      }
      return true;
    } catch (error) {
      console.error("Error adding student to class:", error);
      return false;
    }
  },

  async removeStudentFromClass(classId, studentId) {
    try {
      await delay(200);
      // Get current class data first
      const currentClass = await this.getById(classId);
      if (!currentClass) return false;

      const studentIds = currentClass.studentIds.filter(id => id !== parseInt(studentId));
      const result = await this.update(classId, { studentIds });
      return result !== null;
    } catch (error) {
      console.error("Error removing student from class:", error);
return false;
    }
  }
};