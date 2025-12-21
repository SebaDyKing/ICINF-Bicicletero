// src/utils/colors.js

export const getGradientColor = (inicial) => {
  const charCode = inicial ? inicial.toString().charCodeAt(0) : 0;

  const gradients = [
    { from: "from-blue-600", to: "to-blue-400" },
    { from: "from-cyan-500", to: "to-blue-400" },
    { from: "from-sky-500", to: "to-indigo-400" },
    
    { from: "from-purple-600", to: "to-purple-400" },
    { from: "from-fuchsia-600", to: "to-pink-400" },
    { from: "from-violet-600", to: "to-fuchsia-400" },
    { from: "from-pink-500", to: "to-rose-400" },


    { from: "from-teal-500", to: "to-emerald-400" },
    { from: "from-emerald-500", to: "to-green-400" },
    { from: "from-green-600", to: "to-lime-400" },
    { from: "from-lime-500", to: "to-green-400" },


    { from: "from-orange-500", to: "to-amber-400" },
    { from: "from-amber-500", to: "to-yellow-400" },
    { from: "from-red-500", to: "to-orange-400" },
    { from: "from-rose-500", to: "to-red-400" },
    

    { from: "from-indigo-600", to: "to-blue-500" },
    { from: "from-slate-600", to: "to-slate-400" },
    { from: "from-stone-500", to: "to-neutral-400" },
  ];


  return gradients[charCode % gradients.length];
};