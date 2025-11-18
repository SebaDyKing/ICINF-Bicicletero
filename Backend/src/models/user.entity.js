"use strict";
import { EntitySchema } from "typeorm";

export const Users = new EntitySchema({
  name: "Users",
  tableName: "users",

  inheritance: {
    pattern: "CTI",
    column: {
      name: "tipo_usuario",
      type: "varchar",
    },
  },
  columns: {
    rut: {
      type: "varchar",
      length: 12,
      primary: true,
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    contrasenia: {
      type: "varchar",
      length: 254,
      nullable: false,
    },
    telefono: {
      type: "varchar",
      length: 15,
      nullable: false,
    },
    tipo_usuario: {
      type: "varchar",
      nullable: false,
    },
    verificado: {
      type: "boolean",
      default: false,
    },
    codigo_verificacion: {
      type: "varchar",
      length: 6,
      nullable: true,
    },
  },
});
