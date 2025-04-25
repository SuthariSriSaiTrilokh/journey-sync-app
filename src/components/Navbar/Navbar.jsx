
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Bell, LogOut } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-tripmates-blue">
              TripMates
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />
            </button>
            
            <div className="relative">
              <button className="flex items-center space-x-3">
                <div className="user-avatar">
                  <User size={20} className="text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">John Doe</span>
              </button>
            </div>
            
            <button className="p-2 rounded-full hover:bg-gray-100">
              <LogOut size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
