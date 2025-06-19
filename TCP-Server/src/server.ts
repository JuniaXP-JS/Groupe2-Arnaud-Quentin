import * as net from 'net';
import { connectToMongo, getDb } from './db/db';
import { decode, encode } from './lib/cbor';
import dotenv from 'dotenv-flow';
import { insertDataPoints, insertGeoDataPoints } from './services/gpsService';
import { DataPoint, IGpsGeoData } from './types';

dotenv.config();

/**
 * Nom de la collection MongoDB pour les points GPS classiques.
 * Défini via la variable d'environnement MONGO_GPS_COLLECTION_NAME.
 * @type {string | undefined}
 */
const gpsCollectionName = process.env.MONGO_GPS_COLLECTION_NAME;

/**
 * Nom de la collection MongoDB pour les points GPS au format GeoJSON.
 * Défini via la variable d'environnement MONGO_GPS_GEODATA_COLLECTION_NAME.
 * @type {string | undefined}
 */
const gpsGeoDataCollectionName = process.env.MONGO_GPS_GEODATA_COLLECTION_NAME;

/**
 * Message en attente d'envoi si le SIM n'est pas connecté.
 * @type {any}
 */
let messageEnAttente: any = null;

/**
 * Compteur d'incrémentation pour le debug.
 * @type {number}
 */
let incrementOn = 0;

/**
 * Socket du module SIM (SIM7080G).
 * @type {net.Socket | null}
 */
let simSocket: net.Socket | null = null;

/**
 * Socket de l'API Express.
 * @type {net.Socket | null}
 */
let apiSocket: net.Socket | null = null;

/**
 * Insère un batch de points GPS dans deux collections MongoDB :
 * - La collection classique (latitude/longitude)
 * - La collection GeoJSON (type Point)
 *
 * @param {Object} collection - Collection MongoDB pour les DataPoint classiques
 * @param {Object} geoCollection - Collection MongoDB pour les IGpsGeoData (GeoJSON)
 * @param {Array} parsed - Tableau d'objets à insérer
 * @returns {Promise<void>}
 */
async function handleBatchInsert(
    collection: any,
    geoCollection: any,
    parsed: any
) {
    const dataPoints: DataPoint[] = parsed.map((item: any) => ({
        imei: item.imei,

        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
        createdAt: new Date(),
        updatedAt: new Date(),
        receivedAt: new Date()
    }));
    const result = await insertDataPoints(collection, dataPoints);
    console.log(" Batch inséré :", result.insertedIds);

    /**
     * IGpsGeoData permet de stocker les points GPS au format GeoJSON,
     * ce qui permet d'utiliser les fonctionnalités géospatiales de MongoDB.
     * Le champ "coordinates" suit la norme GeoJSON : [longitude, latitude].
     */
    // const geoDataPoints: IGpsGeoData[] = dataPoints.map((item) => ({
    //     name: item.name,
    //     position: {
    //         type: 'Point',
    //         coordinates: [item.position.longitude, item.position.latitude]
    //     },
    //     receivedAt: item.receivedAt!
    // }));
    // console.log(" GeoDataPoints à insérer :", geoDataPoints);
    // const geoResult = await insertGeoDataPoints(geoCollection, geoDataPoints);
    // console.log(" Batch inséré dans geoCollection :", geoResult.insertedIds);
}

/**
 * Démarre le serveur TCP.
 * - Initialise la connexion à MongoDB.
 * - Gère les connexions entrantes.
 * - Route les messages entre l'API et le module SIM.
 * - Insère les données GPS dans les collections appropriées.
 * @returns {Promise<void>}
 */
export async function startServer() {
    if (!gpsCollectionName) {
        console.error(" Variables d'environnement manquantes");
        return;
    }

    await connectToMongo();
    const db = getDb();
    const collection = db.collection<DataPoint>(gpsCollectionName);
    if (!gpsGeoDataCollectionName) {
        console.error("Variable d'environnement manquante pour gpsGeoDataCollectionName");
        return;
    }
    const geoCollection = db.collection<IGpsGeoData>(gpsGeoDataCollectionName);

    /**
     * Création du serveur TCP.
     * Chaque connexion est gérée individuellement.
     */
    const server = net.createServer((socket) => {
        console.log(" Nouvelle connexion");
        // Cas : un message était en attente, et c’est le SIM qui se connecte maintenant
        if (messageEnAttente) {
            console.log(" Envoi du message en attente au nouveau socket !");
            const encoded = encode(messageEnAttente);
            console.log("message en attente 2 ==> " + encoded);
            socket.write(encoded);
            messageEnAttente = null;
        }

        /**
         * Gestion des données reçues sur le socket.
         */
        socket.on('data', async (buffer) => {
            try {
                console.log(incrementOn++);
                const parsed = decode(buffer);
                console.log("Donnée décodée :", parsed);

                if (parsed.start === true) {
                    console.log("Message venant d'Express API !");
                    apiSocket = socket;

                    //  Stocker le message si le SIM n’est pas connecté
                    messageEnAttente = parsed;
                    console.log("message en attente ===> " + messageEnAttente);
                    if (simSocket) {
                        const encoded = encode(parsed);
                        simSocket.write(encoded);
                        console.log(" Transmis à SIM7080G :", parsed);
                        messageEnAttente = null; // on peut vider car c’est envoyé
                    } else {
                        console.warn("SIM non connecté, message en attente");
                    }

                    return;
                }

                if (Array.isArray(parsed)) {
                    // Batch d'objets
                    await handleBatchInsert(collection, geoCollection, parsed);
                } else if (parsed.name && parsed.position) {
                    // Un seul objet
                    /**
                     * Création d'un DataPoint à partir des données reçues.
                     * @type {DataPoint}
                     */
                    const data: DataPoint = {
                        imei: parsed.name,

                        latitude: parseFloat(parsed.position.latitude),
                        longitude: parseFloat(parsed.position.longitude),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };

                    const result = await collection.insertOne(data);
                    console.log(" Donnée SIM insérée :", result.insertedId);
                    // socket.write(" Reçu et enregistré\n");
                } else {
                    throw new Error(" Donnée invalide");
                }

            } catch (err) {
                console.error(" Erreur serveur :", err);
                // socket.write(" Erreur de décodage ou format\n");
            }
        });

        socket.on('end', () => console.log("Client déconnecté"));
        socket.on('error', (err) => console.error("Socket error:", err.message));
    });

    server.listen(4000, () => {
        console.log("Serveur TCP CBOR actif sur le port 4000");
    });
}

startServer();