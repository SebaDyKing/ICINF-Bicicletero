"use strict";
import { EntitySchema } from "typeorm";

const Bicycle = new EntitySchema({
  name: "Bicycle",
  tableName: "bicycles",
  columns: {
    id_bicycle: {
      type: "varchar",
      length: 15,
      primary: true,
      nullable: false,
      unique: true,
    },
    color: {
      type: "varchar",
      length: 20,
      nullable: false,
    },
    tipo: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    modelo: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    rut_owner: {
        type: "varchar",
        length: 15,
        nullable: false,
    }
  },
  relations: {
    owner: {
      type: "many-to-one",
      target: "Owner",
      joinColumn: {
        name: "rut_owner",
        referencedColumnName: "rut_owner",
      },
      inverseSide: "bicycles",
    },
  },
  indices: [
    {
      name: "IDX_ID_BICYCLE",
      columns: ["id_bicycle"],
      unique: true,
    },
    {
      name: "IDX_RUT_OWNER",
      columns: ["rut_owner"],
    },
  ],
});

export default Bicycle;
