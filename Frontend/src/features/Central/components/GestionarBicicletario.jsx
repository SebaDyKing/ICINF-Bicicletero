import { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Bike } from 'lucide-react';
import BicycleCard from './BicycleCard';
import { NewBicicleRackButton } from './NewBicicleRackButton';

export function GestionarBicicletarios({ racks = [], onBack }) {
    const [activeId, setActiveId] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingData, setEditingData] = useState(null)

    const bicicleterosData = racks.map((rack) => ({
        id: rack.id_bicicletero,
        nombre: rack.nombre,
        ocupados: rack.ocupados,
        total: rack.capacidad,
        latitud: rack.latitud,
        longitud: rack.longitud,
    }))

    useEffect(() => {
        if (bicicleterosData.length > 0) {
            const idExiste = bicicleterosData.find(b => b.id === activeId);

            if (activeId === null || !idExiste) {
                setActiveId(bicicleterosData[0].id);
            }
        }
    }, [bicicleterosData, activeId]);

    const handleCardClick = (id) => {
        if (activeId === id) return;
        setActiveId(id);
    };
    return (
        <div className="w-full bg-slate-100 p-6">
            <div className="relative bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-6">
                <div className="relative bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-5 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />

                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl shadow-lg bounce-slow">
                                <Bike size={28} strokeWidth={2.5} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white tracking-tight">Gestionar Bicicletarios</h1>
                                <p className="text-white/80 text-sm font-medium mt-0.5">Administración de infraestructura y capacidad</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/30">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50"></div>
                                En línea
                            </span>

                            <button
                                onClick={onBack}
                                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-xl text-sm transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2 border border-white/30"
                            >
                                <ArrowLeft size={18} />
                                Volver
                            </button>

                            <button
                                className="bg-white hover:bg-white/90 text-blue-700 font-semibold px-5 py-2 rounded-xl shadow-lg flex items-center gap-2 transition hover:scale-105 active:scale-95"
                                onClick={() => {
                                    setEditingData(null)
                                    setIsModalOpen(true)
                                }}
                            >
                                <Plus size={20} />
                                Nuevo Bicicletario
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {bicicleterosData.length > 0 ? (
                    bicicleterosData.map((rack) => (
                        <BicycleCard
                            key={rack.id}
                            data={rack}
                            isActive={activeId === rack.id}
                            onClick={handleCardClick}
                            onEdit={(data) => {
                                setEditingData(data)
                                setIsModalOpen(true)
                            }}

                        />
                    ))
                ) : (
                    <div className="col-span-1 md:col-span-2 lg:col-span-4 py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                        <p>Esperando datos del servidor...</p>
                    </div>
                )}
            </div>
            <NewBicicleRackButton
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingData}
            />
        </div>
    );
}