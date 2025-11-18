import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  className,
  icon = "FileText",
  title = "No data available",
  description = "Get started by adding your first item.",
  actionText = "Add Item",
  onAction
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="bg-gray-50 p-4 rounded-full mb-6">
        <ApperIcon name={icon} className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-8 max-w-sm">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export default Empty;