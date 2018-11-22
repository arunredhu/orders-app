const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const { orderStatus } = require("../config");

// Schema defination for order model
const schemaDefination = {
  // total distance between origin and destination
  distance: { type: Number, required: true },

  // order status
  status: {
    type: String,
    required: true,
    enum: [orderStatus.UNASSIGNED, orderStatus.TAKEN]
  },

  // origin point of the order
  origin: { type: Array, required: true },

  // destination point of the order
  destination: { type: Array, required: true }
};

// creating the order schema
const orderSchema = new mongoose.Schema(schemaDefination, {
  toJSON: { getters: true },
  timestamps: true
});

orderSchema.plugin(mongoosePaginate);

// creating the 'Order' model and exporing it
module.exports = mongoose.model("Order", orderSchema);
