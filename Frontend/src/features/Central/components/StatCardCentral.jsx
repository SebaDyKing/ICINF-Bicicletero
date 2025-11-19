import React from 'react';

export const StatCardCentral = ({ title, value, subtext, icon, trendColor = "text-gray-500" }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-full transition-all hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${trendColor} bg-opacity-10`}>
        {icon}
      </div>
    </div>
    <p className="text-xs text-gray-400 mt-auto">
      {subtext}
    </p>
  </div>
);
