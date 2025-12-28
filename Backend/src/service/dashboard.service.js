import { AppDataSource } from "../config/configDb.js";
import { Store } from "../models/store.entity.js";
import { BicycleRack } from "../models/bicycleRack.entity.js";
import { IsNull, Between, MoreThanOrEqual } from "typeorm";

/**
 * @async
 * @function getDashboardData
 * @description Recopila y procesa todos los datos necesarios para el dashboard central.
 * Calcula KPIs en tiempo real, ocupación por bicicletero, actividad reciente y datos para gráficos.
 * 
 * @returns {Promise<Object>} Objeto con todos los datos del dashboard.
 * @returns {Object} returns.kpi - Indicadores clave de desempeño (KPIs).
 * @returns {number} returns.kpi.totalBicicletas - Total de bicicletas actualmente estacionadas.
 * @returns {number} returns.kpi.capacidadTotal - Suma de la capacidad de todos los bicicleteros.
 * @returns {number} returns.kpi.ocupacionGlobal - Porcentaje de ocupación general del sistema.
 * @returns {number} returns.kpi.ingresosHoy - Cantidad de ingresos registrados en el día actual.
 * @returns {number} returns.kpi.salidasHoy - Cantidad de salidas registradas en el día actual.
 * @returns {Array<Object>} returns.racks - Lista de bicicleteros con su estado detallado.
 * @returns {Array<Object>} returns.actividad - Lista de los 5 movimientos más recientes (ingresos/salidas).
 * @returns {Object} returns.graficos - Datos formateados para los gráficos del dashboard.
 * @returns {Array<Object>} returns.graficos.porHora - Distribución de ingresos por hora (07:00 - 22:00).
 * @returns {Array<Object>} returns.graficos.semanal - Resumen de ingresos de los últimos 7 días.
 */
export async function getDashboardData() {
    const storeRepository = AppDataSource.getRepository(Store);
    const rackRepo = AppDataSource.getRepository(BicycleRack);

    const racks = await rackRepo.find();

    const datosRacks = await Promise.all(racks.map(async (rack) => {
        const ocupados = await storeRepository.count({
            where: {
                bicycleRack: { id_bicicletero: rack.id_bicicletero },
                fechaSalida: IsNull()
            }
        });

        const capacidadTotal = rack.capacidad_maxima
        const porcentaje = Math.round((ocupados / capacidadTotal) * 100);

        return {
            id_bicicletero: rack.id_bicicletero,
            nombre: rack.nombre,
            ocupados: ocupados,
            capacidad: capacidadTotal,
            porcentaje_ocupacion: porcentaje,
            estado: porcentaje > 90 ? "ALTO" : porcentaje > 60 ? "NORMAL" : "Bajo",
            latitud: rack.latitud,
            longitud: rack.longitud,
            imagen: rack.imagen,
        };
    }));

    const TotalBicicletas = datosRacks.reduce((acc, rack) => acc + rack.ocupados, 0);
    const TotalCapacidad = datosRacks.reduce((acc, rack) => acc + rack.capacidad, 0);
    const ocupacionGlobal = TotalCapacidad > 0 ? Math.round((TotalBicicletas / TotalCapacidad) * 100) : 0;

    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);
    const finDia = new Date();
    finDia.setHours(23, 59, 59, 999);

    const ingresosHoyData = await storeRepository.find({
        where: {
            tipoMovimiento: "Ingreso",
            fechaIngreso: Between(inicioDia, finDia)
        },
        select: ["fechaIngreso"]
    });

    const ingresosHoy = ingresosHoyData.length;

    const salidasHoy = await storeRepository.count({
        where: {
            tipoMovimiento: "Salida",
            fechaSalida: Between(inicioDia, finDia)
        }
    });

    const conteoHoras = {};
    ingresosHoyData.forEach(registro => {
        const hora = new Date(registro.fechaIngreso).getHours();
        conteoHoras[hora] = (conteoHoras[hora] || 0) + 1;
    });

    const graficoHoras = Array.from({ length: 15 }, (_, i) => i + 7).map(h => ({
        hora: `${h}:00`,
        ingresos: conteoHoras[h] || 0
    }));

    const ultimosMovimientos = await storeRepository.find({
        order: { idRegistro: "DESC" },
        take: 5,
        relations: {
            bicycle: { owner: true },
            bicycleRack: true,
            guard: true
        }
    });

    const haceSieteDias = new Date();
    haceSieteDias.setDate(haceSieteDias.getDate() - 6);
    haceSieteDias.setHours(0, 0, 0, 0);

    const ingresosSemana = await storeRepository.find({
        where: {
            tipoMovimiento: "Ingreso",
            fechaIngreso: MoreThanOrEqual(haceSieteDias)
        },
        select: ["fechaIngreso"]
    });

    const conteoDias = {};
    const diasOrdenados = [];

    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const nombreDia = d.toLocaleDateString('es-ES', { weekday: 'short' });
        const key = nombreDia.toLowerCase();
        if (conteoDias[key] === undefined) {
            conteoDias[key] = 0;
            diasOrdenados.push(key);
        }
    }

    ingresosSemana.forEach(registro => {
        const nombreDia = new Date(registro.fechaIngreso)
            .toLocaleDateString('es-ES', { weekday: 'short' })
            .toLowerCase();
        if (conteoDias[nombreDia] !== undefined) {
            conteoDias[nombreDia]++;
        }
    });

    const graficoSemana = diasOrdenados.map(dia => ({
        dia: dia.charAt(0).toUpperCase() + dia.slice(1),
        total: conteoDias[dia]
    }));

    const ultimosMovimientosFeed = await storeRepository.find({
        order: {
            idRegistro: "DESC"
        },
        take: 20,
        relations: {
            bicycle: { owner: true },
            bicycleRack: true
        }
    });

    const controlAccesoFeedCompleto = ultimosMovimientosFeed.map(registro => {
        const nombre = registro.bicycle?.owner ? registro.bicycle.owner.nombre : 'Desconocido';

        const esSalida = registro.tipoMovimiento === "Salida";

        const fechaReferencia = esSalida ? registro.fechaSalida : registro.fechaIngreso;
        const fechaObj = new Date(fechaReferencia);
        const horaFormateada = fechaObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        return {
            id: registro.idRegistro,
            nombre: nombre,
            rut: registro.bicycle?.owner ? registro.bicycle.owner.rut : '---',
            inicial: nombre.charAt(0).toUpperCase(),
            tagBici: `#${registro.bicycle?.id_bicicleta || '000'}`,
            horaEntrada: horaFormateada,
            tipo: esSalida ? 'Salida' : 'Ingreso',
            estado: esSalida ? 'Salida' : 'En recinto',
            ubicacion: registro.bicycleRack?.nombre || 'Sin asignar',
            fechaReferencia: fechaReferencia
        };
    });

    const controlAccesoFeed = controlAccesoFeedCompleto
        .sort((a, b) => new Date(b.fechaReferencia) - new Date(a.fechaReferencia))
        .slice(0, 5)
        .map(({ fechaReferencia, ...item }) => item);

    return {
        kpi: {
            totalBicicletas: TotalBicicletas,
            capacidadTotal: TotalCapacidad,
            ocupacionGlobal,
            ingresosHoy,
            salidasHoy
        },
        racks: datosRacks,
        actividad: controlAccesoFeed,
        graficos: {
            porHora: graficoHoras,
            semanal: graficoSemana
        }

    }
}

