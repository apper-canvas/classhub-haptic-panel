// Activity service using mock data since no activity table exists in database
// This provides activity tracking functionality for the application

let activities = [
  {
    Id: 1,
    type: 'student',
    description: 'New student Sarah Johnson enrolled in 10th Grade',
    user: 'Admin',
    date: new Date().toISOString(),
    details: { studentId: 1, grade: '10th Grade' }
  },
  {
    Id: 2,
    type: 'assignment',
    description: 'Assignment "Math Quiz Chapter 5" created for Algebra class',
    user: 'Teacher',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    details: { assignmentId: 1, className: 'Algebra' }
  },
  {
    Id: 3,
    type: 'grade',
    description: 'Grade submitted for student John Smith - Score: 95/100',
    user: 'Teacher',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    details: { studentId: 2, score: 95, total: 100 }
  },
  {
    Id: 4,
    type: 'attendance',
    description: 'Attendance marked for Chemistry class - 25 present, 3 absent',
    user: 'Teacher',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    details: { className: 'Chemistry', present: 25, absent: 3 }
  }
];

// Helper function to generate unique ID
const generateId = () => {
  return activities.length > 0 ? Math.max(...activities.map(a => a.Id)) + 1 : 1;
};

// Get all activities
export const getAll = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Sort by date (newest first)
  return [...activities].sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Get activity by ID
export const getById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const activity = activities.find(a => a.Id === parseInt(id));
  if (!activity) {
    throw new Error('Activity not found');
  }
  
  return { ...activity };
};

// Create new activity
export const create = async (activityData) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const newActivity = {
    ...activityData,
    Id: generateId(),
    date: new Date().toISOString(),
    timestamp: new Date().toISOString()
  };
  
  activities.push(newActivity);
  return { ...newActivity };
};

// Update activity
export const update = async (id, activityData) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const index = activities.findIndex(a => a.Id === parseInt(id));
  if (index === -1) {
    throw new Error('Activity not found');
  }
  
  activities[index] = {
    ...activities[index],
    ...activityData,
    Id: parseInt(id) // Ensure ID doesn't change
  };
  
  return { ...activities[index] };
};

// Delete activity
export const remove = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = activities.findIndex(a => a.Id === parseInt(id));
  if (index === -1) {
    throw new Error('Activity not found');
  }
  
  activities.splice(index, 1);
  return true;
};

// Get activities by type
export const getByType = async (type) => {
  await new Promise(resolve => setTimeout(resolve, 250));
  
  if (!type || type === 'all') {
    return getAll();
  }
  
  const filtered = activities.filter(a => 
    a.type.toLowerCase() === type.toLowerCase()
  );
  
  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Search activities
export const search = async (searchTerm) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!searchTerm || searchTerm.trim() === '') {
    return getAll();
  }
  
  const term = searchTerm.toLowerCase();
  const filtered = activities.filter(a =>
    a.description.toLowerCase().includes(term) ||
    a.user.toLowerCase().includes(term) ||
    a.type.toLowerCase().includes(term)
  );
  
  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Get activity stats
export const getStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setDate(monthAgo.getDate() - 30);
  
  const todayCount = activities.filter(a => 
    new Date(a.date) >= today
  ).length;
  
  const weekCount = activities.filter(a => 
    new Date(a.date) >= weekAgo
  ).length;
  
  const monthCount = activities.filter(a => 
    new Date(a.date) >= monthAgo
  ).length;
  
  return {
    today: todayCount,
    week: weekCount,
    month: monthCount,
    total: activities.length
  };
};

export const activityService = {
  getAll,
  getById,
  create,
  update,
  remove,
  getByType,
  search,
  getStats
};