const { expect } = require("chai");
const sinon = require("sinon");

const { calcDistance } = require("./distance");
const { mapsClient } = require("../../../shared/services");

// mock req data
const reqMockData = {
  origin: ["23.685", "72"],
  destination: ["28", "79.786"]
};

describe("Orders - Distance service", () => {
  describe("calcDistance - maps client calls", () => {
    let distanceMatrix;

    beforeEach(() => {
      distanceMatrix = sinon.stub(mapsClient, "distanceMatrix");
    });

    it("Should call the mapsClient's distanceMatrix method", () => {
      calcDistance(reqMockData.origin, reqMockData.destination)
        .then(res => {})
        .catch(e => {});

      sinon.assert.calledOnce(distanceMatrix);
    });

    it("Should pass correct values to mapsClient's distanceMatrix method", () => {
      const origins = reqMockData.origin.join();
      const destinations = reqMockData.destination.join();

      calcDistance(reqMockData.origin, reqMockData.destination)
        .then(res => {})
        .catch(e => {});

      sinon.assert.calledWith(distanceMatrix, { origins, destinations });
    });

    afterEach(() => {
      distanceMatrix.restore();
    });
  });

  describe("calcDistance method", () => {
    let distanceMatrix;

    it("Should return the correct distance", async () => {
      distanceMatrix = sinon
        .stub(mapsClient, "distanceMatrix")
        .returns({ asPromise: () => Promise.resolve(gApiSuccessResponse) });

      const result = await calcDistance(
        reqMockData.origin,
        reqMockData.destination
      );

      expect(result).to.deep.equals({
        text: "1,174 km",
        value: 1174215
      });
    });

    it("Should return the error with ZERO_RESULTS", async () => {
      distanceMatrix = sinon
        .stub(mapsClient, "distanceMatrix")
        .returns({ asPromise: () => Promise.resolve(gApiZeroResultsresp) });

      const reqData = {
        origin: ["72", "72"],
        destination: ["28", "79.786"]
      };

      const result = await calcDistance(
        reqData.origin,
        reqData.destination
      ).catch(e => {
        expect(e.message).to.equal("ZERO_RESULTS");
        expect(e.status).to.equal(500);
      });
    });

    afterEach(() => {
      distanceMatrix.restore();
    });
  });
});

const gApiSuccessResponse = {
  status: 200,
  headers: {
    "content-type": "application/json; charset=UTF-8",
    date: "Thu, 22 Nov 2018 17:32:08 GMT",
    expires: "Fri, 23 Nov 2018 17:32:08 GMT",
    "cache-control": "public, max-age=86400",
    server: "mafe",
    "x-xss-protection": "1; mode=block",
    "x-frame-options": "SAMEORIGIN",
    "alt-svc": 'quic=":443"; ma=2592000; v="44,43,39,35"',
    "accept-ranges": "none",
    vary: "Accept-Language,Accept-Encoding",
    connection: "close"
  },
  json: {
    destination_addresses: ["Unnamed Road, Rta, Uttar Pradesh 242307, India"],
    origin_addresses: ["Radhanpur Rd, Gujarat 384230, India"],
    rows: [
      {
        elements: [
          {
            distance: {
              text: "1,174 km",
              value: 1174215
            },
            duration: {
              text: "19 hours 35 mins",
              value: 70506
            },
            status: "OK"
          }
        ]
      }
    ],
    status: "OK"
  },
  requestUrl:
    "https://maps.googleapis.com/maps/api/distancematrix/json?destinations=28%2C79.786&origins=23.685%2C72&key=AIzaSyBERKlSxwHMnRCfF4Pe9CaTB4sjj6tMZvQ",
  query: {
    destinations: "28,79.786",
    origins: "23.685,72",
    key: "AIzaSyBERKlSxwHMnRCfF4Pe9CaTB4sjj6tMZvQ"
  }
};

const gApiZeroResultsresp = {
  status: 200,
  headers: {
    "content-type": "application/json; charset=UTF-8",
    date: "Thu, 22 Nov 2018 17:42:34 GMT",
    expires: "Fri, 23 Nov 2018 17:42:34 GMT",
    "cache-control": "public, max-age=86400",
    server: "mafe",
    "x-xss-protection": "1; mode=block",
    "x-frame-options": "SAMEORIGIN",
    "alt-svc": 'quic=":443"; ma=2592000; v="44,43,39,35"',
    "accept-ranges": "none",
    vary: "Accept-Language,Accept-Encoding",
    connection: "close"
  },
  json: {
    destination_addresses: ["28,79.786"],
    origin_addresses: ["72,72"],
    rows: [
      {
        elements: [
          {
            status: "ZERO_RESULTS"
          }
        ]
      }
    ],
    status: "OK"
  },
  requestUrl:
    "https://maps.googleapis.com/maps/api/distancematrix/json?destinations=28%2C79.786&origins=72%2C72&key=AIzaSyBERKlSxwHMnRCfF4Pe9CaTB4sjj6tMZvQ",
  query: {
    destinations: "28,79.786",
    origins: "72,72",
    key: "AIzaSyBERKlSxwHMnRCfF4Pe9CaTB4sjj6tMZvQ"
  }
};
