// Import Jest DOM extensions
import '@testing-library/jest-dom';

// Mock next-intl useTranslations hook
jest.mock('next-intl', () => ({
  useTranslations: () => (key) => key,
}));

// Mock global fetch
global.fetch = jest.fn();

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
