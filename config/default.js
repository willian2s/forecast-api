/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  App: {
    port: 3000,
    database: {
      mongoUrl: 'mongodb://localhost:27017/forecast',
    },
    auth: {
      key: 'some-key',
      tokenExpiresIn: '2000000000000',
    },
    resources: {
      StormGlass: {
        apiUrl: 'https://api.stormglass.io/v2',
        apiToken: 'dont-hard-code',
      },
    },
  },
};
