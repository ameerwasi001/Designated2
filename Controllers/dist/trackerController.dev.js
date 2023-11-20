"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var User = require("../Models/userModel");

var Tracker = require("../Models/trackerModel");

var catchAsync = require("./../Utils/catchAsync");

var AppError = require("./../Utils/appError");

function firstDayOfWeek(dateObject) {
  var firstDayOfWeekIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var dayOfWeek = dateObject.getDay(),
      firstDayOfWeek = new Date(dateObject),
      diff = dayOfWeek >= firstDayOfWeekIndex ? dayOfWeek - firstDayOfWeekIndex : 6 - dayOfWeek;
  firstDayOfWeek.setDate(dateObject.getDate() - diff);
  firstDayOfWeek.setHours(0, 0, 0, 0);
  return firstDayOfWeek;
}

exports.store = catchAsync(function _callee(req, res, next) {
  var tracker;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Tracker.create(_objectSpread({}, JSON.parse(JSON.stringify(req.body)), {
            user: req.user._id
          })));

        case 2:
          tracker = _context.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: 'Tracker Created Successfully',
            data: {
              tracker: tracker
            }
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.all = catchAsync(function _callee2(req, res) {
  var day, trackers, trackerObj, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, tracker, allTrackers;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          day = 60 * 60 * 24 * 1000;
          _context2.t0 = JSON;
          _context2.t1 = JSON;
          _context2.next = 5;
          return regeneratorRuntime.awrap(Tracker.find({
            user: req.user._id
          }).sort({
            _id: -1
          }));

        case 5:
          _context2.t2 = _context2.sent;
          _context2.t3 = _context2.t1.stringify.call(_context2.t1, _context2.t2);
          trackers = _context2.t0.parse.call(_context2.t0, _context2.t3);
          trackerObj = {};
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 12;

          for (_iterator = trackers[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            tracker = _step.value;
            if (trackerObj[tracker.name]) trackerObj[tracker.name].push(tracker);else trackerObj[tracker.name] = [tracker];
          }

          _context2.next = 20;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t4 = _context2["catch"](12);
          _didIteratorError = true;
          _iteratorError = _context2.t4;

        case 20:
          _context2.prev = 20;
          _context2.prev = 21;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 23:
          _context2.prev = 23;

          if (!_didIteratorError) {
            _context2.next = 26;
            break;
          }

          throw _iteratorError;

        case 26:
          return _context2.finish(23);

        case 27:
          return _context2.finish(20);

        case 28:
          console.log(trackerObj);
          allTrackers = Object.entries(trackerObj).map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                k = _ref2[0],
                vs = _ref2[1];

            return [k, vs[vs.length - 1], new Array(7).fill(0).map(function (_, i) {
              return new Date(firstDayOfWeek(new Date("".concat(req.query.date, "T00:00:00Z"))).getTime() + i * day).toISOString();
            }) // .map(t => trackers.filter(a => a.date == t.split('T')[0]).map(({value}) => value)[0] ?? 0)
            ];
          });
          return _context2.abrupt("return", res.json({
            success: true,
            status: 200,
            message: "",
            data: {
              trackers: allTrackers
            }
          }));

        case 31:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[12, 16, 20, 28], [21,, 23, 27]]);
});
exports.index = catchAsync(function _callee3(req, res) {
  var trackers, trackerByDate, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, tracker;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Tracker.find({
            name: req.query.name
          }).populate('user').sort({
            _id: -1
          }));

        case 2:
          trackers = _context3.sent;
          trackerByDate = {};
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context3.prev = 7;

          for (_iterator2 = trackers[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            tracker = _step2.value;
            if (trackerByDate["".concat(tracker.date)]) trackerByDate["".concat(tracker.date)].push(tracker);else trackerByDate["".concat(tracker.date)] = [tracker];
          }

          _context3.next = 15;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](7);
          _didIteratorError2 = true;
          _iteratorError2 = _context3.t0;

        case 15:
          _context3.prev = 15;
          _context3.prev = 16;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 18:
          _context3.prev = 18;

          if (!_didIteratorError2) {
            _context3.next = 21;
            break;
          }

          throw _iteratorError2;

        case 21:
          return _context3.finish(18);

        case 22:
          return _context3.finish(15);

        case 23:
          return _context3.abrupt("return", res.status(200).json({
            status: 200,
            success: true,
            message: '',
            data: {
              trackerByDate: trackerByDate
            }
          }));

        case 24:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[7, 11, 15, 23], [16,, 18, 22]]);
});