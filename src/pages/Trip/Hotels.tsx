
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useTrip } from '../../contexts/TripContext';
import { Star, MapPin, ArrowUpRight } from 'lucide-react';

const Hotels: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { trips, currentTrip, loadNearbyHotels } = useTrip();
  
  // Find the trip with the given ID
  const trip = tripId ? trips.find((t) => t.id === tripId) : currentTrip;

  useEffect(() => {
    if (trip && trip.hotels.length === 0) {
      loadNearbyHotels();
    }
  }, [trip, loadNearbyHotels]);

  if (!trip) {
    return <div>Trip not found</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">{trip.name} - Nearby Hotels</h2>
            <p className="text-gray-600 mt-2">
              Find accommodations near {trip.location}
            </p>
          </div>
          
          <div className="p-6">
            {trip.hotels.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tripmates-blue"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trip.hotels.map((hotel) => (
                  <div 
                    key={hotel.id} 
                    className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={hotel.image} 
                        alt={hotel.name} 
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{hotel.name}</h3>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          <Star size={16} className="text-yellow-400" />
                          <span className="ml-1 text-gray-700">{hotel.rating.toFixed(1)}</span>
                        </div>
                        <span className="mx-2 text-gray-300">|</span>
                        <div className="text-gray-600 text-sm">{hotel.price}</div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin size={14} className="mr-1" />
                          <span>Near {trip.location}</span>
                        </div>
                        <a 
                          href="#"
                          className="text-tripmates-blue hover:text-tripmates-darkBlue flex items-center text-sm font-medium"
                          onClick={(e) => {
                            e.preventDefault();
                            alert('This would open booking page in a real app.');
                          }}
                        >
                          View Details
                          <ArrowUpRight size={14} className="ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Hotels;
