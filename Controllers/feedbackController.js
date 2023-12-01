const Feedback = require("../Models/feedbackModel.js");
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
  const feedback = await Feedback.find({})

  res.status(200).json({
    status: 200,
    success: true,
    message: '',
    data: { feedback },
  });
});

exports.index = catchAsync(async (req, res, next) => {
  let feedback = await Feedback.find(req.query.query ? JSON.parse(decodeURIComponent(req.query.query)) : {})

  feedback?.length > 0 ? (feedback = feedback.sort((a, b) => b.createdAt - a.createdAt)) : null;

  res.status(200).json({
    status: 200,
    success: true,
    message: '',
    data: { feedback },
  });
});

exports.store = catchAsync(async (req, res, next) => {
  const feedback = await Feedback.create({ ...JSON.parse(JSON.stringify(req.body)), user: req.user._id });

  res.status(200).json({
    status: 200,
    success: true,
    message: 'Feedback Created Successfully',
    data: { feedback },
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const feedback = await Feedback.findByIdAndUpdate(req.params.id, { $set: JSON.parse(JSON.stringify(req.body)) }, { new: true });

  res.status(200).json({
    status: 200,
    success: true,
    message: 'Feedback Edited',
    data: { feedback },
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  let feedback = await Feedback.findOne(req.params.id ? { _id: req.params.id } : JSON.parse(decodeURIComponent(req.query)))
  feedback = await TxDeleter.deleteOne("Feedback", req.params.id)

  res.status(200).json({
    status: 200,
    success: true,
    message: 'Feedback Deleted',
    data: { feedback },
  });
});
