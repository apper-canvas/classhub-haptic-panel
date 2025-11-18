import { classService } from '@/services/api/classService';
import { assignmentService } from '@/services/api/assignmentService';
import { format, parseISO, isWithinInterval } from 'date-fns';

// Mock school events data
const mockEvents = [
  {
    Id: 1,
    title: "Back to School Night",
    description: "Meet your teachers and learn about the curriculum",
    date: "2024-09-15",
    time: "18:00",
    type: "event"
  },
  {
    Id: 2,
    title: "Parent-Teacher Conferences",
    description: "Individual meetings with teachers",
    date: "2024-10-20",
    time: "08:00",
    type: "event"
  },
  {
    Id: 3,
    title: "Fall Break",
    description: "No classes - Fall holiday",
    date: "2024-11-25",
    time: "00:00",
    type: "event"
  },
  {
    Id: 4,
    title: "Winter Break Starts",
    description: "Last day of classes before winter break",
    date: "2024-12-20",
    time: "15:30",
    type: "event"
  }
];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const calendarService = {
  async getEventsForDateRange(startDate, endDate) {
    await delay(800);
    
    try {
      // Get classes and assignments
      const classes = await classService.getAll();
      const assignments = await assignmentService.getAll();
      
      const events = [];
      
      // Convert classes to calendar events
      classes.forEach(classItem => {
        if (classItem.schedule) {
          // Parse schedule to create recurring events
          const scheduleEvents = parseClassSchedule(classItem, startDate, endDate);
          events.push(...scheduleEvents);
        }
      });
      
      // Convert assignments to calendar events
      assignments.forEach(assignment => {
        if (assignment.dueDate) {
          const dueDate = parseISO(assignment.dueDate);
          if (isWithinInterval(dueDate, { start: startDate, end: endDate })) {
            events.push({
              Id: `assignment-${assignment.Id}`,
              title: assignment.title,
              description: `Due: ${assignment.title}`,
              date: assignment.dueDate,
              time: "23:59",
              type: "assignment",
              assignmentId: assignment.Id,
              className: assignment.className || "Unknown Class",
              priority: getAssignmentPriority(assignment.dueDate)
            });
          }
        }
      });
      
      // Add school events
      mockEvents.forEach(event => {
        const eventDate = parseISO(event.date);
        if (isWithinInterval(eventDate, { start: startDate, end: endDate })) {
          events.push({
            ...event,
            Id: `event-${event.Id}`
          });
        }
      });
      
      // Sort events by date and time
      events.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
        const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
        return dateA - dateB;
      });
      
      return events;
    } catch (error) {
      console.error('Calendar service error:', error);
      throw new Error('Failed to load calendar events');
    }
  },

  async getEventsForDate(date) {
    const dateString = format(date, 'yyyy-MM-dd');
    const events = await this.getEventsForDateRange(date, date);
    return events.filter(event => event.date === dateString);
  },

  async getEventById(id) {
    await delay(200);
    // This would fetch a specific event - for now return mock
    return mockEvents.find(event => `event-${event.Id}` === id) || null;
  }
};

function parseClassSchedule(classItem, startDate, endDate) {
  const events = [];
  
  // Simple schedule parsing - assumes schedule format like "Mon,Wed,Fri 10:00-11:00"
  if (!classItem.schedule) return events;
  
  try {
    // For this implementation, create weekly recurring events
    // This is a simplified version - real implementation would parse actual schedule format
    const schedulePattern = classItem.schedule;
    const timeMatch = schedulePattern.match(/(\d{1,2}:\d{2})/);
    const time = timeMatch ? timeMatch[1] : '09:00';
    
    // Generate events for each week in the range
    const currentDate = new Date(startDate);
    const endDateTime = new Date(endDate);
    
    while (currentDate <= endDateTime) {
      // Check if this day matches the class schedule
      const dayName = format(currentDate, 'EEE'); // Mon, Tue, etc.
      
      if (schedulePattern.toLowerCase().includes(dayName.toLowerCase())) {
        events.push({
          Id: `class-${classItem.Id}-${format(currentDate, 'yyyy-MM-dd')}`,
          title: classItem.name,
          description: `${classItem.name} - ${classItem.instructor}`,
          date: format(currentDate, 'yyyy-MM-dd'),
          time: time,
          type: "class",
          classId: classItem.Id,
          instructor: classItem.instructor,
          room: classItem.room || "TBD"
        });
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
  } catch (error) {
    console.error('Error parsing class schedule:', error);
  }
  
  return events;
}

function getAssignmentPriority(dueDate) {
  const due = parseISO(dueDate);
  const now = new Date();
  const daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue < 0) return 'overdue';
  if (daysUntilDue <= 1) return 'urgent';
  if (daysUntilDue <= 3) return 'high';
  if (daysUntilDue <= 7) return 'medium';
  return 'low';
}