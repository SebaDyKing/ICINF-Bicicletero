
import { ChildEntity, Column, OneToMany } from "typeorm";
import { User } from "./user.entity.js";
import { Bicycle } from "./bicycle.entity.js";

@ChildEntity()
export class Owner extends User {
  @Column({ type: "varchar", length: 50, nullable: false })
  nombre;

  @Column({ type: "varchar", length: 50, nullable: false })
  apellido;

  @Column({ name: "qr_data", type: "varchar", length: 255, nullable: true })
  qrData;

  //permite que la relacion sea bidireccional 
  @OneToMany(() => Bicycle, bicycle => bicycle.owner)
  bicycles;
}

/* 
"use strict";
import { EntitySchema } from "typeorm";
import { User } from "./user.entity";

export const Owner = new EntitySchema({
  name: "Owner",
  target: User,
  type: "entity-child",
  discriminatorValue: "Owner", // Valor en la columna type

  columns: {
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
    qrData: {
      name: "qr_data",
      type: "varchar",
      length: 255,
      nullable: true,
    },
  },

  relations: {
    bicycles: {
      type: "one-to-many",
      target: "Bicycle",
      inverseSide: "owner",
    },
  },
});
 */