import React, { useState } from 'react';
import { Flame, Plus, Check } from 'lucide-react';

const HabitTracker = ({ habits, onAddHabit, onLogHabit }) => {
  const [newHabitName, setNewHabitName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    onAddHabit({ name: newHabitName });
    setNewHabitName('');
  };

  return (
    <div className="glass p-6 h-full flex flex-col gap-6">
      <h2 className="text-xl font-semibold">Habits</h2>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="New habit (e.g. Meditate)..."
          className="flex-1"
        />
        <button type="submit" className="btn-primary p-2">
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-4">
        {habits.map((habit) => (
          <div 
            key={habit.id}
            className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium text-slate-200">{habit.name}</h3>
              <div className="flex items-center gap-1 mt-1 text-orange-400">
                <Flame className="w-4 h-4 fill-current" />
                <span className="text-xs font-bold">{habit.current_streak} Day Streak</span>
              </div>
            </div>
            
            <button 
              onClick={() => onLogHabit(habit.id)}
              className="w-10 h-10 rounded-full border-2 border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/10 flex items-center justify-center transition-all group"
            >
              <Check className="w-5 h-5 text-slate-500 group-hover:text-emerald-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitTracker;
