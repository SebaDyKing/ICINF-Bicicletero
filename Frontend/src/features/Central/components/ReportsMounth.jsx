import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const reportsData = [
  { name: 'Jun', reportes: 2 },
  { name: 'Jul', reportes: 4 },
  { name: 'Ago', reportes: 3 },
  { name: 'Sep', reportes: 5 },
  { name: 'Oct', reportes: 7 },

];

//TO DO : Obtener datos reales desde el backend y mapearlos al formato esperado por Recharts.
export const ReportsMounth = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Reportes por Mes</h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={reportsData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
        
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          

          <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: '12px' }} />
          
  
          <YAxis domain={[0, 8]} tickCount={5} tickLine={false} axisLine={false} style={{ fontSize: '12px' }} />
          
          <Tooltip 
             cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} 
             formatter={(value) => [`${value} reportes`, '']}
          />
          
     
          <Bar dataKey="reportes" fill="#1f4f8f" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
