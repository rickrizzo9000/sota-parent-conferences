import React, { useState, useEffect } from 'react';
import { Clock, Check } from 'lucide-react';
import { TimeSlot } from '../types';

interface TimeSlotGridProps {
  timeSlots: TimeSlot[];
  onBookAppointment: (timeSlot: TimeSlot) => void;
  isTimeSlotBooked: (timeSlotId: string) => Promise<boolean> | boolean;
}

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ 
  timeSlots, 
  onBookAppointment, 
  isTimeSlotBooked 
}) => {
  const [bookedSlots, setBookedSlots] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [processingSlot, setProcessingSlot] = useState<string | null>(null);
  
  // Check which slots are booked when the component mounts or when dependencies change
  useEffect(() => {
    const checkBookedSlots = async () => {
      setIsLoading(true);
      const bookedSlotsMap: Record<string, boolean> = {};
      
      // Check each time slot
      for (const slot of timeSlots) {
        const isBooked = await isTimeSlotBooked(slot.id);
        bookedSlotsMap[slot.id] = isBooked;
      }
      
      setBookedSlots(bookedSlotsMap);
      setIsLoading(false);
    };
    
    checkBookedSlots();
  }, [timeSlots, isTimeSlotBooked]);

  const handleBookAppointment = async (timeSlot: TimeSlot) => {
    // Prevent double-booking by setting this slot as processing
    setProcessingSlot(timeSlot.id);
    
    // Double-check that the slot is still available before proceeding
    const isBooked = await isTimeSlotBooked(timeSlot.id);
    
    if (isBooked) {
      // Update the UI to show this slot is now booked
      setBookedSlots(prev => ({
        ...prev,
        [timeSlot.id]: true
      }));
      alert("Sorry, this time slot was just booked by someone else.");
    } else {
      // Proceed with booking
      onBookAppointment(timeSlot);
      
      // Optimistically update UI
      setBookedSlots(prev => ({
        ...prev,
        [timeSlot.id]: true
      }));
    }
    
    setProcessingSlot(null);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading available time slots...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {timeSlots.map((slot) => {
          const isBooked = bookedSlots[slot.id] || false;
          const isProcessing = processingSlot === slot.id;
          
          return (
            <button
              key={slot.id}
              onClick={() => !isBooked && !isProcessing && handleBookAppointment(slot)}
              disabled={isBooked || isProcessing}
              className={`
                p-3 rounded-md border text-center transition-colors
                ${isProcessing 
                  ? 'bg-blue-100 border-blue-300 text-blue-500 cursor-wait' 
                  : isBooked 
                    ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700'}
              `}
            >
              <div className="flex items-center justify-center mb-1">
                <Clock className={`h-4 w-4 mr-1 ${isBooked ? 'text-gray-400' : 'text-blue-500'}`} />
                <span className="text-sm font-medium">{slot.formatted}</span>
              </div>
              <div className="text-xs">
                {isProcessing ? (
                  <span className="flex items-center justify-center text-blue-500">
                    <div className="animate-spin h-3 w-3 mr-1 border-b-2 border-current rounded-full"></div>
                    Processing...
                  </span>
                ) : isBooked ? (
                  <span className="flex items-center justify-center text-gray-500">
                    <Check className="h-3 w-3 mr-1" />
                    Booked
                  </span>
                ) : (
                  <span className="text-blue-600">Available</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotGrid;