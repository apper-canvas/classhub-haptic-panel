import classesData from "@/services/mockData/classes.json";

let classes = [...classesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const classService = {
  async getAll() {
    await delay(300);
    return [...classes];
  },

  async getById(id) {
    await delay(200);
    const classItem = classes.find(c => c.Id === parseInt(id));
    return classItem ? { ...classItem } : null;
  },

  async create(classData) {
    await delay(400);
    const maxId = Math.max(...classes.map(c => c.Id), 0);
    const newClass = {
      ...classData,
      Id: maxId + 1,
      studentIds: [],
      createdAt: new Date().toISOString()
    };
    classes.push(newClass);
    return { ...newClass };
  },

  async update(id, data) {
    await delay(350);
    const index = classes.findIndex(c => c.Id === parseInt(id));
    if (index === -1) return null;
    
    classes[index] = { ...classes[index], ...data };
    return { ...classes[index] };
  },

  async delete(id) {
    await delay(250);
    const index = classes.findIndex(c => c.Id === parseInt(id));
    if (index === -1) return false;
    
    classes.splice(index, 1);
    return true;
  },

  async addStudentToClass(classId, studentId) {
    await delay(200);
    const classItem = classes.find(c => c.Id === parseInt(classId));
    if (!classItem) return false;
    
    if (!classItem.studentIds.includes(parseInt(studentId))) {
      classItem.studentIds.push(parseInt(studentId));
    }
    return true;
  },

  async removeStudentFromClass(classId, studentId) {
    await delay(200);
    const classItem = classes.find(c => c.Id === parseInt(classId));
    if (!classItem) return false;
    
    classItem.studentIds = classItem.studentIds.filter(id => id !== parseInt(studentId));
    return true;
  }
};