import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, FileText, BarChart3, ListTodo, CalendarDays } from 'lucide-react';
import Navbar from './components/Navbar';
import TaskList from './components/TaskList';
import HabitTracker from './components/HabitTracker';
import ProgressBar from './components/ProgressBar';

const API_BASE = 'http://localhost:5000';
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState([
    { name: 'Mon', completed: 3 },
    { name: 'Tue', completed: 5 },
    { name: 'Wed', completed: 2 },
    { name: 'Thu', completed: 4 },
    { name: 'Fri', completed: 6 },
    { name: 'Sat', completed: 8 },
    { name: 'Sun', completed: 4 },
  ]);

  useEffect(() => {
    fetchUser();
    fetchTasks();
    fetchHabits();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/user`);
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/tasks`);
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchHabits = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/habits`);
      setHabits(res.data);
    } catch (err) { console.error(err); }
  };

  const handleLogin = () => {
    window.location.href = `${API_BASE}/login`;
  };

  const handleLogout = async () => {
    await axios.get(`${API_BASE}/logout`);
    setUser(null);
  };

  const addTask = async (taskData) => {
    const res = await axios.post(`${API_BASE}/api/tasks`, taskData);
    setTasks([...tasks, res.data]);
  };

  const toggleTask = async (id, isCompleted) => {
    await axios.put(`${API_BASE}/api/tasks/${id}`, { is_completed: isCompleted });
    setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: isCompleted } : t));
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_BASE}/api/tasks/${id}`);
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addHabit = async (habitData) => {
    const res = await axios.post(`${API_BASE}/api/habits`, habitData);
    setHabits([...habits, res.data]);
  };

  const handleDownload = (type) => {
    window.open(`${API_BASE}/api/export/${type}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />

      <main className="flex-1 pt-24 pb-12 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stats & Habits */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="h-64">
            <ProgressBar data={stats} />
          </div>
          <div className="flex-1">
            <HabitTracker habits={habits} onAddHabit={addHabit} onLogHabit={() => {}} />
          </div>
          
          <div className="glass p-6 flex flex-col gap-4">
            <h3 className="font-semibold text-sm text-slate-400 uppercase tracking-wider">Reports</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleDownload('csv')}
                className="btn-secondary text-sm"
              >
                <Download className="w-4 h-4" /> CSV
              </button>
              <button 
                onClick={() => handleDownload('pdf')}
                className="btn-secondary text-sm"
              >
                <FileText className="w-4 h-4" /> PDF
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Tasks */}
        <div className="lg:col-span-8">
          <TaskList 
            tasks={tasks} 
            onAddTask={addTask} 
            onToggleTask={toggleTask} 
            onDeleteTask={deleteTask} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;
