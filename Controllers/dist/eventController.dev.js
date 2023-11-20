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
          return regeneratorRuntime.awrap(Event.create(_objectSpread({}, JSON.parse(JSON.stringify(req.body)), {
            user: req.user._id
          }), {
            "new": true
          }));

        case 2:
          event = _context.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: 'Event Joined',
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
          return regeneratorRuntime.awrap(Event.findByIdAndUpdate(req.params.id, {
            $set: JSON.parse(JSON.stringify(req.body))
          }, {
            "new": true
          }));

        case 2:
          event = _context2.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: 'Event Joined',
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
          return regeneratorRuntime.awrap(Event.remove({
            _id: req.params.id
          }));

        case 2:
          event = _context3.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: 'Appointment requested successfully',
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
  var events, joinedEvents, isJoinedDict, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, event;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Event.find({}).populate('user').sort({
            _id: -1
          }));

        case 2:
          events = _context4.sent;
          _context4.next = 5;
          return regeneratorRuntime.awrap(JoinedEvent.find({
            user: req.user._id
          }));

        case 5:
          joinedEvents = _context4.sent;
          isJoinedDict = {};
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context4.prev = 10;

          for (_iterator = joinedEvents[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            event = _step.value;
            if ("".concat(event.user) == "".concat(req.user._id)) isJoinedDict["".concat(event.event)] = true;
          }

          _context4.next = 18;
          break;

        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](10);
          _didIteratorError = true;
          _iteratorError = _context4.t0;

        case 18:
          _context4.prev = 18;
          _context4.prev = 19;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 21:
          _context4.prev = 21;

          if (!_didIteratorError) {
            _context4.next = 24;
            break;
          }

          throw _iteratorError;

        case 24:
          return _context4.finish(21);

        case 25:
          return _context4.finish(18);

        case 26:
          events = events.filter(function (ev) {
            return !!ev.user;
          }).filter(function (event) {
            return !isJoinedDict["".concat(event._id)];
          });
          return _context4.abrupt("return", res.status(200).json({
            status: 200,
            success: true,
            message: '',
            data: {
              events: events
            }
          }));

        case 28:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[10, 14, 18, 26], [19,, 21, 25]]);
});