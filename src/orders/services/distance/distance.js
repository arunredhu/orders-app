const { mapsClient } = require("../../../shared/services");
const { APIError } = require("../../../shared/utils");

/**
 * @description Calculate the distance based on the origins and destinations
 * @param {*} origins
 * @param {*} destinations
 */
const calcDistance = async (origins, destinations) => {
  // call to maps client api for getting the distance
  const response = await mapsClient
    .distanceMatrix({
      origins: origins.join(),
      destinations: destinations.join()
    })
    .asPromise(); // convert to promise

  const jsonValue = response.json;

  // check the overall status of the directions api
  if (jsonValue.status !== "OK") {
    throw new APIError(jsonValue.status, 400);
  }

  // parsing the response
  const [row] = jsonValue.rows;
  const [element] = row.elements;

  // check the response for the particular element
  if (element.status !== "OK") {
    throw new APIError(element.status, 400);
  }

  return element.distance;
};

module.exports = {
  calcDistance
};
