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
import { getGuardService, getUserService } from '../services/adminGuard.service';
import Swal from 'sweetalert2'

import {Header} from './Header';

export default function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState('guards'); // 'guards' | 'reports'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedGuard, setSelectedGuard] = useState(null)
  const [userSelected, setUserSelected] = useState(null)
  const [inputRut, setInputRut] = useState(null)
  const [rol, setRol] = useState('')
  
  // Estados de datos
  const [guards, setGuards] = useState([]);
  const [reports, setReports] = useState([]);

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
    const fetchReports = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/guards/report/getAllReports`);
        console.log(res)
        
        const formatted = res.data.data.resultQuery.map(r => ({
          ID_Informe: r.ID_Informe,
          fecha: r.Fecha,
          descripcion: r.Descripcion,
          bicicletero: r.Bicicletero,
          imagenes: r.ImagenesURL
        }));
        

        setReports(formatted);
      } catch (error) {
        console.error("Error backend:", error);
        Swal.fire({
                icon: 'error',
                title: 'Error al cargar reportes.',
                timer: 2000
              })
      }
    };

    fetchReports();
  }, []);

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
        Swal.fire({
                icon: 'error',
                title: 'Error al cargar guardias.',
                timer: 2000
              })
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

      Swal.fire({
        icon: 'success',
        title: 'pico',
        timer: 2000
      })
      console.log(res.data.resultQuery);

    } catch (error) {
      console.log(error);
      Swal.fire({
                icon: 'error',
                title: error.response?.data?.message || "Error en la solicitud",
                timer: 2000
              })
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
          data: { rut },
        }
      );

      Swal.fire({
                icon: 'success',
                title: res.data.message,
                timer: 2000
              })

      // actualizar UI — ejemplo filtrando
      setGuards(prev => prev.filter(g => g.rut !== rut));

    } catch (error) {
      console.error(error);
      Swal.fire({
                icon: 'error',
                title: error.response?.data?.message || "No se pudo eliminar.",
                timer: 2000
              })
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

      Swal.fire({
                icon: 'success',
                title: 'Información del guardia actualizada correctamente.',
                timer: 2000
              })
      console.log(res.data);

    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: error.response?.data?.message || "Error en la solicitud",
        timer: 2000
      })
    }
  };

  const searchGuardByRut = async () => {
    try {
      const res = await getGuardService(inputRut)
      
      // Guardas el resultado en un estado separado
      setUserSelected(res.data.data)
      console.log(res.data.data)
      setInputRut('')
    } catch (error) {
      console.error(error);
      setUserSelected(null); // Limpia
    }
  };

  const searchUserByRut = async () => {
    try {
      const res = await getUserService(inputRut)
      
      // Guardas el resultado en un estado separado
      setUserSelected(res.data.data)
      console.log(res.data.data)
      setInputRut('')
    } catch (error) {
      console.error(error);
      setUserSelected(null); // Limpia
      Swal.fire({
                icon: 'error',
                title: error.response?.data?.message || "Usuario no encontrado",
                timer: 2000
              })
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

  const formatDate = (fechaHora) => {
    const date = new Date(fechaHora);

    const dia = date.getDate().toString().padStart(2, "0");
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    const anio = date.getFullYear();

    return `${dia}/${mes}/${anio}`;
  };

    const handleDeleteReport = async (ID_Informe) => {
      const confirmDelete = window.confirm(
        `¿Seguro que deseas eliminar el reporte con ID ${ID_Informe}?`
      );
      if (!confirmDelete) return;

      try {
        const res = await axios.delete(
          "http://localhost:3000/api/guards/report/deleteReport",
          {
            data: { ID_Informe },
          }
        );

        Swal.fire({
                icon: 'success',
                title: 'Reporte eliminado correctamente',
                timer: 2000
              })

        // actualizar UI — ejemplo filtrando
        setReports(prev => prev.filter(r => r.ID_Informe !== ID_Informe));

      } catch (error) {
        console.error(error);
        Swal.fire({
                icon: 'error',
                title: error.response?.data?.message || "No se pudo eliminar.",
                timer: 2000
              })
      }
    };

  
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
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

        {/*BUSQUEDA DE USUARIO*/}
        {activeTab === 'guards' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-3">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Buscar usuario en el sistema</h2>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Buscar por RUT..."
                value={inputRut}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                onChange={(e) => setInputRut(e.target.value)}
              />
            </div>

            <select className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-3"
            value = {rol}
            onChange={(e) => setRol(e.target.value)}>
              <option value="">Seleccionar rol</option>
              <option value='guardia'>Guardia</option>
              <option value='owner'>Owner</option>
            </select>

            <div className="relative mb-6">              
              <button className="mt-5 flex items-center gap-1 text-white bg-blue-800 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 font-medium" onClick={() => {rol === '' ? Swal.fire({
                icon: 'warning',
                title: 'Seleccione el rol.',
                timer: 2000
              }) : rol==='guardia' ? searchGuardByRut() : searchUserByRut()}}>
                <Search size={14}/> Buscar
              </button>
              {userSelected && (
                <div className="table-user-search">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 text-sm font-semibold">
                      <tr>
                        <th className="p-4 rounded-tl-lg">Nombre</th>
                        <th className="p-4">RUT</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Teléfono</th>
                        <th className='p-4 rounded-tr-lg'>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-4">{userSelected.nombre}</td>
                        <td className="p-4">{userSelected.rut}</td>
                        <td className="p-4">{userSelected.correo}</td>
                        <td className="p-4">{userSelected.telefono}</td>
                        <td>
                          <button className="flex items-center gap-1 text-white bg-red-600 px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 font-medium mt-3" onClick={() => handleDelete(userSelected.rut)}>
                            <Trash2 size={14}/> Eliminar
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}


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

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-semibold">
                  <tr>
                    <th className="p-4 rounded-tl-lg">ID</th>
                    <th className="p-4">Fecha</th>
                    <th className="p-4">Bicicletero</th>
                    <th className="p-4 w-64">Descripción</th>
                    <th className="p-4">Imagenes</th>
                    <th className="p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reports.map((r) => (
                    <tr key={r.ID_Informe} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium">{r.ID_Informe}</td>
                      <td className="p-4">{formatDate(r.fecha)}</td>
                      <td className="p-4">{r.bicicletero}</td>
                      <td className="p-4 truncate max-w-xs" title={r.descripcion}>{r.descripcion}</td>
                      <td className="p-4 text-center">
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-xs border border-gray-200">{r.imagenes} imágenes</span>
                      </td>
                      <td className='p-4'>
                        <button className="flex items-center gap-1 text-white bg-red-600 px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 font-medium" onClick={() => handleDeleteReport(r.ID_Informe)}>
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