const AboutUs = require("../Models/aboutUsModel.js");
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
  const aboutUs = await AboutUs.find({})

  res.status(200).json({
    status: 200,
    success: true,
    message: '',
    data: {aboutUs},
  });
});

exports.index = catchAsync(async (req, res, next) => {
  const aboutUs = await AboutUs.find( req.query.query ? JSON.parse(decodeURIComponent(req.query.query)) : {})

  res.status(200).json({
    status: 200,
    success: true,
    message: '',
    data: {aboutUs},
  });
});

exports.store = catchAsync(async (req, res, next) => {
  const aboutUs = await AboutUs.create({...JSON.parse(JSON.stringify(req.body)), user: req.user._id});

  res.status(200).json({
    status: 200,
    success: true,
    message: 'AboutUs Created Successfully',
    data: {aboutUs},
  });
});

exports.update = catchAsync(async (req, res, next) => {
    const aboutUs = await AboutUs.findByIdAndUpdate(req.params.id, {$set: JSON.parse(JSON.stringify(req.body))}, { new: true });
  
    res.status(200).json({
      status: 200,
      success: true,
      message: 'AboutUs Edited',
      data: {aboutUs},
    });
});

exports.delete = catchAsync(async (req, res, next) => {
  let aboutUs =  await AboutUs.findOne(req.params.id ? { _id: req.params.id } : JSON.parse(decodeURIComponent(req.query)))
  aboutUs = await TxDeleter.deleteOne("AboutUs", req.params.id)

  res.status(200).json({
      status: 200,
      success: true,
      message: 'AboutUs Deleted',
      data: {aboutUs},
    });
});
