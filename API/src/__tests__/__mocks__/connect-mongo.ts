export default {
    create: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      destroy: jest.fn(),
      on: jest.fn(), 
    })),
  };