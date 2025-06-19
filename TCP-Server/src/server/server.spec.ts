import * as net from 'net';

describe('TCP Server Tests', () => {
    let server: net.Server;
    let TEST_PORT: number; // Dynamic port

    beforeAll((done) => {
        server = net.createServer((socket) => {
            socket.on('data', (data) => {
                const message = data.toString();
                console.log("Received data:", message);

                if (message === 'test') {
                    socket.write('Data received');
                } else {
                    socket.write('Invalid data');
                }
            });
        });

        // Use a dynamic port to avoid conflicts
        server.listen(0, () => {
            const address = server.address() as net.AddressInfo;
            TEST_PORT = address.port; // Retrieve the dynamically assigned port
            console.log(`TCP Server running on port ${TEST_PORT}`);
            done();
        });

        server.on('error', (err) => {
            done(err); // Handle server errors
        });
    });

    afterAll((done) => {
        server.close(() => {
            console.log('TCP Server stopped');
            done();
        });
    });

    it('should handle valid data', (done) => {
        const client = new net.Socket();

        client.connect(TEST_PORT, 'localhost', () => {
            client.write('test');
        });

        client.on('data', (data) => {
            expect(data.toString()).toBe('Data received');
            client.end();
            done();
        });

        client.on('error', (err) => {
            done(err);
        });
    });

    it('should handle invalid data', (done) => {
        const client = new net.Socket();

        client.connect(TEST_PORT, 'localhost', () => {
            client.write('invalid');
        });

        client.on('data', (data) => {
            expect(data.toString()).toBe('Invalid data');
            client.end();
            done();
        });

        client.on('error', (err) => {
            done(err);
        });
    });
});