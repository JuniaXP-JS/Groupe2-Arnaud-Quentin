const mockCollection = {
    insertOne: jest.fn().mockResolvedValue({
        acknowledged: true,
        insertedId: 'mocked_id',
    }),
    deleteOne: jest.fn().mockResolvedValue({
        acknowledged: true,
        deletedCount: 1,
    }),
};

const mockDb = {
    collection: jest.fn(() => mockCollection),
};

const mockClient = {
    connect: jest.fn(),
    db: jest.fn(() => mockDb),
    close: jest.fn(),
};

export const MongoClient = jest.fn(() => mockClient);