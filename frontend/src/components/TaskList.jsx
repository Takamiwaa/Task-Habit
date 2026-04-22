import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, ListTodo, Circle } from 'lucide-react';
import { clsx } from 'clsx';

const TaskList = ({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
  const [filter, setFilter] = useState('Daily');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const filteredTasks = tasks.filter(t => t.frequency === filter);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({ title: newTaskTitle, frequency: filter });
    setNewTaskTitle('');
  };

  return (
    <div className="glass p-8 h-full flex flex-col gap-8 relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <ListTodo className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black italic tracking-tight">TASKS</h2>
        </div>
        
        <div className="flex gap-1 p-1.5 bg-white/5 rounded-2xl backdrop-blur-md border border-white/5">
          {['Daily', 'Weekly', 'Monthly'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300",
                filter === f 
                  ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]" 
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder={`What's on your ${filter.toLowerCase()} list?`}
          className="w-full pl-5 pr-14 py-4 rounded-2xl"
        />
        <button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg hover:bg-indigo-500 transition-all active:scale-90"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-slate-500"
            >
              <Circle className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="italic font-medium">All clear for {filter.toLowerCase()}!</p>
            </motion.div>
          ) : (
            filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ x: 5 }}
                className={clsx(
                  "flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 group/item",
                  task.is_completed 
                    ? "bg-white/[0.02] border-white/5 opacity-60" 
                    : "bg-white/[0.05] border-white/10 hover:border-indigo-500/30 hover:bg-white/[0.08]"
                )}
              >
                <div className="flex items-center gap-4">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => onToggleTask(task.id, !task.is_completed)}
                    className={clsx(
                      "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all",
                      task.is_completed 
                        ? "bg-emerald-500 border-emerald-500" 
                        : "border-slate-700 hover:border-indigo-400"
                    )}
                  >
                    {task.is_completed && <CheckCircle2 className="w-5 h-5 text-white" />}
                  </motion.button>
                  <span className={clsx(
                    "text-lg font-medium transition-all duration-500",
                    task.is_completed ? "text-slate-500 line-through decoration-slate-600" : "text-white"
                  )}>
                    {task.title}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDeleteTask(task.id)}
                  className="p-2 text-slate-600 hover:text-rose-500 opacity-0 group-hover/item:opacity-100 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskList;
