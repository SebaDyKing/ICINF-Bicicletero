import {Column, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, Entity } from "typeorm";
import { Owner } from "./owner.entity.js";
import { Store } from "./store.entity.js";

@Entity()
export class Bicycle {
  @PrimaryColumn({ type: "varchar", length: 15 })
  id_bicicleta;

  @Column({ type: "varchar", length: 30 })
  color;

  @Column({ type: "varchar", length: 50 })
  modelo;

  //Relaciones
  @ManyToOne(() => Owner, owner => owner.bicycles)
  @JoinColumn({ name: "rut_duenio", referencedColumnName: "rut" })
  owner;

  @OneToMany(() => Store, store => store.bicycle)
  stores;
}

/* 
"use strict";
import { EntitySchema } from "typeorm";

export const Bicycle = new EntitySchema({
  name: "Bicycle",
  tableName: "bicycle",
  columns: {
    id_bicicleta: {
      type: "varchar",
      length: 15,
      primary: true,
    },
    color: {
      type: "varchar",
      length: 30,
    },
    modelo: {
      type: "varchar",
      length: 50,
    },
  },

  relations: {
    owner: {
      type: "many-to-one",
      target: "Owner",
      inverseSide: "bicycles",
      joinColumn: {
        name: "rut_duenio",
        referencedColumnName: "rut"
      },
    },
    stores: {
      type: "one-to-many",
      target: "Store",
      inverseSide: "bicycle",
    },
  },
});
*/