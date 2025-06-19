import * as net from 'net';
import { connectToMongo, getDb } from '../db/db';
import { decode, encode } from '../lib/cbor';
import dotenv from 'dotenv-flow';

dotenv.config();

interface DataPoint {
    imei: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
    updatedAt: Date;
}

const gpsCollectionName: string | undefined = process.env.MONGO_GPS_COLLECTION_NAME;

let pendingMessage: any = null;
let incrementOn: number = 0;
let simSocket: net.Socket | null = null;
let apiSocket: net.Socket | null = null; // optional, useful if a response is needed

async function startServer() {
    if (!gpsCollectionName) {
        console.error("Missing environment variables");
        return;
    }

    await connectToMongo();
    const db = getDb();
    const collection = db.collection<DataPoint>(gpsCollectionName);

    const server = net.createServer((socket) => {
        console.log("New connection");
        // Case: a message was pending, and now the SIM connects
        if (pendingMessage) {
            console.log("Sending pending message to the new socket!");
            const encoded = encode(pendingMessage);
            console.log("pending message 2 ==> " + encoded);
            socket.write(encoded);
            pendingMessage = null;
        }

        socket.on('data', async (buffer) => {
            try {
                console.log(incrementOn++);
                const parsed = decode(buffer);
                console.log("Decoded data:", parsed);

                if (parsed.start === true) {
                    console.log("Message coming from Express API!");
                    apiSocket = socket;

                    // Store the message if the SIM is not connected
                    pendingMessage = parsed;
                    console.log("pending message ===> " + pendingMessage);
                    if (simSocket) {
                        const encoded = encode(parsed);
                        simSocket.write(encoded);
                        console.log("Transmitted to SIM7080G:", parsed);
                        pendingMessage = null; // can be cleared as it has been sent
                    } else {
                        console.warn("SIM not connected, message pending");
                    }

                    return;
                }

                if (Array.isArray(parsed)) {
                    // Batch of objects
                    const dataPoints: DataPoint[] = parsed.map((item: any) => ({
                        imei: item.name,
                        latitude: parseFloat(item.position.latitude),
                        longitude: parseFloat(item.position.longitude),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }));
                    const result = await collection.insertMany(dataPoints);
                    console.log("Batch inserted:", result.insertedIds);
                    socket.write("Batch received and saved\n");
                } else if (parsed.name && parsed.position) {
                    // Single object
                    simSocket = socket;
                    const data: DataPoint = {
                        imei: parsed.name,
                        latitude: parseFloat(parsed.position.latitude),
                        longitude: parseFloat(parsed.position.longitude),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
                    const result = await collection.insertOne(data);
                    console.log("SIM data inserted:", result.insertedId);
                    socket.write("Received and saved\n");
                } else {
                    throw new Error("Invalid data");
                }

            } catch (err) {
                console.error("Server error:", err);
                socket.write("Decoding or format error\n");
            }
        });

        socket.on('end', () => console.log("Client disconnected"));
        socket.on('error', (err) => console.error("Socket error:", err.message));
    });

    server.listen(4000, () => {
        console.log("TCP CBOR server active on port 4000");
    });
}

startServer();