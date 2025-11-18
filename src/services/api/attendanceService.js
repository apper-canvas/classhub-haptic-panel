import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
    await delay(300);
    return [...attendance];
  },

  async getById(id) {
    await delay(200);
    const record = attendance.find(a => a.Id === parseInt(id));
    return record ? { ...record } : null;
  },

  async create(attendanceData) {
    await delay(400);
    const maxId = Math.max(...attendance.map(a => a.Id), 0);
    const newRecord = {
      ...attendanceData,
      Id: maxId + 1
    };
    attendance.push(newRecord);
    return { ...newRecord };
  },

  async update(id, data) {
    await delay(350);
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) return null;
    
    attendance[index] = { ...attendance[index], ...data };
    return { ...attendance[index] };
  },

  async delete(id) {
    await delay(250);
    const index = attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) return false;
    
    attendance.splice(index, 1);
    return true;
  },

  async getByStudentId(studentId) {
    await delay(200);
    return attendance.filter(a => a.studentId === parseInt(studentId));
  },

  async getByClassId(classId) {
    await delay(200);
    return attendance.filter(a => a.classId === parseInt(classId));
  },

  async getByDate(date) {
    await delay(200);
    const targetDate = new Date(date).toDateString();
    return attendance.filter(a => new Date(a.date).toDateString() === targetDate);
  },

  async getByClassAndDate(classId, date) {
    await delay(200);
    const targetDate = new Date(date).toDateString();
    return attendance.filter(a => 
      a.classId === parseInt(classId) && 
      new Date(a.date).toDateString() === targetDate
    );
  },

  async markAttendance(studentId, classId, date, status, note = "", markedBy = "System") {
    await delay(300);
    
    // Check if attendance already exists for this student, class, and date
    const existingIndex = attendance.findIndex(a => 
      a.studentId === parseInt(studentId) && 
      a.classId === parseInt(classId) && 
      new Date(a.date).toDateString() === new Date(date).toDateString()
    );

    if (existingIndex !== -1) {
      // Update existing record
      attendance[existingIndex] = {
        ...attendance[existingIndex],
        status,
        note,
        markedBy
      };
      return { ...attendance[existingIndex] };
    } else {
      // Create new record
      const maxId = Math.max(...attendance.map(a => a.Id), 0);
      const newRecord = {
        Id: maxId + 1,
        studentId: parseInt(studentId),
        classId: parseInt(classId),
        date: new Date(date).toISOString(),
        status,
        note,
        markedBy
      };
      attendance.push(newRecord);
      return { ...newRecord };
    }
  },

  async getAttendanceStats(studentId, classId = null) {
    await delay(200);
    let records = attendance.filter(a => a.studentId === parseInt(studentId));
    
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
  },

  async getClassAttendanceStats(classId, date = null) {
    await delay(200);
    let records = attendance.filter(a => a.classId === parseInt(classId));
    
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
  }
};