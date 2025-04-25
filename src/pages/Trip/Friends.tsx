
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useTrip } from '../../contexts/TripContext';
import { useToast } from '../../hooks/use-toast';
import { 
  Users, 
  Mail, 
  Copy, 
  UserPlus,
  X,
  Check
} from 'lucide-react';

const Friends: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { trips, currentTrip } = useTrip();
  const { toast } = useToast();
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  // Find the trip with the given ID
  const trip = tripId ? trips.find((t) => t.id === tripId) : currentTrip;

  if (!trip) {
    return <div>Trip not found</div>;
  }

  const handleCopyLink = () => {
    // In a real app, this would be a shareable link
    navigator.clipboard.writeText(`Join my trip on TripMates! Trip Code: ${trip.id}`);
    toast({
      title: 'Link copied!',
      description: 'Trip invite link copied to clipboard.',
    });
  };

  const handleSendInvite = () => {
    if (!inviteEmail) {
      toast({
        title: 'Error',
        description: 'Please enter an email address.',
        variant: 'destructive',
      });
      return;
    }

    // In a real app, this would send an email invitation
    toast({
      title: 'Invitation sent',
      description: `An invitation has been sent to ${inviteEmail}.`,
    });

    setInviteEmail('');
    setShowInviteModal(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold">{trip.name} - Friends</h2>
            <button 
              onClick={() => setShowInviteModal(true)}
              className="btn-primary flex items-center"
            >
              <UserPlus size={16} className="mr-2" />
              Invite Friends
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-6 bg-tripmates-lightGray p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Trip Code</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Share this code with friends so they can join your trip.
                </p>
              </div>
              <div className="flex items-center">
                <div className="bg-white px-4 py-2 rounded-md font-mono mr-3 border">
                  {trip.id}
                </div>
                <button 
                  onClick={handleCopyLink}
                  className="p-2 rounded-full hover:bg-gray-200"
                  aria-label="Copy trip code"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Trip Members ({trip.members.length})</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trip.members.map((member) => (
                <div 
                  key={member.id} 
                  className="border rounded-lg p-4 flex items-center"
                >
                  <div className="relative">
                    <div className="friend-avatar">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${member.location ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                  
                  <div className="ml-4">
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-gray-500">
                      {member.location ? 'Online now' : 'Offline'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Invite Friends</h2>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="mb-6">
                <p className="text-gray-600">
                  Invite your friends to join this trip. They'll be able to see all trip details, expenses, and photos.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="invite-email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-gray-400" />
                      </div>
                      <input
                        id="invite-email"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-tripmates-blue focus:border-tripmates-blue"
                        placeholder="friend@example.com"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center">
                    <div className="font-medium mr-2">Or share trip code:</div>
                    <div className="bg-gray-100 px-3 py-1 rounded-md font-mono mr-2">
                      {trip.id}
                    </div>
                    <button 
                      onClick={handleCopyLink}
                      className="p-1 rounded-full hover:bg-gray-200"
                      aria-label="Copy trip code"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendInvite}
                  className="btn-primary flex justify-center items-center"
                >
                  <Check size={16} className="mr-2" />
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Friends;
