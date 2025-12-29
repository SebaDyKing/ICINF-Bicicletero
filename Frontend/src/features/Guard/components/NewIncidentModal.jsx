import axios from 'axios';
import { X, Upload } from 'lucide-react';
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { createReportService, getOwnersByBicicleteroService, getBicicleterosService} from '../services/guardReports.service';

// Componente Básico de Modal
const NewIncidentModal  = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;
  const [fecha, setFecha] = useState('')
  const [bicicletero, setBicicletero] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [listaBicicleteros, setListaBicicleteros] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
  const fetchBicicleteros = async () => {
    try {
      const res = await getBicicleterosService();
      const bicicleteros = res.data.data
      console.log(bicicleteros)
      setListaBicicleteros(bicicleteros);
    }catch(error){
      Swal.fire({
        icon: 'error',
        title: 'Error.',
        text: error,
        timer: 2000
      })
    }
  };
  fetchBicicleteros();
}, []);

  const handleCreateRegister = async () => {
    try {
      if (bicicletero === '') throw new Error('Seleccione un bicicletero.')
      console.log(bicicletero)
      console.log(listaBicicleteros[bicicletero-1].nombre)
        
      const users = await getOwnersByBicicleteroService(bicicletero)
      console.log(users)
      
      const emails = users.data.data.resultQuery.map(owner => owner.email)
      console.log(emails)

      const nombreBicicletero = listaBicicleteros[bicicletero-1].nombre

      const res = await createReportService(emails, fecha, nombreBicicletero, descripcion)

      console.log(res);

      await Swal.fire({
            icon: 'success',
            title: 'Se ha registrado el incidente exitosamente',
            timer: 2000
          })
      onSuccess();
    } catch (error) {
      console.log(error);
      error.status === 400 ? Swal.fire({
              icon: 'error',
              title: error.response.data.message || 'Error en la solicitud',
              timer: 2000
            }) : 
      Swal.fire({
              icon: 'error',
              title: error || 'Error en la solicitud',
              timer: 2000
            })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative animation-fade-in">
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Registrar Nuevo Incidente</h2>
            <p className="text-sm text-gray-500">Complete los detalles del incidente</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Formulario */}
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
          
          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input value = {fecha} onChange={(e) => setFecha(e.target.value)}
              type="date" 
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Bicicletero */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bicicletero</label>
            <select 
              value={bicicletero} 
              onChange={(e) => {
                setBicicletero(e.target.value); 
              }}
              className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Seleccione un bicicletero</option>
              {listaBicicleteros.map((bicicletero) => (
                <option key={bicicletero.id_bicicletero} value={bicicletero.id_bicicletero}>
                  {bicicletero.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea value = {descripcion} onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              placeholder="Describa el incidente en detalle..."
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancelar
            </button>
            <button onClick={handleCreateRegister}
              type="submit" 
              className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 font-medium"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewIncidentModal;