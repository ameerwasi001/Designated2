const mongoose = require("mongoose");
const TxQuery = require("../txQuery");

const structure = {
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: Number
};

const schema = new mongoose.Schema(structure);

const model = mongoose.model("PrivacyPolicy", schema);
TxQuery.model("PrivacyPolicy", model, structure);

module.exports = model;
