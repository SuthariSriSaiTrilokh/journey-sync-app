
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated && (
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-tripmates-blue">TripMates</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-tripmates-darkGray hover:text-tripmates-blue p-2 rounded-full hover:bg-gray-100">
                <Home size={20} />
              </Link>
              
              <div className="relative">
                <button className="flex items-center space-x-2">
                  <div className="friend-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full" />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                </button>
              </div>
              
              <button 
                onClick={handleLogout} 
                className="text-tripmates-darkGray hover:text-tripmates-blue p-2 rounded-full hover:bg-gray-100"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>
      )}
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-white py-6 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} TripMates. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
