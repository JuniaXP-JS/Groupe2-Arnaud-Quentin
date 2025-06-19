// src/db.ts
import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv-flow';

dotenv.config();

/**
 * Utilise uniquement la variable d'environnement MONGO_URI pour la connexion.
 */
const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
//const uri = "mongodb+srv://arnaudrein:68qd3FJHI3gX10pC@iot.t8ds8zy.mongodb.net/";
const dbName = process.env.MONGO_DB_NAME || "express-db";

let client: MongoClient;
let db: Db;

/**
 * Établit une connexion à la base de données MongoDB.
 * @async
 * @returns {Promise<void>}
 */
export async function connectToMongo() {
    if (!uri || !dbName) {
        console.error("❌ Variables d'environnement manquantes");
        return;
    }

    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log("✅ Connecté à MongoDB");
}

/**
 * Retourne l'instance de la base de données MongoDB connectée.
 * @returns {Db}
 * @throws {Error} Si la base de données n'est pas connectée.
 */
export function getDb(): Db {
    if (!db) throw new Error("MongoDB non connecté !");
    return db;
}
