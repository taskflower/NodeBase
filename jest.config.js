// jest.config.mjs
export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
      '^.+\\.tsx?$': ['ts-jest', {
        useESM: true,
      }]
    },
    transformIgnorePatterns: [
      'node_modules/(?!(inquirer|ora|chalk|figures|ora|.*-ansi-.*|strip-ansi|ansi-regex|ansi-styles|is-unicode-supported|is-fullwidth-code-point|emoji-regex|string-width|cli-cursor|restore-cursor|onetime|signal-exit|mimic-fn|cli-spinners|wcwidth|is-interactive|is-docker|log-symbols)/)',
    ],
    testMatch: [
      "<rootDir>/src/**/__tests__/**/*.ts"
    ],
    moduleDirectories: ['node_modules'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
  };