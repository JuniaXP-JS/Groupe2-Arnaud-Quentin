import * as net from 'net';
import { encode } from './lib/cbor';

// Tableau de données à envoyer (batch)
const message = [
    {
        name: 'Volvic',
        position: {
            latitude: 45.55,
            longitude: 3.09
        }
    },
    {
        name: 'Paris',
        position: {
            latitude: 48.85,
            longitude: 2.35
        }
    }
];

// Encodage CBOR
const encoded = encode(message);
const buffer = typeof encoded === 'string'
    ? Buffer.from(encoded, 'utf-8')
    : Buffer.from(encoded);

// const SERVER_IP = '127.0.0.1';
const SERVER_IP = '20.13.77.198';
// const SERVER_PORT = 4000;
const SERVER_PORT = 80;

const client = new net.Socket();

client.connect(SERVER_PORT, SERVER_IP, () => {
    console.log(`📡 Connecté à ${SERVER_IP}:${SERVER_PORT}`);
    console.log("📤 Envoi CBOR (batch):", message);

    client.write(buffer, () => {
        console.log("✅ Données envoyées");
        setTimeout(() => {
            client.end();
        }, 1000);
    });
});

client.on('data', (data) => {
    console.log("📥 Réponse serveur :", data.toString());
});

client.on('close', () => {
    console.log("🔌 Connexion fermée");
});

client.on('error', (err) => {
    console.error("❌ Erreur client TCP :", err.message);
});
