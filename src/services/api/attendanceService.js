import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";
import { create, getAll, getById, update } from "@/services/api/activityService";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
    try {
      await delay(300);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.fetchRecords('attendance_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "note_c"}},
          {"field": {"Name": "markedBy_c"}},
          {"field": {"Name": "studentId_c"}},
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
        date: item.date_c || new Date().toISOString(),
        status: item.status_c || "absent",
        note: item.note_c || "",
        markedBy: item.markedBy_c || "System",
        studentId: item.studentId_c?.Id || item.studentId_c || 0,
        classId: item.classId_c?.Id || item.classId_c || 0,
        createdAt: item.CreatedOn || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching attendance:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.getRecordById('attendance_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "note_c"}},
          {"field": {"Name": "markedBy_c"}},
          {"field": {"Name": "studentId_c"}},
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
        date: item.date_c || new Date().toISOString(),
        status: item.status_c || "absent",
        note: item.note_c || "",
        markedBy: item.markedBy_c || "System",
        studentId: item.studentId_c?.Id || item.studentId_c || 0,
        classId: item.classId_c?.Id || item.classId_c || 0,
        createdAt: item.CreatedOn || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching attendance ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(attendanceData) {
    try {
      await delay(400);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.createRecord('attendance_c', {
        records: [{
          Name: `Attendance ${attendanceData.studentId} ${attendanceData.date}`,
          date_c: attendanceData.date,
          status_c: attendanceData.status,
          note_c: attendanceData.note || "",
          markedBy_c: attendanceData.markedBy || "System",
          studentId_c: attendanceData.studentId,
          classId_c: attendanceData.classId
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
            date: item.date_c || new Date().toISOString(),
            status: item.status_c || "absent",
            note: item.note_c || "",
            markedBy: item.markedBy_c || "System",
            studentId: item.studentId_c?.Id || item.studentId_c || 0,
            classId: item.classId_c?.Id || item.classId_c || 0,
            createdAt: item.CreatedOn || new Date().toISOString()
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating attendance:", error?.response?.data?.message || error);
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

      if (data.date !== undefined) updateData.date_c = data.date;
      if (data.status !== undefined) updateData.status_c = data.status;
      if (data.note !== undefined) updateData.note_c = data.note;
      if (data.markedBy !== undefined) updateData.markedBy_c = data.markedBy;
      if (data.studentId !== undefined) updateData.studentId_c = data.studentId;
      if (data.classId !== undefined) updateData.classId_c = data.classId;

      const response = await apperClient.updateRecord('attendance_c', {
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
            date: item.date_c || new Date().toISOString(),
            status: item.status_c || "absent",
            note: item.note_c || "",
            markedBy: item.markedBy_c || "System",
            studentId: item.studentId_c?.Id || item.studentId_c || 0,
            classId: item.classId_c?.Id || item.classId_c || 0,
            createdAt: item.CreatedOn || new Date().toISOString()
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating attendance:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      await delay(250);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.deleteRecord('attendance_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting attendance:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getByStudentId(studentId) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.fetchRecords('attendance_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "note_c"}},
          {"field": {"Name": "markedBy_c"}},
          {"field": {"Name": "studentId_c"}},
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
        date: item.date_c || new Date().toISOString(),
        status: item.status_c || "absent",
        note: item.note_c || "",
        markedBy: item.markedBy_c || "System",
        studentId: item.studentId_c?.Id || item.studentId_c || 0,
        classId: item.classId_c?.Id || item.classId_c || 0,
        createdAt: item.CreatedOn || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching attendance by student:", error);
      return [];
    }
  },

  async getByClassId(classId) {
    try {
      await delay(200);
      const apperClient = getApperClient();
      if (!apperClient) throw new Error("ApperClient not available");

      const response = await apperClient.fetchRecords('attendance_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "note_c"}},
          {"field": {"Name": "markedBy_c"}},
          {"field": {"Name": "studentId_c"}},
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
        date: item.date_c || new Date().toISOString(),
        status: item.status_c || "absent",
        note: item.note_c || "",
        markedBy: item.markedBy_c || "System",
        studentId: item.studentId_c?.Id || item.studentId_c || 0,
        classId: item.classId_c?.Id || item.classId_c || 0,
        createdAt: item.CreatedOn || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching attendance by class:", error);
      return [];
    }
  },

  async getByDate(date) {
    try {
      await delay(200);
      const attendance = await this.getAll();
      const targetDate = new Date(date).toDateString();
      return attendance.filter(a => new Date(a.date).toDateString() === targetDate);
    } catch (error) {
      console.error("Error fetching attendance by date:", error);
      return [];
    }
  },

  async getByClassAndDate(classId, date) {
    try {
      await delay(200);
      const attendance = await this.getByClassId(classId);
      const targetDate = new Date(date).toDateString();
      return attendance.filter(a => new Date(a.date).toDateString() === targetDate);
    } catch (error) {
      console.error("Error fetching attendance by class and date:", error);
      return [];
    }
  },

  async markAttendance(studentId, classId, date, status, note = "", markedBy = "System") {
    try {
      await delay(300);
      
      // Check if attendance already exists for this student, class, and date
      const existing = await this.getByClassAndDate(classId, date);
      const existingRecord = existing.find(a => 
        a.studentId === parseInt(studentId) && 
        new Date(a.date).toDateString() === new Date(date).toDateString()
      );

      if (existingRecord) {
        // Update existing record
        return await this.update(existingRecord.Id, {
          status,
          note,
          markedBy
        });
      } else {
        // Create new record
        return await this.create({
          studentId: parseInt(studentId),
          classId: parseInt(classId),
          date: new Date(date).toISOString(),
          status,
          note,
          markedBy
        });
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      return null;
    }
  },

  async getAttendanceStats(studentId, classId = null) {
    try {
      await delay(200);
      let records = await this.getByStudentId(studentId);
      
      if (classId) {
        records = records.filter(a => a.classId === parseInt(classId));
      }

      const stats = {
        total: records.length,
        present: records.filter(r => r.status === "present").length,
        absent: records.filter(r => r.status === "absent").length,
        late: records.filter(r => r.status === "late").length
      };

      stats.attendanceRate = stats.total > 0 ? 
        Math.round(((stats.present + stats.late) / stats.total) * 100) : 0;

      return stats;
    } catch (error) {
      console.error("Error getting attendance stats:", error);
      return { total: 0, present: 0, absent: 0, late: 0, attendanceRate: 0 };
    }
  },

  async getClassAttendanceStats(classId, date = null) {
    try {
      await delay(200);
      let records = await this.getByClassId(classId);
      
      if (date) {
        const targetDate = new Date(date).toDateString();
        records = records.filter(a => new Date(a.date).toDateString() === targetDate);
      }

      const stats = {
        total: records.length,
        present: records.filter(r => r.status === "present").length,
        absent: records.filter(r => r.status === "absent").length,
        late: records.filter(r => r.status === "late").length
      };

      stats.attendanceRate = stats.total > 0 ? 
        Math.round(((stats.present + stats.late) / stats.total) * 100) : 0;

      return stats;
    } catch (error) {
      console.error("Error getting class attendance stats:", error);
      return { total: 0, present: 0, absent: 0, late: 0, attendanceRate: 0 };
}
  }
};