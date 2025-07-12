import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import logo from '/Express.png';

function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src={logo} alt="ExpressFix Logo" className="w-16 h-16 mr-4 rounded" />
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back!</h1>
            <p className="text-purple-100">Let's enhance your designs with AI-powered tools</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-200 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tools..."
              className="bg-purple-500/30 border border-purple-400/30 rounded-lg pl-10 pr-4 py-2 text-sm placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent w-64"
            />
          </div>
          
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-purple-500/30 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;