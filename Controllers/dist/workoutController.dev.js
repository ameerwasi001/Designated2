"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var User = require("../Models/userModel");

var Workout = require("../Models/workoutModel");

var CompletedExercise = require('../Models/completedExerciseModel');

var Exercise = require("../Models/exerciseModel");

var catchAsync = require("./../Utils/catchAsync");

var AppError = require("./../Utils/appError");

exports.store = catchAsync(function _callee(req, res, next) {
  var obj, newExercises, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, exercise, newExercise, workout;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          obj = _objectSpread({}, JSON.parse(JSON.stringify(req.body)), {
            user: req.user._id
          });
          newExercises = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 5;
          _iterator = obj.exercises[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 16;
            break;
          }

          exercise = _step.value;
          _context.next = 11;
          return regeneratorRuntime.awrap(Exercise.create(_objectSpread({}, exercise, {
            user: req.user._id
          })));

        case 11:
          newExercise = _context.sent;
          newExercises.push(newExercise._id);

        case 13:
          _iteratorNormalCompletion = true;
          _context.next = 7;
          break;

        case 16:
          _context.next = 22;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](5);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 22:
          _context.prev = 22;
          _context.prev = 23;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 25:
          _context.prev = 25;

          if (!_didIteratorError) {
            _context.next = 28;
            break;
          }

          throw _iteratorError;

        case 28:
          return _context.finish(25);

        case 29:
          return _context.finish(22);

        case 30:
          obj.exercises = newExercises;
          _context.next = 33;
          return regeneratorRuntime.awrap(Workout.create(obj));

        case 33:
          workout = _context.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: 'Workout Created Successfully',
            data: {
              workout: workout
            }
          });

        case 35:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 18, 22, 30], [23,, 25, 29]]);
});
exports.update = catchAsync(function _callee2(req, res, next) {
  var obj, newExercises, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, exercise, newExercise, workout;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          obj = _objectSpread({}, JSON.parse(JSON.stringify(req.body)), {
            user: req.user._id
          });
          newExercises = [];
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context2.prev = 5;
          _iterator2 = obj.exercises[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context2.next = 16;
            break;
          }

          exercise = _step2.value;
          _context2.next = 11;
          return regeneratorRuntime.awrap(Exercise.create(_objectSpread({}, exercise, {
            user: req.user._id
          })));

        case 11:
          newExercise = _context2.sent;
          newExercises.push(newExercise._id);

        case 13:
          _iteratorNormalCompletion2 = true;
          _context2.next = 7;
          break;

        case 16:
          _context2.next = 22;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](5);
          _didIteratorError2 = true;
          _iteratorError2 = _context2.t0;

        case 22:
          _context2.prev = 22;
          _context2.prev = 23;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 25:
          _context2.prev = 25;

          if (!_didIteratorError2) {
            _context2.next = 28;
            break;
          }

          throw _iteratorError2;

        case 28:
          return _context2.finish(25);

        case 29:
          return _context2.finish(22);

        case 30:
          obj.exercises = newExercises;
          _context2.next = 33;
          return regeneratorRuntime.awrap(Workout.findOneAndUpdate({
            _id: req.params.id
          }, obj, {
            "new": true
          }));

        case 33:
          workout = _context2.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: 'Workout Created Successfully',
            data: {
              workout: workout
            }
          });

        case 35:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[5, 18, 22, 30], [23,, 25, 29]]);
});
exports["delete"] = catchAsync(function _callee3(req, res, next) {
  var workout;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Workout.remove({
            _id: req.params.id
          }));

        case 2:
          workout = _context3.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: 'Workout deleted',
            data: {}
          });

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.index = catchAsync(function _callee4(req, res) {
  var workouts, completedExercises, completedExerciseSet, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, workout, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, ex, noOfCompletedWorkouts;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.t0 = JSON;
          _context4.t1 = JSON;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Workout.find({}).populate('user').populate('exercises'));

        case 4:
          _context4.t2 = _context4.sent;
          _context4.t3 = _context4.t1.stringify.call(_context4.t1, _context4.t2);
          workouts = _context4.t0.parse.call(_context4.t0, _context4.t3);
          _context4.next = 9;
          return regeneratorRuntime.awrap(CompletedExercise.find({
            user: req.user._id,
            completedDate: req.query.currentDate
          }));

        case 9:
          completedExercises = _context4.sent;
          completedExerciseSet = new Set(completedExercises.map(function (ex) {
            return "".concat(ex.exercise._id);
          }));
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context4.prev = 14;
          _iterator3 = workouts[Symbol.iterator]();

        case 16:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context4.next = 42;
            break;
          }

          workout = _step3.value;
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context4.prev = 21;

          for (_iterator4 = workout.exercises[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            ex = _step4.value;
            ex.done = completedExerciseSet.has("".concat(ex._id));
          }

          _context4.next = 29;
          break;

        case 25:
          _context4.prev = 25;
          _context4.t4 = _context4["catch"](21);
          _didIteratorError4 = true;
          _iteratorError4 = _context4.t4;

        case 29:
          _context4.prev = 29;
          _context4.prev = 30;

          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }

        case 32:
          _context4.prev = 32;

          if (!_didIteratorError4) {
            _context4.next = 35;
            break;
          }

          throw _iteratorError4;

        case 35:
          return _context4.finish(32);

        case 36:
          return _context4.finish(29);

        case 37:
          noOfCompletedWorkouts = workout.exercises.filter(function (ex) {
            return ex.done;
          }).length;
          if (noOfCompletedWorkouts == workout.exercises.length) workout.done = true;

        case 39:
          _iteratorNormalCompletion3 = true;
          _context4.next = 16;
          break;

        case 42:
          _context4.next = 48;
          break;

        case 44:
          _context4.prev = 44;
          _context4.t5 = _context4["catch"](14);
          _didIteratorError3 = true;
          _iteratorError3 = _context4.t5;

        case 48:
          _context4.prev = 48;
          _context4.prev = 49;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 51:
          _context4.prev = 51;

          if (!_didIteratorError3) {
            _context4.next = 54;
            break;
          }

          throw _iteratorError3;

        case 54:
          return _context4.finish(51);

        case 55:
          return _context4.finish(48);

        case 56:
          return _context4.abrupt("return", res.status(200).json({
            status: 200,
            success: true,
            message: '',
            data: {
              workouts: workouts
            }
          }));

        case 57:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[14, 44, 48, 56], [21, 25, 29, 37], [30,, 32, 36], [49,, 51, 55]]);
});