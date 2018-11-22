const express = require("express");
const bodyParser = require("body-parser");

const { dbConnection } = require("./shared/services");
const { errorHandler } = require("./shared/utils");
const appRoutes = require("./app-routes");

const port = process.env.PORT || 8080;

// creating the express app
const app = express();

/***** Configuring the application *****/

// Body-parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// registering the app routes
app.use(appRoutes);

// register error handler
app.use(errorHandler);

/***** App configuration ends *****/

const bootstrapApp = app => {
  app.listen(port, () => {
    console.log(`App working on ${port}`);
  });
};

/**
 * Connect to the database
 */
dbConnection
  .createConnection()
  .then(db => {
    console.log("Db connected");
  })
  .catch(e => {
    console.log(e);
  });

bootstrapApp(app);
