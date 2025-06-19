import { MongoClient } from 'mongodb';

/**
 * Test d'insertion directe dans la base MongoDB (hors serveur TCP).
 */
describe('MongoDB direct insert', () => {
    it('should insert a DataPoint document directly', async () => {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
        const dbName = process.env.MONGO_DB_NAME || 'mon_iot_db';
        const collectionName = process.env.MONGO_GPS_COLLECTION_NAME || 'gpsdatas';

        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const mockData = {
            name: 'DirectTest',
            position: {
                latitude: 45.0,
                longitude: 3.0
            },
            receivedAt: new Date()
        };

        const result = await collection.insertOne(mockData);

        expect(result).toHaveProperty('insertedId');
        expect(result.acknowledged).toBe(true);

        // Clean up
        await collection.deleteOne({ _id: result.insertedId });
        await client.close();
    });
});