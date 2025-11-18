import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-red-50 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="h-10 w-10 text-red-500" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. The page might have been 
          moved, deleted, or the URL might be incorrect.
        </p>
        
        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full" icon="Home">
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center justify-center space-x-4">
            <Link 
              to="/classes" 
              className="text-primary hover:text-blue-700 text-sm font-medium"
            >
              View Classes
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              to="/students" 
              className="text-primary hover:text-blue-700 text-sm font-medium"
            >
              View Students
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              to="/assignments" 
              className="text-primary hover:text-blue-700 text-sm font-medium"
            >
              View Assignments
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-xs text-gray-500">
          If you believe this is an error, please contact the system administrator.
        </div>
      </div>
    </div>
  );
};

export default NotFound;