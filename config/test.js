/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  App: {
    database: {
      mongoUrl: 'mongodb://localhost:27017/forecast-test',
    },
    resources: {
      StormGlass: {
        apiToken: 'test-token',
      },
    },
  },
};
