const mongoose = require("mongoose");
const TxQuery = require("../txQuery");

const structure = {
  question: { type: String },
  answer: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: Number
};

const schema = new mongoose.Schema(structure);

const model = mongoose.model("FAQS", schema);
TxQuery.model("FAQS", model, structure);

module.exports = model;
