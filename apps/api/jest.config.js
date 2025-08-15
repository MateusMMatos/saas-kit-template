module.exports = {
  testEnvironment: 'node',
  transform: { '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: 'tsconfig.json' }] },
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: './',
  testMatch: ['**/?(*.)+(spec|test).ts']
};
