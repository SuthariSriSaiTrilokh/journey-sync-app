
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, MapPin, Users } from 'lucide-react';
import { Trip } from '../contexts/TripContext';

interface TripCardProps {
  trip: Trip;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/trip/${trip.id}`);
  };

  return (
    <div 
      className="trip-card card-hover cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-40">
        <img 
          src={trip.coverImage} 
          alt={trip.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h3 className="text-xl font-semibold">{trip.name}</h3>
          <div className="flex items-center mt-1">
            <MapPin size={14} className="mr-1" />
            <span className="text-sm">{trip.location}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <CalendarIcon size={14} className="mr-1" />
          <span>
            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users size={14} className="mr-1 text-gray-600" />
            <span className="text-sm text-gray-600">{trip.members.length} travelers</span>
          </div>
          
          <div className="flex -space-x-2">
            {trip.members.slice(0, 3).map((member) => (
              <div key={member.id} className="friend-avatar ring-2 ring-white">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            ))}
            {trip.members.length > 3 && (
              <div className="friend-avatar bg-gray-200 ring-2 ring-white flex items-center justify-center text-xs font-medium">
                +{trip.members.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
