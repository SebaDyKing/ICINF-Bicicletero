import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Shield,
  AlertTriangle,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { createGuardService, deleteGuardService, updateGuardService, getAllGuardService, getGuardService, getUserService, getAllReportsService, deleteOwnerService, deleteReportService } from '../services/adminGuard.service';
import Swal from 'sweetalert2'
import { formatRut } from '../../utils/rutUtils'

import { Header } from './Header';
import { Footer } from './Footer';

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
  const prefijo = '+56 9 '
  const letras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;
  const [telefono, setTelefono] = useState(prefijo);
  const [contrasenia, setContrasenia] = useState("");
  const navigate = useNavigate();

  
  //Se obtiene reportes consultados al sistema y los guarda en el arreglo reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getAllReportsService()
        console.log(res)

        const formatted = res.data.data.resultQuery.map(r => ({
          ID_Informe: r.ID_Informe,
          fecha: r.Fecha,
          descripcion: r.Descripcion,
          bicicletero: r.Bicicletero
        }));
        setReports(formatted);
      } catch (error) {

        //en caso de algun error avisa al usuario con una alerta
        console.error("Error backend:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar incidentes.',
          timer: 2000
        })
      }
    };

    fetchReports();
  }, []);

  ////Se obtienen guardias consultados al sistema y los guarda en el arreglo guards
  useEffect(() => {
    const fetchGuards = async () => {
      try {
        const res = await getAllGuardService()

        const formatted = res.data.data.resultQuery.map(g => ({
          nombre: `${g.nombre} ${g.apellido}`,
          rut: g.rut,
          email: g.email,
          telefono: g.telefono
        }));

        setGuards(formatted);
      } catch (error) {
        console.log(error)
        const message = error.response?.data?.message;
        if (error.response?.status === 401) {
          Swal.fire({
            icon: "warning",
            title: "Acceso denegado",
            text: message,
          });
          navigate('/')
        } else if (error.response?.status === 403) {
          Swal.fire({
            icon: "error",
            title: "Acceso denegado",
            text: message,
          });
          navigate('/')
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: message || "Error inesperado",
          });
          navigate('/')
        }
      }
    };

    fetchGuards();
  }, []);

  
  useEffect(() => {
    //Cada que se seleccione un guardia se asignara el valor para email y telefono, de manera que se muestre al momento de clickear "editar"
    if (selectedGuard) {
      setEmail(selectedGuard.email || "");
      setTelefono(selectedGuard.telefono || "");
    }
  }, [selectedGuard]);


  //Funcion que llama al servicio de crear guardia
  const handleCreate = async () => {
    try {
      console.log(rut, email, contrasenia, telefono, nombre, apellido)

      const res = await createGuardService(rut, email, contrasenia, telefono, nombre, apellido);

      await Swal.fire({
        icon: 'success',
        title: 'Guardia creado exitosamente',
        timer: 1000
      })
      console.log(res);
      //Resetea los valores del input paar que se vea mas limpio
      resetDatos()
      //actualiza la pagina
      navigate(0)
    } catch (error) {

      //en caso de algun error avisa al usuario mediante una alerta
      console.log(error);
      const details = error.response?.data?.errorDetails;
      error.status === 409 ? Swal.fire({
        icon: 'error',
        title: error.response.data.message || "Error de validación"
      }) : Swal.fire({
        icon: 'error',
        title: details?.[0] || "Error de validación"
      });
    }
  };

  //Funcion que llama al servicio de eliminar guardia
  const handleDelete = async (rut) => {
    try {
      const res = await deleteGuardService(rut)
      Swal.fire({
        icon: 'success',
        title: res.data.message,
        timer: 2000
      })
      // actualizar UI, donde mostrara a los guardias
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

  //Funcion que llama al servicio de eliminar owner
  const handleDeleteOwner = async (rut) => {
    try {
      const res = await deleteOwnerService(rut)
      Swal.fire({
        icon: 'success',
        title: res.data.message,
        timer: 2000
      })
      // actualizar UI
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

  //Funcion que llama al servicio de modificar guardia
  const handleUpdate = async (guard) => {
    try {
      const res = await updateGuardService(guard.rut, email, contrasenia, telefono);
      console.log(res)

      await Swal.fire({
        icon: 'success',
        title: 'Información del guardia actualizada correctamente.',
        timer: 5000
      })
      console.log(res.data);
      //actualiza la pagina
      navigate(0)

    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: error || error.response?.data?.message || "Error en la solicitud",
        timer: 2000
      })
    }
  };

  //Funcion que llama al servicio de buscar guardia
  const searchGuardByRut = async () => {
    try {

      //se le entrega de parametro el rut ingresado
      const res = await getGuardService(inputRut)

      // Guardas el resultado en un estado separado
      setUserSelected(res.data.data)
      console.log(res.data.data)
      console.log(res)
      setInputRut('') //Se limpia input
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: error || "Guardia no encontrado.",
        timer: 2000
      })
      setUserSelected(null); // Limpia userSelected
    }
  };

  //Funcion que llama al servicio de crear guardia
  const searchUserByRut = async () => {
    try {
      //se ingresa como parametro el rut del usuario que se busca
      const res = await getUserService(inputRut)
      // Guardas el resultado en un estado separado
      setUserSelected(res.data.data)
      console.log(res.data.data)
      setInputRut('') //Se limpia el input
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: error || "Usuario no encontrado.",
        timer: 2000
      })
      setUserSelected(null); // Limpia userSelected
    }
  };

  //Funcion que formatea la hora, y se muestre en formato DD/MM/AAAA, ya que pgAdmin devuelve en formato AAAA/MM/DD HH/MM/SS
  const formatDate = (fechaHora) => {
    const date = new Date(fechaHora);

    const dia = date.getDate().toString().padStart(2, "0");
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    const anio = date.getFullYear();

    return `${dia}/${mes}/${anio}`;
  };

  //Funcion que llama al servicio de eliminar reporte.
  const handleDeleteReport = async (ID_Informe) => {
    try {
      await deleteReportService(ID_Informe)

      Swal.fire({
        icon: 'success',
        title: 'Reporte eliminado correctamente',
        timer: 2000
      })

      // actualizar UI
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

  //Funcion que formatea el input que se ingresa, manteniendo el prefijo +56 9 y la forma +56 9 XXXX XXXX
  const formatPhone = (value) => {
    // Quitar el prefijo si viene duplicado
    let clean = value.replace(prefijo, '');

    // Solo números
    clean = clean.replace(/\D/g, '');

    // Máximo 8 dígitos
    clean = clean.slice(0, 8);

    // Agrupar de 4 en 4
    const grouped = clean.match(/.{1,4}/g)?.join(' ') || '';

    return prefijo + grouped;
  };

  //Limpia valores
  const resetDatos = () => {
    setNombre('')
    setApellido('')
    setContrasenia('')
    setEmail('')
    setTelefono(prefijo)
    setRut('')
  }


  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col">
      <Header />
      {/* --- Contenido Principal --- */}
      <main className="p-6 max-w-7xl mx-auto grow w-full">

        {/* Header con ícono y título */}
        <header className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-linear-to-br from-[#003366] to-[#0066cc] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 animate-pulse-soft">
                <Shield size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Centro de Seguridad</h2>
                <p className="text-slate-500 text-sm">Gestión integral de guardias e incidentes</p>
              </div>
            </div>
            {activeTab === 'guards' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-linear-to-br from-[#003366] to-[#0066cc] hover:from-[#002244] hover:to-[#0055aa] text-white px-5 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105"
              >
                <Plus size={18} /> Nuevo Guardia
              </button>
            )}
          </div>
        </header>

        {/*BUSQUEDA DE USUARIO*/}
        {activeTab === 'guards' && (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 mb-6 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
            <div className="relative bg-linear-to-r from-blue-700 to-blue-900 -m-6 mb-6 px-6 py-4 overflow-hidden rounded-t-3xl">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent shimmer" />
              <div className="relative">
                <h2 className="text-xl font-bold text-white tracking-tight">Buscar usuario en el sistema</h2>
              </div>
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por RUT..."
                value={inputRut}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                onChange={(e) => {
                  const formattedRut = formatRut(e.target.value);
                  setInputRut(formattedRut);
                }}
                maxLength={12}
              />
            </div>

            <select className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-3 shadow-sm hover:shadow-md transition-all"
              value={rol}
              onChange={(e) => setRol(e.target.value)}>
              <option value="">Seleccionar rol</option>
              <option value='guardia'>Guardia</option>
              <option value='owner'>Owner</option>
            </select>

            <div className="relative mb-6">
              <button className="mt-5 flex items-center gap-2 text-white bg-linear-to-br from-blue-700 to-blue-900 px-4 py-2.5 rounded-xl text-sm hover:shadow-lg hover:scale-105 font-semibold transition-all shadow-md" onClick={() => {
                rol === '' ? Swal.fire({
                  icon: 'warning',
                  title: 'Seleccione rol de usuario.',
                  timer: 2000
                }) : rol === 'guardia' ? searchGuardByRut() : searchUserByRut(); console.log(userSelected)
              }}>
                <Search size={14} /> Buscar
              </button>
              {userSelected && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
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
                        <td className="p-4">{`${userSelected.nombre} ${userSelected.apellido}`}</td>
                        <td className="p-4">{userSelected.rut}</td>
                        <td className="p-4">{userSelected.correo || userSelected.email}</td>
                        <td className="p-4">{userSelected.telefono}</td>
                        <td>
                          <button className="flex items-center gap-1 text-white bg-linear-to-br from-red-600 to-red-700 px-3 py-2 rounded-xl text-sm hover:shadow-lg hover:scale-105 font-semibold transition-all mt-3" onClick={async () => { userSelected.tipo_usuario === 'Guard' ? handleDelete(userSelected.rut) : handleDeleteOwner(userSelected.rut); setTimeout(() => { navigate(0) }, 1300) }}>
                            <Trash2 size={14} /> Eliminar
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
        <div className="flex mb-6 bg-white rounded-full p-1.5 shadow-lg border border-gray-200 w-full max-w-4xl mx-auto">
          <button
            onClick={() => setActiveTab('guards')}
            className={`flex-1 py-3 rounded-full font-semibold text-sm flex justify-center items-center gap-2 transition-all ${activeTab === 'guards' ? 'bg-linear-to-br from-[#003366] to-[#0066cc] text-white shadow-lg shadow-blue-500/30' : 'text-gray-600 hover:bg-slate-100'}`}
          >
            <Shield size={18} /> Guardias ({guards.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-3 rounded-full font-semibold text-sm flex justify-center items-center gap-2 transition-all ${activeTab === 'reports' ? 'bg-linear-to-br from-[#003366] to-[#0066cc] text-white shadow-lg shadow-blue-500/30' : 'text-gray-600 hover:bg-slate-100'}`}
          >
            <AlertTriangle size={18} /> Incidentes ({reports.length})
          </button>
        </div>


        {/* --- VISTA: GUARDIAS --- */}

        {activeTab === 'guards' && (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
            <div className="relative bg-linear-to-r from-blue-700 to-blue-900 px-6 py-4 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent shimmer" />
              <div className="relative">
                <h3 className="font-bold text-lg text-white tracking-tight">Personal de Seguridad</h3>
                <p className="text-blue-100 text-sm mt-1">Gestión completa de guardias asignados a bicicleteros</p>
              </div>
            </div>
            <div className="p-6">

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-600 text-sm font-semibold">
                    <tr>
                      <th className="p-4 rounded-tl-lg">Nombre</th>
                      <th className="p-4">RUT</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Teléfono</th>
                      <th className="p-4 rounded-tr-lg text-right">Acciones</th>
                    </tr>
                  </thead>
                  {guards.length === 0 ? (
                    <tr>
                      {/* IMPORTANTE: colSpan debe ser igual al número de columnas de tu cabecera (ID, Fecha, etc.) */}
                      <td colSpan="6" className="p-8 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          {/* Opcional: Un icono para que se vea más bonito */}
                          <span className="text-2xl">👥</span>
                          <p>No se encuentran guardias registrados.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tbody className="divide-y divide-gray-100">
                      {guards.map((guard) => (
                        <tr key={guard.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="p-4 font-medium text-gray-800">{guard.nombre}</td>
                          <td className="p-4 text-gray-600">{guard.rut}</td>
                          <td className="p-4 text-gray-600">{guard.email}</td>
                          <td className="p-4 text-gray-600">{guard.telefono}</td>
                          <td className="p-4 flex justify-end gap-2">
                            <button className="flex items-center gap-1 text-blue-600 border border-blue-300 px-3 py-2 rounded-xl text-sm hover:bg-blue-50 hover:shadow-md hover:scale-105 font-semibold transition-all" onClick={() => {
                              setIsModalOpenEdit(true);
                              setSelectedGuard(guard);
                              console.log(selectedGuard)
                              console.log(guard)
                              console.log(email)
                              console.log(telefono)
                            }}>
                              <Edit size={14} /> Editar
                            </button>

                            <button className="flex items-center gap-1 text-white bg-linear-to-br from-red-600 to-red-700 px-3 py-2 rounded-xl text-sm hover:shadow-lg hover:scale-105 font-semibold transition-all" onClick={() => handleDelete(guard.rut)}>
                              <Trash2 size={14} /> Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        )}


        {/* --- VISTA: INCIDENTES --- */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
            <div className="relative bg-linear-to-r from-blue-700 to-blue-900 px-6 py-4 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent shimmer" />
              <div className="relative">
                <h3 className="font-bold text-lg text-white tracking-tight">Incidentes de Robo</h3>
                <p className="text-blue-100 text-sm mt-1">Gestión y seguimiento de incidentes de los estudiantes</p>
              </div>
            </div>
            <div className="p-6">

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-semibold">
                    <tr>
                      <th className="p-4 rounded-tl-lg">ID</th>
                      <th className="p-4">Fecha</th>
                      <th className="p-4">Bicicletero</th>
                      <th className="p-4 w-64">Descripción</th>
                      <th className="p-4">Acciones</th>
                    </tr>
                  </thead>
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="text-2xl">📂</span>
                          <p>No se encuentran incidentes registrados.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tbody className="divide-y divide-gray-100">
                      {reports.map((r) => (
                        <tr key={r.ID_Informe} className="hover:bg-blue-50/50 transition-colors">
                          <td className="p-4 font-medium">{r.ID_Informe}</td>
                          <td className="p-4">{formatDate(r.fecha)}</td>
                          <td className="p-4">{r.bicicletero}</td>
                          <td className="p-4 wrap-break-word" title={r.descripcion}>{r.descripcion}</td>
                          <td className='p-4'>
                            <button className="flex items-center gap-1 text-white bg-linear-to-br from-red-600 to-red-700 px-3 py-2 rounded-xl text-sm hover:shadow-lg hover:scale-105 font-semibold transition-all" onClick={() => handleDeleteReport(r.ID_Informe)}>
                              <Trash2 size={14} /> Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

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
              <button onClick={() => { setIsModalOpen(false); resetDatos() }} className="text-gray-400 hover:text-gray-600">
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
                    onChange={(e) => {
                      const value = e.target.value;

                      if (letras.test(value)) {
                        setNombre(value);
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Apellido</label>
                  <input
                    type="text"
                    placeholder="Ej: Pérez"
                    value={apellido}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (letras.test(value)) {
                        setApellido(value);
                      }
                    }}
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
                  onChange={(e) => {
                    const formattedRut = formatRut(e.target.value);
                    setRut(formattedRut);
                  }}
                  maxLength={12}
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
                  onChange={(e) => setTelefono(formatPhone(e.target.value))}
                  onKeyDown={(e) => {
                    // Bloquea borrar el prefijo
                    if (
                      e.key === 'Backspace' &&
                      telefono.length <= prefijo.length
                    ) {
                      e.preventDefault();
                    }
                  }}
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
                onClick={() => { setIsModalOpen(false); resetDatos() }}
                className="px-5 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 hover:scale-105 transition-all"
              >
                Cancelar
              </button>
              <button className="px-5 py-2.5 bg-linear-to-br from-[#003366] to-[#0066cc] text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 shadow-lg shadow-blue-500/30 transition-all" onClick={handleCreate}>
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
              <button onClick={() => { setIsModalOpenEdit(false); resetDatos() }} className="text-gray-400 hover:text-gray-600">
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
                  onChange={(e) => setTelefono(formatPhone(e.target.value))}
                  onKeyDown={(e) => {
                    // Bloquea borrar el prefijo
                    if (
                      e.key === 'Backspace' &&
                      telefono.length <= prefijo.length
                    ) {
                      e.preventDefault();
                    }
                  }}
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
                onClick={() => { setIsModalOpenEdit(false); resetDatos() }}
                className="px-5 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 hover:scale-105 transition-all"
              >
                Cancelar
              </button>
              <button className="px-5 py-2.5 bg-linear-to-br from-[#003366] to-[#0066cc] text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 shadow-lg shadow-blue-500/30 transition-all" onClick={() => handleUpdate(selectedGuard)}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}