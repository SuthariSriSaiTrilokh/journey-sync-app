
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Camera, DollarSign, Hotel, Users } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white py-4 border-b border-gray-200">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-tripmates-blue">TripMates</div>
          <div>
            <button 
              onClick={() => navigate('/login')} 
              className="px-4 py-2 mr-2 text-tripmates-blue hover:text-tripmates-darkBlue"
            >
              Log In
            </button>
            <button 
              onClick={() => navigate('/register')} 
              className="btn-primary"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <section className="py-20 bg-gradient-travel text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">All Your Group Trip Planning in One Place</h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
            Connect with friends, share expenses, track locations, and create unforgettable memories together.
          </p>
          <button 
            onClick={() => navigate('/register')} 
            className="bg-white text-tripmates-blue hover:bg-gray-100 font-semibold py-3 px-8 rounded-md text-lg transition-colors"
          >
            Get Started Free
          </button>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need for Group Travel</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-tripmates-lightGray p-6 rounded-lg text-center">
              <div className="w-14 h-14 bg-tripmates-blue rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Location Sharing</h3>
              <p className="text-gray-600">Keep track of your group in real-time so no one gets lost</p>
            </div>
            
            <div className="bg-tripmates-lightGray p-6 rounded-lg text-center">
              <div className="w-14 h-14 bg-tripmates-blue rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Camera size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Photo Gallery</h3>
              <p className="text-gray-600">Share and store your memories in one collaborative album</p>
            </div>
            
            <div className="bg-tripmates-lightGray p-6 rounded-lg text-center">
              <div className="w-14 h-14 bg-tripmates-blue rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <DollarSign size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expense Sharing</h3>
              <p className="text-gray-600">Split costs fairly and keep track of who owes what</p>
            </div>
            
            <div className="bg-tripmates-lightGray p-6 rounded-lg text-center">
              <div className="w-14 h-14 bg-tripmates-blue rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <Hotel size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nearby Hotels</h3>
              <p className="text-gray-600">Find accommodation options near your current location</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-tripmates-lightGray">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Plan Your Next Adventure?</h2>
            <p className="text-xl mb-8">Join TripMates today and make your group travel experience seamless and enjoyable.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigate('/register')} 
                className="btn-primary text-lg py-3 px-8"
              >
                Sign Up Now
              </button>
              <button 
                onClick={() => navigate('/login')} 
                className="btn-outline text-lg py-3 px-8"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
