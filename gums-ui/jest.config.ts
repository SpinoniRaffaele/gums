/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // A preset that is used as a base for Jest's configuration
  preset: "jest-preset-angular",

  // The root directory that Jest should scan for tests and modules within
  rootDir: 'src',

  // The test environment that will be used for testing
  testEnvironment: "jest-environment-jsdom",

  // Options that will be passed to the testEnvironment
  testEnvironmentOptions: { "resources": "usable" },

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: 'tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        isolatedModules: true,
      },
    ],
  },

  transformIgnorePatterns: ['node_modules/(?!@angular|three|@ngrx)'],
};

export default config;