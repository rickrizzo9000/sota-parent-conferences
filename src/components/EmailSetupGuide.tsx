import React from 'react';
import { Info, ExternalLink } from 'lucide-react';

interface EmailSetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailSetupGuide: React.FC<EmailSetupGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between bg-blue-50 p-4 border-b sticky top-0">
          <h2 className="text-xl font-semibold flex items-center">
            <Info className="h-5 w-5 mr-2 text-blue-600" />
            <span>Setting Up Email Functionality</span>
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <div className="prose max-w-none">
            <h3>How to Set Up EmailJS for Real Email Sending</h3>
            
            <p>
              This application uses EmailJS to send emails directly from the browser. 
              Follow these steps to set up your own EmailJS account and enable real email sending:
            </p>
            
            <ol className="list-decimal pl-5 space-y-4">
              <li>
                <strong>Create an EmailJS Account</strong>
                <p>
                  Visit <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                    EmailJS.com <ExternalLink className="h-3 w-3 ml-1" />
                  </a> and sign up for a free account.
                </p>
              </li>
              
              <li>
                <strong>Add an Email Service</strong>
                <p>
                  In your EmailJS dashboard, go to "Email Services" and add a new service.
                  You can connect with Gmail, Outlook, or other email providers.
                </p>
                <p>
                  Note the <code>SERVICE_ID</code> that is generated for your service.
                </p>
              </li>
              
              <li>
                <strong>Create an Email Template</strong>
                <p>
                  Go to "Email Templates" and create a new template. You can use the following HTML as a starting point:
                </p>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`<h2>Parent-Teacher Conference Schedule</h2>
<p>Dear {{to_name}},</p>
<p>Here is your schedule for the Parent-Teacher Conferences:</p>
<div>{{message}}</div>
<p>Thank you for scheduling your conferences.</p>
<p>School District Parent-Teacher Conference System</p>`}
                </pre>
                <p>
                  Note the <code>TEMPLATE_ID</code> that is generated for your template.
                </p>
              </li>
              
              <li>
                <strong>Get Your Public Key</strong>
                <p>
                  Go to "Account" → "API Keys" to find your <code>PUBLIC_KEY</code>.
                </p>
              </li>
              
              <li>
                <strong>Update the Application</strong>
                <p>
                  Create a <code>.env</code> file in the root of the project (copy from <code>.env.example</code>) and add your EmailJS credentials:
                </p>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key`}
                </pre>
              </li>
              
              <li>
                <strong>Update the Code</strong>
                <p>
                  Open <code>src/services/emailService.ts</code> and update the following constants with your EmailJS credentials:
                </p>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_conference';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';`}
                </pre>
              </li>
            </ol>
            
            <h3 className="mt-6">Testing Your Setup</h3>
            
            <p>
              After completing the setup, you can test the email functionality by:
            </p>
            
            <ol className="list-decimal pl-5">
              <li>Scheduling a conference</li>
              <li>Clicking the "Email Schedule" button</li>
              <li>Clicking "Send Email" in the modal</li>
            </ol>
            
            <p>
              If everything is set up correctly, you should receive an email with your conference schedule.
            </p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Note:</strong> The free tier of EmailJS allows 200 emails per month. For a production application, you may need to upgrade to a paid plan.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSetupGuide;