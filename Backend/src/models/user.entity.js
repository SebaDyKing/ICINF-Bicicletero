import { Entity, PrimaryColumn, Column, TableInheritance } from "typeorm";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class User {
  @PrimaryColumn({ type: "varchar", length: 12, nullable:false })
  rut;

  @Column({ type: "varchar", length: 100, nullable:false })
  email;

  @Column({ type: "varchar", length: 20, nullable:false })
  tipoUsuario;

  @Column({ type: "varchar", length: 254, nullable:false })
  contrasenia;

  @Column({ type: "varchar", length: 15, nullable:false })
  telefono;
}
