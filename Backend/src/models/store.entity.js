
import { Entity, ManyToOne, Column, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn } from "typeorm";
import { BicycleRack } from "./bicycleRack.entity.js";
import { Bicycle } from "./bicycle.entity.js";
import { Guard } from "./guard.entity.js";

@Entity()
export class Store {
  @PrimaryGeneratedColumn({ name: "id_registro" })
  idRegistro;

  @Column({ name: "tipo_movimiento", type: "varchar", length: 10 })
  tipoMovimiento;

  @CreateDateColumn({ name: "fecha_ingreso", type: "timestamp" })
  fechaIngreso;

  @Column({ name: "fecha_salida", type: "timestamp", nullable: true })
  fechaSalida;

  @ManyToOne(() => BicycleRack, bicycleRack => bicycleRack.stores)
  @JoinColumn({ name: "id_bicicletero", referencedColumnName: 'id_bicicletero' })
  bicycleRack;

  @ManyToOne(() => Guard, guard => guard.stores)
  @JoinColumn({ name: "rut_guardia", referencedColumnName: 'rut' })
  guard;
  
  @ManyToOne(() => Bicycle, bicycle => bicycle.stores)
  @JoinColumn({ name: "id_bicicleta", referencedColumnName: 'id_bicicleta'  })
  bicycle;
}

/* 
"use strict";
import { EntitySchema } from "typeorm";

export const Store = new EntitySchema({
  name: "Store",
  tableName: "store",
  columns: {
    idRegistro: {
      name: "id_registro",
      type: "int",
      primary: true,
      generated: "increment",
    },
    tipoMovimiento: {
      name: "tipo_movimiento",
      type: "varchar",
      length: 10,
    },
    fechaIngreso: {
      name: "fecha_ingreso",
      type: "timestamp",
      createDate: true,
    },
    fechaSalida: {
      name: "fecha_salida",
      type: "timestamp",
      nullable: true,
    },
  },

  relations: {
    bicycleRack: {
      type: "many-to-one",
      target: "BicycleRack",
      inverseSide: "stores",
      joinColumn: {
        name: "id_bicicletero",
        referencedColumnName: "id_bicicletero",
      },
    },
    guard: {
      type: "many-to-one",
      target: "Guard",
      inverseSide: "stores",
      joinColumn: {
        name: "rut_guardia",
        referencedColumnName: "rut"
      },
    },
    bicycle: {
      type: "many-to-one",
      target: "Bicycle",
      inverseSide: "stores",
      joinColumn: {
        name: "id_bicicleta",
        referencedColumnName: "id_bicicleta",
      },
    },
  },
});*/