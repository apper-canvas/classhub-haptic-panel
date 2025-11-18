import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  iconColor = "text-primary", 
  iconBg = "bg-blue-50",
  change,
  changeType,
  className 
}) => {
  const getChangeColor = (type) => {
    switch (type) {
      case "positive": return "text-green-600";
      case "negative": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case "positive": return "TrendingUp";
      case "negative": return "TrendingDown";
      default: return "Minus";
    }
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-card p-6", className)}>
      <div className="flex items-center">
        <div className={cn("p-3 rounded-full", iconBg)}>
          <ApperIcon name={icon} className={cn("h-6 w-6", iconColor)} />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className={cn("ml-2 flex items-center text-sm", getChangeColor(changeType))}>
                <ApperIcon name={getChangeIcon(changeType)} className="h-3 w-3 mr-1" />
                {change}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;