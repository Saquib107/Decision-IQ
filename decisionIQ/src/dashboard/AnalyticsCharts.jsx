import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

export function SuccessTrendChart({ decisions, darkMode }) {
  // Sort and process data
  const data = decisions
    .filter(d => d.outcome)
    .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))
    .reduce((acc, curr, idx) => {
      const date = curr.date ? new Date(curr.date).toLocaleDateString() : 'Unknown';
      const successCount = acc.length > 0 ? acc[acc.length-1].totalSuccess : 0;
      const totalCount = idx + 1;
      const newSuccess = curr.outcome.success ? successCount + 1 : successCount;
      acc.push({
        name: date,
        rate: Math.round((newSuccess / totalCount) * 100),
        totalSuccess: newSuccess
      });
      return acc;
    }, []);

  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#374151' : '#f3f4f6'} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 10, fill: darkMode ? '#9ca3af' : '#6b7280'}} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 10, fill: darkMode ? '#9ca3af' : '#6b7280'}} 
            unit="%"
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: darkMode ? '#1f2937' : '#fff' }}
          />
          <Area type="monotone" dataKey="rate" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPieChart({ decisions, darkMode }) {
  const counts = decisions.reduce((acc, d) => {
    const cat = d.category || 'Personal';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(counts).map(key => ({ name: key, value: counts[key] }));

  const COLORS = ['#f97316', '#fbbf24', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: darkMode ? '#1f2937' : '#fff' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
