import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Sparkles, Activity } from 'lucide-react';
import Navbar from './components/Navbar';
import TaskList from './components/TaskList';
import HabitTracker from './components/HabitTracker';
import ProgressBar from './components/ProgressBar';

const API_BASE = 'http://localhost:5000';
axios.defaults.withCredentials = true;

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }
  }
};

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
    <div className="min-h-screen relative">
      <div className="bg-mesh" />
      
      {/* Background Blobs */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />

      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />

      <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative pt-28 pb-12 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left Column */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <motion.div variants={containerVariants} className="h-64">
            <ProgressBar data={stats} />
          </motion.div>
          
          <motion.div variants={containerVariants} className="flex-1">
            <HabitTracker habits={habits} onAddHabit={addHabit} onLogHabit={() => {}} />
          </motion.div>
          
          <motion.div variants={containerVariants} className="glass p-8 flex flex-col gap-6 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Download className="w-20 h-20" />
            </div>
            
            <div className="flex items-center gap-2">
              <Sparkles className="text-indigo-400 w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-slate-400">Reports</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleDownload('csv')}
                className="btn-secondary group-hover:border-indigo-500/30"
              >
                <Download className="w-4 h-4" /> CSV
              </button>
              <button 
                onClick={() => handleDownload('pdf')}
                className="btn-secondary group-hover:border-purple-500/30"
              >
                <FileText className="w-4 h-4" /> PDF
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <motion.div variants={containerVariants} className="lg:col-span-8">
          <TaskList 
            tasks={tasks} 
            onAddTask={addTask} 
            onToggleTask={toggleTask} 
            onDeleteTask={deleteTask} 
          />
        </motion.div>
      </motion.main>
    </div>
  );
}

export default App;
