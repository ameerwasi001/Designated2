const mongoose = require("mongoose");
const TxQuery = require("../txQuery");

const structure = {
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: Number
};

const schema = new mongoose.Schema(structure);

const model = mongoose.model("AboutUs", schema);
TxQuery.model("AboutUs", model, structure);

module.exports = model;
