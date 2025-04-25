
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTrip } from '../../contexts/TripContext';
import Layout from '../../components/Layout';
import { useToast } from '../../hooks/use-toast';
import { Camera, MapPin, DollarSign, Hotel, Users, Share2 } from 'lucide-react';

const TripDetails: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { trips, setCurrentTrip } = useTrip();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('');
  
  // Find the trip with the given ID
  const trip = trips.find((t) => t.id === tripId);

  useEffect(() => {
    if (!trip) {
      navigate('/dashboard');
      return;
    }
    
    setCurrentTrip(trip);
  }, [trip, tripId, navigate, setCurrentTrip]);

  const handleShare = () => {
    // In a real app, this would generate an actual invite link or QR code
    navigator.clipboard.writeText(`Join my trip on TripMates! Trip Code: ${trip?.id}`);
    
    toast({
      title: 'Trip code copied!',
      description: 'Share this code with friends to invite them to your trip.',
    });
  };

  if (!trip) {
    return null; // will redirect in useEffect
  }

  return (
    <Layout>
      <div className="relative">
        <div className="h-64 sm:h-80 w-full">
          <img 
            src={trip.coverImage} 
            alt={trip.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="bg-white rounded-t-xl -mt-20 p-6 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{trip.name}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin size={16} className="mr-1" />
                  <span>{trip.location}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <span className="text-sm">
                    {new Date(trip.startDate).toLocaleDateString()} to {new Date(trip.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center mt-4 md:mt-0">
                <button 
                  onClick={handleShare}
                  className="btn-outline flex items-center justify-center"
                >
                  <Share2 size={16} className="mr-2" />
                  Invite Friends
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="flex flex-wrap border-b">
            <Link 
              to={`/trip/${trip.id}/photos`}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'photos' 
                  ? 'border-tripmates-blue text-tripmates-blue' 
                  : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('photos')}
            >
              <Camera size={16} className="mr-2" />
              Photos
            </Link>
            
            <Link 
              to={`/trip/${trip.id}/locations`}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'locations' 
                  ? 'border-tripmates-blue text-tripmates-blue' 
                  : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('locations')}
            >
              <MapPin size={16} className="mr-2" />
              Locations
            </Link>
            
            <Link 
              to={`/trip/${trip.id}/expenses`}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'expenses' 
                  ? 'border-tripmates-blue text-tripmates-blue' 
                  : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('expenses')}
            >
              <DollarSign size={16} className="mr-2" />
              Expenses
            </Link>
            
            <Link 
              to={`/trip/${trip.id}/hotels`}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'hotels' 
                  ? 'border-tripmates-blue text-tripmates-blue' 
                  : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('hotels')}
            >
              <Hotel size={16} className="mr-2" />
              Nearby Hotels
            </Link>
            
            <Link 
              to={`/trip/${trip.id}/friends`}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'friends' 
                  ? 'border-tripmates-blue text-tripmates-blue' 
                  : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('friends')}
            >
              <Users size={16} className="mr-2" />
              Friends
            </Link>
          </div>
          
          <div className="p-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Welcome to {trip.name}!</h3>
              <p className="text-gray-600 mb-6">Select a tab to manage your trip details</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-tripmates-lightGray p-6 rounded-lg text-center">
                  <div className="w-12 h-12 bg-tripmates-blue rounded-full flex items-center justify-center text-white mx-auto mb-3">
                    <Camera size={20} />
                  </div>
                  <h4 className="font-medium mb-2">Photos</h4>
                  <p className="text-sm text-gray-600">Share and view trip memories</p>
                </div>
                
                <div className="bg-tripmates-lightGray p-6 rounded-lg text-center">
                  <div className="w-12 h-12 bg-tripmates-blue rounded-full flex items-center justify-center text-white mx-auto mb-3">
                    <MapPin size={20} />
                  </div>
                  <h4 className="font-medium mb-2">Locations</h4>
                  <p className="text-sm text-gray-600">Track your group's location</p>
                </div>
                
                <div className="bg-tripmates-lightGray p-6 rounded-lg text-center">
                  <div className="w-12 h-12 bg-tripmates-blue rounded-full flex items-center justify-center text-white mx-auto mb-3">
                    <DollarSign size={20} />
                  </div>
                  <h4 className="font-medium mb-2">Expenses</h4>
                  <p className="text-sm text-gray-600">Manage shared costs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TripDetails;
