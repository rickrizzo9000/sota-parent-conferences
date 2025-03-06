import React from 'react';
import { Database, ExternalLink } from 'lucide-react';

interface SupabaseSetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupabaseSetupGuide: React.FC<SupabaseSetupGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between bg-green-50 p-4 border-b sticky top-0">
          <h2 className="text-xl font-semibold flex items-center">
            <Database className="h-5 w-5 mr-2 text-green-600" />
            <span>Setting Up Supabase Database</span>
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
            <h3>How to Set Up Supabase for Multi-User Functionality</h3>
            
            <p>
              This application can use Supabase as a backend database to enable multi-user functionality.
              Follow these steps to set up your own Supabase project:
            </p>
            
            <ol className="list-decimal pl-5 space-y-4">
              <li>
                <strong>Create a Supabase Account</strong>
                <p>
                  Visit <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline flex items-center">
                    Supabase.com <ExternalLink className="h-3 w-3 ml-1" />
                  </a> and sign up for a free account.
                </p>
              </li>
              
              <li>
                <strong>Create a New Project</strong>
                <p>
                  In your Supabase dashboard, click "New Project" and fill in the required information:
                </p>
                <ul className="list-disc pl-5">
                  <li>Project name (e.g., "Parent-Teacher Conference Scheduler")</li>
                  <li>Database password (save this somewhere secure)</li>
                  <li>Region (choose the one closest to your users)</li>
                </ul>
              </li>
              
              <li>
                <strong>Get Your API Credentials</strong>
                <p>
                  Once your project is created, go to "Project Settings" → "API" to find your API credentials:
                </p>
                <ul className="list-disc pl-5">
                  <li>Project URL (anon/public)</li>
                  <li>API Key (anon/public)</li>
                </ul>
              </li>
              
              <li>
                <strong>Update the Application</strong>
                 <p>
                  Create a <code>.env</code> file in the root of the project and add your Supabase credentials:
                </p>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`}
                </pre>
              </li>
              
              <li>
                <strong>Set Up Database Tables</strong>
                <p>
                  In your Supabase project, go to the "SQL Editor" and create a new query. Copy and paste the following SQL to create the necessary tables:
                </p>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id integer PRIMARY KEY,
  name text NOT NULL,
  subject text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable row level security
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read teacher data
CREATE POLICY "Anyone can read teachers"
  ON teachers
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to insert teacher data (needed for seeding)
CREATE POLICY "Anyone can insert teachers"
  ON teachers
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id text PRIMARY KEY,
  teacher_id integer REFERENCES teachers(id),
  teacher_name text NOT NULL,
  teacher_subject text NOT NULL,
  parent_name text NOT NULL,
  parent_email text NOT NULL,
  student_name text NOT NULL,
  time_slot_id text NOT NULL,
  time_slot_formatted text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create a unique constraint to prevent double booking
CREATE UNIQUE INDEX IF NOT EXISTS appointments_teacher_timeslot_idx 
  ON appointments (teacher_id, time_slot_id);

-- Enable row level security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Anyone can read appointments (needed for checking availability)
CREATE POLICY "Anyone can read appointments"
  ON appointments
  FOR SELECT
  TO public
  USING (true);

-- Anyone can insert appointments (we'll validate in the application)
CREATE POLICY "Anyone can insert appointments"
  ON appointments
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Anyone can update appointments (we'll validate in the application)
CREATE POLICY "Anyone can update appointments"
  ON appointments
  FOR UPDATE
  TO public
  USING (true);

-- Anyone can delete appointments (we'll validate in the application)
CREATE POLICY "Anyone can delete appointments"
  ON appointments
  FOR DELETE
  TO public
  USING (true);`}
                </pre>
              </li>
              
              <li>
                <strong>Enable Real-time</strong>
                <p>
                  In your Supabase dashboard, go to "Database" → "Replication" and enable real-time for the following tables:
                </p>
                <ul className="list-disc pl-5">
                  <li>teachers</li>
                  <li>appointments</li>
                </ul>
              </li>
            </ol>
            
            <h3 className="mt-6">Testing Your Setup</h3>
            
            <p>
              After completing the setup, you can test the multi-user functionality by:
            </p>
            
            <ol className="list-decimal pl-5">
              <li>Opening the application in two different browsers or computers</li>
              <li>Scheduling a conference in one browser</li>
              <li>Verifying that the booked time slot appears as unavailable in the other browser</li>
            </ol>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Note:</strong> The free tier of Supabase has some limitations, but it's more than sufficient for this application. For a production environment, you might want to consider upgrading to a paid plan.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseSetupGuide;