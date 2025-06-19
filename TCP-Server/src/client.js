"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net = require("net");
var cbor_1 = require("./lib/cbor");
// Tableau de données à envoyer (batch)
var message = [
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
var encoded = (0, cbor_1.encode)(message);
var buffer = typeof encoded === 'string'
    ? Buffer.from(encoded, 'utf-8')
    : Buffer.from(encoded);
// const SERVER_IP = '127.0.0.1';
var SERVER_IP = '20.13.77.198';
// const SERVER_PORT = 4000;
var SERVER_PORT = 80;
var client = new net.Socket();
client.connect(SERVER_PORT, SERVER_IP, function () {
    console.log("\uD83D\uDCE1 Connect\u00E9 \u00E0 ".concat(SERVER_IP, ":").concat(SERVER_PORT));
    console.log("📤 Envoi CBOR (batch):", message);
    client.write(buffer, function () {
        console.log("✅ Données envoyées");
        setTimeout(function () {
            client.end();
        }, 1000);
    });
});
client.on('data', function (data) {
    console.log("📥 Réponse serveur :", data.toString());
});
client.on('close', function () {
    console.log("🔌 Connexion fermée");
});
client.on('error', function (err) {
    console.error("❌ Erreur client TCP :", err.message);
});
