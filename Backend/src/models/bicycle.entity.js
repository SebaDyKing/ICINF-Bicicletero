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