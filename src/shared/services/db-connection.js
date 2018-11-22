const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const { DB_HOSTNAME, DB_PORT, DB_NAME } = process.env;

const dbUri = `mongodb://${DB_HOSTNAME}:${DB_PORT}/${DB_NAME}`;

const createConnection = () =>
  mongoose.connect(
    dbUri,
    {
      auto_reconnect: true,
      connectTimeoutMS: 3600000,
      socketTimeoutMS: 3600000,
      // retry to connect for 60 times
      reconnectTries: 60,
      // wait 5 second before retrying
      reconnectInterval: 5000,
      useNewUrlParser: true
    }
  );

module.exports = {
  createConnection
};
