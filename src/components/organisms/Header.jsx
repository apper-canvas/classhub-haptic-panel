import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

export default function Header({ onMobileMenuToggle }) {
  const location = useLocation();
  const navigate = useNavigate();

  function handleSearch(searchTerm) {
    // Handle global search - could navigate to search results page
    console.log('Global search:', searchTerm);
  }

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

  return (
    <header className="bg-surface border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Open mobile menu"
            >
              <ApperIcon name="Menu" size={20} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">ClassHub</span>
            </Link>
          </div>

          {/* Center - Navigation (hidden on mobile) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-primary bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <ApperIcon name={item.icon} size={16} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {/* Search bar (hidden on small screens) */}
            <div className="hidden md:block">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search..."
                className="w-64"
              />
            </div>

            {/* User menu */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>
</div>
    </header>
  );
}