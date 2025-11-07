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
