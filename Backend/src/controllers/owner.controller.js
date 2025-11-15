"use strict";
import { validateOwnerBody } from "../validations/owner.validations.js";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../Handlers/responseHandlers.js";
import { AppDataSource } from "../config/configDb.js";
import { Owner } from "../models/owner.entity.js";
import { Users } from "../models/user.entity.js";

export async function createOwner(req, res) {
  try {
    const { error } = validateOwnerBody(req.body);
    if (error) {
      return handleErrorClient(
        res,
        400,
        "Los datos ingresados no son validos",
        error.message
      );
    }

    const ownerRepository = AppDataSource.getRepository(Owner);
    const userRepository = AppDataSource.getRepository(Users);

    const { rut, email, contrasenia, telefono, nombre, apellido, qrData } =
      req.body;

    const tipo_usuario = "Owner";

    const isValid =
      (await ownerRepository.findOneBy({ rut })) ||
      (await userRepository.findOneBy({ rut }));

    if (isValid)
      return handleErrorClient(
        res,
        409,
        `El RUT ${rut} ya está registrado.`,
        "Error"
      );

    const newOwner = ownerRepository.create({
      rut,
      nombre,
      apellido,
      qrData,
    });

    const newUser = userRepository.create({
      rut,
      email,
      telefono,
      contrasenia,
      tipo_usuario,
    });

    await ownerRepository.save(newOwner);
    await userRepository.save(newUser);

    const ownerData = {
      rut: newOwner.rut,
      email: newUser.email,
      contrasenia: newUser.contrasenia,
      telefono: newUser.telefono,
      nombre: newOwner.nombre,
      apellido: newOwner.apellido,
      tipo_usuario: newUser.tipo_usuario,
    };

    handleSuccess(
      res,
      201,
      "Dueño de bicicleta creado exitosamente",
      ownerData
    );
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}

export async function getOwner(req, res) {
  try {
    const { rut } = req.params;

    const ownerRepository = AppDataSource.getRepository(Owner);
    const userRepository = AppDataSource.getRepository(Users);

    const owner = await ownerRepository.findOneBy({ rut });
    const user = await userRepository.findOneBy({ rut });

    if (!owner || !user) {
      return handleErrorClient(
        res,
        404,
        `El dueño de bicicleta con RUT ${rut} no fue encontrado.`
      );
    }

    const ownerData = {
      rut: owner.rut,
      email: user.email,
      telefono: user.telefono,
      nombre: owner.nombre,
      apellido: owner.apellido,
      qrData: owner.qrData,
      tipo_usuario: user.tipo_usuario,
    };

    handleSuccess(res, 200, "Dueño de bicicleta encontrado", ownerData);
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}

export async function getAllOwners(req, res) {
  try {
    const ownerRepository = AppDataSource.getRepository(Owner);
    const userRepository = AppDataSource.getRepository(Users);

    // Obtenemos todos los registros de "Owners"
    const owners = await ownerRepository.find();
    // Obtenemos todos los "Users" que también son "Owners"
    const users = await userRepository.findBy({ tipo_usuario: "Owner" });

    // Creamos un "Mapa" de usuarios para buscarlos por RUT
    const userMap = new Map(users.map((user) => [user.rut, user]));

    const combinedOwners = owners.map((owner) => {
        const user = userMap.get(owner.rut);

        if (!user) {
          console.warn(
            `Inconsistencia de datos: Owner con RUT ${owner.rut} no tiene un 'User' asociado.`
          );
          return null;
        }

        return {
          rut: owner.rut,
          email: user.email,
          telefono: user.telefono,
          nombre: owner.nombre,
          apellido: owner.apellido,
          qrData: owner.qrData,
          tipo_usuario: user.tipo_usuario,
        };
      }).filter(Boolean); // Filtramos cualquier 'null' que haya resultado de una inconsistencia

    handleSuccess(
      res,
      200,
      "Dueños de bicicleta obtenidos exitosamente",
      combinedOwners
    );
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}





/*
export async function registerOwner(req, res) {
  try {
    const ownerData = req.body;

    const { error } = validateOwnerBody(registerOwner);
    if (error) {
      return handleErrorClient(
        res,
        400,
        "Credenciales invalidas",
        error.message
      );
    }

    const [user, errorRegister] = await registerOwnerService(ownerData); //!Crear el Service

    if (errorRegister) {
      return handleErrorClient(
        res,
        400,
        "Error al registrar usuario",
        errorRegister
      );
    }

    handleSuccess(res, 201, "Usuario registrado exitosamente", user);
  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}*/
