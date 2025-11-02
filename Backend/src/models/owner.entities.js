"use strict";
import { EntitySchema } from "typeorm";
// --- CAMBIO: Se agregó la extensión '.js' al import
import Bicycle from "./bicycle.entities.js";

const Owner = new EntitySchema({
  name: "Owner",
  tableName: "owner",
  columns: {
    rut_owner: {
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
    rol: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    telefono: {
      type: "varchar",
      length: 12,
      nullable: false,
    },
    correo: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    /*
    contrasenia: {
      type: "varchar",
      length: 200, 
      nullable: false,
    },
    */ 
    datos_qr: {
      type: "varchar",
      length: 200,
      nullable: false,
    },
  },
  relations: {
    Bicycle: {
      type: "one-to-many",
      target: "Bicycle",
      inverseSide: "owner",
    },
  },
  indices: [
    {
      name: "IDX_OWNER_RUT",
      columns: ["rut_owner"],
      unique: true,
    },
  ],
});

export default Owner;