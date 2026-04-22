import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const ProgressBar = ({ data }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass p-8 h-full flex flex-col gap-6 relative overflow-hidden group"
    >
      <div className="absolute top-[-20%] left-[-20%] w-[150px] h-[150px] bg-indigo-500/10 rounded-full blur-[80px]" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black italic tracking-wide">PERFORMANCE</h2>
        </div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
          Weekly Activity
        </span>
      </div>

      <div className="flex-1 min-h-[220px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                <stop offset="100%" stopColor="#818cf8" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
              dy={15}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.8)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '16px', 
                color: '#f8fafc',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
              }}
            />
            <Bar 
              dataKey="completed" 
              radius={[6, 6, 0, 0]}
              animationDuration={1500}
              animationBegin={500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === data.length - 1 ? 'url(#barGradient)' : 'rgba(99, 102, 241, 0.2)'} 
                  stroke={index === data.length - 1 ? '#818cf8' : 'transparent'}
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ProgressBar;
