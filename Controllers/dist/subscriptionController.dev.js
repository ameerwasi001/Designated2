"use strict";

var User = require('../Models/userModel');

var cron = require('node-cron');

var stripe = require('stripe')("".concat(process.env.STRIPE_SECRET_KEY));

var allSubscriptionTypes = {
  monthly: {
    type: "Monthly",
    price: 5,
    features: [{
      available: true,
      value: 'A'
    }, {
      available: true,
      value: 'B'
    }, {
      available: true,
      value: 'C'
    }]
  },
  yearly: {
    type: "Yearly",
    price: 50,
    features: [{
      available: true,
      value: 'A'
    }, {
      available: false,
      value: 'B'
    }, {
      available: true,
      value: 'C'
    }]
  },
  free: {
    type: "Free",
    price: 0,
    features: [{
      available: true,
      value: 'A'
    }, {
      available: false,
      value: 'B'
    }, {
      available: false,
      value: 'C'
    }]
  }
};

var ResponseObject = function ResponseObject(status, success, message, data) {
  return {
    status: status,
    success: success,
    message: message,
    data: data
  };
};

module.exports.isLocked = function _callee(req, res, next) {
  var userId, user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = req.user._id;
          _context.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            _id: userId
          }));

        case 4:
          user = _context.sent;
          return _context.abrupt("return", res.status(200).send(ResponseObject(200, true, '', {
            locked: user.locked
          })));

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          return _context.abrupt("return", res.status(500).send(ResponseObject(500, false, 'Server Error', {})));

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports.unlock = function _callee2(req, res, next) {
  var valid, userId, user, token, source, subscriptionType, sub, userRefetch;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          valid = {
            success: true
          };

          if (!valid.success) {
            _context2.next = 29;
            break;
          }

          userId = req.user._id;
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            _id: userId
          }));

        case 6:
          user = _context2.sent;
          _context2.next = 9;
          return regeneratorRuntime.awrap(stripe.tokens.create({
            card: {
              number: req.body.number,
              exp_month: req.body.exp_month,
              exp_year: req.body.exp_year,
              cvc: req.body.cvc
            }
          }));

        case 9:
          token = _context2.sent;
          console.log(user, user.customerId);
          _context2.next = 13;
          return regeneratorRuntime.awrap(stripe.customers.createSource(user.customerId, {
            source: token.id
          }));

        case 13:
          source = _context2.sent;
          _context2.next = 16;
          return regeneratorRuntime.awrap(stripe.customers.update(user.customerId, {
            default_source: source.id
          }));

        case 16:
          subscriptionType = null;
          if (req.body.yearly === 'true') subscriptionType = process.env.STRIPE_YEARLY_PRICE;else subscriptionType = process.env.STRIPE_MONTHLY_PRICE;
          _context2.next = 20;
          return regeneratorRuntime.awrap(stripe.subscriptions.create({
            customer: user.customerId,
            items: [{
              price: subscriptionType
            }]
          }));

        case 20:
          sub = _context2.sent;
          _context2.next = 23;
          return regeneratorRuntime.awrap(User.updateOne({
            _id: userId
          }, {
            $set: {
              hasCardInfo: true,
              locked: false,
              subscriptionId: sub.id,
              subscriptionType: req.body.yearly === 'true' ? 'yearly' : 'monthly'
            }
          }));

        case 23:
          _context2.next = 25;
          return regeneratorRuntime.awrap(User.findOne({
            _id: user._id
          }));

        case 25:
          userRefetch = _context2.sent;
          return _context2.abrupt("return", res.status(200).send(ResponseObject(200, true, 'Payment Was Successful', {
            user: userRefetch
          })));

        case 29:
          return _context2.abrupt("return", res.status(200).send(valid));

        case 30:
          _context2.next = 36;
          break;

        case 32:
          _context2.prev = 32;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          return _context2.abrupt("return", res.status(500).send(ResponseObject(500, false, 'Server Error', {})));

        case 36:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 32]]);
};

module.exports.cancel = function _callee3(req, res, next) {
  var valid, user, userRefetch;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          valid = {
            success: true
          };

          if (!valid.success) {
            _context3.next = 16;
            break;
          }

          _context3.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            _id: req.user._id
          }));

        case 5:
          user = _context3.sent;
          _context3.next = 8;
          return regeneratorRuntime.awrap(stripe.subscriptions.del(user.subscriptionId));

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            _id: req.user._id
          }, {
            $set: {
              subscriptionId: "",
              subscriptionType: "",
              locked: true
            }
          }));

        case 10:
          _context3.next = 12;
          return regeneratorRuntime.awrap(User.findOne({
            _id: user._id
          }));

        case 12:
          userRefetch = _context3.sent;
          return _context3.abrupt("return", res.status(200).send(ResponseObject(200, true, 'Subscription Cancelled Successfully', {
            user: userRefetch
          })));

        case 16:
          return _context3.abrupt("return", res.status(200).send(valid));

        case 17:
          _context3.next = 23;
          break;

        case 19:
          _context3.prev = 19;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          return _context3.abrupt("return", res.status(500).send(ResponseObject(500, false, 'Server Error', {})));

        case 23:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

module.exports.current = function _callee4(req, res, next) {
  var user;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            _id: req.user._id
          }));

        case 3:
          user = _context4.sent;
          console.log(user);
          return _context4.abrupt("return", res.json(ResponseObject(200, true, 'Current Subscription Type Retrieved Successfully', {
            subscriptionType: user.subscriptionType,
            locked: user.locked,
            subscriptionData: allSubscriptionTypes[user.subscriptionType ? user.subscriptionType : 'free']
          })));

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);
          return _context4.abrupt("return", res.status(500).send(ResponseObject(500, false, 'Server Error', {})));

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports.types = function _callee5(req, res, next) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          return _context5.abrupt("return", res.json(ResponseObject(200, true, 'Current Subscription Type Retrieved Successfully', {
            types: Object.values(allSubscriptionTypes)
          })));

        case 4:
          _context5.prev = 4;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);
          return _context5.abrupt("return", res.status(500).send(ResponseObject(500, false, 'Server Error', {})));

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 4]]);
};

module.exports.resubscribe = function _callee6(req, res, next) {
  var valid, userId, user, token, source, subscriptionType, sub, userRefetch;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          valid = {
            success: true
          };

          if (!valid.success) {
            _context6.next = 32;
            break;
          }

          userId = req.user._id;
          _context6.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            _id: req.user._id
          }));

        case 6:
          user = _context6.sent;
          _context6.next = 9;
          return regeneratorRuntime.awrap(stripe.subscriptions.del(user.subscriptionId));

        case 9:
          _context6.next = 11;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            _id: req.user._id
          }, {
            $set: {
              subscriptionId: ""
            }
          }));

        case 11:
          _context6.next = 13;
          return regeneratorRuntime.awrap(stripe.tokens.create({
            card: {
              number: req.body.number,
              exp_month: req.body.exp_month,
              exp_year: req.body.exp_year,
              cvc: req.body.cvc
            }
          }));

        case 13:
          token = _context6.sent;
          _context6.next = 16;
          return regeneratorRuntime.awrap(stripe.customers.createSource(user.customerId, {
            source: token.id
          }));

        case 16:
          source = _context6.sent;
          _context6.next = 19;
          return regeneratorRuntime.awrap(stripe.customers.update(user.customerId, {
            default_source: source.id
          }));

        case 19:
          subscriptionType = null;
          if (req.body.yearly === 'true') subscriptionType = process.env.STRIPE_YEARLY_PRICE;else subscriptionType = process.env.STRIPE_MONTHLY_PRICE;
          _context6.next = 23;
          return regeneratorRuntime.awrap(stripe.subscriptions.create({
            customer: user.customerId,
            items: [{
              price: subscriptionType
            }]
          }));

        case 23:
          sub = _context6.sent;
          _context6.next = 26;
          return regeneratorRuntime.awrap(User.updateOne({
            _id: userId
          }, {
            hasCardInfo: true,
            locked: false,
            subscriptionId: sub.id,
            subscriptionType: req.body.yearly === 'true' ? 'yearly' : 'monthly'
          }));

        case 26:
          _context6.next = 28;
          return regeneratorRuntime.awrap(User.findOne({
            _id: user._id
          }));

        case 28:
          userRefetch = _context6.sent;
          return _context6.abrupt("return", res.status(200).send(ResponseObject(200, true, "You are now a ".concat(req.body.yearly === 'true' ? 'yearly' : 'monthly', " subscriber"), {
            user: userRefetch
          })));

        case 32:
          return _context6.abrupt("return", res.status(200).send(valid));

        case 33:
          _context6.next = 39;
          break;

        case 35:
          _context6.prev = 35;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);
          return _context6.abrupt("return", res.status(500).send(ResponseObject(500, false, 'Server Error', {})));

        case 39:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 35]]);
};

cron.schedule("0 */15 * * * *", function _callee7() {
  var oneMinute, oneHour, oneDay, sevenDays;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          oneMinute = 60 * 1000;
          oneHour = oneMinute * 60;
          oneDay = oneHour * 24;
          sevenDays = 7 * oneDay;
          console.log("Running Every 15 Minutes");
          _context7.next = 7;
          return regeneratorRuntime.awrap(User.updateMany({
            hasCardInfo: false,
            //   createdAt: { $lte: new Date().getTime() - oneMinute },
            createdAt: {
              $lte: new Date().getTime() - sevenDays
            }
          }, {
            $set: {
              locked: true
            }
          }));

        case 7:
        case "end":
          return _context7.stop();
      }
    }
  });
});