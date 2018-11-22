const path = require("path");
// this will load the environment configuration for the dev mode
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.dev") });

require("./src/app");
