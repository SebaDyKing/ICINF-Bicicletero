 
import { ChildEntity, Column, OneToMany } from "typeorm";
import { User } from "./user.entity.js";
import { Store } from "./store.entity.js";

@ChildEntity()
export class Guard extends User {
  @Column({type: 'varchar', length:50, nullable:false})
  nombre;

  @Column({type: 'varchar', length:50, nullable:false})
  apellido;

  @OneToMany(() => Store, store => store.guard) 
  stores;
}

/*
"use strict";
import { EntitySchema } from "typeorm";
import { User } from "./user.entity";

export const Guard = new EntitySchema({
  name: "Guard",  
  target: User,
  type: "entity-child",
  discriminatorValue: "Guard", // Valor en la columna type

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
  },

  relations: {
    stores: {
      type: "one-to-many",
      target: "Store",
      inverseSide: "guard",
    },
  },
});
*/