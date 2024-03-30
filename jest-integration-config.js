const config = require("./jest.config");
let testMatch = ['**/*.test.ts'];
config.testMatch = testMatch;
module.exports = config;