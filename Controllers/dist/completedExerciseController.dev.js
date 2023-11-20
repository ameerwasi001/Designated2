"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var User = require("../Models/userModel");

var Workout = require("../Models/workoutModel");

var CompletedExercise = require("../Models/completedExerciseModel");

var catchAsync = require("./../Utils/catchAsync");

var AppError = require("./../Utils/appError");

exports.store = catchAsync(function _callee(req, res, next) {
  var completedExercise;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(CompletedExercise.create(_objectSpread({}, JSON.parse(JSON.stringify(req.body)), {
            user: req.user._id,
            exercise: req.params.id
          })));

        case 2:
          completedExercise = _context.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: 'Exercise Completed Successfully',
            data: {
              completedExercise: completedExercise
            }
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.index = catchAsync(function _callee2(req, res, next) {
  var today, yesterday, todayData, yesterData, notifications;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(CompletedExercise.find({
            completedDate: req.query.completedDate,
            user: req.user._id
          }).populate('exercise'));

        case 2:
          today = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(CompletedExercise.find({
            completedDate: req.query.completedDate.split('-').map(function (x, i) {
              return i == 2 ? x - 1 <= 9 ? "0".concat(x - 1) : x - 1 : x;
            }).join('-'),
            user: req.user._id
          }).populate('exercise'));

        case 5:
          yesterday = _context2.sent;
          todayData = today.map(function (data) {
            return {
              text: "You have completed ".concat(data.exercise.name, " exercise"),
              time: data.createdAt,
              exercise: data.exercise
            };
          });
          yesterData = yesterday.map(function (data) {
            return {
              text: "You have completed ".concat(data.exercise.name, " exercise"),
              time: data.createdAt,
              exercise: data.exercise
            };
          });
          notifications = [todayData.length ? {
            title: "Today",
            data: todayData
          } : undefined, yesterData.length ? {
            title: "Yesterday",
            data: yesterday.map(function (data) {
              return {
                text: "You have completed ".concat(data.exercise.name, " exercise"),
                time: data.createdAt,
                exercise: data.exercise
              };
            })
          } : undefined].filter(function (x) {
            return !!x;
          });
          res.status(200).json({
            status: 200,
            success: true,
            message: '',
            data: {
              notifications: notifications
            }
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  });
});