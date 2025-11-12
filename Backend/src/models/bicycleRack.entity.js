"use strict";
import { EntitySchema } from "typeorm";

export const BicycleRack = new EntitySchema({
  name: "BicycleRack",
  tableName: "bicycleRack",

  columns: {
    id_bicicletero: {
      name: "id_bicicletero",
      type: "int",
      primary: true,
      generated: "increment",
    },
    nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    capacidad_maxima: {
      name: "capacidad_maxima",
      type: "int",
      nullable: false,
    },
    latitud: {
      type: "decimal",
      precision: 10,
      scale: 8,
      nullable: false,
    },
    longitud: {
      type: "decimal",
      precision: 10,
      scale: 8,
      nullable: false,
    },
    imagen:{
      type: "varchar",
      length:200,
      nullable: true
    }
  },

  relations: {
    stores: {
      type: "one-to-many",
      target: "Store",
      inverseSide: "bicycleRack",
    },
  },
});
