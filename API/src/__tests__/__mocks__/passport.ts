const passport = {
    authenticate: jest.fn((strategy, options, callback) => {
        return (req: any, res: any, next: any) => {
            if (req.headers.authorization === `Bearer valid-token`) {
                callback(null, { id: 'user123', email: 'test@example.com' }, null); // Simulate an authenticated user
            } else {
                callback(null, false, null); // Simulate an unauthenticated user
            }
        };
    }),

    serializeUser: jest.fn((user: any, done: (err: any, id?: string) => void) => {
        if (typeof done === 'function') {
            done(null, user.id);
        }
    }),

    deserializeUser: jest.fn((id: string, done: (err: any, user?: any) => void) => {
        if (typeof done === 'function') {
            done(null, { id });
        }
    }),
    use: jest.fn(), // Simulate strategy registration
    initialize: jest.fn(() => (req: any, res: any, next: any) => {
        next();
    }),
    session: jest.fn(() => (req: any, res: any, next: any) => {
        next();
    }),
};

export default passport;
