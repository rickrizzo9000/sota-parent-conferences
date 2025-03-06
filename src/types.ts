export interface Teacher {
  id: number;
  name: string;
  subject: string;
}

export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  formatted: string;
}

export interface Appointment {
  id: string;
  teacherId: number;
  teacherName: string;
  teacherSubject: string;
  parentName: string;
  parentEmail: string;
  studentName: string;
  timeSlot: TimeSlot;
}