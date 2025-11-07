import { Entity, ChildEntity } from "typeorm";
import { User } from "./user.entity.js";

@ChildEntity()
export class Central extends User {
  //Hereda todas los campos de User
}
