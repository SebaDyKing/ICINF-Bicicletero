import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock } from 'lucide-react';

export const BarchartCentral = ({ data }) => {
  const chartData = data || [];

  return (
    <div className="relative bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group h-[400px]">
      <div className="relative bg-orange-600 px-6 py-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />

        <div className="relative flex justify-between items-center text-white">
          <h3 className="font-bold text-lg tracking-tight">Afluencia por Hora (Hoy)</h3>
          <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl shadow-lg bounce-slow">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="p-6 h-[calc(100%-76px)]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#fb923c" stopOpacity={0.7} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fed7aa" />

            <XAxis
              dataKey="hora"
              tickLine={false}
              axisLine={false}
              style={{ fontSize: '12px', fill: '#64748B', fontWeight: '600' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              style={{ fontSize: '12px', fill: '#64748B', fontWeight: '600' }}
            />

            <Tooltip
              cursor={{ fill: '#fff7ed', opacity: 0.3 }}
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                backgroundColor: 'white',
                padding: '12px'
              }}
              labelStyle={{ fontWeight: 'bold', color: '#ea580c' }}
            />

            <Bar
              dataKey="ingresos"
              fill="url(#colorBar)"
              radius={[8, 8, 0, 0]}
              barSize={35}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};