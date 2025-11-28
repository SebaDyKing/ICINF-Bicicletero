"use strict";
import { EntitySchema } from "typeorm";

export const Reports = new EntitySchema({
  name: "Reports",       
  tableName: "reports", 

  columns: {
    id_informe: {
      name: "ID_Informe", 
      type: "int",
      primary: true,
      generated: "increment",
    },
    fecha: {
      name: "Fecha",
      type: "timestamp",
      createDate: true,
    },
    descripcion: {
      name: "Descripcion",
      type: "text",
      nullable: true,
    },
    bicicletero: {
      name: "Bicicletero",
      type: "varchar",
      length: 100,
      nullable: true,
    },
    informeURL: {
      name: "InformeURL",
      type: "varchar",
      length: 255,
      nullable: true,
    },
    imagenesURL: {
      name: "ImagenesURL",
      type: "simple-json",
      nullable: true,
    },
  },

  relations: {
    users: { 
      type: "many-to-many",
      target: "Users", 
      inverseSide: "reports", 
      
      joinTable: {
        name: "userReports", 
        
        joinColumn: {
          name: "ID_Informe",
          referencedColumnName: "id_informe", 
        },
        
        inverseJoinColumn: {
          name: "Rut",
          referencedColumnName: "rut",
        },
      },
    },
  },
});