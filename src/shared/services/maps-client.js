const { createClient } = require("@google/maps");

const key = process.env.GOOGLE_API_KEY;

// create the google map client
const mapsClient = createClient({
  key,
  Promise: Promise
});

module.exports = mapsClient;
