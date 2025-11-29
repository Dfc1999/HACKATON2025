// Azure Function para conexión con MongoDB Atlas y operaciones CRUD del agente de reconocimiento de caras

const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_ATLAS_URI;
const dbName = process.env.MONGO_DB_NAME || "hospital_ai";
const collectionName = "agente_reconocimiento_caras";

let client;
let db;

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log("Conectado a MongoDB Atlas");
  }
  return db.collection(collectionName);
}

module.exports = async function (context, req) {
  context.log("Solicitud recibida en /conection_db");

  try {
    const collection = await connectToMongo();
    const { action, data, filter, id } = req.body;

    let result;

    switch (action) {
      case "create":
        result = await collection.insertOne({
          nombre: data.nombre,
          apellido: data.apellido,
          direccion: data.direccion,
          numero: data.numero,
          referencia_nombre: data.referencia_nombre,
          referencia_numero: data.referencia_numero,
          vectores: data.vectores,
          datos_medicos: data.datos_medicos,
          enfermedades_base: data.enfermedades_base,
          createdAt: new Date(),
        });
        context.res = {
          status: 201,
          body: { message: "Agente creado exitosamente", id: result.insertedId },
        };
        break;

      case "read":
        result = filter
          ? await collection.find(filter).toArray()
          : await collection.find().toArray();
        context.res = {
          status: 200,
          body: result,
        };
        break;

      case "update":
        if (!id) throw new Error("Se requiere el ID para actualizar");
        result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: data }
        );
        context.res = {
          status: 200,
          body: { message: "Agente actualizado", modifiedCount: result.modifiedCount },
        };
        break;

      case "delete":
        if (!id) throw new Error("Se requiere el ID para eliminar");
        result = await collection.deleteOne({ _id: new ObjectId(id) });
        context.res = {
          status: 200,
          body: { message: "Agente eliminado", deletedCount: result.deletedCount },
        };
        break;

      default:
        context.res = {
          status: 400,
          body: { error: "Acción no válida. Usa create, read, update o delete." },
        };
    }
  } catch (error) {
    context.log.error("Error en conexión MongoDB:", error);
    context.res = {
      status: 500,
      body: { error: error.message },
    };
  }
};