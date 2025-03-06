import React from 'react';
import { Calendar, Clock, User, BookOpen, X, Mail, GraduationCap, Send } from 'lucide-react';
import { Appointment } from '../types';

interface MyAppointmentsProps {
  appointments: Appointment[];
  onCancelAppointment: (appointmentId: string) => void;
  onEmailSchedule: () => void;
}

const MyAppointments: React.FC<MyAppointmentsProps> = ({ 
  appointments, 
  onCancelAppointment,
  onEmailSchedule
}) => {
  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <Calendar className="h-10 w-10 text-green-500 mx-auto mb-3" />
        <h2 className="text-xl font-semibold mb-2">My Scheduled Conferences</h2>
        <p className="text-gray-600">
          You haven't scheduled any conferences yet. Select a teacher and time slot to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-green-50 p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-green-600" />
          <span>My Scheduled Conferences</span>
        </h2>
        <button
          onClick={onEmailSchedule}
          className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
        >
          <Send className="h-4 w-4 mr-1" />
          Email Schedule
        </button>
      </div>
      
      <div className="divide-y">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-start space-x-4 mb-3 md:mb-0">
                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {appointment.teacherName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{appointment.teacherName}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{appointment.teacherSubject}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    <span>Student: {appointment.studentName}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-start md:items-end">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{appointment.timeSlot.formatted}</span>
                </div>
                
                <button
                  onClick={() => onCancelAppointment(appointment.id)}
                  className="inline-flex items-center px-3 py-1 border border-red-300 text-sm leading-5 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:border-red-400 focus:shadow-outline-red active:bg-red-200 transition ease-in-out duration-150"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;