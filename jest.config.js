module.exports = {
  moduleFileExtensions: [
    'js',
    'ts',
    'json',
    'styl',
    'css'
  ],
  transform: {
    '.+\\.(css|styl)$': 'jest-css-modules-transform',
    '.+\\.ts$': 'ts-jest'
  },
  testRegex: '/__tests__/.*\\.test\\.ts$',
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  bail: true,
  collectCoverageFrom: [
    'src/**/*.ts'
  ],
  setupFiles: [
    '<rootDir>/__tests__/setup.ts'
  ]
};
