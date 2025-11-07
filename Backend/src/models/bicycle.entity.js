import { Column, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Owner } from "./owner.entity.js";

export class Bicycle {
  @PrimaryColumn({type: 'varchar', length: 15})
  id_bicicleta;

  @Column({type: 'varchar', length:30})
  color

  @Column({type: 'varchar', length:50})
  modelo

  //Relaciones
  @ManyToOne(() => Owner, owner => owner.bicycle)
  bicycles

  @JoinColumn({name: 'rut_dueño'})
  owner

  @OneToMany(() => Store, store => store.bicycle)
  stores
}