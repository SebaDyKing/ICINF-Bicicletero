"use strict";
import { EntitySchema } from "typeorm";

const Guard = new EntitySchema({
  name: "Guard",
  tableName: "guard",
  columns: {
    rut_guard: {
      type: "varchar",
      length: 15,
      primary: true,
      nullable: false,
      unique: true,
    },
    nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    apellido: {
      type: "varchar",
      length: 100,
      nullable: false,
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
  },
  relations: {
    Store: {
      type: "one-to-many",
      target: "Store",
      inverseSide: "guard",
    },
  },
  indices: [
    {
      name: "IDX_GUARD_RUT",
      columns: ["rut_guard"],
      unique: true,
    },
  ],
});

export default Guard;
