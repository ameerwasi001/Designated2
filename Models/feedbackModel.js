const mongoose = require("mongoose");
const TxQuery = require("../txQuery");

const structure = {
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: Number
};

const schema = new mongoose.Schema(structure);

const model = mongoose.model("Feedback", schema);
TxQuery.model("Feedback", model, structure);

module.exports = model;
