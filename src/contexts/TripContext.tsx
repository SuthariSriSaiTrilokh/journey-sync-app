
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface Person {
  id: string;
  name: string;
  avatar?: string;
  location?: Location;
}

interface Expense {
  id: string;
  name: string;
  description: string;
  amount: number;
  date: string;
  paidBy: Person;
  splitWith: Person[];
}

interface Photo {
  id: string;
  url: string;
  caption?: string;
  location?: string;
  uploadedBy: Person;
  date: string;
}

interface Hotel {
  id: string;
  name: string;
  image: string;
  rating: number;
  price: string;
}

export interface Trip {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  createdBy: string;
  members: Person[];
  expenses: Expense[];
  photos: Photo[];
  hotels: Hotel[];
}

interface TripContextType {
  trips: Trip[];
  currentTrip: Trip | null;
  setCurrentTrip: (trip: Trip | null) => void;
  createTrip: (tripData: Omit<Trip, 'id' | 'members' | 'expenses' | 'photos' | 'hotels'>) => void;
  joinTrip: (tripId: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addPhoto: (photo: Omit<Photo, 'id'>) => void;
  updateLocation: (location: Location) => void;
  loadNearbyHotels: () => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);

  // Load trips from localStorage on initial load
  useEffect(() => {
    const storedTrips = localStorage.getItem('tripmates-trips');
    if (storedTrips) {
      try {
        setTrips(JSON.parse(storedTrips));
      } catch (error) {
        console.error('Failed to parse stored trips:', error);
      }
    } else {
      // Set demo trips if none exist
      const demoTrips = generateDemoTrips();
      setTrips(demoTrips);
      localStorage.setItem('tripmates-trips', JSON.stringify(demoTrips));
    }
  }, []);

  // Save trips to localStorage whenever they change
  useEffect(() => {
    if (trips.length > 0) {
      localStorage.setItem('tripmates-trips', JSON.stringify(trips));
    }
  }, [trips]);

  const generateDemoTrips = (): Trip[] => {
    if (!user) return [];
    
    const trip1: Trip = {
      id: '1',
      name: 'Beach Getaway',
      location: 'Malibu, CA',
      startDate: '2025-06-15',
      endDate: '2025-06-22',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
      createdBy: user.id,
      members: [
        { id: user.id, name: user.name, avatar: user.avatar },
        { 
          id: '2', 
          name: 'Alex Johnson', 
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
        },
      ],
      expenses: [
        {
          id: '1',
          name: 'Hotel Reservation',
          description: 'Beach resort for 3 nights',
          amount: 450,
          date: '2025-05-20',
          paidBy: { id: user.id, name: user.name, avatar: user.avatar },
          splitWith: [
            { id: user.id, name: user.name, avatar: user.avatar },
            { id: '2', name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
          ]
        }
      ],
      photos: [],
      hotels: []
    };

    return [trip1];
  };

  const createTrip = (tripData: Omit<Trip, 'id' | 'members' | 'expenses' | 'photos' | 'hotels'>) => {
    if (!user) return;

    const newTrip: Trip = {
      id: Math.random().toString(36).substring(2, 11),
      ...tripData,
      members: [{ id: user.id, name: user.name, avatar: user.avatar }],
      expenses: [],
      photos: [],
      hotels: []
    };

    setTrips([...trips, newTrip]);
    setCurrentTrip(newTrip);
  };

  const joinTrip = (tripId: string) => {
    if (!user) return;

    const tripIndex = trips.findIndex(trip => trip.id === tripId);
    if (tripIndex === -1) return;

    const updatedTrips = [...trips];
    const trip = updatedTrips[tripIndex];
    
    // Check if user is already a member
    if (!trip.members.some(member => member.id === user.id)) {
      trip.members.push({
        id: user.id,
        name: user.name,
        avatar: user.avatar
      });
    }

    updatedTrips[tripIndex] = trip;
    setTrips(updatedTrips);
    setCurrentTrip(trip);
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    if (!currentTrip || !user) return;

    const newExpense: Expense = {
      id: Math.random().toString(36).substring(2, 11),
      ...expenseData,
    };

    const updatedTrip = {
      ...currentTrip,
      expenses: [...currentTrip.expenses, newExpense]
    };

    const updatedTrips = trips.map(trip => 
      trip.id === currentTrip.id ? updatedTrip : trip
    );

    setTrips(updatedTrips);
    setCurrentTrip(updatedTrip);
  };

  const addPhoto = (photoData: Omit<Photo, 'id'>) => {
    if (!currentTrip || !user) return;

    const newPhoto: Photo = {
      id: Math.random().toString(36).substring(2, 11),
      ...photoData,
    };

    const updatedTrip = {
      ...currentTrip,
      photos: [...currentTrip.photos, newPhoto]
    };

    const updatedTrips = trips.map(trip => 
      trip.id === currentTrip.id ? updatedTrip : trip
    );

    setTrips(updatedTrips);
    setCurrentTrip(updatedTrip);
  };

  const updateLocation = (location: Location) => {
    if (!currentTrip || !user) return;

    const updatedMembers = currentTrip.members.map(member => {
      if (member.id === user.id) {
        return { ...member, location };
      }
      return member;
    });

    const updatedTrip = {
      ...currentTrip,
      members: updatedMembers
    };

    const updatedTrips = trips.map(trip => 
      trip.id === currentTrip.id ? updatedTrip : trip
    );

    setTrips(updatedTrips);
    setCurrentTrip(updatedTrip);
  };

  const loadNearbyHotels = () => {
    if (!currentTrip) return;

    // Mock hotel data
    const mockHotels: Hotel[] = [
      {
        id: '1',
        name: 'Ocean View Resort',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        price: '$250/night'
      },
      {
        id: '2',
        name: 'City Center Hotel',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        rating: 4.5,
        price: '$180/night'
      },
      {
        id: '3',
        name: 'Mountain Lodge',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        rating: 4.2,
        price: '$150/night'
      },
      {
        id: '4',
        name: 'Lakeside Inn',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        price: '$220/night'
      },
    ];

    const updatedTrip = {
      ...currentTrip,
      hotels: mockHotels
    };

    const updatedTrips = trips.map(trip => 
      trip.id === currentTrip.id ? updatedTrip : trip
    );

    setTrips(updatedTrips);
    setCurrentTrip(updatedTrip);
  };

  return (
    <TripContext.Provider value={{
      trips,
      currentTrip,
      setCurrentTrip,
      createTrip,
      joinTrip,
      addExpense,
      addPhoto,
      updateLocation,
      loadNearbyHotels
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
