"use strict";
import { EntitySchema } from "typeorm";

export const Guard = new EntitySchema({
  name: "Guard",
  tableName: "guard",
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
  },

  relations: {
    stores: {
      type: "one-to-many",
      target: "Store",
      inverseSide: "guard",
    },
  },
});
