"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var multer = require("multer");

var sharp = require("sharp");

var User = require("../Models/userModel");

var Appointment = require("../Models/appointmentModel");

var Review = require("../Models/reviewModel.js");

var catchAsync = require("./../Utils/catchAsync");

var AppError = require("./../Utils/appError");

var factory = require("./handlersFactory");

var multerStorage = multer.memoryStorage();

var multerFilter = function multerFilter(req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

var upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
exports.uploadUserPhoto = upload.single("photo");
exports.resizeUserPhoto = catchAsync(function _callee(req, res, next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.file) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next());

        case 2:
          req.file.filename = "user-".concat(req.user.id, "-").concat(Date.now(), ".jpeg");
          _context.next = 5;
          return regeneratorRuntime.awrap(sharp(req.file.buffer).resize(500, 500).toFormat("jpeg").jpeg({
            quality: 90
          }).toFile("public/img/users/".concat(req.file.filename)));

        case 5:
          next();

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
});

var filterObj = function filterObj(obj) {
  for (var _len = arguments.length, allowedFields = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    allowedFields[_key - 1] = arguments[_key];
  }

  var newObj = {};
  Object.keys(obj).forEach(function (el) {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = function (req, res, next) {
  req.params.id = req.user.id;
  next();
};

exports.beABuddy = catchAsync(function _callee2(req, res, next) {
  var updatedUser;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user._id, {
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            occupation: req.body.occupation,
            language: req.body.language,
            location: req.body.location,
            description: req.body.description,
            image: req.body.image,
            specialSkills: req.body.specialSkills,
            aloneBuddy: true
          }, {
            "new": true,
            runValidators: false
          }));

        case 2:
          updatedUser = _context2.sent;
          res.status(200).json({
            status: 200,
            success: true,
            data: {
              user: updatedUser
            }
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.updateMe = catchAsync(function _callee3(req, res, next) {
  var filteredBody, updatedUser;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!(req.body.password || req.body.passwordConfirm)) {
            _context3.next = 2;
            break;
          }

          return _context3.abrupt("return", next(new AppError("This route is not for password updates. Please use /updateMyPassword.", 400)));

        case 2:
          // 2) Filtered out unwanted fields names that are not allowed to be updated
          filteredBody = filterObj(req.body, "name", "email");
          if (req.file) filteredBody.photo = req.file.filename; // 3) Update user document

          _context3.next = 6;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, filteredBody, {
            "new": true,
            runValidators: true
          }));

        case 6:
          updatedUser = _context3.sent;
          res.status(200).json({
            status: 200,
            success: true,
            data: {
              user: updatedUser
            }
          });

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  });
});
exports.deleteMe = catchAsync(function _callee4(req, res, next) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            active: false
          }));

        case 2:
          res.status(204).json({
            status: 204,
            success: true,
            data: null
          });

        case 3:
        case "end":
          return _context4.stop();
      }
    }
  });
});
exports.topScorers = catchAsync(function _callee5(req, res, next) {
  var users;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(User.find({}).sort({
            score: -1
          }));

        case 2:
          users = _context5.sent;
          res.status(200).json({
            status: 200,
            success: true,
            message: '',
            data: {
              users: users
            }
          });

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
});
exports.updateProfile = catchAsync(function _callee6(req, res) {
  var body, user;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log("Hu!");
          body = JSON.parse(JSON.stringify(req.body));
          _context6.next = 4;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.user.id, {
            $set: _objectSpread({}, body)
          }, {
            "new": true
          }));

        case 4:
          user = _context6.sent;
          res.status(200).json({
            status: 200,
            message: "Profile Updated Successfully",
            success: true,
            data: {
              user: user
            }
          });

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
});
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User); // Do NOT update passwords with this!

exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);