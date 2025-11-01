"use strict";
import { EntitySchema } from "typeorm";

const Central = new EntitySchema({
  name: "Central",
  tableName: "central",
  columns: {
    id_central: {
      type: "varchar",
      length: 15,
      primary: true,
      unique: true,
      generated: true,
    },
    correo: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    contrasenia: {
      type: "varchar",
      length: 200,
      nullable: false,
    },
    telefono: {
      type: "varchar",
      length: 12,
      nullable: true,
    },
    direccion: {
      type: "varchar",
      length: 200,
      nullable: true,
    },
  },
  relations: {
    guard: {
      type: "one-to-many",
      target: "Guard",
      inverseSide: "central",
    },
    bicycleRack: {
      type: "one-to-many",
      target: "bicycleRack",
      inverseSide: "central",
    },
  },
});

export default Central;
