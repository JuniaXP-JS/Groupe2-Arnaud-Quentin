import dotenv from 'dotenv-flow';

dotenv.config();

import { MongoClient } from 'mongodb';

/**
 * Tests d'intégration pour MongoDB.
 * Vérifie l'insertion et la suppression de données dans la collection GPS.
 */
describe('MongoDB Tests', () => {
    /**
     * Teste l'insertion d'un document dans MongoDB et sa suppression.
     * 
     * @async
     * @returns {Promise<void>}
     */
    it('should insert data into MongoDB', async () => {
        if (!process.env.MONGO_URI || !process.env.MONGO_DB_NAME || !process.env.MONGO_GPS_COLLECTION_NAME) {
            throw new Error('MONGO_URI and MONGO_DB_NAME are not defined in the environment variables');
        }

        /**
         * Données simulées à insérer dans la collection.
         * @type {{ name: string, position: { latitude: number, longitude: number } }}
         */
        const mockData = {
            name: 'Device1',
            position: {
                latitude: 48.8566,
                longitude: 2.3522,
            },
        };

        console.log(' Mock data to insert:', mockData);

        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect(); // Ensure the client is connected
        console.log(' Connected to MongoDB');

        const db = client.db(process.env.MONGO_DB_NAME);
        const collection = db.collection(process.env.MONGO_GPS_COLLECTION_NAME);

        /**
         * Résultat de l'insertion du document.
         */
        const result = await collection.insertOne(mockData);

        console.log(' Insert result:', result);

        // Assertions
        expect(result).toHaveProperty('insertedId');
        expect(result).toHaveProperty('acknowledged', true);

        // Clean up: Remove the inserted data
        /**
         * Résultat de la suppression du document inséré.
         */
        const deleteResult = await collection.deleteOne({ _id: result.insertedId });
        console.log('Deleted inserted data:', deleteResult);

        expect(deleteResult).toHaveProperty('acknowledged', true);
        expect(deleteResult).toHaveProperty('deletedCount', 1);

        await client.close(); // Close the connection
    });
});