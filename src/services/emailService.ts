import emailjs from '@emailjs/browser';
import { Appointment } from '../types';

// EmailJS configuration
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_conference';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

// Initialize EmailJS with your public key
export const initEmailJS = () => {
  emailjs.init(PUBLIC_KEY);
};

interface EmailParams {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
}

export const sendEmail = async (params: EmailParams): Promise<boolean> => {
  try {
    // In development mode, we'll simulate a successful email send
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Email would be sent with the following parameters:', params);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      return true;
    }

    // In production, use actual EmailJS service
    const templateParams = {
      to_name: params.to_name,
      to_email: params.to_email,
      subject: params.subject,
      message: params.message,
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );

    if (response.status === 200) {
      return true;
    } else {
      console.error('Email sending failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const formatAppointmentsForEmail = (
  parentName: string,
  studentName: string,
  appointments: Appointment[]
): string => {
  let message = `Dear ${parentName},\n\n`;
  message += `Here is your schedule for the Parent-Teacher Conferences on March 6, 2025:\n\n`;
  
  appointments.forEach((app, index) => {
    message += `${index + 1}. ${app.teacherName} (${app.teacherSubject})\n`;
    message += `   Time: ${app.timeSlot.formatted}\n`;
    message += `   Student: ${studentName}\n\n`;
  });
  
  message += `Thank you for scheduling your conferences.\n\n`;
  message += `School District Parent-Teacher Conference System`;
  
  return message;
};

// Function to format appointments as HTML for better email display
export const formatAppointmentsAsHTML = (
  parentName: string,
  studentName: string,
  appointments: Appointment[]
): string => {
  let html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">Parent-Teacher Conference Schedule</h2>
      <p>Dear ${parentName},</p>
      <p>Here is your schedule for the Parent-Teacher Conferences on March 6, 2025:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">Teacher</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">Subject</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">Time</th>
          </tr>
        </thead>
        <tbody>
  `;

  appointments.forEach((app) => {
    html += `
      <tr>
        <td style="padding: 10px; border: 1px solid #e5e7eb;">${app.teacherName}</td>
        <td style="padding: 10px; border: 1px solid #e5e7eb;">${app.teacherSubject}</td>
        <td style="padding: 10px; border: 1px solid #e5e7eb;">${app.timeSlot.formatted}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
      <p>Student: <strong>${studentName}</strong></p>
      <p>Thank you for scheduling your conferences.</p>
      <p style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
        School District Parent-Teacher Conference System
      </p>
    </div>
  `;

  return html;
};

// Function to download the schedule as a text file
export const downloadScheduleAsFile = (
  parentName: string,
  studentName: string,
  appointments: Appointment[]
) => {
  const content = formatAppointmentsForEmail(parentName, studentName, appointments);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'conference_schedule.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Function to create an ICS calendar file for download
export const downloadCalendarFile = (appointments: Appointment[]) => {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//School District//Parent-Teacher Conference System//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  appointments.forEach(app => {
    const startTime = app.timeSlot.startTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, '');
    const endTime = app.timeSlot.endTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, '');
    
    icsContent = [
      ...icsContent,
      'BEGIN:VEVENT',
      `UID:${app.id}@schooldistrict.edu`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, '')}`,
      `DTSTART:${startTime}`,
      `DTEND:${endTime}`,
      `SUMMARY:Conference with ${app.teacherName}`,
      `DESCRIPTION:Parent-Teacher Conference with ${app.teacherName} (${app.teacherSubject}) for student ${app.studentName}`,
      `LOCATION:School Building`,
      'END:VEVENT'
    ];
  });

  icsContent.push('END:VCALENDAR');
  
  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'parent_teacher_conferences.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};