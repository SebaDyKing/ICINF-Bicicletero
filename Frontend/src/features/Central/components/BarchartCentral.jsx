import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const data = [
 { name: 'FACE', ocupacion: 60 },
 { name: 'Idiomas', ocupacion: 90 },
 { name: 'Biblioteca', ocupacion: 80 },
 { name: 'Ciencias', ocupacion: 65 },
]
export const BarchartCentral = () => {

    return (
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Ocupación por Bicicletero</h3>
      
     
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          
         
          <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: '12px' }} />
          

          <YAxis domain={[0, 100]} tickLine={false} axisLine={false} style={{ fontSize: '12px' }} />
          
     
          <Tooltip 
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} 
            labelFormatter={(name) => name}
            formatter={(value) => [`${value}% de ocupación`, '']}
          />
          
          <Bar dataKey="ocupacion" fill="#1f4f8f" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
    )
    
}