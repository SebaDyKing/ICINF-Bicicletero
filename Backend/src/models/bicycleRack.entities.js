"use strict";
import { EntitySchema } from "typeorm";

const BicycleRack = new EntitySchema({
  name: "BicycleRack",
  tableName: "bicycleRack",
  columns: {
    id_bicicletero: {
      type: "int", // CAMBIO: Mismo error que 'central'. Se cambió de 'varchar' a 'int'
      primary: true,
      // CAMBIO: 'generated: true' SÍ funciona con 'int', pero no con 'varchar'
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    capacidad_maxima: {
      type: "int",
      // --- CAMBIO: Se borró la línea 'length: 100,'
      // La propiedad 'length' no es compatible con el tipo 'int' y causaba un error
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
      precision: 11,
      scale: 8,
      nullable: false,
    },
    id_central: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
    central: {
      type: "many-to-one",
      target: "Central",
      joinColumn: {
        name: "id_central",
        referencedColumnName: "id_central",
      },
      inverseSide: "bicycleRack",
    },
    almacenamientos: {
      type: "one-to-many",
      target: "store",
      inverseSide: "bicycleRack",
    },
  },
});

export default BicycleRack;