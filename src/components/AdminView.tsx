import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, BookOpen, X, Mail, GraduationCap, Download, Filter, Search, ArrowUpDown } from 'lucide-react';
import { Appointment, Teacher } from '../types';
import { isSupabaseConfigured } from '../services/supabaseClient';

interface AdminViewProps {
  appointments: Appointment[];
  teachers: Teacher[];
  onExit: () => void;
  onCancelAppointment: (appointmentId: string) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ 
  appointments, 
  teachers,
  onExit,
  onCancelAppointment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeacher, setFilterTeacher] = useState<number | null>(null);
  const [filterTimeSlot, setFilterTimeSlot] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  // Check if Supabase is configured
  useEffect(() => {
    setIsSupabaseConnected(isSupabaseConfigured());
  }, []);

  // Get unique time slots from appointments
  const uniqueTimeSlots = Array.from(
    new Set(appointments.map(app => app.timeSlot.id))
  ).map(id => {
    const appointment = appointments.find(app => app.timeSlot.id === id);
    return {
      id,
      formatted: appointment?.timeSlot.formatted || ''
    };
  }).sort((a, b) => a.formatted.localeCompare(b.formatted));

  // Filter and sort appointments
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.parentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTeacher = filterTeacher === null || appointment.teacherId === filterTeacher;
    const matchesTimeSlot = filterTimeSlot === null || appointment.timeSlot.id === filterTimeSlot;
    
    return matchesSearch && matchesTeacher && matchesTimeSlot;
  });

  // Sort appointments
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (!sortField) return 0;
    
    let comparison = 0;
    
    switch (sortField) {
      case 'teacherName':
        comparison = a.teacherName.localeCompare(b.teacherName);
        break;
      case 'parentName':
        comparison = a.parentName.localeCompare(b.parentName);
        break;
      case 'studentName':
        comparison = a.studentName.localeCompare(b.studentName);
        break;
      case 'time':
        comparison = a.timeSlot.formatted.localeCompare(b.timeSlot.formatted);
        break;
      default:
        return 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Teacher', 'Subject', 'Parent', 'Email', 'Student', 'Time'];
    const rows = sortedAppointments.map(app => [
      app.teacherName,
      app.teacherSubject,
      app.parentName,
      app.parentEmail,
      app.studentName,
      app.timeSlot.formatted
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'parent_teacher_conferences.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterTeacher(null);
    setFilterTimeSlot(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-purple-50 p-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold flex items-center mb-3 sm:mb-0">
            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
            <span>Administrator View: All Scheduled Conferences</span>
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </button>
            <button
              onClick={onExit}
              className="inline-flex items-center px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors"
            >
              <X className="h-4 w-4 mr-1" />
              Exit Admin
            </button>
          </div>
        </div>
      </div>

      {!isSupabaseConnected && (
        <div className="bg-yellow-50 p-3 border-b border-yellow-100">
          <p className="text-sm text-yellow-700 flex items-center">
            <svg className="h-4 w-4 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Running in local storage mode. Connect to Supabase for multi-user functionality.
          </p>
        </div>
      )}

      <div className="p-4 border-b bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full border rounded-md pl-9 pr-3 py-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={filterTeacher || ''}
              onChange={(e) => setFilterTeacher(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">All Teachers</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <select
              className="border rounded-md px-3 py-2 text-sm"
              value={filterTimeSlot || ''}
              onChange={(e) => setFilterTimeSlot(e.target.value || null)}
            >
              <option value="">All Time Slots</option>
              {uniqueTimeSlots.map(slot => (
                <option key={slot.id} value={slot.id}>
                  {slot.formatted}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </button>
        </div>
      </div>

      {sortedAppointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('teacherName')}
                >
                  <div className="flex items-center">
                    <span>Teacher</span>
                    {sortField === 'teacherName' && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'text-blue-600' : 'text-red-600'}`} />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('parentName')}
                >
                  <div className="flex items-center">
                    <span>Parent</span>
                    {sortField === 'parentName' && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'text-blue-600' : 'text-red-600'}`} />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('studentName')}
                >
                  <div className="flex items-center">
                    <span>Student</span>
                    {sortField === 'studentName' && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'text-blue-600' : 'text-red-600'}`} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('time')}
                >
                  <div className="flex items-center">
                    <span>Time</span>
                    {sortField === 'time' && (
                      <ArrowUpDown className={`h-4 w-4 ml-1 ${sortDirection === 'asc' ? 'text-blue-600' : 'text-red-600'}`} />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{appointment.teacherName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{appointment.teacherSubject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.parentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-blue-600">{appointment.parentEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.studentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{appointment.timeSlot.formatted}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onCancelAppointment(appointment.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No conferences found</h3>
          <p className="text-gray-500">
            {searchTerm || filterTeacher || filterTimeSlot 
              ? 'Try adjusting your search or filters'
              : 'No parent-teacher conferences have been scheduled yet'}
          </p>
        </div>
      )}

      <div className="bg-gray-50 px-4 py-3 border-t">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{sortedAppointments.length}</span> of{' '}
          <span className="font-medium">{appointments.length}</span> total conferences
        </div>
      </div>
    </div>
  );
};

export default AdminView;