const mongoose = require("mongoose");
const TxQuery = require("../txQuery");

const structure = {
  notifyType: String,
  seen: {type: Boolean, default: false},
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
body:String,
postId:String,
commentId:String,

  media: String,
  title: String,
  profilePic: String,
image:"",
  description: String,
  additionalData: Array,
  actionTaken: {
    type: Boolean,
    default: false,
  },
  createdAt: Number,
};

const schema = new mongoose.Schema(structure);
const model = mongoose.model("Notifications", schema);
TxQuery.model("Notifications", model, structure);

module.exports = model;
