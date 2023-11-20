const mongoose = require("mongoose");
const TxQuery = require("../txQuery");

const structure = {
  


  type:{
    type:String,
    default:""
  },
 
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
accountNo:Number,
amount:Number,

receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt:Number
};

const schema = new mongoose.Schema(structure);
const model = mongoose.model("Transactions", schema);
TxQuery.model("Transactions", model, structure);

module.exports = model;
