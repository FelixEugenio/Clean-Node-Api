const config = require("./jest.config");
let testMatch = ['**/*.spec.ts'];
config.testMatch = testMatch;
module.exports = config;
