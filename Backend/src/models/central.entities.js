"use strict";
import { EntitySchema } from "typeorm";

const Central = new EntitySchema({
  name: "Central",
  tableName: "central",
  columns: {
    id_central: {
      type: "int", // CAMBIO: El tipo se cambió de 'varchar' a 'int'
      primary: true,
      // CAMBIO: 'generated: true' (autoincrementable) SÍ funciona con 'int', 
      // pero no con 'varchar', lo que causaba el error "sintaxis en o cerca de «NOT»"
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