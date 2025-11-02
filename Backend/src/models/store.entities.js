"use strict";
import { EntitySchema } from "typeorm";
// --- CAMBIO: Se agregó la extensión '.js' al import
import BicycleRack from "./bicycleRack.entities.js";

const Store = new EntitySchema({
  name: "Store",
  tableName: "store",
  columns: {
    id_registro: {
      type: "int",
      primary: true,
      generated: true,
    },
    tipo_movimiento: {
      type: "varchar",
      length: 50,
      nullable: false, 
    },
    fecha: {
      // --- CAMBIO: El tipo 'datetime' no existe en PostgreSQL, se cambió a 'timestamp'
      type: "timestamp",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
    id_bicicletero: {
      type: "int",
      nullable: false,
    },
    rut_guardia: {
      type: "varchar",
      length: 15,
      nullable: false,
    },
    // --- CAMBIO: Se cambió el nombre de 'id_bicicleta' a 'id_bicycle' para que coincida con el modelo 'bicycle.entities.js'
    id_bicycle: {
      type: "varchar",
      length: 15,
      nullable: false,
    },
  },
  relations: {
    BicycleRack: {
      type: "many-to-one",
      target: "bicycleRack",
      joinColumn: {
        name: "id_bicicletero",
        referencedColumnName: "id_bicicletero"
      },
      inverseSide: "store",
    },
    guard: {
      type: "many-to-one",
      target: "guard",
      joinColumn: {
        name: "rut_guardia",
        // --- CAMBIO: La columna PK en 'guard.entities.js' es 'rut_guard' (sin 'ia')
        // Se corrigió la referencia para evitar el error 'rut_guardia was not found'
        referencedColumnName: "rut_guard"
      },
      inverseSide: "store",
    },
    bicycle: {
      type: "many-to-one",
      target: "bicycle",
      joinColumn: {
        // --- CAMBIO: Mismo error de tipeo que en 'columns'
        name: "id_bicycle",
        // --- CAMBIO: La columna PK en 'bicycle.entities.js' es 'id_bicycle'
        // Se corrigió la referencia para evitar el error 'id_bicicleta was not found'
        referencedColumnName: "id_bicycle"
      },
      inverseSide: "store",
    },
  },
  indices: [
    {
      name: "IDX_ALMACEN_FECHA",
      columns: ["fecha"],
    },
    {
      name: "IDX_STORE_BICYCLE_RACK",
      columns: ["id_bicicletero"],
    },
  ],
});

// --- CAMBIO: El archivo exportaba 'Almacenadas' por error
// Se corrigió para que exporte 'Store', que es lo que se define arriba
export default Store;