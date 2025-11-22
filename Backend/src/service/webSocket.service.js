import { AppDataSource } from "../config/configDb.js";
import { Store } from "../models/store.entity.js";
import { BicycleRack } from "../models/bicycleRack.entity.js";
import { IsNull, Between, MoreThanOrEqual } from "typeorm";

export const actualizarDashboard = async (io) => {
    try {
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

            const capacidadTotal = rack.capacidad || 15;
            const porcentaje = Math.round((ocupados / capacidadTotal) * 100);

            return {
                id_bicicletero: rack.id_bicicletero,
                nombre: rack.nombre,
                ocupados: ocupados,
                capacidad: capacidadTotal,
                porcentaje_ocupacion: porcentaje,
                estado: porcentaje > 90 ? "ALTO" : porcentaje > 60 ? "NORMAL" : "Bajo"
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

        const actividadFeed = ultimosMovimientos.map(mov => ({
            id: mov.idRegistro,
            tipo: mov.tipoMovimiento,
            bici: `Bici #${mov.bicycle?.id_bicicleta || '?' }`,
            hora: mov.tipoMovimiento === 'Salida' ? mov.fechaSalida : mov.fechaIngreso,
            ubicacion: mov.bicycleRack?.nombre || ''
        }));

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

        const payload = {
            kpi: {
                totalBicicletas: TotalBicicletas,
                capacidadTotal: TotalCapacidad,
                ocupacionGlobal: ocupacionGlobal,
                ingresosHoy: ingresosHoy,
                salidasHoy: salidasHoy
            },
            racks: datosRacks,
            actividad: actividadFeed,
            graficos: {
                porHora: graficoHoras,
                semanal: graficoSemana
            }
        };

        io.emit('dashboard:actualizacion', payload);

    } catch (error) {
        console.error("WebSocket Error:", error);
    }
};