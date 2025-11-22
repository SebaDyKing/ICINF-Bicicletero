import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,AreaChart,Area} from 'recharts';

export const WeeklyChart = ({ data }) => {
  const chartData = data || [];

  return (
<div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[320px]">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Tendencia Semanal</h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          
          <XAxis 
            dataKey="dia" 
            tickLine={false} 
            axisLine={false} 
            style={{ fontSize: '11px', fill: '#64748B' }} 
          />
          <YAxis 
             tickLine={false} 
             axisLine={false} 
             style={{ fontSize: '11px', fill: '#64748B' }} 
          />
          
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}/>
          
          {/* Área Violeta suave */}
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="#6366F1" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorTotal)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};