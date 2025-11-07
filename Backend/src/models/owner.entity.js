import { ChildEntity, Column, OneToMany } from "typeorm";
import { User } from "./user.entity.js";
import { Store } from "./store.entity.js";

@ChildEntity()
export class Owner extends User {
  @Column({ type: "varchar", length: 50, nullable: false })
  nombre;

  @Column({ type: "varchar", length: 50, nullable: false })
  apellido;

  @Column({ name: "qr_data", type: "varchar", length: 255, nullable: true })
  qrData;

  //permite que la relacion sea bidireccional 
  @OneToMany(() => Store, (store) => store.owner)
  stores;
}
