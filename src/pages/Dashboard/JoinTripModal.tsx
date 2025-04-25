
import React, { useState } from 'react';
import { useTrip } from '../../contexts/TripContext';
import { useToast } from '../../hooks/use-toast';
import { X, QrCode } from 'lucide-react';

interface JoinTripModalProps {
  onClose: () => void;
}

const JoinTripModal: React.FC<JoinTripModalProps> = ({ onClose }) => {
  const [tripCode, setTripCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  
  const { joinTrip, trips } = useTrip();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tripCode) {
      toast({
        title: 'Error',
        description: 'Please enter a trip code.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if the trip exists
      const tripExists = trips.some(trip => trip.id === tripCode);
      
      if (!tripExists) {
        toast({
          title: 'Error',
          description: 'Invalid trip code. Please check and try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      joinTrip(tripCode);
      
      toast({
        title: 'Success',
        description: 'You have successfully joined the trip!',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to join trip. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Join a Trip</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={20} />
          </button>
        </div>
        
        {showQrScanner ? (
          <div className="p-4">
            <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow mb-4">
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">QR Scanner Placeholder</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Position the QR code within the frame to scan
              </p>
              <button
                type="button"
                onClick={() => setShowQrScanner(false)}
                className="btn-outline"
              >
                Back to Manual Entry
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="tripCode" className="block text-sm font-medium text-gray-700">
                  Trip Code
                </label>
                <input
                  id="tripCode"
                  type="text"
                  value={tripCode}
                  onChange={(e) => setTripCode(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-tripmates-blue focus:border-tripmates-blue"
                  placeholder="Enter trip code"
                />
              </div>
              
              <button
                type="button"
                onClick={() => setShowQrScanner(true)}
                className="flex items-center justify-center w-full py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <QrCode size={16} className="mr-2" />
                Scan QR Code
              </button>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex justify-center"
              >
                {isLoading ? 'Joining...' : 'Join Trip'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default JoinTripModal;
