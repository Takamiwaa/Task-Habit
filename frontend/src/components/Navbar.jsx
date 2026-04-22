import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, LogOut, CheckCircle, Flame } from 'lucide-react';

const Navbar = ({ user, onLogin, onLogout }) => {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl h-16 glass z-50 flex items-center justify-between px-8 border-indigo-500/10 shadow-[0_0_50px_-12px_rgba(79,70,229,0.2)]"
    >
      <div className="flex items-center gap-3">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.1 }}
          className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20"
        >
          <CheckCircle className="text-white w-5 h-5" />
        </motion.div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            HABITPULSE
          </span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">System Active</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 pr-4 border-r border-white/10"
            >
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-200">{user.name}</p>
                <p className="text-[9px] text-slate-500 font-medium">{user.email}</p>
              </div>
              <img src={user.picture} alt={user.name} className="w-9 h-9 rounded-xl border border-indigo-500/50 shadow-lg" />
            </motion.div>
            <button onClick={onLogout} className="btn-secondary py-2 px-4 text-xs">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogin} 
            className="btn-primary py-2 px-6 shadow-indigo-500/30"
          >
            <LogIn className="w-4 h-4" />
            Login with Google
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
