// src/utils/formatters.js

export const getColors = (name) => {
  const colors = [
    { from: "from-blue-600", to: "to-blue-400" },
    { from: "from-purple-600", to: "to-purple-400" },
    { from: "from-fuchsia-600", to: "to-pink-400" },
    { from: "from-teal-500", to: "to-emerald-400" },
    { from: "from-indigo-600", to: "to-indigo-400" },
    { from: "from-orange-500", to: "to-amber-400" }
  ];
  
  if (!name) return colors[0];
  
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export const getInitial = (name) =>
  name ? name.charAt(0).toUpperCase() : "?";

export const cleanBikeId = (str) =>
  str ? str.replace("Bici #", "") : "?";

export const formatTime = (dateStr) => {
  if (!dateStr) return "--:--";
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? dateStr
    : d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
};