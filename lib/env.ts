/**
 * Environment configuration helpers.
 * Centralizes reading of env vars so consumers don't reach into process.env directly.
 */

/** Whether the app should serve dummy/mock data instead of real API/DB data. */
export const isDummyDataEnabled = (): boolean => {
  return process.env.DUMMY_DATA_ENABLED === 'true';
};

/** Convenience const for quick checks. */
export const DUMMY_MODE = isDummyDataEnabled();
