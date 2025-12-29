import "dotenv/config";
import { AppDataSource } from "./config/configDb.js";
import { BicycleRack } from "./models/bicycleRack.entity.js";
import { Store } from "./models/store.entity.js";
import { Bicycle } from "./models/bicycle.entity.js";
import { Owner } from "./models/owner.entity.js";
import { Guard } from "./models/guard.entity.js";

const seedTestingDatabase = async () => {
  try {
    console.log("🌱 Conectando a la base de datos...");
    await AppDataSource.initialize();
    console.log("✅ Conectado.");

    // ==========================================
    // 1. OBTENER REPOSITORIOS
    // ==========================================
    const rackRepo = AppDataSource.getRepository(BicycleRack);
    const ownerRepo = AppDataSource.getRepository(Owner);
    const guardRepo = AppDataSource.getRepository(Guard);
    const bikeRepo = AppDataSource.getRepository(Bicycle);
    const storeRepo = AppDataSource.getRepository(Store);

    // ==========================================
    // 2. LIMPIAR BASE DE DATOS
    // ==========================================
    console.log("🧹 Limpiando tablas antiguas...");
    await storeRepo.createQueryBuilder().delete().execute();
    await bikeRepo.createQueryBuilder().delete().execute();
    await ownerRepo.createQueryBuilder().delete().execute();
    await guardRepo.createQueryBuilder().delete().execute();
    await rackRepo.createQueryBuilder().delete().execute();

    // ==========================================
    // 3. CREAR BICICLETEROS (4 RACKS)
    // ==========================================
    console.log("🏗️ Creando 4 bicicleteros...");
    const racksData = [
      { nombre: "Bicicletero Central", capacidad_maxima: 15, latitud: -36.8222, longitud: -73.0122 },
      { nombre: "Bicicletero FACE", capacidad_maxima: 15, latitud: -36.8235, longitud: -73.0145 },
      { nombre: "Bicicletero Idiomas", capacidad_maxima: 15, latitud: -36.8210, longitud: -73.0110 },
      { nombre: "Bicicletero Biblioteca", capacidad_maxima: 15, latitud: -36.8240, longitud: -73.0150 }
    ];
    const racks = await rackRepo.save(racksData);
    console.log(`✅ ${racks.length} bicicleteros creados`);

    // ==========================================
    // 4. CREAR GUARDIA DE PRUEBA
    // ==========================================
    console.log("👮 Creando guardia de prueba...");
    const guard = await guardRepo.save({
      rut: "21.589.945-4",
      email: "guardia@ubb.cl",
      contrasenia: "Guardia123",
      telefono: "+56911111111",
      tipo_usuario: "Guardia",
      verificado: true,
      nombre: "Carlos",
      apellido: "Seguridad"
    });
    console.log(`✅ Guardia creado: ${guard.nombre} ${guard.apellido}`);

    // ==========================================
    // 5. CREAR 8 USUARIOS (2 por bicicletero)
    // ==========================================
    console.log("👥 Creando 8 usuarios (2 por bicicletero)...");
    const usuariosData = [
      // Bicicletero Central
      { nombre: "Ana", apellido: "Silva", rut: "20.111.111-1", email: "ana.silva@alumnos.ubb.cl" },
      { nombre: "Luis", apellido: "González", rut: "20.222.222-2", email: "luis.gonzalez@alumnos.ubb.cl" },

      // Bicicletero FACE
      { nombre: "María", apellido: "Rojas", rut: "20.333.333-3", email: "maria.rojas@alumnos.ubb.cl" },
      { nombre: "José", apellido: "Pérez", rut: "20.444.444-4", email: "jose.perez@alumnos.ubb.cl" },

      // Bicicletero Idiomas
      { nombre: "Pedro", apellido: "Muñoz", rut: "20.555.555-5", email: "pedro.munoz@alumnos.ubb.cl" },
      { nombre: "Carla", apellido: "Díaz", rut: "20.666.666-6", email: "carla.diaz@alumnos.ubb.cl" },

      // Bicicletero Biblioteca
      { nombre: "Fernanda", apellido: "Vásquez", rut: "20.777.777-7", email: "fernanda.vasquez@alumnos.ubb.cl" },
      { nombre: "Diego", apellido: "Castro", rut: "20.888.888-8", email: "diego.castro@alumnos.ubb.cl" }
    ];

    const ownersCreated = [];
    for (const userData of usuariosData) {
      const owner = await ownerRepo.save({
        ...userData,
        contrasenia: "pass123",
        telefono: `+569${Math.floor(Math.random() * 90000000) + 10000000}`,
        tipo_usuario: "Owner",
        verificado: true
      });
      ownersCreated.push(owner);
    }
    console.log(`✅ ${ownersCreated.length} usuarios creados`);

    // ==========================================
    // 6. CREAR BICICLETAS (1 por usuario)
    // ==========================================
    console.log("🚲 Creando bicicletas...");
    const colores = ["Rojo", "Azul", "Negro", "Verde", "Blanco", "Gris", "Naranja", "Morado"];
    const modelos = ["Marlin 5", "Oxford", "Gt Aggressor", "P3", "Cannondale", "Trek X", "Giant"];

    const bikesCreated = [];
    for (const owner of ownersCreated) {
      const bike = await bikeRepo.save({
        marca: "Trek",
        color: colores[Math.floor(Math.random() * colores.length)],
        modelo: modelos[Math.floor(Math.random() * modelos.length)],
        tipo: "Montaña",
        owner: owner
      });
      bikesCreated.push(bike);
    }
    console.log(`✅ ${bikesCreated.length} bicicletas creadas`);

    // ==========================================
    // 7. ACTIVIDAD RECIENTE (SOLO 15 MOVIMIENTOS EN TOTAL)
    // ==========================================
    console.log("📊 Generando actividad (10 ingresos + 5 salidas)...");
    const allMovements = [];
    const ahora = new Date();

    // 1. 7 INGRESOS ANTIGUOS (Para completar los 10 totales) - Hace 60-40 min
    for (let i = 0; i < 7; i++) {
      const bike = bikesCreated[i % bikesCreated.length];
      const rack = racks[i % racks.length];

      const fechaIngreso = new Date(ahora);
      fechaIngreso.setMinutes(ahora.getMinutes() - (60 - i * 3)); // Hace 60, 57... minutos

      allMovements.push({
        tipoMovimiento: "Ingreso",
        fechaIngreso: fechaIngreso,
        fechaSalida: null,
        bicycle: bike,
        bicycleRack: rack,
        guard: guard
      });
    }

    // 2. 5 SALIDAS (Hace 30-15 min)
    for (let i = 0; i < 5; i++) {
      // Usamos las bicis 0-4 que ya ingresaron en el paso anterior
      const bike = bikesCreated[i];
      const rack = racks[i % racks.length];

      const fechaIngresoAntiguo = new Date(ahora);
      fechaIngresoAntiguo.setMinutes(ahora.getMinutes() - 90); // Entraron hace mucho

      const fechaSalida = new Date(ahora);
      fechaSalida.setMinutes(ahora.getMinutes() - (30 - i * 3)); // Salieron hace 30, 27... 18 min

      allMovements.push({
        tipoMovimiento: "Salida",
        fechaIngreso: fechaIngresoAntiguo,
        fechaSalida: fechaSalida,
        bicycle: bike,
        bicycleRack: rack,
        guard: guard
      });
    }

    // 3. 3 INGRESOS MUY RECIENTES (Para que salgan arriba) - Hace 5-1 min
    // Usamos bicis diferentes o las que salieron
    for (let i = 0; i < 3; i++) {
      const bike = bikesCreated[(i + 5) % bikesCreated.length]; // Bicis distintas
      const rack = racks[i % racks.length];

      const fechaIngreso = new Date(ahora);
      fechaIngreso.setMinutes(ahora.getMinutes() - (5 - i * 2)); // Hace 5, 3, 1 minuto

      allMovements.push({
        tipoMovimiento: "Ingreso",
        fechaIngreso: fechaIngreso,
        fechaSalida: null,
        bicycle: bike,
        bicycleRack: rack,
        guard: guard
      });
    }

    await storeRepo.save(allMovements);
    console.log(`✅ ${allMovements.length} movimientos totales creados (10 ingresos + 5 salidas)`);

    // ==========================================
    // RESUMEN FINAL
    // ==========================================
    console.log("\n" + "=".repeat(50));
    console.log("✨ BASE DE DATOS DE TESTING POBLADA CON ÉXITO");
    console.log("=".repeat(50));
    console.log(`📊 Bicicleteros: ${racks.length}`);
    console.log(`👥 Usuarios: ${ownersCreated.length}`);
    console.log(`🚲 Bicicletas: ${bikesCreated.length}`);
    console.log(`� Total movimientos: ${allMovements.length} (10 ingresos + 5 salidas)`);
    console.log(`🅿️ Bicicletas estacionadas: 10`);
    console.log("=".repeat(50));
    console.log("\n📋 CREDENCIALES DE PRUEBA:");
    console.log("Guardia: guardia@ubb.cl / Guardia123");
    console.log("Usuarios: [nombre].[apellido]@alumnos.ubb.cl / pass123");
    console.log("=".repeat(50) + "\n");

  } catch (error) {
    console.error("❌ Error FATAL:", error);
  } finally {
    await AppDataSource.destroy();
    process.exit();
  }
};

seedTestingDatabase();
