const PrivacyPolicy = require("../Models/privacyPolicyModel.js");
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
  const privacyPolicy = await PrivacyPolicy.find({})

  res.status(200).json({
    status: 200,
    success: true,
    message: '',
    data: {privacyPolicy},
  });
});

exports.index = catchAsync(async (req, res, next) => {
  const privacyPolicy = await PrivacyPolicy.find( req.query.query ? JSON.parse(decodeURIComponent(req.query.query)) : {})

  res.status(200).json({
    status: 200,
    success: true,
    message: '',
    data: {privacyPolicy},
  });
});

exports.store = catchAsync(async (req, res, next) => {
  const privacyPolicy = await PrivacyPolicy.create({...JSON.parse(JSON.stringify(req.body)), user: req.user._id});

  res.status(200).json({
    status: 200,
    success: true,
    message: 'PrivacyPolicy Created Successfully',
    data: {privacyPolicy},
  });
});

exports.update = catchAsync(async (req, res, next) => {
    const privacyPolicy = await PrivacyPolicy.findByIdAndUpdate(req.params.id, {$set: JSON.parse(JSON.stringify(req.body))}, { new: true });
  
    res.status(200).json({
      status: 200,
      success: true,
      message: 'PrivacyPolicy Edited',
      data: {privacyPolicy},
    });
});

exports.delete = catchAsync(async (req, res, next) => {
  let privacyPolicy =  await PrivacyPolicy.findOne(req.params.id ? { _id: req.params.id } : JSON.parse(decodeURIComponent(req.query)))
  privacyPolicy = await TxDeleter.deleteOne("PrivacyPolicy", req.params.id)

  res.status(200).json({
      status: 200,
      success: true,
      message: 'PrivacyPolicy Deleted',
      data: {privacyPolicy},
    });
});
