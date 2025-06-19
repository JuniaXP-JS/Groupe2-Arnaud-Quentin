import { vi } from 'vitest';

const get = vi.fn().mockResolvedValue({ data: [] });
const post = vi.fn().mockImplementation((url, data) => {
    // For the registration endpoint
    if (url.includes('/api/auth/register')) {
        return Promise.resolve({
            data: {
                token: 'fake-test-token',
                user: {
                    id: 'test-user-id',
                    email: data.email,
                    name: data.name || 'Test User'
                }
            }
        });
    }
    // Default behavior
    return Promise.resolve({ data: {} });
});

const axiosMock = {
    get,
    post,
    isAxiosError: (error: any) => error.isAxiosError === true,
    create: () => ({
        get,
        post,
        interceptors: {
            request: { use: vi.fn(), eject: vi.fn() },
            response: { use: vi.fn(), eject: vi.fn() }
        }
    }),
    defaults: {
        headers: {
            common: {}
        }
    },
    interceptors: {
        request: { use: vi.fn(), eject: vi.fn() },
        response: { use: vi.fn(), eject: vi.fn() }
    }
};

export { get, post };

export default axiosMock;