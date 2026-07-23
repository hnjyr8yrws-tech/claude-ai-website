import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Unmount React trees between tests (globals: false, so RTL's auto-afterEach is
// not registered for us).
afterEach(() => cleanup());

// jsdom does not implement matchMedia. Provide an overridable stub so any component
// that probes it won't throw on render.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}
