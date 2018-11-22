const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);
const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const server = "localhost:8080";

/*
 * Add order
 */
describe("/POST orders", () => {
  it("should return error for invalid format due to incomplete request data (no destination)", done => {
    chai
      .request(server)
      .post("/orders")
      .send({
        origin: ["28", "70"]
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.be.equal("INVALID_PARAMETERS");
        done();
      });
  });

  it("should return error for invalid format due to incomplete request data (no source)", done => {
    chai
      .request(server)
      .post("/orders")
      .send({
        destination: ["28", "70"]
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.be.equal("INVALID_PARAMETERS");
        done();
      });
  });

  it("should return 400 with invalid format (latitude of source missing)", done => {
    chai
      .request(server)
      .post("/orders")
      .send({
        origin: ["", "72"],
        destination: ["28", "79.786"]
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.be.equal("INVALID_PARAMETERS");
        done();
      });
  });

  it("should return 400 with invalid format (longitude of source missing)", done => {
    chai
      .request(server)
      .post("/orders")
      .send({
        origin: ["28", ""],
        destination: ["28", "79.786"]
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.be.equal("INVALID_PARAMETERS");
        done();
      });
  });

  it("should return 400 with invalid format (latitude of destination missing)", done => {
    chai
      .request(server)
      .post("/orders")
      .send({
        origin: ["28", "72"],
        destination: ["", "79.786"]
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.be.equal("INVALID_PARAMETERS");
        done();
      });
  });

  it("should return 400 with invalid format (longitude of destination missing)", done => {
    chai
      .request(server)
      .post("/orders")
      .send({
        origin: ["28", "72"],
        destination: ["28", ""]
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.be.equal("INVALID_PARAMETERS");
        done();
      });
  });

  it("should return 400 with invalid format (invalid json)", done => {
    chai
      .request(server)
      .post("/orders")
      .send({
        origin: ["28", "70"],
        destination: ["29.754", 70]
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.be.equal("INVALID_PARAMETERS");
        done();
      });
  });

  //This needs to be fixed - error code is coming as Unknown_Error
  it("should return error because of invalid destination coordinates", done => {
    chai
      .request(server)
      .post("/orders")
      .send({
        origin: ["2", "70.786"],
        destination: ["28.6756", "7"]
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body.error).to.be.equal("ZERO_RESULTS");
        done();
      });
  });

  //This needs to be fixed - error code is coming as Unknown_Error
  it("should return error because of invalid source coordinates", done => {
    chai
      .request(server)
      .post("/orders")
      .send({
        origin: ["2", "2270.786"],
        destination: ["28.6756", "7"]
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body.error).to.be.equal("NOT_FOUND");
        done();
      });
  });

  //This needs to be fixed - error code is coming as Unknown_Error
  it("should return error because of invalid source & destination coordinates", done => {
    chai
      .request(server)
      .post("/orders")
      .send({
        origin: ["2", "2270.786"],
        destination: ["2888.6756", "7"]
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body.error).to.be.equal("NOT_FOUND");
        done();
      });
  });
  it("should create order with valid request", done => {
    chai
      .request(server)
      .post("/orders")
      .send({
        origin: ["23.685", "72"],
        destination: ["28", "79.786"]
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("distance");
        expect(res.body.distance).to.be.a("number");
        expect(res.body.status).to.be.equal("UNASSIGNED");
        done();
      });
  });
});

/*
 * Application should not expose anything on / and should throw 404 error.
 */
describe("GET /", () => {
  it("404 for invalid urls", done => {
    chai
      .request(server)
      .get("/")
      .end(function(err, res) {
        expect(res).to.have.status(404);
        done();
      });
  });
});

/*
 * Application does not expose any request which accepts method type DELETE; hence a 404 should
 * be thrown for any such request.
 */
describe("DELETE orders/9476837", () => {
  it("405 for invalid method and path", done => {
    chai
      .request(server)
      .delete("/order")
      .send({
        origin: ["2", "70.786"],
        destination: ["28.6756", "7"]
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});

/*
 * List order test cases
 */
describe("GET /", () => {
  it("should return error for imcomplete params (no limit passed)", done => {
    chai
      .request(server)
      .get("/orders?page=1")
      .end(function(err, res) {
        expect(res).to.have.status(400);
        expect(res.body.error).to.be.equal("INVALID_PARAMETERS");
        done();
      });
  });

  it("should return error for imcomplete params (no page number passed)", done => {
    chai
      .request(server)
      .get("/orders?limit=1")
      .end(function(err, res) {
        expect(res).to.have.status(400);
        expect(res.body.error).to.be.equal("INVALID_PARAMETERS");
        done();
      });
  });

  it("should return error for invalid params (negative page number)", done => {
    chai
      .request(server)
      .get("/orders?page=-1&limit=1")
      .end(function(err, res) {
        expect(res).to.have.status(400);
        expect(res.body.error).to.be.equal("INVALID_PARAMETERS");
        done();
      });
  });

  it("should return error for invalid params (negative limit number)", done => {
    chai
      .request(server)
      .get("/orders?page=1&limit=-1")
      .end(function(err, res) {
        expect(res).to.have.status(400);
        expect(res.body.error).to.be.equal("INVALID_PARAMETERS");
        done();
      });
  });

  it("should return error for invalid params (alphanumeric page number)", done => {
    chai
      .request(server)
      .get("/orders?page=a&limit=-1")
      .end(function(err, res) {
        expect(res).to.have.status(400);
        expect(res.body.error).to.be.equal("INVALID_PARAMETERS");
        done();
      });
  });

  it("should return error for invalid params (alphanumeric limit value)", done => {
    chai
      .request(server)
      .get("/orders?page=1&limit=A")
      .end(function(err, res) {
        expect(res).to.have.status(400);
        expect(res.body.error).to.be.equal("INVALID_PARAMETERS");
        done();
      });
  });

  // This test is failing, please check why are we throwing 500 if the page num=0
  it("should return error due to page num = 0", done => {
    chai
      .request(server)
      .get("/orders?page=0&limit=1")
      .end(function(err, res) {
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should return only 1 order, with correct format", done => {
    chai
      .request(server)
      .get("/orders?page=1&limit=1")
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body[0]).to.have.property("distance");
        expect(res.body[0].distance).to.be.a("number");
        expect(res.body[1]).to.be.undefined;
        done();
      });
  });

  //New Tests
  it("should return only 0 order, with limit as 0", done => {
    chai
      .request(server)
      .get("/orders?page=1&limit=0")
      .end(function(err, res) {
        expect(res).to.have.status(400);
        expect(res.body[0]).to.be.undefined;
        done();
      });
  });
});

/*
 * Patch order
 */
describe("/PATCH /orders/:id", () => {
  it("returns error due to an order id which does not exist", done => {
    chai
      .request(server)
      .patch("/orders/5beb29b8e7c73b234a1fe6dc")
      .send({
        status: "TAKEN"
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body.error).to.be.equal("Order not available for update");
        done();
      });
  });

  it("should return error due to wrong param being passed (statuses instead of status)", done => {
    chai
      .request(server)
      .patch("/orders/5beb29b8e7c73b234a1fe6dc")
      .send({
        statusFoo: "TAKEN"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.be.equal("INVALID_PARAMETERS");
        done();
      });
  });

  it("should return error due to wrong value for staus being passed", done => {
    chai
      .request(server)
      .patch("/orders/5beb29b8e7c73b234a1fe6dc")
      .send({
        status: "TOOK"
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.be.equal("INVALID_PARAMETERS");
        done();
      });
  });

  it("should return success for patched order", done => {
    chai
      .request(server)
      .get("/orders?page=1&limit=1")
      .end((err, res) => {
        chai
          .request(server)
          .patch("/orders/" + res.body[0].id)
          .send({
            status: "TAKEN"
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.status).to.be.equal("SUCCESS");
            done();
          });
      });
  });

  it("should return failure for updating status to TAKEN of already taken order", done => {
    chai
      .request(server)
      .get("/orders?page=1&limit=1")
      .end((err, res) => {
        let order = res;
        chai
          .request(server)
          .patch("/orders/" + res.body[0].id)
          .send({
            status: "TAKEN"
          })
          .end((err, res) => {
            expect(res).to.have.status(409);
            expect(res.body.error).to.be.equal(
              "Order not available for update"
            );
            done();
          });
      });
  });
});
