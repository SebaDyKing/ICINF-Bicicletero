import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  LogOut, 
  X, 
  Eye, 
  EyeOff 
} from 'lucide-react';

const initialReports = [
  { 
    id: 1, 
    date: '2025-11-28 09:15', 
    student: 'Juan Pérez González', 
    rut: '12.345.678-9', 
    place: 'Bicicletero FACE', 
    desc: 'Bicicleta azul marca Trek, modelo Marlin 5...', 
    status: 'En investigación', 
    guardId: 1 
  },
  { 
    id: 2, 
    date: '2025-11-27 14:30', 
    student: 'María González Silva', 
    rut: '23.456.789-0', 
    place: 'Bicicletero Ingeniería', 
    desc: 'Cortaron el candado con cizalla, bicicleta...', 
    status: 'Pendiente', 
    guardId: null 
  },
  { 
    id: 3, 
    date: '2025-11-25 11:20', 
    student: 'Carlos Silva Rojas', 
    rut: '24.567.890-1', 
    place: 'Bicicletero Biblioteca', 
    desc: 'Robo de accesorios: luces LED delanteras...', 
    status: 'Resuelto', 
    guardId: 2 
  },
];

export default function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState('guards'); // 'guards' | 'reports'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedGuard, setSelectedGuard] = useState(null)
  
  // Estados de datos
  const [guards, setGuards] = useState([]);
  const [reports, setReports] = useState(initialReports);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contrasenia, setContrasenia] = useState("");

  //login
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email");
  const emailFromRegister = emailFromUrl || location.state?.email;

  useEffect(() => {
    // if (!emailFromRegister) {
    //   navigate("/login");
    // }
    const fetchGuards = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/central/getAllGuards");

        const formatted = res.data.data.resultQuery.map(g => ({
          name: `${g.nombre} ${g.apellido}`,
          rut: g.rut,
          email: g.email,
          phone: g.telefono
        }));

        setGuards(formatted);
      } catch (error) {
        console.error("Error backend:", error);
        alert("Error al cargar guardias");
      }
    };

    fetchGuards();
  }, []);

  useEffect(() => {
    if (selectedGuard) {
      setEmail(selectedGuard.email || "");
      setTelefono(selectedGuard.telefono || "");
      setContrasenia("");
    }
  }, [selectedGuard]);


  const handleCreate = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/central/createGuard", {
        rut,
        email,
        contrasenia,
        telefono,
        nombre,
        apellido
      });

      alert("Guardia creado");
      console.log(res.data.resultQuery);

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Error en la solicitud");
    }
  };

  const handleDelete = async (rut) => {
    console.log(rut)
    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar al guardia con RUT ${rut}?`
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        "http://localhost:3000/api/central/deleteGuard",
        {
          data: { rut }, // 👈 IMPORTANTE: el body del DELETE va en "data"
        }
      );

      alert(res.data.message);

      // actualizar UI — ejemplo filtrando
      setGuards(prev => prev.filter(g => g.rut !== rut));

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "No se pudo eliminar.");
    }
  };

  
  const handleUpdate = async (guard) => {
    const confirmUpdate = window.confirm(
      `Actualizar información del guardia con RUT: ${guard.rut}?`
    );
    if (!confirmUpdate) return;

    try {
      const res = await axios.put(
        "http://localhost:3000/api/central/updateGuard",
        {
          rut: guard.rut,
          email,
          contrasenia,
          telefono
        }
      );
      console.log(res)

      alert("Información del guardia actualizada correctamente");
      console.log(res.data);

    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Error en la solicitud");
    }
  };



  // --- Sub-Componentes Visuales ---

  const StatCard = ({ title, value, subtext, icon: Icon, colorClass, iconColor }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
      <div className="flex justify-between items-start">
        <span className="text-gray-500 font-medium text-sm">{title}</span>
        <div className={`p-2 rounded-full ${colorClass}`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-800">{value}</div>
        <div className="text-gray-400 text-xs mt-1">{subtext}</div>
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const styles = {
      'En investigación': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Pendiente': 'bg-red-100 text-red-700 border-red-200',
      'Resuelto': 'bg-green-100 text-green-700 border-green-200',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* --- Navbar Superior --- */}
      <nav className="bg-[#003366] text-white px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="bg-white text-[#003366] font-bold px-3 py-1 rounded text-lg">UBB</div>
          <div className="flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-gray-300">Bicicleteros</a>
            <a href="#" className="bg-[#1a4d80] px-3 py-1 rounded">Centro de Seguridad</a>
            <a href="#" className="hover:text-gray-300">Estadísticas</a>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <button className="flex items-center gap-2 hover:text-gray-300"><User size={16}/> Perfil</button>
          <button className="flex items-center gap-2 hover:text-gray-300"><LogOut size={16}/> Cerrar Sesión</button>
        </div>
      </nav>

      {/* --- Contenido Principal --- */}
      <main className="p-8 max-w-7xl mx-auto">
        
        {/* Header y Botón Nuevo Guardia */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Centro de Seguridad</h1>
            <p className="text-gray-500 mt-1">Gestión integral de guardias y reportes de robo</p>
          </div>
          {activeTab === 'guards' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <Plus size={18} /> Nuevo Guardia
            </button>
          )}
        </div>

        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Guardias Activos" value="2" subtext="Personal de seguridad" icon={Shield} colorClass="bg-blue-50" iconColor="text-blue-500" />
          <StatCard title="Reportes Pendientes" value="2" subtext="Requieren atención urgente" icon={AlertTriangle} colorClass="bg-red-50" iconColor="text-red-500" />
          <StatCard title="En Investigación" value="2" subtext="Casos activos" icon={Clock} colorClass="bg-yellow-50" iconColor="text-yellow-500" />
          <StatCard title="Tasa de Resolución" value="20%" subtext="1 casos resueltos" icon={TrendingUp} colorClass="bg-green-50" iconColor="text-green-500" />
        </div>

        {/* --- Pestañas de Navegación (Toggle) --- */}
        <div className="flex mb-6 bg-white rounded-full p-1 shadow-sm border border-gray-200 w-full max-w-4xl mx-auto">
          <button 
            onClick={() => setActiveTab('guards')}
            className={`flex-1 py-2 rounded-full font-medium text-sm flex justify-center items-center gap-2 transition-all ${activeTab === 'guards' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Shield size={16} /> Guardias ({guards.length})
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-2 rounded-full font-medium text-sm flex justify-center items-center gap-2 transition-all ${activeTab === 'reports' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <AlertTriangle size={16} /> Reportes ({reports.length})
          </button>
        </div>

        {/* --- VISTA: GUARDIAS --- */}
        {activeTab === 'guards' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Personal de Seguridad</h2>
            <p className="text-gray-500 text-sm mb-6">Gestión completa de guardias asignados a bicicleteros</p>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Buscar por nombre, apellido, email, RUT o teléfono..." 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 text-sm font-semibold">
                  <tr>
                    <th className="p-4 rounded-tl-lg">Nombre</th>
                    <th className="p-4">RUT</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Teléfono</th>
                    <th className="p-4 rounded-tr-lg text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {guards.map((guard) => (
                    <tr key={guard.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-800">{guard.name}</td>
                      <td className="p-4 text-gray-600">{guard.rut}</td>
                      <td className="p-4 text-gray-600">{guard.email}</td>
                      <td className="p-4 text-gray-600">{guard.phone}</td>
                      <td className="p-4 flex justify-end gap-2">
                        <button className="flex items-center gap-1 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-50 font-medium" onClick={() => {
                          setIsModalOpenEdit(true);
                          setSelectedGuard(guard)}}>
                          <Edit size={14}/> Editar
                        </button>

                        <button className="flex items-center gap-1 text-white bg-red-600 px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 font-medium" onClick={() => handleDelete(guard.rut)}>
                          <Trash2 size={14}/> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- VISTA: REPORTES --- */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Reportes de Robo</h2>
            <p className="text-gray-500 text-sm mb-6">Gestión y seguimiento de reportes de los estudiantes</p>

            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Buscar por estudiante, RUT, lugar o descripción..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Todos los estados</option>
                <option>Pendiente</option>
                <option>En investigación</option>
                <option>Resuelto</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-semibold">
                  <tr>
                    <th className="p-4 rounded-tl-lg">Fecha/Hora</th>
                    <th className="p-4">Estudiante</th>
                    <th className="p-4">Lugar</th>
                    <th className="p-4 w-64">Descripción</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4">Guardia</th>
                    <th className="p-4 rounded-tr-lg">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 align-top text-gray-800 font-medium whitespace-nowrap">
                        <div className="flex flex-col">
                          <span>{report.date.split(' ')[0]}</span>
                          <span className="text-gray-400 text-xs">{report.date.split(' ')[1]}</span>
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <div className="font-medium text-gray-800">{report.student}</div>
                        <div className="text-gray-400 text-xs">{report.rut}</div>
                      </td>
                      <td className="p-4 align-top text-gray-600">{report.place}</td>
                      <td className="p-4 align-top text-gray-600 truncate max-w-xs" title={report.desc}>
                        {report.desc}
                      </td>
                      <td className="p-4 align-top">
                        <StatusBadge status={report.status} />
                      </td>
                      <td className="p-4 align-top">
                        <select 
                          className="bg-white border border-gray-200 text-gray-700 text-xs rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 w-full"
                          defaultValue={report.guardId || ""}
                        >
                          <option value="" disabled>Asignar...</option>
                          {guards.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 align-top">
                        <select 
                           className="bg-gray-100 border border-transparent hover:border-gray-300 text-gray-700 text-xs rounded px-2 py-1 cursor-pointer focus:ring-2 focus:ring-blue-500"
                           defaultValue={report.status}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="En investigación">En investigación</option>
                          <option value="Resuelto">Resuelto</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* --- MODAL: AGREGAR GUARDIA --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Agregar Nuevo Guardia</h3>
                <p className="text-sm text-gray-500">Ingresa los datos del nuevo guardia de seguridad</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6 space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Nombre</label>
                  <input
                    type="text"
                    placeholder="Ej: Juan"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Apellido</label>
                  <input
                    type="text"
                    placeholder="Ej: Pérez"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">RUT</label>
                <input
                  type="text"
                  placeholder="12.345.678-9"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="juan.perez@ubb.cl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Teléfono</label>
                <input
                  type="tel"
                  placeholder="+56 9 1234 5678"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa una contraseña segura"
                    value={contrasenia}
                    onChange={(e) => setContrasenia(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-10"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md shadow-blue-200 transition-all" onClick={handleCreate}>
                Agregar Guardia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: MODIFICAR GUARDIA --- */}
      {isModalOpenEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Editar Guardia</h3>
                <p className="text-sm text-gray-500">Actualice la informacion del guardia de seguridad</p>
              </div>
              <button onClick={() => setIsModalOpenEdit(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6 space-y-4">

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="juan.perez@ubb.cl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Teléfono</label>
                <input
                  type="tel"
                  placeholder="+56 9 1234 5678"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa una contraseña segura"
                    value={contrasenia}
                    onChange={(e) => setContrasenia(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-10"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
              <button 
                onClick={() => setIsModalOpenEdit(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md shadow-blue-200 transition-all" onClick={() => handleUpdate(selectedGuard)}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}