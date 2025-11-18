import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

export default function EventCard({ event, onClick, className }) {
  function getEventTypeIcon(type) {
    switch (type) {
      case 'class': return 'BookOpen';
      case 'assignment': return 'FileText';
      case 'event': return 'Calendar';
      default: return 'Circle';
    }
  }
  
  function getEventTypeColor(type) {
    switch (type) {
      case 'class': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'assignment': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'event': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }
  
  function getBadgeVariant(type) {
    switch (type) {
      case 'class': return 'blue';
      case 'assignment': return 'orange';
      case 'event': return 'green';
      default: return 'gray';
    }
  }
  
  function getPriorityColor(priority) {
    switch (priority) {
      case 'overdue': return 'text-red-600';
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  }
  
  return (
    <div 
      className={cn(
        "p-3 rounded-lg border cursor-pointer transition-all duration-150 hover:shadow-md",
        getEventTypeColor(event.type),
        className
      )}
      onClick={() => onClick?.(event)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <ApperIcon 
            name={getEventTypeIcon(event.type)} 
            size={16} 
            className="text-current"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-gray-900 truncate">
              {event.title}
            </h4>
            <Badge variant={getBadgeVariant(event.type)} size="sm">
              {event.type}
            </Badge>
          </div>
          
          {event.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {event.description}
            </p>
          )}
          
          {/* Event Details */}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
            {event.time && (
              <div className="flex items-center gap-1">
                <ApperIcon name="Clock" size={12} />
                <span>{event.time}</span>
              </div>
            )}
            
            {event.instructor && (
              <div className="flex items-center gap-1">
                <ApperIcon name="User" size={12} />
                <span>{event.instructor}</span>
              </div>
            )}
            
            {event.room && (
              <div className="flex items-center gap-1">
                <ApperIcon name="MapPin" size={12} />
                <span>{event.room}</span>
              </div>
            )}
            
            {event.className && event.type === 'assignment' && (
              <div className="flex items-center gap-1">
                <ApperIcon name="BookOpen" size={12} />
                <span>{event.className}</span>
              </div>
            )}
            
            {event.priority && event.type === 'assignment' && (
              <div className={cn(
                "flex items-center gap-1 font-medium",
                getPriorityColor(event.priority)
              )}>
                <ApperIcon 
                  name={event.priority === 'urgent' || event.priority === 'overdue' ? 'AlertTriangle' : 'Circle'} 
                  size={12} 
                />
                <span className="capitalize">{event.priority}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}