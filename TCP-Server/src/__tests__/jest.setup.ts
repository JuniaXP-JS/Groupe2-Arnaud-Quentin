import { spawn } from 'child_process';
import dotenv from 'dotenv-flow';

dotenv.config();

let serverProcess: any;

beforeAll((done) => {
    // Ne démarre le serveur principal que si le test en cours est lié à MongoDB
    if (expect.getState().testPath?.includes('server.mongo.spec.ts')) {
        console.log("Starting the server...");
        serverProcess = spawn('npm', ['run', 'dev'], {
            stdio: 'inherit',
            shell: true,
        });

        setTimeout(() => {
            console.log("Server is running");
            done();
        }, 3000);
    } else {
        done();
    }
});

afterAll(() => {
    if (serverProcess) {
        console.log("Stopping the server...");
        serverProcess.kill();
    }
});