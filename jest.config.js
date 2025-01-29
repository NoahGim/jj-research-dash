module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.js' }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(axios|axios-mock-adapter|@ant-design)/)'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^axios$': require.resolve('axios'),
    '^@ant-design/charts$': '<rootDir>/src/__mocks__/chartMock.js',
    '^xlsx$': '<rootDir>/src/__mocks__/xlsxMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],
  verbose: true
}; 