import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const BarchartCentral = ({ data }) => {
  const chartData = data || [];

  return (
<div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[320px]">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Afluencia por Hora (Hoy)</h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          
          <XAxis 
            dataKey="hora" 
            tickLine={false} 
            axisLine={false} 
            style={{ fontSize: '11px', fill: '#64748B' }} 
          />
          <YAxis 
            tickLine={false} 
            axisLine={false} 
            style={{ fontSize: '11px', fill: '#64748B' }} 
          />
          
          <Tooltip 
            cursor={{ fill: '#F8FAFC' }} 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
          />
          
   
          <Bar dataKey="ingresos" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};