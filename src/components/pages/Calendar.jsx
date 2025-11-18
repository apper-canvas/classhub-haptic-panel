import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import CalendarGrid from '@/components/organisms/CalendarGrid';
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import ApperIcon from '@/components/ApperIcon';
import { calendarService } from '@/services/api/calendarService';
import { toast } from 'react-toastify';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');

  useEffect(() => {
    loadCalendarData();
  }, [currentDate]);

  useEffect(() => {
    applyFilters();
  }, [events, searchTerm, eventTypeFilter]);

  async function loadCalendarData() {
    try {
      setLoading(true);
      setError(null);
      const startDate = startOfMonth(currentDate);
      const endDate = endOfMonth(currentDate);
      const calendarEvents = await calendarService.getEventsForDateRange(startDate, endDate);
      setEvents(calendarEvents);
    } catch (err) {
      console.error('Failed to load calendar data:', err);
      setError('Failed to load calendar events');
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (eventTypeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === eventTypeFilter);
    }

    setFilteredEvents(filtered);
  }

  function handleSearch(term) {
    setSearchTerm(term);
  }

  function handleEventTypeFilter(type) {
    setEventTypeFilter(type);
  }

  function goToPreviousMonth() {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  }

  function goToNextMonth() {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadCalendarData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Calendar</h1>
          <p className="text-gray-600">View scheduled classes, assignment due dates, and school events</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={goToToday}
          >
            Today
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search events..."
            onSearch={handleSearch}
            value={searchTerm}
          />
        </div>
        
        <div className="flex gap-4">
          <Select
            value={eventTypeFilter}
            onChange={handleEventTypeFilter}
            className="min-w-32"
          >
            <option value="all">All Events</option>
            <option value="class">Classes</option>
            <option value="assignment">Assignments</option>
            <option value="event">School Events</option>
          </Select>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={goToPreviousMonth}
          >
            <ApperIcon name="ChevronLeft" size={16} />
          </Button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <Button 
            variant="secondary" 
            size="sm"
            onClick={goToNextMonth}
          >
            <ApperIcon name="ChevronRight" size={16} />
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Classes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Assignments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Events</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <Loading message="Loading calendar..." />
      ) : (
        <CalendarGrid
          currentDate={currentDate}
          events={filteredEvents}
          onEventClick={(event) => {
            if (event.type === 'class' && event.classId) {
              // Navigate to class detail
              window.location.href = `/classes/${event.classId}`;
            } else if (event.type === 'assignment' && event.assignmentId) {
              // Navigate to assignments with filter
              window.location.href = '/assignments';
            }
          }}
        />
      )}
    </div>
  );
}