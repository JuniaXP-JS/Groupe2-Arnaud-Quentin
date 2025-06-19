import app from './app';
import dotenv from 'dotenv-flow';
import { startServer } from './server';
// Load environment variables from .env file
dotenv.config();

// Get HTTP and TCP settings from environment variables
const TCP_PORT = process.env.TCP_PORT ? parseInt(process.env.TCP_PORT) : 4567;
const TCP_IP = process.env.TCP_IP || '127.0.0.1';  // TCP server IP address

// start HTTP Server
startServer();

// Start TCP server with the IP and port from environment variables
/* startTcpServer(TCP_IP, TCP_PORT);

setTimeout(() => {
    runTestClient();
}, 1000); */
