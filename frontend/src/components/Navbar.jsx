import React from 'react';
import { LogIn, LogOut, CheckCircle, User } from 'lucide-react';

const Navbar = ({ user, onLogin, onLogout }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center justify-between px-6 mx-4 mt-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-indigo-600 rounded-lg">
          <CheckCircle className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          HabitPulse
        </span>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-indigo-500/50" />
              <span className="hidden md:block text-sm font-medium">{user.name}</span>
            </div>
            <button onClick={onLogout} className="btn-secondary">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <button onClick={onLogin} className="btn-primary">
            <LogIn className="w-4 h-4" />
            Login with Google
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
