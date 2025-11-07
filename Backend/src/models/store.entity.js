import { Entity, ManyToOne, Column, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { BicycleRack } from "./bicycleRack.entity.js";
import { Bicycle } from "./bicycle.entity.js";

@Entity
export class Store {
  @PrimaryGeneratedColumn({ name: "id_registro" })
  idRegistro;

  @Column({ name: "tipo_movimiento", type: "varchar", length: 10 })
  tipoMovimiento;

  @Column({ name: "fecha_salida", type: "timestamp", nullable: true })
  fechaSalida;

  @Column({ name: "fecha_ingreso", type: "timestamp", nullable: true })
  fechaIngreso;

  @ManyToOne(() => BicycleRack, bicycleRack => bicycleRack.stores)
  @JoinColumn({ name: "id_bicicletero" })
  bicycleRack;

  @ManyToOne(() => Guard, guard => guard.stores)
  @JoinColumn({ name: "id_bicicletero" })
  guard;
  
  @ManyToOne(() => Bicycle, bicycle => bicycle.stores)
  @JoinColumn({ name: "id_bicicletero" })
  bicycle;
}
