"use strict";

var catchAsync = require("../Utils/catchAsync");

var Quiz = require('../Models/quizModel');

var User = require('../Models/userModel');

var Submission = require('../Models/submissionModel');

exports.index = catchAsync(function _callee(req, res, next) {
  var quizes, topScorers;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = JSON;
          _context.t1 = JSON;
          _context.next = 4;
          return regeneratorRuntime.awrap(Quiz.find({}).sort({
            deadline: -1
          }));

        case 4:
          _context.t2 = _context.sent;
          _context.t3 = _context.t1.stringify.call(_context.t1, _context.t2);
          quizes = _context.t0.parse.call(_context.t0, _context.t3);
          _context.next = 9;
          return regeneratorRuntime.awrap(User.find({}).sort({
            score: -1
          }));

        case 9:
          topScorers = _context.sent;
          return _context.abrupt("return", res.json({
            status: 200,
            success: true,
            message: "",
            data: {
              topScorers: topScorers,
              quizes: quizes
            }
          }));

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.store = catchAsync(function _callee2(req, res, next) {
  var quiz;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Quiz.create(JSON.parse(JSON.stringify(req.body.quiz))));

        case 2:
          quiz = _context2.sent;
          return _context2.abrupt("return", res.json({
            status: 200,
            success: true,
            message: "",
            data: {
              quiz: quiz
            }
          }));

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.update = catchAsync(function _callee3(req, res, next) {
  var quiz;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Quiz.findByIdAndUpdate(req.params.id, JSON.parse(JSON.stringify(req.body.quiz)), {
            "new": true
          }));

        case 2:
          quiz = _context3.sent;
          return _context3.abrupt("return", res.json({
            status: 200,
            success: true,
            message: "",
            data: {
              quiz: quiz
            }
          }));

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports["delete"] = catchAsync(function _callee4(req, res, next) {
  var quiz;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Quiz.deleteOne({
            _id: req.params.id
          }));

        case 2:
          quiz = _context4.sent;
          return _context4.abrupt("return", res.json({
            status: 200,
            success: true,
            message: "",
            data: {
              quiz: quiz
            }
          }));

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
});