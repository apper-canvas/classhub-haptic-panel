import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";

const AttendanceTracker = ({ 
  attendance, 
  students, 
  selectedClass,
  selectedDate,
  onClassChange,
  onDateChange,
  loading, 
  error, 
  onRetry,
  onAttendanceUpdate
}) => {
  const [selectedStatus, setSelectedStatus] = useState({});

  if (loading) {
    return <Loading variant="table" />;
  }

  if (error) {
    return (
      <ErrorView 
        message={error} 
        onRetry={onRetry}
      />
    );
  }

  if (!students || students.length === 0) {
    return (
      <Empty
        icon="Calendar"
        title="No students in selected class"
        description="Add students to this class to start tracking attendance."
        actionText="Manage Students"
      />
    );
  }

  const handleStatusChange = async (studentId, status) => {
    setSelectedStatus(prev => ({ ...prev, [studentId]: status }));
    await onAttendanceUpdate(studentId, selectedClass, selectedDate, status);
  };

  const getAttendanceForStudent = (studentId) => {
    return attendance.find(a => 
      a.studentId === studentId && 
      a.classId === parseInt(selectedClass) &&
      format(new Date(a.date), "yyyy-MM-dd") === format(new Date(selectedDate), "yyyy-MM-dd")
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present": return "bg-green-100 text-green-800";
      case "absent": return "bg-red-100 text-red-800";
      case "late": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAttendanceStats = () => {
    const stats = {
      total: students.length,
      present: 0,
      absent: 0,
      late: 0
    };

    students.forEach(student => {
      const record = getAttendanceForStudent(student.Id);
      if (record) {
        stats[record.status]++;
      }
    });

    return stats;
  };

  const stats = getAttendanceStats();

  const getStudentInitials = (student) => {
    return `${student.firstName?.[0] || ""}${student.lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Class:</label>
              <Select
                value={selectedClass}
                onChange={(e) => onClassChange(e.target.value)}
                className="w-48"
              >
                <option value="">Select a class</option>
                <option value="1">Mathematics 101</option>
                <option value="2">English Literature</option>
                <option value="3">Biology Basics</option>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Date:</label>
              <input
                type="date"
                value={format(new Date(selectedDate), "yyyy-MM-dd")}
                onChange={(e) => onDateChange(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-card p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100">
              <ApperIcon name="Users" className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-card p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100">
              <ApperIcon name="Check" className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Present</p>
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-card p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-red-100">
              <ApperIcon name="X" className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Absent</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-card p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100">
              <ApperIcon name="Clock" className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Late</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Attendance for {format(new Date(selectedDate), "MMMM d, yyyy")}
            </h3>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" icon="Download">
                Export
              </Button>
              <Button size="sm" icon="Save">
                Save All
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => {
                const attendanceRecord = getAttendanceForStudent(student.Id);
                const currentStatus = selectedStatus[student.Id] || attendanceRecord?.status || "";
                
                return (
                  <tr key={student.Id} className="table-row-hover">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                            {getStudentInitials(student)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.gradeLevel}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {currentStatus ? (
                        <Badge variant={currentStatus} className={getStatusColor(currentStatus)}>
                          {currentStatus}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">Not marked</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant={currentStatus === "present" ? "primary" : "ghost"}
                          onClick={() => handleStatusChange(student.Id, "present")}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <ApperIcon name="Check" className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={currentStatus === "absent" ? "primary" : "ghost"}
                          onClick={() => handleStatusChange(student.Id, "absent")}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <ApperIcon name="X" className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={currentStatus === "late" ? "primary" : "ghost"}
                          onClick={() => handleStatusChange(student.Id, "late")}
                          className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                        >
                          <ApperIcon name="Clock" className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        placeholder="Add note..."
                        defaultValue={attendanceRecord?.note || ""}
                        className="form-input text-sm w-full max-w-xs"
                        onBlur={(e) => {
                          if (currentStatus) {
                            onAttendanceUpdate(student.Id, selectedClass, selectedDate, currentStatus, e.target.value);
                          }
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;