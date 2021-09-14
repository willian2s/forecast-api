/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  App: {
    port: 3000,
    database: {
      mongoUrl: 'mongodb://localhost:27017/forecast',
    },
    resources: {
      StormGlass: {
        apiUrl: 'https://api.stormglass.io/v2',
        apiToken: 'dont-hard-code',
      },
    },
  },
};
