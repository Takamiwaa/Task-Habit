import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Calendar } from 'lucide-react';
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
    <div className="glass p-6 h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <div className="flex gap-2 p-1 bg-slate-900 rounded-lg">
          {['Daily', 'Weekly', 'Monthly'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "px-3 py-1 text-xs rounded-md transition-all",
                filter === f ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder={`Add a new ${filter.toLowerCase()} task...`}
          className="flex-1"
        />
        <button type="submit" className="btn-primary p-2">
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 text-slate-500 italic">
            No {filter.toLowerCase()} tasks yet.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-indigo-500/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleTask(task.id, !task.is_completed)}
                  className={clsx(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    task.is_completed 
                      ? "bg-indigo-600 border-indigo-600" 
                      : "border-slate-600 group-hover:border-indigo-400"
                  )}
                >
                  {task.is_completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                </button>
                <span className={clsx(
                  "transition-all",
                  task.is_completed ? "text-slate-500 line-through" : "text-slate-200"
                )}>
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
