import { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import StatCard from '@/components/molecules/StatCard';
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { activityService } from '@/services/api/activityService';
import { toast } from 'react-toastify';

export default function Activity() {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterType]);

  async function loadData() {
    try {
      setLoading(true);
      const [activitiesData, statsData] = await Promise.all([
        activityService.getAll(),
        activityService.getStats()
      ]);
      
      setActivities(activitiesData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      console.error('Error loading activity data:', err);
      setError('Failed to load activity data. Please try again.');
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  }

  async function applyFilters() {
    if (!searchTerm && filterType === 'all') {
      // If no filters, reload all data
      try {
        const data = await activityService.getAll();
        setActivities(data);
      } catch (err) {
        console.error('Error applying filters:', err);
      }
      return;
    }

    try {
      let filteredData;
      
      if (searchTerm) {
        filteredData = await activityService.search(searchTerm);
      } else {
        filteredData = await activityService.getByType(filterType);
      }
      
      // Apply additional filtering if both search and type filter are active
      if (searchTerm && filterType !== 'all') {
        filteredData = filteredData.filter(activity => 
          activity.type.toLowerCase() === filterType.toLowerCase()
        );
      }
      
      setActivities(filteredData);
    } catch (err) {
      console.error('Error applying filters:', err);
      toast.error('Error filtering activities');
    }
  }

  function handleSearch(term) {
    setSearchTerm(term);
  }

  function handleTypeFilter(type) {
    setFilterType(type);
  }

  function getActivityIcon(type) {
    switch (type.toLowerCase()) {
      case 'student':
        return 'Users';
      case 'assignment':
        return 'FileText';
      case 'grade':
        return 'Award';
      case 'attendance':
        return 'Calendar';
      default:
        return 'Activity';
    }
  }

  function getActivityColor(type) {
    switch (type.toLowerCase()) {
      case 'student':
        return 'bg-blue-500';
      case 'assignment':
        return 'bg-green-500';
      case 'grade':
        return 'bg-yellow-500';
      case 'attendance':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  }

  function getBadgeVariant(type) {
    switch (type.toLowerCase()) {
      case 'student':
        return 'primary';
      case 'assignment':
        return 'success';
      case 'grade':
        return 'warning';
      case 'attendance':
        return 'info';
      default:
        return 'secondary';
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity</h1>
          <p className="text-gray-600 mt-1">Recent system activities and events</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Today"
            value={stats.today}
            icon="Calendar"
            color="blue"
            subtitle="activities"
          />
          <StatCard
            title="This Week"
            value={stats.week}
            icon="TrendingUp"
            color="green"
            subtitle="activities"
          />
          <StatCard
            title="This Month"
            value={stats.month}
            icon="BarChart3"
            color="purple"
            subtitle="activities"
          />
          <StatCard
            title="Total"
            value={stats.total}
            icon="Activity"
            color="orange"
            subtitle="all time"
          />
        </div>
      )}

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 w-full sm:max-w-md">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search activities..."
            />
          </div>
          <div className="w-full sm:w-auto sm:min-w-[180px]">
            <Select
              value={filterType}
              onChange={handleTypeFilter}
              options={[
                { value: 'all', label: 'All Activities' },
                { value: 'student', label: 'Student' },
                { value: 'assignment', label: 'Assignment' },
                { value: 'grade', label: 'Grade' },
                { value: 'attendance', label: 'Attendance' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          <p className="text-sm text-gray-600 mt-1">
            {activities.length} {activities.length === 1 ? 'activity' : 'activities'} found
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {activities.length === 0 ? (
            <div className="p-8 text-center">
              <ApperIcon name="Activity" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'No activities have been recorded yet.'}
              </p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.Id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-start gap-4">
                  {/* Activity Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${getActivityColor(activity.type)} flex items-center justify-center`}>
                    <ApperIcon 
                      name={getActivityIcon(activity.type)} 
                      size={20} 
                      className="text-white" 
                    />
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={getBadgeVariant(activity.type)}>
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                      </span>
                    </div>

                    <p className="text-gray-900 mb-2 leading-relaxed">
                      {activity.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ApperIcon name="User" size={14} />
                        <span>{activity.user}</span>
                      </div>
                      <time className="text-sm text-gray-500" dateTime={activity.date}>
                        {format(new Date(activity.date), 'MMM d, yyyy \'at\' h:mm a')}
                      </time>
                    </div>

                    {/* Activity Details */}
                    {activity.details && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          {Object.entries(activity.details)
                            .filter(([key]) => key !== 'action')
                            .map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-gray-600 capitalize">
                                  {key.replace(/_/g, ' ')}:
                                </span>
                                <span className="text-gray-900 font-medium">
                                  {typeof value === 'object' ? JSON.stringify(value) : value}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}