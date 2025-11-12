"use strict";
import { EntitySchema } from "typeorm";

export const Owner = new EntitySchema({
  name: "Owner",
  tableName: "owner",
  extends: "Users",

  columns: {
    rut: {
      type: "varchar",
      length: 12,
      primary: true,
      nullable: false,
    },
    nombre: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    apellido: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    qrData: {
      name: "qr_data",
      type: "varchar",
      length: 255,
      nullable: true,
    },
  },

  relations: {
    bicycles: {
      type: "one-to-many",
      target: "Bicycle",
      inverseSide: "owner",
    },
  },
});
