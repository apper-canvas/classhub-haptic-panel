import assignmentsData from "@/services/mockData/assignments.json";

let assignments = [...assignmentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const assignmentService = {
  async getAll() {
    await delay(300);
    return [...assignments];
  },

  async getById(id) {
    await delay(200);
    const assignment = assignments.find(a => a.Id === parseInt(id));
    return assignment ? { ...assignment } : null;
  },

  async create(assignmentData) {
    await delay(400);
    const maxId = Math.max(...assignments.map(a => a.Id), 0);
    const newAssignment = {
      ...assignmentData,
      Id: maxId + 1,
      submissions: [],
      status: "active",
      createdAt: new Date().toISOString()
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, data) {
    await delay(350);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) return null;
    
    assignments[index] = { ...assignments[index], ...data };
    return { ...assignments[index] };
  },

  async delete(id) {
    await delay(250);
    const index = assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) return false;
    
    assignments.splice(index, 1);
    return true;
  },

  async getByClassId(classId) {
    await delay(200);
    return assignments.filter(a => a.classId === parseInt(classId));
  },

  async getUpcoming(days = 7) {
    await delay(250);
    const now = new Date();
    const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return assignments.filter(a => {
      const dueDate = new Date(a.dueDate);
      return dueDate >= now && dueDate <= futureDate && a.status === "active";
    });
  },

  async submitAssignment(assignmentId, studentId) {
    await delay(200);
    const assignment = assignments.find(a => a.Id === parseInt(assignmentId));
    if (!assignment) return false;
    
    if (!assignment.submissions.includes(parseInt(studentId))) {
      assignment.submissions.push(parseInt(studentId));
    }
    return true;
  }
};