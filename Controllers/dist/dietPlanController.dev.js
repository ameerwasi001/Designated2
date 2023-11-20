"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var User = require("../Models/userModel");

var DietPlan = require("../Models/dietPlanModel");

var catchAsync = require("./../Utils/catchAsync");

var AppError = require("./../Utils/appError");

exports.store = catchAsync(function _callee(req, res, next) {
  var dietPlan;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(DietPlan.create(_objectSpread({}, JSON.parse(JSON.stringify(req.body)), {
            user: req.user._id
          }), {
            "new": true
          }));

        case 2:
          dietPlan = _context.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: 'DietPlan Created Successfully',
            data: {
              dietPlan: dietPlan
            }
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.update = catchAsync(function _callee2(req, res, next) {
  var dietPlan;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(DietPlan.findByIdAndUpdate(req.params.id, {
            $set: JSON.parse(JSON.stringify(req.body))
          }, {
            "new": true
          }));

        case 2:
          dietPlan = _context2.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: 'DietPlan Edited',
            data: {
              dietPlan: dietPlan
            }
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports["delete"] = catchAsync(function _callee3(req, res, next) {
  var dietPlan;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(DietPlan.remove({
            _id: req.params.id
          }));

        case 2:
          dietPlan = _context3.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: 'DietPlan deleted',
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
  var dietPlans, dietPlanObj, dietPlanArr, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _dietPlan, dietPlan;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(DietPlan.find({}).populate('user').sort({
            _id: -1
          }));

        case 2:
          dietPlans = _context4.sent;
          dietPlanObj = {};
          dietPlanArr = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context4.prev = 8;

          for (_iterator = dietPlans[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _dietPlan = _step.value;
            if (dietPlanObj["".concat(_dietPlan.recipeType)]) dietPlanObj["".concat(_dietPlan.recipeType)].push(_dietPlan);else dietPlanObj["".concat(_dietPlan.recipeType)] = [_dietPlan];
          }

          _context4.next = 16;
          break;

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](8);
          _didIteratorError = true;
          _iteratorError = _context4.t0;

        case 16:
          _context4.prev = 16;
          _context4.prev = 17;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 19:
          _context4.prev = 19;

          if (!_didIteratorError) {
            _context4.next = 22;
            break;
          }

          throw _iteratorError;

        case 22:
          return _context4.finish(19);

        case 23:
          return _context4.finish(16);

        case 24:
          for (dietPlan in dietPlanObj) {
            dietPlanArr.push([dietPlan, dietPlanObj[dietPlan]]);
          }

          return _context4.abrupt("return", res.status(200).json({
            status: 200,
            success: true,
            message: '',
            data: {
              dietPlans: dietPlanArr
            }
          }));

        case 26:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[8, 12, 16, 24], [17,, 19, 23]]);
});