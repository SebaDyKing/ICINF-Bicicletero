
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Store } from "./store.entity.js";

@Entity
export class BicycleRack {
  @PrimaryGeneratedColumn({ name: "id_bicicletero" })
  id_bicicletero;

  @Column({ type: "varchar", length: 100, nullable: false })
  nombre;

  @Column({ name: "capacidad_maxima", type: "int", nullable: false })
  capacidad_maxima;

  @Column({ type: "decimal", precision: 10, scale: 8, nullable: false })
  latitud;

  @Column({ type: "decimal", precision: 10, scale: 8, nullable: false })
  longitud;

  @OneToMany(() => Store, (store) => store.bicycleRack)
  stores;
}
 
/* 
"use strict";
import { EntitySchema } from "typeorm";

export const BicycleRack = new EntitySchema({
  name: "BicycleRack",
  tableName: "bicycleRack",
  columns: {
    id_bicicletero: {
      name: "id_bicicletero",
      type: "int",
      primary: true,
      generated: "increment",
    },
    nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    capacidad_maxima: {
      name: "capacidad_maxima",
      type: "int",
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
      precision: 10,
      scale: 8,
      nullable: false,
    },
  },

  relations: {
    stores: {
      type: "one-to-many",
      target: "Store",
      inverseSide: "bicycleRack",
    },
  },
});*/