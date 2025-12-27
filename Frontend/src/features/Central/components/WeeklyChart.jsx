import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { AnimatedLightDot } from './AnimatedLightDot';

export const WeeklyChart = ({ data }) => {
  const chartData = data || [];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (chartData.length === 0) return;

    const animateDot = () => {
      setProgress((prev) => {
        const next = prev + 0.005;
        return next >= 1 ? 0 : next;
      });
    };

    const interval = setInterval(animateDot, 16);
    return () => clearInterval(interval);
  }, [chartData.length]);

  const CustomActiveDot = (props) => {
    return <AnimatedLightDot {...props} progress={progress} />;
  };

  return (
    <div className="relative bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group h-[400px]">
      <div className="relative bg-blue-600 px-6 py-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />

        <div className="relative flex justify-between items-center text-white">
          <h3 className="font-bold text-lg tracking-tight">Tendencia Semanal</h3>
          <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl shadow-lg bounce-slow">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="p-6 h-[calc(100%-76px)]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>

              {/* Filtro de brillo para efecto de luz */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#bfdbfe" />

            <XAxis
              dataKey="dia"
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
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                backgroundColor: 'white',
                padding: '12px'
              }}
              labelStyle={{ fontWeight: 'bold', color: '#2563eb' }}
            />

            <Area
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorWeekly)"
              animationDuration={1000}
              dot={<CustomActiveDot />}
              activeDot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};