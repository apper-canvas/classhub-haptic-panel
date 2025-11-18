import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import AttendanceTracker from "@/components/organisms/AttendanceTracker";
import { attendanceService } from "@/services/api/attendanceService";
import { studentService } from "@/services/api/studentService";
import { classService } from "@/services/api/classService";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [allAttendance, allStudents, allClasses] = await Promise.all([
        attendanceService.getAll(),
        studentService.getAll(),
        classService.getAll()
      ]);

      setAttendance(allAttendance);
      setStudents(allStudents);
      setClasses(allClasses);
      
      // Set default class if available
      if (allClasses.length > 0 && !selectedClass) {
        setSelectedClass(allClasses[0].Id.toString());
      }
    } catch (err) {
      setError("Failed to load attendance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAttendanceUpdate = async (studentId, classId, date, status, note = "") => {
    try {
      const updatedRecord = await attendanceService.markAttendance(
        studentId, 
        classId, 
        date, 
        status, 
        note
      );
      
      // Update local state
      setAttendance(prev => {
        const existingIndex = prev.findIndex(a => 
          a.studentId === studentId && 
          a.classId === parseInt(classId) &&
          format(new Date(a.date), "yyyy-MM-dd") === format(new Date(date), "yyyy-MM-dd")
        );
        
        if (existingIndex !== -1) {
          // Update existing record
          return prev.map((record, index) => 
            index === existingIndex ? updatedRecord : record
          );
        } else {
          // Add new record
          return [...prev, updatedRecord];
        }
      });

      toast.success("Attendance updated successfully!");
    } catch (error) {
      toast.error("Failed to update attendance. Please try again.");
    }
  };

  // Filter students based on selected class
  const filteredStudents = selectedClass ? 
    students.filter(s => s.enrolledClasses?.includes(parseInt(selectedClass))) : 
    [];
  
  // Filter attendance records based on selected class and date
  const filteredAttendance = attendance.filter(a => {
    const matchClass = selectedClass ? a.classId === parseInt(selectedClass) : true;
    const matchDate = format(new Date(a.date), "yyyy-MM-dd") === selectedDate;
    return matchClass && matchDate;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance</h1>
          <p className="text-gray-600">
            Track daily attendance for your classes and monitor student participation.
          </p>
        </div>

        {/* Attendance Tracker */}
        <AttendanceTracker
          attendance={filteredAttendance}
          students={filteredStudents}
          selectedClass={selectedClass}
          selectedDate={selectedDate}
          onClassChange={handleClassChange}
          onDateChange={handleDateChange}
          loading={loading}
          error={error}
          onRetry={loadData}
          onAttendanceUpdate={handleAttendanceUpdate}
        />
      </div>
    </div>
  );
};

export default Attendance;