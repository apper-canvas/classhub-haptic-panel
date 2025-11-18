import { Link, useLocation } from "react-router-dom";
import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

export default function MobileNav({ isOpen, onClose }) {
  const location = useLocation();

  function isActive(href) {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  }

  const navItems = [
    { href: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/students', label: 'Students', icon: 'Users' },
    { href: '/classes', label: 'Classes', icon: 'BookOpen' },
    { href: '/assignments', label: 'Assignments', icon: 'FileText' },
    { href: '/grades', label: 'Grades', icon: 'Award' },
    { href: '/attendance', label: 'Attendance', icon: 'Calendar' },
    { href: '/activity', label: 'Activity', icon: 'Activity' },
    { href: '/calendar', label: 'Calendar', icon: 'CalendarDays' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Mobile navigation */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-surface shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">ClassHub</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close mobile menu"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <nav className="p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-primary bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <ApperIcon name={item.icon} size={20} />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
</>
  );
}