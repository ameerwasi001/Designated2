const TermsOfUse = require("../Models/termsOfUseModel.js");
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
  const termsOfUse = await TermsOfUse.find({})

  res.status(200).json({
    status: 200,
    success: true,
    message: '',
    data: {termsOfUse},
  });
});

exports.index = catchAsync(async (req, res, next) => {
  const termsOfUse = await TermsOfUse.find( req.query.query ? JSON.parse(decodeURIComponent(req.query.query)) : {})

  res.status(200).json({
    status: 200,
    success: true,
    message: '',
    data: {termsOfUse},
  });
});

exports.store = catchAsync(async (req, res, next) => {
  const termsOfUse = await TermsOfUse.create({...JSON.parse(JSON.stringify(req.body)), user: req.user._id});

  res.status(200).json({
    status: 200,
    success: true,
    message: 'TermsOfUse Created Successfully',
    data: {termsOfUse},
  });
});

exports.update = catchAsync(async (req, res, next) => {
    const termsOfUse = await TermsOfUse.findByIdAndUpdate(req.params.id, {$set: JSON.parse(JSON.stringify(req.body))}, { new: true });
  
    res.status(200).json({
      status: 200,
      success: true,
      message: 'TermsOfUse Edited',
      data: {termsOfUse},
    });
});

exports.delete = catchAsync(async (req, res, next) => {
  let termsOfUse =  await TermsOfUse.findOne(req.params.id ? { _id: req.params.id } : JSON.parse(decodeURIComponent(req.query)))
  termsOfUse = await TxDeleter.deleteOne("TermsOfUse", req.params.id)

  res.status(200).json({
      status: 200,
      success: true,
      message: 'TermsOfUse Deleted',
      data: {termsOfUse},
    });
});
