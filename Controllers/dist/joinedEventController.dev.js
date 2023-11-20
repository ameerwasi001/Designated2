"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var User = require("../Models/userModel");

var Event = require("../Models/eventModel");

var JoinedEvent = require("../Models/joinedEventModel");

var catchAsync = require("./../Utils/catchAsync");

var AppError = require("./../Utils/appError");

exports.store = catchAsync(function _callee(req, res, next) {
  var event;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(JoinedEvent.create(_objectSpread({}, JSON.parse(JSON.stringify(req.body)), {
            user: req.user._id,
            event: req.params.id
          })));

        case 2:
          event = _context.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: 'Joined successfully',
            data: {
              event: event
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
  var event;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(JoinedEvent.findOneAndUpdate({
            event: req.params.id,
            user: req.user._id
          }, {
            $set: JSON.parse(JSON.stringify(req.body))
          }, {
            "new": true
          }));

        case 2:
          event = _context2.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: '',
            data: {
              event: event
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
  var event;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(JoinedEvent.remove({
            event: req.params.id,
            user: req.user._id
          }));

        case 2:
          event = _context3.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: 'Unjoined the event successfully',
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
  var joinedEvents;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.t0 = JSON;
          _context4.t1 = JSON;
          _context4.next = 4;
          return regeneratorRuntime.awrap(JoinedEvent.find({}).populate('user').populate('event'));

        case 4:
          _context4.t2 = _context4.sent;
          _context4.t3 = _context4.t1.stringify.call(_context4.t1, _context4.t2);

          _context4.t4 = function (obj) {
            return _objectSpread({}, obj.event, {
              status: obj.status
            });
          };

          joinedEvents = _context4.t0.parse.call(_context4.t0, _context4.t3).map(_context4.t4);
          return _context4.abrupt("return", res.json({
            status: 200,
            success: true,
            message: "",
            data: {
              events: joinedEvents
            }
          }));

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  });
});