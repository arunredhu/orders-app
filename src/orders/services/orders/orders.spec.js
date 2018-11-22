const { expect } = require("chai");
const sinon = require("sinon");
const distanceService = require("../distance/distance");

const { Order } = require("../../models");

const { createOrder, listOrders, updateOrderStatus } = require("./orders");

const reqMockData = {
  origin: ["23.685", "72"],
  destination: ["28", "79.786"]
};

describe("Orders - orders service", () => {
  describe("createOrder method", async () => {
    it("Should call the distanceService's calcDistance method", () => {
      const calcDistance = sinon.stub(distanceService, "calcDistance");

      createOrder(reqMockData.origin, reqMockData.destination)
        .then(res => {})
        .catch(e => {});

      sinon.assert.calledOnce(calcDistance);
      calcDistance.restore();
    });

    it("Should call the distanceService's calcDistance method with correct arguments", () => {
      const calcDistance = sinon.stub(distanceService, "calcDistance");

      createOrder(reqMockData.origin, reqMockData.destination)
        .then(res => {})
        .catch(e => {});

      sinon.assert.calledWith(
        calcDistance,
        reqMockData.origin,
        reqMockData.destination
      );
      calcDistance.restore();
    });

    it("Should create and return the order", async () => {
      const distanceResponse = {
        text: "1,174 km",
        value: 1174215
      };
      const calcDistanceStub = sinon
        .stub(distanceService, "calcDistance")
        .returns(Promise.resolve(distanceResponse));

      const orderCreateStub = sinon
        .stub(Order, "create")
        .returns(Promise.resolve(orderCreateSuccess));

      const results = await createOrder(
        reqMockData.origin,
        reqMockData.destination
      );

      expect(results).to.deep.equal(orderCreateSuccess);
    });
  });
});

const orderCreateSuccess = {
  origin: ["23.685", "72"],
  destination: ["28", "79.786"],
  _id: "5bf6f5ca4d475d5a48a47a5e",
  distance: 1174215,
  status: "UNASSIGNED",
  createdAt: "2018-11-22T18:30:34.374Z",
  updatedAt: "2018-11-22T18:30:34.374Z",
  __v: 0,
  id: "5bf6f51-22T18:30:34.374Z",
  __v: 0,
  id: "5bf6f5ca4d475d5a48a47a5e"
};
