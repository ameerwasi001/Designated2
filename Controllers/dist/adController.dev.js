"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var User = require("../Models/userModel");

var Ad = require("../Models/adModel");

var catchAsync = require("./../Utils/catchAsync");

var AppError = require("./../Utils/appError");

exports.store = catchAsync(function _callee(req, res, next) {
  var ad;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Ad.create(_objectSpread({}, JSON.parse(JSON.stringify(req.body)), {
            user: req.user._id
          })));

        case 2:
          ad = _context.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: 'Ad Created Successfully',
            data: {
              ad: ad
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
  var ad;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Ad.findByIdAndUpdate(req.params.id, {
            $set: JSON.parse(JSON.stringify(req.body))
          }, {
            "new": true
          }));

        case 2:
          ad = _context2.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: 'Ad Edited',
            data: {
              ad: ad
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
  var ad;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Ad.remove({
            _id: req.params.id
          }));

        case 2:
          ad = _context3.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: 'Ad deleted',
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
  var ads;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Ad.find({}).populate('user').sort({
            _id: -1
          }));

        case 2:
          ads = _context4.sent;
          return _context4.abrupt("return", res.status(200).json({
            status: 200,
            success: true,
            message: '',
            data: {
              ads: ads
            }
          }));

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
});