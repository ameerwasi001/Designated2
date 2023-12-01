const FAQS = require("../Models/faqsModel.js");
const TxDeleter = require("../txDeleter");
const {
  Query,
  QueryModel,
  QueryBuilder,

  Matcher,
  Eq,

  PostProcessor
} = require("../Utils/query");
const catchAsync = require("../Utils/catchAsync");

exports.find = catchAsync(async (req, res, next) => {
  const fAQS = await FAQS.find({})

  res.status(200).json({
    status: 200,
    success: true,
    message: '',
    data: {fAQS},
  });
});

exports.index = catchAsync(async (req, res, next) => {
  const fAQS = await FAQS.find( req.query.query ? JSON.parse(decodeURIComponent(req.query.query)) : {})

  res.status(200).json({
    status: 200,
    success: true,
    message: '',
    data: {fAQS},
  });
});

exports.store = catchAsync(async (req, res, next) => {
  const fAQS = await FAQS.create({...JSON.parse(JSON.stringify(req.body)), user: req.user._id});

  res.status(200).json({
    status: 200,
    success: true,
    message: 'FAQS Created Successfully',
    data: {fAQS},
  });
});

exports.update = catchAsync(async (req, res, next) => {
    const fAQS = await FAQS.findByIdAndUpdate(req.params.id, {$set: JSON.parse(JSON.stringify(req.body))}, { new: true });
  
    res.status(200).json({
      status: 200,
      success: true,
      message: 'FAQS Edited',
      data: {fAQS},
    });
});

exports.delete = catchAsync(async (req, res, next) => {
  let fAQS =  await FAQS.findOne(req.params.id ? { _id: req.params.id } : JSON.parse(decodeURIComponent(req.query)))
  fAQS = await TxDeleter.deleteOne("FAQS", req.params.id)

  res.status(200).json({
      status: 200,
      success: true,
      message: 'FAQS Deleted',
      data: {fAQS},
    });
});
