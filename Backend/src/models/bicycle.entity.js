"use strict";
import { EntitySchema } from "typeorm";

export const Bicycle = new EntitySchema({
  name: "Bicycle",
  tableName: "bicycle",

  columns: {
    id_bicicleta: { 
      primary: true,
      type: "int",
      generated: true,
    },
    alias: {
      type: "varchar",
      length: 10,
      nullable: true,
    },
    color: {
      type: "varchar",
      length: 30,
    },
    marca: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    modelo: {
      type: "varchar",
      length: 50,
    },
    tipo: {
      type: "varchar",
      length: 30,
      nullable: false,
    },
    fecha_creacion: {
      type: "timestamp",
      createDate: true,
    }
  },
  relations: {
    owner: {
      type: "many-to-one",
      target: "Owner",
      inverseSide: "bicycles",
      joinColumn: {
        name: "rut_duenio",
        referencedColumnName: "rut",
      },
      onDelete: "CASCADE",
    },
    stores: {
      type: "one-to-many",
      target: "Store",
      inverseSide: "bicycle",
    },
  },
});
