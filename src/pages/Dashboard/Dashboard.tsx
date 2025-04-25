
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import TripCard from '../../components/TripCard';
import CreateTripModal from './CreateTripModal';
import JoinTripModal from './JoinTripModal';
import { useTrip } from '../../contexts/TripContext';
import { useAuth } from '../../contexts/AuthContext';
import { PlusCircle, UserPlus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { trips } = useTrip();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Layout>
      <div className="bg-gradient-travel py-10 px-4 sm:px-6 lg:px-8 text-white">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
          <p className="mt-2">Ready for your next adventure?</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h2 className="text-2xl font-bold mb-4 md:mb-0">My Trips</h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => setCreateModal(true)}
              className="btn-primary flex items-center justify-center"
            >
              <PlusCircle size={16} className="mr-2" />
              Create Trip
            </button>
            
            <button 
              onClick={() => setShowJoinModal(true)}
              className="btn-outline flex items-center justify-center"
            >
              <UserPlus size={16} className="mr-2" />
              Join Trip
            </button>
          </div>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-12 bg-tripmates-lightGray rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
            <p className="text-gray-600 mb-6">Start by creating a new trip or join an existing one</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center justify-center"
              >
                <PlusCircle size={16} className="mr-2" />
                Create Trip
              </button>
              
              <button 
                onClick={() => setShowJoinModal(true)}
                className="btn-outline flex items-center justify-center"
              >
                <UserPlus size={16} className="mr-2" />
                Join Trip
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateTripModal onClose={() => setShowCreateModal(false)} />
      )}
      
      {showJoinModal && (
        <JoinTripModal onClose={() => setShowJoinModal(false)} />
      )}
    </Layout>
  );
};

export default Dashboard;
