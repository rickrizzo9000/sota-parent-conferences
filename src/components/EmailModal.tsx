import React, { useState, useRef } from 'react';
import { X, Send, Loader, Download, Copy, Check, Calendar } from 'lucide-react';
import { Appointment } from '../types';
import { 
  sendEmail, 
  formatAppointmentsForEmail, 
  formatAppointmentsAsHTML,
  downloadScheduleAsFile,
  downloadCalendarFile
} from '../services/emailService';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  parentName: string;
  parentEmail: string;
  studentName: string;
  onEmailSent: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  appointments,
  parentName,
  parentEmail,
  studentName,
  onEmailSent
}) => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const messageContent = formatAppointmentsForEmail(parentName, studentName, appointments);
  const htmlContent = formatAppointmentsAsHTML(parentName, studentName, appointments);

  const handleSendEmail = async () => {
    setSending(true);
    setError(null);
    
    try {
      const success = await sendEmail({
        to_email: parentEmail,
        to_name: parentName,
        subject: 'Your Parent-Teacher Conference Schedule',
        message: messageContent
      });

      if (success) {
        onEmailSent();
        onClose();
      } else {
        setError('Failed to send email. Please try one of the alternative options below.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try one of the alternative options below.');
      console.error('Email sending error:', err);
    } finally {
      setSending(false);
    }
  };

  const handleDownload = () => {
    downloadScheduleAsFile(parentName, studentName, appointments);
  };

  const handleDownloadCalendar = () => {
    downloadCalendarFile(appointments);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(messageContent)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        setError('Failed to copy to clipboard. Please try another option.');
      });
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between bg-blue-50 p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <Send className="h-5 w-5 mr-2 text-blue-600" />
            <span>Your Conference Schedule</span>
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To:
            </label>
            <div className="border rounded-md px-3 py-2 bg-gray-50">
              {parentEmail}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject:
            </label>
            <div className="border rounded-md px-3 py-2 bg-gray-50">
              Your Parent-Teacher Conference Schedule
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Message Preview:
              </label>
              <button 
                onClick={togglePreview}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {showPreview ? "Show Plain Text" : "Show HTML Preview"}
              </button>
            </div>
            
            {showPreview ? (
              <div 
                ref={previewRef}
                className="border rounded-md px-3 py-2 h-40 overflow-y-auto text-sm"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            ) : (
              <div className="border rounded-md px-3 py-2 h-40 overflow-y-auto whitespace-pre-wrap text-sm">
                {messageContent}
              </div>
            )}
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <div className="flex flex-col space-y-3 mt-6">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={sending}
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                disabled={sending}
              >
                {sending ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </>
                )}
              </button>
            </div>
            
            <div className="pt-3 border-t">
              <p className="text-sm text-gray-600 mb-3">Alternative options:</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  onClick={handleDownload}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Text
                </button>
                <button
                  onClick={handleCopyToClipboard}
                  className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center justify-center"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Text
                    </>
                  )}
                </button>
              </div>
              <button
                onClick={handleDownloadCalendar}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Add to Calendar (.ics)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;