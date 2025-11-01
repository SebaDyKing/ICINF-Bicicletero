"use strict";
import { EntitySchema } from "typeorm";
import BicycleRack from "./bicycleRack.entity";

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
      type: "datetime",
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
    id_bicicleta: {
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
        referencedColumnName: "rut_guardia"
      },
      inverseSide: "store",
    },
    bicycle: {
      type: "many-to-one",
      target: "bicycle",
      joinColumn: {
        name: "id_bicicleta",
        referencedColumnName: "id_bicicleta"
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

export default Almacenadas;