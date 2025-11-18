import { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  isSameDay
} from 'date-fns';
import { cn } from '@/utils/cn';
import EventCard from '@/components/organisms/EventCard';
import ApperIcon from '@/components/ApperIcon';

export default function CalendarGrid({ currentDate, events, onEventClick }) {
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Calculate calendar grid boundaries
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });
  
  // Group events by date
  const eventsByDate = {};
  events.forEach(event => {
    if (!eventsByDate[event.date]) {
      eventsByDate[event.date] = [];
    }
    eventsByDate[event.date].push(event);
  });
  
  function getEventsForDate(date) {
    const dateString = format(date, 'yyyy-MM-dd');
    return eventsByDate[dateString] || [];
  }
  
  function handleDateClick(date) {
    setSelectedDate(isSameDay(date, selectedDate || new Date('1900-01-01')) ? null : date);
  }
  
  function getEventTypeColor(type) {
    switch (type) {
      case 'class': return 'bg-blue-500';
      case 'assignment': return 'bg-orange-500';
      case 'event': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  }
  
  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      {/* Calendar Header */}
      <div className="grid grid-cols-7 bg-gray-50 border-b">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          
          return (
            <div 
              key={index}
              className={cn(
                "min-h-32 p-2 border-r border-b last:border-r-0 cursor-pointer transition-colors",
                "hover:bg-blue-50",
                isCurrentMonth ? "bg-white" : "bg-gray-50",
                isSelected && "bg-blue-100",
                isDayToday && "bg-blue-50 ring-2 ring-blue-200"
              )}
              onClick={() => handleDateClick(day)}
            >
              {/* Day Number */}
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "text-sm font-medium",
                  isCurrentMonth ? "text-gray-900" : "text-gray-400",
                  isDayToday && "text-blue-600 font-bold"
                )}>
                  {format(day, 'd')}
                </span>
                
                {isDayToday && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </div>
              
              {/* Events */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.Id}
                    className={cn(
                      "text-xs p-1 rounded text-white cursor-pointer hover:opacity-80 transition-opacity",
                      getEventTypeColor(event.type)
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                    title={`${event.title} ${event.time ? `at ${event.time}` : ''}`}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    {event.time && (
                      <div className="opacity-80">{event.time}</div>
                    )}
                  </div>
                ))}
                
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 font-medium">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Selected Date Details */}
      {selectedDate && (
        <div className="border-t bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          
          <div className="space-y-2">
            {getEventsForDate(selectedDate).length === 0 ? (
              <p className="text-gray-500 text-sm">No events scheduled for this day</p>
            ) : (
              getEventsForDate(selectedDate).map(event => (
                <EventCard 
                  key={event.Id} 
                  event={event} 
                  onClick={() => onEventClick?.(event)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}