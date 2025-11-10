
import { Entity, ChildEntity } from "typeorm";
import { User } from "./user.entity.js";

@ChildEntity()
export class Central extends User {
  //Hereda todas los campos de User
}
 
/* 
"use strict";
import { EntitySchema } from "typeorm";
import { User } from "./user.entity";

export const Central = new EntitySchema({
  name: "Central",
  target: User,
  extends: "User",

  columns: {},
});
*/