import studentsData from "@/services/mockData/students.json";

let students = [...studentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const studentService = {
  async getAll() {
    await delay(300);
    return [...students];
  },

  async getById(id) {
    await delay(200);
    const student = students.find(s => s.Id === parseInt(id));
    return student ? { ...student } : null;
  },

  async create(studentData) {
    await delay(400);
    const maxId = Math.max(...students.map(s => s.Id), 0);
    const newStudent = {
      ...studentData,
      Id: maxId + 1,
      enrolledClasses: [],
      createdAt: new Date().toISOString()
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, data) {
    await delay(350);
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) return null;
    
    students[index] = { ...students[index], ...data };
    return { ...students[index] };
  },

  async delete(id) {
    await delay(250);
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) return false;
    
    students.splice(index, 1);
    return true;
  },

  async getByClassId(classId) {
    await delay(200);
    return students.filter(s => s.enrolledClasses.includes(parseInt(classId)));
  },

  async enrollInClass(studentId, classId) {
    await delay(200);
    const student = students.find(s => s.Id === parseInt(studentId));
    if (!student) return false;
    
    if (!student.enrolledClasses.includes(parseInt(classId))) {
      student.enrolledClasses.push(parseInt(classId));
    }
    return true;
  },

  async unenrollFromClass(studentId, classId) {
    await delay(200);
    const student = students.find(s => s.Id === parseInt(studentId));
    if (!student) return false;
    
    student.enrolledClasses = student.enrolledClasses.filter(id => id !== parseInt(classId));
    return true;
  }
};