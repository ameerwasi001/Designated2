"use strict";

var catchAsync = require("../Utils/catchAsync");

var Quiz = require('../Models/quizModel');

var Submission = require('../Models/submissionModel');

var User = require('../Models/userModel');

var History = require('../Models/quizHistoryModel');

exports.index = catchAsync(function _callee(req, res, next) {
  var quizes, submissions, score, totalScore;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Quiz.find({}));

        case 2:
          quizes = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(Submission.find({
            user: req.user._id
          }).populate('quiz'));

        case 5:
          submissions = _context.sent;
          score = submissions.map(function (s) {
            return s.score;
          }).reduce(function (a, b) {
            return a + b;
          }, 0);
          totalScore = quizes.map(function (q) {
            return q.questions.length;
          }).reduce(function (a, b) {
            return a + b;
          }, 0);
          return _context.abrupt("return", res.json({
            status: 200,
            success: true,
            message: "",
            data: {
              submissions: submissions,
              allQuizesNumber: quizes.length,
              score: score,
              totalScore: totalScore
            }
          }));

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.store = catchAsync(function _callee2(req, res) {
  var score, submission, topScorers, quizFull;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("Submission =>", req.body);
          score = req.body.data.filter(function (data) {
            return data.correct;
          }).length;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Submission.create({
            user: req.user._id,
            quiz: req.body.quiz,
            data: req.body.data,
            score: score
          }));

        case 4:
          submission = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(User.updateOne({
            _id: req.user._id
          }, {
            $inc: {
              score: score
            }
          }));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(History.create({
            user: req.user._id,
            quiz: req.body.quiz,
            submission: submission._id
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(Submission.find({
            quiz: req.body.quiz
          }).sort({
            score: 1
          }));

        case 11:
          topScorers = _context2.sent;
          _context2.next = 14;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user._id, {
            $inc: {
              score: score
            }
          }));

        case 14:
          _context2.next = 16;
          return regeneratorRuntime.awrap(Quiz.findOne({
            _id: req.body.quiz
          }));

        case 16:
          quizFull = _context2.sent;
          return _context2.abrupt("return", res.json({
            status: 200,
            success: true,
            message: "",
            data: {
              submission: submission,
              topScorers: topScorers,
              quiz: quizFull
            }
          }));

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  });
});