
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">TripMates</h1>
        <p className="text-xl text-gray-600">Loading your adventure...</p>
      </div>
    </div>
  );
};

export default Index;
