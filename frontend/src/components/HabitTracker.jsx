import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Plus, Check, Zap, Target } from 'lucide-react';

const HabitTracker = ({ habits, onAddHabit, onLogHabit }) => {
  const [newHabitName, setNewHabitName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    onAddHabit({ name: newHabitName });
    setNewHabitName('');
  };

  return (
    <div className="glass p-8 h-full flex flex-col gap-8 group/card">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
          <Target className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-black italic tracking-tight">HABITS</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="New daily habit..."
          className="w-full pl-5 pr-14 py-4 rounded-2xl"
        />
        <button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 p-2.5 rounded-xl text-white shadow-lg shadow-purple-500/20 hover:bg-purple-500 transition-all active:scale-90"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {habits.map((habit) => (
            <motion.div 
              key={habit.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between hover:bg-white/[0.06] hover:border-purple-500/20 transition-all duration-300 group/item"
            >
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-slate-100">{habit.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-orange-500/10 rounded-full border border-orange-500/20">
                    <Flame className={clsx(
                      "w-3.5 h-3.5 fill-current",
                      habit.current_streak > 0 ? "text-orange-500" : "text-slate-600"
                    )} />
                    <span className="text-[10px] font-black text-orange-400 uppercase tracking-tighter">
                      {habit.current_streak} Day Streak
                    </span>
                  </div>
                  {habit.current_streak >= 7 && (
                    <Zap className="w-3.5 h-3.5 text-yellow-400 fill-current animate-bounce" />
                  )}
                </div>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onLogHabit(habit.id)}
                className="w-12 h-12 rounded-2xl border-2 border-slate-800 hover:border-emerald-500 hover:bg-emerald-500/10 flex items-center justify-center transition-all bg-slate-900/50 group/check"
              >
                <Check className="w-6 h-6 text-slate-500 group-hover/check:text-emerald-400 transition-colors" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Utility to fix missing import in current scope
const clsx = (...classes) => classes.filter(Boolean).join(' ');

export default HabitTracker;
