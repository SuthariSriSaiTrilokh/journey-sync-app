
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users } from 'lucide-react';

const TripCard = ({ trip }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="trip-card card-hover cursor-pointer"
      onClick={() => navigate(`/trip/${trip.id}`)}
    >
      <div className="relative h-48">
        <img 
          src={trip.coverImage} 
          alt={trip.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{trip.name}</h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin size={16} className="mr-2" />
            <span>{trip.location}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar size={16} className="mr-2" />
            <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users size={16} className="mr-2" />
              <span>{trip.members.length} members</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
