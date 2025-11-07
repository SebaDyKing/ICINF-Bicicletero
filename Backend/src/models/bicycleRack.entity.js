import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity
export class BicycleRack {
  @PrimaryGeneratedColumn({ name: "id_bicicletero" })
  id_bicicletero;

  @Column({ name: "capacidad_maxima", type: "int" })
  capacidad_maxima;

  @Column({ type: "decimal", precision: 10, scale: 8 })
  latitud;

  @Column({ type: "varchar", length: 100 })
  nombre;

  @OneToMany(() => Store, (store) => store.bicicleta)
  stores;
}
