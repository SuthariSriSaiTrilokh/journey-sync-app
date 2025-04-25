
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useTrip } from '../../contexts/TripContext';
import { useToast } from '../../hooks/use-toast';
import { MapPin, Users } from 'lucide-react';

const Locations: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { trips, currentTrip, updateLocation } = useTrip();
  const { toast } = useToast();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Find the trip with the given ID
  const trip = tripId ? trips.find((t) => t.id === tripId) : currentTrip;

  useEffect(() => {
    if (!trip) return;
    
    // In a real app, this would use a mapping service API
    // For demo purposes, we'll simulate location tracking
    const trackLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            updateLocation({
              latitude,
              longitude,
              timestamp: Date.now()
            });
            
            toast({
              title: 'Location updated',
              description: 'Your location has been shared with your trip members.',
            });
          },
          (error) => {
            toast({
              title: 'Error',
              description: 'Unable to access your location. Please check your permissions.',
              variant: 'destructive',
            });
          }
        );
      } else {
        toast({
          title: 'Error',
          description: 'Geolocation is not supported by your browser.',
          variant: 'destructive',
        });
      }
    };

    // Track location on component mount
    trackLocation();

    // Set up interval for periodic location updates
    const intervalId = setInterval(trackLocation, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, [trip, updateLocation, toast]);

  if (!trip) {
    return <div>Trip not found</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">{trip.name} - Locations</h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6 bg-tripmates-lightGray p-4 rounded-lg">
              <div className="flex items-center">
                <MapPin size={20} className="text-tripmates-blue mr-2" />
                <h3 className="font-semibold">Location Sharing</h3>
              </div>
              <p className="mt-2 text-gray-600">
                Your location is being shared with your trip members. You can see their locations on the map.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
              <div ref={mapContainerRef} className="h-72 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Map loading... (In a real app, this would be an interactive map)</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <h3 className="text-lg font-semibold col-span-full mb-2">Trip Members</h3>
              
              {trip.members.map((member) => (
                <div key={member.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="friend-avatar">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    {member.location ? (
                      <p className="text-sm text-gray-600">
                        Last updated: {new Date(member.location.timestamp).toLocaleTimeString()}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">Location not shared</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Locations;
