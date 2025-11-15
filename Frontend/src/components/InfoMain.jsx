import React from 'react';
import { Shield, Camera, Lock, Wrench } from 'lucide-react';
import '../index.css'
const InfoMain = () => {

    // Datos de las características para evitar repetición
    const features = [
    {
        icon: Shield,
        title: "Protección Integral",
        description: "Sistema de seguridad multicapa con guardias capacitados, caninos entrenados y vigilancia permanente en todos los bicicleteros del campus.",
        color: "blue-500"
    },
    {
        icon: Camera,
        title: "Monitoreo Inteligente",
        description: "Red de cámaras HD con tecnología de visión nocturna y grabación continua. Acceso remoto 24/7 al estado de tu bicicleta.",
        color: "blue-500"
    },
    {
        icon: Lock,
        title: "Acceso Controlado",
        description: "Sistema de registro digital y control de acceso mediante credenciales UBB. Historial completo de entrada y salida de bicicletas.",
        color: "blue-500"
    },
    {
        icon: Wrench,
        title: "Mantenimiento Proactivo",
        description: "Revisiones periódicas de infraestructura, reparaciones inmediatas y mejoras continuas para garantizar instalaciones de primera clase.",
        color: "blue-500"
    },
    ];

    // Componente individual de la tarjeta de característica
    const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out border border-gray-100 transform hover:-translate-y-1">
        <div className="flex items-start space-x-4">
        
        {/* Icono */}
        <div className={`shrink-0 p-3 bg-blue-100 rounded-lg text-${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        
        {/* Contenido */}
        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {title}
            </h3>
            <p className="text-sm text-gray-600">
            {description}
            </p>
        </div>
        </div>
    </div>
    );

    // Componente principal de la aplicación (o la sección)
    return (
        // Contenedor principal: centra el contenido y aplica padding
        <div className="min-h-screen flex items-center justify-center py-16 px-4 bg-gray-50">
        <div className="max-w-6xl w-full">
            
            {/* Encabezado de la Sección */}
            <header className="text-center mb-12 md:mb-16">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">
                NUESTRA PROMESA
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">
                Seguridad y Cuidado para tu Bicicleta
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Descubre las características clave que hacen de nuestro bicicletero el lugar más seguro del campus.
            </p>
            </header>

            {/* Malla de Características */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
                <FeatureCard 
                key={index} 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description} 
                color={feature.color}
                />
            ))}
            </div>
            
        </div>
        </div>
    );
}

export default InfoMain