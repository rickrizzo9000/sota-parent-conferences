import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, BookOpen, X, Mail, GraduationCap, Lock, Eye, Send, Info, Database } from 'lucide-react';
import TeacherList from './components/TeacherList';
import TimeSlotGrid from './components/TimeSlotGrid';
import MyAppointments from './components/MyAppointments';
import AdminView from './components/AdminView.tsx';
import EmailModal from './components/EmailModal';
import EmailSetupGuide from './components/EmailSetupGuide';
import SupabaseSetupGuide from './components/SupabaseSetupGuide';
import { Teacher, Appointment, TimeSlot } from './types';
import { isSupabaseConfigured } from './services/supabaseClient';
import { fetchTeachers, seedTeachersIfNeeded } from './services/teacherService';
import { 
  fetchAppointments, 
  createAppointment as createAppointmentInDb, 
  deleteAppointment as deleteAppointmentFromDb,
  isTimeSlotBooked as checkTimeSlotBooked
} from './services/appointmentService';
import { supabase } from './services/supabaseClient';

function App() {
  const defaultTeachers: Teacher[] = [
    { id: 1, name: 'Accorso, Michelle', subject: 'Drama' },
    { id: 2, name: 'Antonio, Cara', subject: 'Math' },
    { id: 3, name: 'Arrendell, Robert', subject: '7th grade Science' },
    { id: 4, name: 'Ballestas, Edgar A', subject: 'ESOL' },
    { id: 5, name: 'Bassette, Joshua', subject: 'Math' },
    { id: 6, name: 'Beasley, Sharon', subject: 'Special Ed' },
    { id: 7, name: 'Bell, Bridget', subject: 'Dance' },
    { id: 8, name: 'Best, William J', subject: 'Math' },
    { id: 9, name: 'Bilofsky, Matthew A.', subject: 'Social Studies' },
    { id: 10, name: 'Bonawitz, Spencer S', subject: 'English' },
    { id: 11, name: 'Branca, Nija', subject: 'English' },
    { id: 12, name: 'Breidenstein, Heidi J', subject: 'English' },
    { id: 13, name: 'Brent, Stephen A', subject: 'Math' },
    { id: 14, name: 'Canfield, Kenneth', subject: 'Theater Tech' },
    { id: 15, name: 'Capezzuto, Cheryl A', subject: 'Physical Ed' },
    { id: 16, name: 'Cooley, Sarah', subject: 'Special Ed' },
    { id: 17, name: 'Coughlin, Eileen M.', subject: 'English' },
    { id: 18, name: 'Cox, Daile', subject: 'Math' },
    { id: 19, name: 'Craddock, Bradley E', subject: 'Creative Writing' },
    { id: 20, name: 'Dastyck, Renee', subject: 'Special Ed' },
    { id: 21, name: 'DellaGloria, Marc J', subject: 'Math' },
    { id: 22, name: 'Demonte, Anthony N', subject: 'Computer Science' },
    { id: 23, name: 'Diaz, Angel R', subject: 'Foreign Language' },
    { id: 24, name: 'Diaz, Ramon L', subject: 'Social Studies' },
    { id: 25, name: 'Dinicola, Mary C', subject: 'Special Ed' },
    { id: 26, name: 'Driscoll, Danielle', subject: 'Math' },
    { id: 27, name: 'Episcopo, Andrew R', subject: 'Reading' },
    { id: 28, name: 'Fellows, Luke', subject: 'Drama' },
    { id: 29, name: 'Ferindino, Amanda', subject: 'Special Education' },
    { id: 30, name: 'Fetter, John P', subject: 'Instrumental Music' },
    { id: 31, name: 'Fitzgerald, Chandler', subject: 'Social Studies' },
    { id: 32, name: 'Fitzpatrick, Theresa L', subject: 'Visual Arts' },
    { id: 33, name: 'Fixsen, Angela H.', subject: 'Math' },
    { id: 34, name: 'Freese, Lauren', subject: 'Math' },
    { id: 35, name: 'Fusco, Matthew W', subject: 'English' },
    { id: 36, name: 'Gallagher, Brian N', subject: 'Chemistry' },
    { id: 37, name: 'Gamzon, Marcy', subject: 'Creative Writing' },
    { id: 38, name: 'Geary, Paul M', subject: 'Biology' },
    { id: 39, name: 'Gilbert, Brenton V', subject: 'Social Studies' },
    { id: 40, name: 'Glavich-Hawkins, Genine N', subject: 'Art' },
    { id: 41, name: 'Harris, Meagan K', subject: 'Special Ed' },
    { id: 42, name: 'Hartmann, James', subject: 'Vocal Music' },
    { id: 43, name: 'Hayden, Mary Ellen', subject: 'Special Ed' },
    { id: 44, name: 'Johnson, Zachary S', subject: 'Social Studies' },
    { id: 45, name: 'Keihl, Kaitlyn M', subject: 'English' },
    { id: 46, name: 'Kosmider, Anna K', subject: 'Dance' },
    { id: 47, name: 'Kraeger, Traci L', subject: 'Chemistry' },
    { id: 48, name: 'Kumar, Pratima', subject: 'Math' },
    { id: 49, name: 'Labrosa, Amy', subject: 'Special Ed' },
    { id: 50, name: 'Latorre, Jack A', subject: 'Art' },
    { id: 51, name: 'Majak, Katharine K', subject: 'Physics' },
    { id: 52, name: 'Manetta, JoEllen', subject: 'Social Studies' },
    { id: 53, name: 'Martin, William M', subject: 'Earth Science' },
    { id: 54, name: 'Mason, Erin C', subject: 'Social Studies' },
    { id: 55, name: 'Mazierski, Kaitlyn', subject: 'Foreign Language' },
    { id: 56, name: 'McManus, Craig', subject: 'ELA' },
    { id: 57, name: 'McMullen, Phillip E', subject: 'Vocal Music' },
    { id: 58, name: 'Meteyer, Matthew T', subject: 'Chemistry' },
    { id: 59, name: 'Morrow, Jeremy', subject: 'Special Ed' },
    { id: 60, name: 'Myers, Edward H', subject: 'Theater Tech' },
    { id: 61, name: 'Newell, Robert J', subject: 'Living Environment' },
    { id: 62, name: 'Nowicki, Kaley M', subject: 'Visual Arts' },
    { id: 63, name: 'O\'Connor, Michael J', subject: 'Special Ed' },
    { id: 64, name: 'O\'Connor, Rebecca A', subject: 'Special Ed' },
    { id: 65, name: 'O\'Connor, Sean T', subject: 'Foreign Language' },
    { id: 66, name: 'Oneill, Ryan', subject: 'Physical Ed' },
    { id: 67, name: 'Padilla, LaToya A', subject: 'Earth Science' },
    { id: 68, name: 'Parisi, Jody M', subject: 'Instrumental Music' },
    { id: 69, name: 'Pasqualucci, Thomas J', subject: '8th grade Science' },
    { id: 70, name: 'Perez, Ashley T', subject: 'Creative Writing' },
    { id: 71, name: 'Phillips, Melinda B.', subject: 'Dance' },
    { id: 72, name: 'Price, Amanda K', subject: 'Special Ed' },
    { id: 73, name: 'Rivera, Ariana S', subject: 'Dance' },
    { id: 74, name: 'Robinson, Nicole', subject: 'Foreign Language' },
    { id: 75, name: 'Roods, Cynthia A', subject: 'Living Environment' },
    { id: 76, name: 'Roselli, Mark J', subject: 'Physical Ed' },
    { id: 77, name: 'Rybolt, Benjamin', subject: 'Music' },
    { id: 78, name: 'Schuman, Jennifer', subject: 'Special Ed' },
    { id: 79, name: 'Sinesiou, Adam', subject: 'Special Ed' },
    { id: 80, name: 'Smith, Andrew', subject: 'Health' },
    { id: 81, name: 'Smith, Erica L', subject: 'Foreign Language' },
    { id: 82, name: 'Smithgall, Douglas J', subject: 'Earth Science' },
    { id: 83, name: 'Sowers, Matthew J', subject: 'Physical Ed' },
    { id: 84, name: 'Tillotson, James A', subject: 'Social Studies' },
    { id: 85, name: 'Tobin, Michael R', subject: 'Special Ed' },
    { id: 86, name: 'Vandermallie, Sherry L', subject: 'Physical Ed' },
    { id: 87, name: 'Venanzi, Kerry A', subject: 'Music' },
    { id: 88, name: 'Walsh, Cassandra S', subject: 'Special Ed' },
    { id: 89, name: 'Wardlow, Katherine H', subject: 'Hearing Impaired' },
    { id: 90, name: 'Watson, Kelly M', subject: 'Art' },
    { id: 91, name: 'Wilson, Evan A', subject: 'Social Studies' },
    { id: 92, name: 'Wilson, Ryan', subject: 'Health' },
    { id: 93, name: 'Wolf, Erin', subject: 'Special Ed' },
    { id: 94, name: 'Woodhams, Susan D', subject: 'English' },
    { id: 95, name: 'Zenkert, Scott C', subject: 'Social Studies' },
    { id: 96, name: 'Zingaro, Jennifer M', subject: 'ESOL' }
  ];

  const [teachers, setTeachers] = useState<Teacher[]>(defaultTeachers);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [parentName, setParentName] = useState<string>('');
  const [parentEmail, setParentEmail] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [showAdminView, setShowAdminView] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [showEmailSetupGuide, setShowEmailSetupGuide] = useState<boolean>(false);
  const [showSupabaseSetupGuide, setShowSupabaseSetupGuide] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Check if Supabase is configured
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      const isConnected = isSupabaseConfigured();
      setIsSupabaseConnected(isConnected);
      
      if (isConnected) {
        try {
          // Seed teachers if needed
          await seedTeachersIfNeeded(defaultTeachers);
          
          // Fetch teachers from database
          const dbTeachers = await fetchTeachers();
          if (dbTeachers.length > 0) {
            setTeachers(dbTeachers);
          } else {
            // If we couldn't get teachers from the database, use the default list
            console.log('Using default teacher list as fallback');
          }
          
          // Fetch appointments from database
          const dbAppointments = await fetchAppointments();
          if (dbAppointments.length > 0) {
            setAppointments(dbAppointments);
          }
        } catch (error) {
          console.error('Error initializing data from Supabase:', error);
          setDatabaseError('Failed to connect to the database. Using local storage as fallback.');
        }
      }
      
      setIsLoading(false);
    };
    
    checkSupabaseConnection();
  }, []);

  // Set up real-time subscription for appointments
  useEffect(() => {
    if (!isSupabaseConnected) return;
    
    const appointmentsSubscription = supabase
      .channel('appointments-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'appointments' 
      }, async (payload) => {
        // Refresh appointments when changes occur
        const dbAppointments = await fetchAppointments();
        setAppointments(dbAppointments);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(appointmentsSubscription);
    };
  }, [isSupabaseConnected]);

  // Load data from localStorage on initial render (fallback when Supabase is not connected)
  useEffect(() => {
    if (isSupabaseConnected) return;
    
    const savedParentName = localStorage.getItem('parentName');
    const savedParentEmail = localStorage.getItem('parentEmail');
    const savedStudentName = localStorage.getItem('studentName');
    const savedAppointments = localStorage.getItem('appointments');
    
    if (savedParentName) setParentName(savedParentName);
    if (savedParentEmail) setParentEmail(savedParentEmail);
    if (savedStudentName) setStudentName(savedStudentName);
    
    if (savedAppointments) {
      try {
        // Need to convert date strings back to Date objects
        const parsedAppointments = JSON.parse(savedAppointments);
        const reconstructedAppointments = parsedAppointments.map((app: any) => ({
          ...app,
          timeSlot: {
            ...app.timeSlot,
            startTime: new Date(app.timeSlot.startTime),
            endTime: new Date(app.timeSlot.endTime)
          }
        }));
        setAppointments(reconstructedAppointments);
      } catch (error) {
        console.error('Error parsing saved appointments:', error);
      }
    }
  }, [isSupabaseConnected]);

  // Save parent info to localStorage whenever it changes (fallback when Supabase is not connected)
  useEffect(() => {
    if (isSupabaseConnected) return;
    
    localStorage.setItem('parentName', parentName);
    localStorage.setItem('parentEmail', parentEmail);
    localStorage.setItem('studentName', studentName);
  }, [parentName, parentEmail, studentName, isSupabaseConnected]);

  // Save appointments to localStorage whenever they change (fallback when Supabase is not connected)
  useEffect(() => {
    if (isSupabaseConnected) return;
    
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments, isSupabaseConnected]);

  // Generate time slots from 5:00 PM to 6:50 PM in 10-minute increments
  useEffect(() => {
    const slots: TimeSlot[] = [];
    const conferenceDate = new Date('March 6, 2025');
    
    for (let hour = 17; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        // Include 6:50 PM (18:50)
        if (hour === 18 && minute > 50) continue;
        
        const startTime = new Date(conferenceDate);
        startTime.setHours(hour, minute, 0);
        
        const endTime = new Date(conferenceDate);
        endTime.setHours(hour, minute + 10, 0);
        
        slots.push({
          id: `${hour}-${minute}`,
          startTime,
          endTime,
          formatted: `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        });
      }
    }
    
    setTimeSlots(slots);
  }, []);

  // Refresh appointments periodically to ensure UI is in sync
  useEffect(() => {
    const refreshAppointments = async () => {
      if (isSupabaseConnected) {
        try {
          const dbAppointments = await fetchAppointments();
          setAppointments(dbAppointments);
        } catch (error) {
          console.error('Error refreshing appointments:', error);
        }
      }
    };

    // Initial refresh
    refreshAppointments();

    // Set up interval for periodic refreshes
    const intervalId = setInterval(() => {
      refreshAppointments();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, [isSupabaseConnected, refreshTrigger]);

  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleAppointmentBook = async (timeSlot: TimeSlot) => {
    if (bookingInProgress) {
      return; // Prevent multiple simultaneous booking attempts
    }
    
    if (!selectedTeacher || !parentName.trim() || !parentEmail.trim() || !studentName.trim()) {
      alert('Please fill in all required fields (parent name, email, and student name)');
      return;
    }

    // Check if this parent already has an appointment at this time
    const hasConflict = appointments.some(
      app => app.timeSlot.id === timeSlot.id && app.parentEmail === parentEmail
    );

    if (hasConflict) {
      alert('You already have an appointment at this time');
      return;
    }

    setBookingInProgress(true);

    try {
      // Double-check if the time slot is still available
      const isSlotBooked = await isTimeSlotBooked(selectedTeacher.id, timeSlot.id);
      
      if (isSlotBooked) {
        alert('This time slot has just been booked by someone else. Please select another time.');
        setBookingInProgress(false);
        return;
      }

      const newAppointment: Appointment = {
        id: `${selectedTeacher.id}-${timeSlot.id}-${parentEmail}`,
        teacherId: selectedTeacher.id,
        teacherName: selectedTeacher.name,
        teacherSubject: selectedTeacher.subject,
        parentName,
        parentEmail,
        studentName,
        timeSlot
      };

      if (isSupabaseConnected) {
        try {
          // Save to Supabase
          const success = await createAppointmentInDb(newAppointment);
          if (!success) {
            alert('Failed to book appointment. The time slot may have been taken. Please try another time slot.');
            setBookingInProgress(false);
            return;
          }
          
          // Force refresh appointments to ensure UI is updated
          const dbAppointments = await fetchAppointments();
          setAppointments(dbAppointments);
        } catch (error) {
          console.error('Error booking appointment:', error);
          alert('Failed to book appointment. Please try again.');
          setBookingInProgress(false);
          return;
        }
      } else {
        // Save to local state
        setAppointments(prevAppointments => [...prevAppointments, newAppointment]);
      }
      
      setEmailSent(false); // Reset email sent status when new appointment is booked
      // Trigger a refresh to ensure the UI is updated
      setRefreshTrigger(prev => prev + 1);
    } finally {
      setBookingInProgress(false);
    }
  };

  const handleAppointmentCancel = async (appointmentId: string) => {
    if (isSupabaseConnected) {
      try {
        // Delete from Supabase
        const success = await deleteAppointmentFromDb(appointmentId);
        if (!success) {
          alert('Failed to cancel appointment. Please try again.');
          return;
        }
        
        // Force refresh appointments to ensure UI is updated
        const dbAppointments = await fetchAppointments();
        setAppointments(dbAppointments);
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('Failed to cancel appointment. Please try again.');
        return;
      }
    } else {
      // Delete from local state
      setAppointments(prevAppointments => prevAppointments.filter(app => app.id !== appointmentId));
    }
    
    setEmailSent(false); // Reset email sent status when appointment is cancelled
    // Trigger a refresh to ensure the UI is updated
    setRefreshTrigger(prev => prev + 1);
  };

  const isTimeSlotBooked = async (teacherId: number, timeSlotId: string): Promise<boolean> => {
    if (isSupabaseConnected) {
      try {
        // Check in Supabase
        return await checkTimeSlotBooked(teacherId, timeSlotId);
      } catch (error) {
        console.error('Error checking time slot availability:', error);
        return false;
      }
    } else {
      // Check in local state
      return appointments.some(
        app => app.teacherId === teacherId && app.timeSlot.id === timeSlotId
      );
    }
  };

  const getMyAppointments = () => {
    return appointments.filter(app => app.parentEmail === parentEmail);
  };

  const handleAdminLogin = () => {
    // Simple password check - in a real app, this would be more secure
    if (adminPassword === 'admin123') {
      setIsAdminAuthenticated(true);
      setShowAdminView(true);
      setShowAdminLogin(false);
    } else {
      alert('Invalid administrator password');
    }
  };

  const toggleAdminLogin = () => {
    setShowAdminLogin(!showAdminLogin);
    if (!showAdminLogin) {
      setShowAdminView(false);
    }
  };

  const exitAdminView = () => {
    setShowAdminView(false);
    setIsAdminAuthenticated(false);
    setAdminPassword('');
  };

  const handleEmailSchedule = () => {
    const myAppointments = getMyAppointments();
    
    if (myAppointments.length === 0) {
      alert('You have no scheduled conferences to email');
      return;
    }
    
    if (!parentEmail) {
      alert('Please provide your email address');
      return;
    }
    
    // Open the email modal instead of using mailto
    setShowEmailModal(true);
  };

  const handleEmailSent = () => {
    setEmailSent(true);
    
    // Hide the success message after 5 seconds
    setTimeout(() => {
      setEmailSent(false);
    }, 5000);
  };

  const hasParentInfo = parentName.trim() !== '' && parentEmail.trim() !== '' && studentName.trim() !== '';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading conference scheduler...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Parent-Teacher Conference Scheduler</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-medium">March 6, 2025</span>
            </div>
            <button 
              onClick={() => setShowEmailSetupGuide(true)}
              className="flex items-center text-sm bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded transition-colors"
            >
              <Info className="h-4 w-4 mr-1" />
              Email Setup
            </button>
            <button 
              onClick={() => setShowSupabaseSetupGuide(true)}
              className="flex items-center text-sm bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded transition-colors"
            >
              <Database className="h-4 w-4 mr-1" />
              Database Setup
            </button>
            <button 
              onClick={toggleAdminLogin}
              className="flex items-center text-sm bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded transition-colors"
            >
              <Lock className="h-4 w-4 mr-1" />
              {showAdminLogin ? 'Cancel' : 'Admin'}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 flex-grow">
        {!isSupabaseConnected && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded relative mb-4 flex items-center" role="alert">
            <Database className="h-5 w-5 mr-2" />
            <span>
              Running in local storage mode. 
              <button 
                onClick={() => setShowSupabaseSetupGuide(true)}
                className="ml-2 underline font-medium"
              >
                Connect to Supabase
              </button> 
              for multi-user functionality.
            </span>
          </div>
        )}
        
        {isSupabaseConnected && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded relative mb-4 flex items-center" role="alert">
            <Database className="h-5 w-5 mr-2" />
            <span>
              Connected to Supabase database. Multiple users can now schedule conferences simultaneously.
            </span>
          </div>
        )}
        
        {databaseError && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative mb-4 flex items-center" role="alert">
            <Database className="h-5 w-5 mr-2" />
            <span>
              {databaseError}
            </span>
            <button 
              className="absolute top-0 right-0 p-2" 
              onClick={() => setDatabaseError(null)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {emailSent && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center" role="alert">
            <Send className="h-5 w-5 mr-2" />
            <span>Your conference schedule has been sent to {parentEmail}. Please check your inbox.</span>
            <button 
              className="absolute top-0 right-0 p-2" 
              onClick={() => setEmailSent(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {showAdminLogin && !isAdminAuthenticated ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Lock className="h-5 w-5 mr-2 text-blue-600" />
              Administrator Login
            </h2>
            <div className="flex items-center mb-4">
              <input
                type="password"
                placeholder="Enter administrator password"
                className="border rounded-md px-3 py-2 mr-2 flex-grow"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
              <button
                onClick={handleAdminLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Login
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Administrator access is restricted to authorized personnel only.
            </p>
          </div>
        ) : null}

        {showAdminView && isAdminAuthenticated ? (
          <div className="mb-6">
            <AdminView 
              appointments={appointments} 
              teachers={teachers}
              onExit={exitAdminView}
              onCancelAppointment={handleAppointmentCancel}
            />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-lg font-semibold mb-4">Parent & Student Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Parent Name *"
                    className="border rounded-md px-3 py-2 w-full"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-500 mr-2" />
                  <input
                    type="email"
                    placeholder="Parent Email *"
                    className="border rounded-md px-3 py-2 w-full"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-5 w-5 text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Student Name *"
                    className="border rounded-md px-3 py-2 w-full"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600 flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>Please fill in all fields, then select a teacher and time slot to schedule your conference</span>
              </div>
            </div>

            {hasParentInfo && (
              <div className="mb-6">
                <MyAppointments 
                  appointments={getMyAppointments()} 
                  onCancelAppointment={handleAppointmentCancel}
                  onEmailSchedule={handleEmailSchedule}
                />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <TeacherList 
                  teachers={teachers} 
                  selectedTeacher={selectedTeacher} 
                  onSelectTeacher={handleTeacherSelect} 
                />
              </div>
              
              <div className="lg:col-span-2">
                {selectedTeacher ? (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-blue-50 p-4 border-b">
                      <h2 className="text-xl font-semibold flex items-center">
                        <span>Schedule with: {selectedTeacher.name}</span>
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {selectedTeacher.subject}
                        </span>
                        <button 
                          onClick={() => setSelectedTeacher(null)}
                          className="ml-auto text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </h2>
                    </div>
                    <TimeSlotGrid 
                      timeSlots={timeSlots} 
                      onBookAppointment={handleAppointmentBook}
                      isTimeSlotBooked={(timeSlotId) => isTimeSlotBooked(selectedTeacher.id, timeSlotId)}
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Select a Teacher</h2>
                    <p className="text-gray-600">
                      Please select a teacher from the list to view available time slots
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="bg-gray-100 border-t py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2025 School District Parent-Teacher Conference System</p>
        </div>
      </footer>

      {/* Email Modal */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        appointments={getMyAppointments()}
        parentName={parentName}
        parentEmail={parentEmail}
        studentName={studentName}
        onEmailSent={handleEmailSent}
      />

      {/* Email Setup Guide Modal */}
      <EmailSetupGuide
        isOpen={showEmailSetupGuide}
        onClose={() => setShowEmailSetupGuide(false)}
      />

      {/* Supabase Setup Guide Modal */}
      <SupabaseSetupGuide
        isOpen={showSupabaseSetupGuide}
        onClose={() => setShowSupabaseSetupGuide(false)}
      />
    </div>
  );
}

export default App;