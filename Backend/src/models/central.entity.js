"use strict";
import { EntitySchema } from "typeorm";

export const Central = new EntitySchema({
  name: "Central",
  tableName: "central",
  extends: "Users",

  columns: {
    rut: {
      type: "varchar",
      length: 12,
      primary: true,
      nullable: false,
    },
  },
});
