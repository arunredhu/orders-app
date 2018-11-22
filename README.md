[![Build Status](https://travis-ci.org/arunredhu/orders-app.svg?branch=master)](https://travis-ci.org/arunredhu/orders-app)

# Orders-app

## This application exposes API's for creating, updating and listing orders.

## Uses:

- [Node.js](https://nodejs.org/en/) (v8.12.0) server that supports the APIs.
- [MongoDB](https://www.mongodb.com/) (v3.4.18) the database layer.
- [Docker](https://www.docker.com/) as the container service to isolate the environment.

## How to Run

1. Clone/Download the project
2. Set Google Distance Matrix API key in .env file, key: `GOOGLE_API_KEY`
3. Execute the _start.sh_ bash file via `./start.sh` to start the project. This will:
   1. Start the docker environment. Internally within the docker environment it will:
      - Build the Node.js image
      - Download the mongo image
      - Start the Node.js server
   2. After docker-compose has built and started the project, automated test cases will start running.

## Google Maps Distance Matric API configuration

- Set the API key in .env file, key: `GOOGLE_API_KEY`

## How to start application manually (using Docker)

1. Clone/Download the project
1. Run `docker-compose up` from terminal
1. APIs will be accessible at `http://localhost:8080/orders`

## How to run automated tests (integration & unit tests) from CLI (Command Line Interface) or Terminal

- After starting the project with `docker-compose up`, run:
  1. Interation tests: `docker exec -it app npm run e2e`
  2. Unit tests: `docker exec -it app npm test`

## API Reference Documentation

- **GET** `/orders?page=:page&limit=:limit`: Fetch paginated orders

  - Response :
    `[ { "distance": 1199398, "status": "TAKEN", "id": "5bebba7c1c2c2d001c3e92f3" }, { "distance": 2000, "status": "UNASSIGNED", "id": "5bebba7c1c2c2d001c3e92f1" }, ]`

- **POST** `/orders`: Create a new order

      	- Request:
      	```

  {
  "origin" :["28.704060", "77.102493"],
  "destination" :["28.535517", "77.391029"]
  }

  ```

  - Response:
    `{ "id": "5bebcf381c2c2d001c3e92f4", "distance": 1071, "status": "UNASSIGNED" }`

  ```

- **PATCH** `/orders/:id`: Update the status of a particular order using it's id

      	- Request:
      	```
        {
            "status" : "TAKEN"
        }
        ```

  - Responsw:
    `{ "status": "SUCCESS" }`

  ```

  ```

## Folder Structure

**/src/orders/config**

- Includesthe project specific constants and configurations.

**/src/orders**

- Separate orders folder to maintain modularity of code.
- **`controllers`** contains order related controllers to control basic flow of order related functionalities
- **`models`** has the model definition of orders.
- **`services`** has the srevice defintions for order management.
- **`index.js`** is what builds and configures the express app
- **`order-routes`** is what has the project specific routes

**/src/shared/services**

- **`maps-client.js`** has functionality for google calculate distance api.
- **`db-connection.js`** contains functions for managing mongoose database connections.

**/src/shared/utils**

- **`error-handler.js`** contains functions for handling error routes, managing error logging, parsing error and sending error to the client.
- **`api-error.js`** contains function for handling an API internal server error.

**/test**

- Has the automated integration and unit test cases, which can be run to verify the project.

**/app.js**

- The initiator file, that starts the server and initiated all configurations.

## Swagger API documentation

- Swagger documentation can be found at `/swagger.yaml`

## Linting

- Linting configuration available at `/.eslintrc.`
