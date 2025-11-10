
import { Entity, PrimaryColumn, Column, TableInheritance } from "typeorm";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class User {
  @PrimaryColumn({ type: "varchar", length: 12, nullable:false })
  rut;

  @Column({ type: "varchar", length: 100, nullable:false })
  email;

  @Column({ type: "varchar", length: 254, nullable:false })
  contrasenia;

  @Column({ type: "varchar", length: 15, nullable:false })
  telefono;
}

/* 
"use strict";
import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name: "User",
  tableName: "user",

  columns: {
    rut: {
      type: "varchar",
      length: 12,
      primary: true,
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    contrasenia: {
      type: "varchar",
      length: 254,
      nullable: false,
    },
    telefono: {
      type: "varchar",
      length: 15,
      nullable: false,
    },
  },

  inheritance: {
    pattern: "STI", 
    column: { type: "varchar", name: "type" }, // Para diferenciar a los hijos
  },
});
*/