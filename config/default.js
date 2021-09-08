/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  App: {
    resources: {
      StormGlass: {
        apiUrl: 'https://api.stormglass.io/v2',
        apiToken: 'dont-hard-code',
      },
    },
  },
};
