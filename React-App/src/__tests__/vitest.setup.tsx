import '@testing-library/jest-dom';
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Mock import.meta.env globally for Vite
Object.defineProperty(globalThis, 'import.meta', {
  value: {
    env: {
      VITE_API_URL: 'http://localhost:3000',
      VITE_MAPBOX_KEY: 'test-mapbox-key'
    }
  }
});

// Mock ResizeObserver for testing environment
global.ResizeObserver = class {
  observe() { }
  unobserve() { }
  disconnect() { }
};

// Mock window.matchMedia for testing environment
if (!window.matchMedia) {
  window.matchMedia = function (query: string): MediaQueryList {
    return {
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => { },
      removeEventListener: () => { },
      addListener: () => { },
      removeListener: () => { },
      dispatchEvent: () => false,
    } as MediaQueryList;
  };
}