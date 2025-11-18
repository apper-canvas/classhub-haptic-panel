import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gradeService = {
  async getAll() {
    await delay(300);
    return [...grades];
  },

  async getById(id) {
    await delay(200);
    const grade = grades.find(g => g.Id === parseInt(id));
    return grade ? { ...grade } : null;
  },

  async create(gradeData) {
    await delay(400);
    const maxId = Math.max(...grades.map(g => g.Id), 0);
    const newGrade = {
      ...gradeData,
      Id: maxId + 1,
      gradedAt: new Date().toISOString()
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, data) {
    await delay(350);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) return null;
    
    grades[index] = { ...grades[index], ...data };
    return { ...grades[index] };
  },

  async delete(id) {
    await delay(250);
    const index = grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) return false;
    
    grades.splice(index, 1);
    return true;
  },

  async getByStudentId(studentId) {
    await delay(200);
    return grades.filter(g => g.studentId === parseInt(studentId));
  },

  async getByClassId(classId) {
    await delay(200);
    return grades.filter(g => g.classId === parseInt(classId));
  },

  async getByAssignmentId(assignmentId) {
    await delay(200);
    return grades.filter(g => g.assignmentId === parseInt(assignmentId));
  },

  async getStudentClassGrades(studentId, classId) {
    await delay(200);
    return grades.filter(g => 
      g.studentId === parseInt(studentId) && g.classId === parseInt(classId)
    );
  },

  async calculateClassAverage(classId) {
    await delay(150);
    const classGrades = grades.filter(g => g.classId === parseInt(classId));
    if (classGrades.length === 0) return 0;
    
    const total = classGrades.reduce((sum, grade) => sum + grade.score, 0);
    return Math.round((total / classGrades.length) * 100) / 100;
  },

  async calculateStudentAverage(studentId, classId = null) {
    await delay(150);
    let studentGrades = grades.filter(g => g.studentId === parseInt(studentId));
    
    if (classId) {
      studentGrades = studentGrades.filter(g => g.classId === parseInt(classId));
    }
    
    if (studentGrades.length === 0) return 0;
    
    const total = studentGrades.reduce((sum, grade) => sum + grade.score, 0);
    return Math.round((total / studentGrades.length) * 100) / 100;
  }
};