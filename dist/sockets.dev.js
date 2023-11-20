"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Message = require("./Models/Message");

var User = require("./Models/userModel");

var OnlineUser = require("./Models/OnlineUser");

var io = require("socket.io")(); // const client = redis.createClient()


var client = {
  set: function set(user) {
    return regeneratorRuntime.async(function set$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(OnlineUser.updateOne({
              user: user
            }, {}, {
              upsert: true
            }));

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  del: function del(user) {
    return regeneratorRuntime.async(function del$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(OnlineUser.remove({
              user: user
            }));

          case 2:
            return _context2.abrupt("return", _context2.sent);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  flushDb: function flushDb() {
    return regeneratorRuntime.async(function flushDb$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(OnlineUser.remove({}));

          case 2:
            return _context3.abrupt("return", _context3.sent);

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  KEYS: function KEYS() {
    var keys, newKeys, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key;

    return regeneratorRuntime.async(function KEYS$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return regeneratorRuntime.awrap(OnlineUser.find({}));

          case 2:
            keys = _context4.sent;
            newKeys = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context4.prev = 7;

            for (_iterator = keys[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              key = _step.value;
              newKeys.push("".concat(key.user));
            }

            _context4.next = 15;
            break;

          case 11:
            _context4.prev = 11;
            _context4.t0 = _context4["catch"](7);
            _didIteratorError = true;
            _iteratorError = _context4.t0;

          case 15:
            _context4.prev = 15;
            _context4.prev = 16;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 18:
            _context4.prev = 18;

            if (!_didIteratorError) {
              _context4.next = 21;
              break;
            }

            throw _iteratorError;

          case 21:
            return _context4.finish(18);

          case 22:
            return _context4.finish(15);

          case 23:
            return _context4.abrupt("return", newKeys);

          case 24:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[7, 11, 15, 23], [16,, 18, 22]]);
  },
  connect: function connect() {
    return regeneratorRuntime.async(function connect$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt("return", null);

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    });
  }
};
client.connect().then(function _callee9(_) {
  var getOnlineUsers;
  return regeneratorRuntime.async(function _callee9$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          // await client.flushDb();
          getOnlineUsers = function getOnlineUsers() {
            var userIds, users;
            return regeneratorRuntime.async(function getOnlineUsers$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return regeneratorRuntime.awrap(client.KEYS());

                  case 2:
                    userIds = _context6.sent;
                    _context6.next = 5;
                    return regeneratorRuntime.awrap(User.find({
                      _id: {
                        $in: userIds
                      }
                    }));

                  case 5:
                    users = _context6.sent;
                    io.emit("online-users", {
                      message: "Online Users Retrieved Successfully",
                      success: true,
                      data: {
                        users: users
                      }
                    });

                  case 7:
                  case "end":
                    return _context6.stop();
                }
              }
            });
          };

          io.sockets.on("connect", function _callee8(socket) {
            var authenticated;
            return regeneratorRuntime.async(function _callee8$(_context14) {
              while (1) {
                switch (_context14.prev = _context14.next) {
                  case 0:
                    console.log("Connected to ".concat(socket.id));

                    authenticated = function authenticated(cb) {
                      return function _callee(data) {
                        var user;
                        return regeneratorRuntime.async(function _callee$(_context7) {
                          while (1) {
                            switch (_context7.prev = _context7.next) {
                              case 0:
                                _context7.next = 2;
                                return regeneratorRuntime.awrap(User.findOne({
                                  _id: data.userId
                                }));

                              case 2:
                                user = _context7.sent;

                                if (user) {
                                  _context7.next = 6;
                                  break;
                                }

                                socket.emit({
                                  message: "Unauthenticated",
                                  success: false,
                                  data: {}
                                });
                                return _context7.abrupt("return", socket.disconnect());

                              case 6:
                                _context7.next = 8;
                                return regeneratorRuntime.awrap(cb(_objectSpread({
                                  user: JSON.parse(JSON.stringify(user))
                                }, data)));

                              case 8:
                              case "end":
                                return _context7.stop();
                            }
                          }
                        });
                      };
                    };

                    socket.on("user-enter", authenticated(function _callee2(_ref) {
                      var user;
                      return regeneratorRuntime.async(function _callee2$(_context8) {
                        while (1) {
                          switch (_context8.prev = _context8.next) {
                            case 0:
                              user = _ref.user;
                              console.log(user, user._id);
                              _context8.next = 4;
                              return regeneratorRuntime.awrap(client.set(user._id));

                            case 4:
                              _context8.next = 6;
                              return regeneratorRuntime.awrap(getOnlineUsers());

                            case 6:
                            case "end":
                              return _context8.stop();
                          }
                        }
                      });
                    }));
                    socket.on("user-leave", authenticated(function _callee3(_ref2) {
                      var user;
                      return regeneratorRuntime.async(function _callee3$(_context9) {
                        while (1) {
                          switch (_context9.prev = _context9.next) {
                            case 0:
                              user = _ref2.user;
                              _context9.next = 3;
                              return regeneratorRuntime.awrap(client.del(user._id));

                            case 3:
                              _context9.next = 5;
                              return regeneratorRuntime.awrap(getOnlineUsers());

                            case 5:
                            case "end":
                              return _context9.stop();
                          }
                        }
                      });
                    }));
                    socket.on("get-online-users", authenticated(function _callee4() {
                      return regeneratorRuntime.async(function _callee4$(_context10) {
                        while (1) {
                          switch (_context10.prev = _context10.next) {
                            case 0:
                              _context10.next = 2;
                              return regeneratorRuntime.awrap(getOnlineUsers());

                            case 2:
                            case "end":
                              return _context10.stop();
                          }
                        }
                      });
                    }));
                    socket.on("get-inboxes", authenticated(function _callee5(_ref3) {
                      var user, dbMessages, inboxes, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, message, inboxUsers, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, inbox, inboxUser_, inboxUser, lastMessage, lastMessageTime, totalMessages, unreadMessagesCount, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _message;

                      return regeneratorRuntime.async(function _callee5$(_context11) {
                        while (1) {
                          switch (_context11.prev = _context11.next) {
                            case 0:
                              user = _ref3.user;
                              _context11.next = 3;
                              return regeneratorRuntime.awrap(Message.find({
                                $or: [{
                                  sender: user._id
                                }, {
                                  receiver: user._id
                                }]
                              }));

                            case 3:
                              dbMessages = _context11.sent;
                              // console.log(2);
                              // console.log(dbMessages);
                              inboxes = new Set();
                              _iteratorNormalCompletion2 = true;
                              _didIteratorError2 = false;
                              _iteratorError2 = undefined;
                              _context11.prev = 8;

                              for (_iterator2 = dbMessages[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                message = _step2.value;
                                inboxes.add(message.sender.toString());
                                inboxes.add(message.receiver.toString());
                              } // console.log(3);


                              _context11.next = 16;
                              break;

                            case 12:
                              _context11.prev = 12;
                              _context11.t0 = _context11["catch"](8);
                              _didIteratorError2 = true;
                              _iteratorError2 = _context11.t0;

                            case 16:
                              _context11.prev = 16;
                              _context11.prev = 17;

                              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                                _iterator2["return"]();
                              }

                            case 19:
                              _context11.prev = 19;

                              if (!_didIteratorError2) {
                                _context11.next = 22;
                                break;
                              }

                              throw _iteratorError2;

                            case 22:
                              return _context11.finish(19);

                            case 23:
                              return _context11.finish(16);

                            case 24:
                              inboxes["delete"](user._id.toString()); // console.log("inboxes", inboxes);
                              // console.log("inboxes", inboxes);
                              // getting all users , last message by them , unread message count

                              inboxUsers = [];
                              _iteratorNormalCompletion3 = true;
                              _didIteratorError3 = false;
                              _iteratorError3 = undefined;
                              _context11.prev = 29;
                              _iterator3 = inboxes[Symbol.iterator]();

                            case 31:
                              if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                                _context11.next = 72;
                                break;
                              }

                              inbox = _step3.value;
                              _context11.next = 35;
                              return regeneratorRuntime.awrap(User.findOne({
                                _id: inbox
                              }).select({
                                notifications: 0,
                                unreadMessages: 0
                              }));

                            case 35:
                              inboxUser_ = _context11.sent;
                              // console.log("inboxuser_", inboxUser_);
                              // console.log(4, inboxUser_);
                              inboxUser = JSON.parse(JSON.stringify(inboxUser_)); // console.log("inboxUser", inboxUser);
                              // console.log("inboxUser===========" + inboxUser);

                              lastMessage = null;
                              lastMessageTime = null; // console.log("inboxUser", inboxUser);

                              _context11.next = 41;
                              return regeneratorRuntime.awrap(Message.find({
                                $or: [{
                                  sender: inboxUser._id,
                                  receiver: user._id
                                }, {
                                  sender: user._id,
                                  receiver: inboxUser._id
                                }]
                              }).sort({
                                _id: -1
                              }));

                            case 41:
                              totalMessages = _context11.sent;
                              // console.log(5);
                              // console.log("==========", totalMessages);
                              lastMessage = totalMessages[0].message;
                              lastMessageTime = totalMessages[0].messageTime;
                              unreadMessagesCount = 0;
                              _iteratorNormalCompletion4 = true;
                              _didIteratorError4 = false;
                              _iteratorError4 = undefined;
                              _context11.prev = 48;

                              for (_iterator4 = totalMessages[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                _message = _step4.value;

                                if (_message.seen === false && _message.sender.equals(inboxUser._id)) {
                                  unreadMessagesCount++;
                                }
                              } // console.log("aaaaaaaa");


                              _context11.next = 56;
                              break;

                            case 52:
                              _context11.prev = 52;
                              _context11.t1 = _context11["catch"](48);
                              _didIteratorError4 = true;
                              _iteratorError4 = _context11.t1;

                            case 56:
                              _context11.prev = 56;
                              _context11.prev = 57;

                              if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                                _iterator4["return"]();
                              }

                            case 59:
                              _context11.prev = 59;

                              if (!_didIteratorError4) {
                                _context11.next = 62;
                                break;
                              }

                              throw _iteratorError4;

                            case 62:
                              return _context11.finish(59);

                            case 63:
                              return _context11.finish(56);

                            case 64:
                              console.log("counttt", unreadMessagesCount);
                              inboxUser.lastMessage = lastMessage;
                              inboxUser["lastMessageTime"] = lastMessageTime;
                              inboxUser.unreadMessagesCount = unreadMessagesCount; // console.log("bbbbbbb");

                              inboxUsers.push(inboxUser);

                            case 69:
                              _iteratorNormalCompletion3 = true;
                              _context11.next = 31;
                              break;

                            case 72:
                              _context11.next = 78;
                              break;

                            case 74:
                              _context11.prev = 74;
                              _context11.t2 = _context11["catch"](29);
                              _didIteratorError3 = true;
                              _iteratorError3 = _context11.t2;

                            case 78:
                              _context11.prev = 78;
                              _context11.prev = 79;

                              if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                                _iterator3["return"]();
                              }

                            case 81:
                              _context11.prev = 81;

                              if (!_didIteratorError3) {
                                _context11.next = 84;
                                break;
                              }

                              throw _iteratorError3;

                            case 84:
                              return _context11.finish(81);

                            case 85:
                              return _context11.finish(78);

                            case 86:
                              inboxUsers.sort(function (a, b) {
                                return a.lastMessageTime > b.lastMessageTime ? -1 : 1;
                              }); // console.log(inboxUsers);

                              console.log("inbox users", inboxUsers);
                              socket.emit("inboxes", {
                                success: true,
                                message: "Inbox Retrieved Succcessfully",
                                // data: { inboxes: [...inboxes], },
                                data: {
                                  inboxes: inboxUsers
                                }
                              });

                            case 89:
                            case "end":
                              return _context11.stop();
                          }
                        }
                      }, null, null, [[8, 12, 16, 24], [17,, 19, 23], [29, 74, 78, 86], [48, 52, 56, 64], [57,, 59, 63], [79,, 81, 85]]);
                    }));
                    socket.on("get-messages", authenticated(function _callee6(_ref4) {
                      var user, inbox, updatedMessages, userX, unreadMessages, newUnreadMessages, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, message, messages;

                      return regeneratorRuntime.async(function _callee6$(_context12) {
                        while (1) {
                          switch (_context12.prev = _context12.next) {
                            case 0:
                              user = _ref4.user, inbox = _ref4.inbox;
                              _context12.next = 3;
                              return regeneratorRuntime.awrap(Message.updateMany({
                                sender: inbox,
                                receiver: user._id
                              }, {
                                seen: true
                              }));

                            case 3:
                              updatedMessages = _context12.sent;
                              console.log("updated msgs", updatedMessages);
                              _context12.next = 7;
                              return regeneratorRuntime.awrap(User.findOne({
                                _id: user._id
                              }));

                            case 7:
                              userX = _context12.sent;
                              unreadMessages = userX.unreadMessages ? userX.unreadMessages : [];
                              newUnreadMessages = [];
                              _iteratorNormalCompletion5 = true;
                              _didIteratorError5 = false;
                              _iteratorError5 = undefined;
                              _context12.prev = 13;

                              for (_iterator5 = unreadMessages[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                message = _step5.value;
                                if ("".concat(message.sender) != "".concat(inbox)) newUnreadMessages.push(message);
                              }

                              _context12.next = 21;
                              break;

                            case 17:
                              _context12.prev = 17;
                              _context12.t0 = _context12["catch"](13);
                              _didIteratorError5 = true;
                              _iteratorError5 = _context12.t0;

                            case 21:
                              _context12.prev = 21;
                              _context12.prev = 22;

                              if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
                                _iterator5["return"]();
                              }

                            case 24:
                              _context12.prev = 24;

                              if (!_didIteratorError5) {
                                _context12.next = 27;
                                break;
                              }

                              throw _iteratorError5;

                            case 27:
                              return _context12.finish(24);

                            case 28:
                              return _context12.finish(21);

                            case 29:
                              _context12.next = 31;
                              return regeneratorRuntime.awrap(User.updateOne({
                                _id: user._id
                              }, {
                                $set: {
                                  unreadMessages: newUnreadMessages
                                }
                              }));

                            case 31:
                              _context12.next = 33;
                              return regeneratorRuntime.awrap(Message.find({
                                $and: [{
                                  $or: [{
                                    sender: user._id
                                  }, {
                                    receiver: user._id
                                  }]
                                }, {
                                  $or: [{
                                    sender: inbox
                                  }, {
                                    receiver: inbox
                                  }]
                                }]
                              }).sort({
                                createdAt: -1
                              }));

                            case 33:
                              messages = _context12.sent;
                              // .populate("receiver")
                              // .populate("sender");
                              io.emit("messages", {
                                success: true,
                                message: "Messages Retrieved Successfully",
                                data: {
                                  messages: messages
                                }
                              });

                            case 35:
                            case "end":
                              return _context12.stop();
                          }
                        }
                      }, null, null, [[13, 17, 21, 29], [22,, 24, 28]]);
                    }));
                    socket.on("send-message", authenticated(function _callee7(_ref5) {
                      var user, to, message, messageType, messageTime, receiver, unreadMessages, fromSender, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, _message2, dbMessage, messages;

                      return regeneratorRuntime.async(function _callee7$(_context13) {
                        while (1) {
                          switch (_context13.prev = _context13.next) {
                            case 0:
                              user = _ref5.user, to = _ref5.to, message = _ref5.message, messageType = _ref5.messageType, messageTime = _ref5.messageTime;
                              _context13.prev = 1;
                              console.log("innnnn send msg start Startttttttttt");
                              _context13.next = 5;
                              return regeneratorRuntime.awrap(User.findOne({
                                _id: to
                              }));

                            case 5:
                              receiver = _context13.sent;
                              unreadMessages = receiver.unreadMessages ? receiver.unreadMessages : [];
                              fromSender = null;
                              _iteratorNormalCompletion6 = true;
                              _didIteratorError6 = false;
                              _iteratorError6 = undefined;
                              _context13.prev = 11;

                              for (_iterator6 = unreadMessages[Symbol.iterator](); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                _message2 = _step6.value;
                                if (_message2.sender == to) fromSender = _message2;
                              }

                              _context13.next = 19;
                              break;

                            case 15:
                              _context13.prev = 15;
                              _context13.t0 = _context13["catch"](11);
                              _didIteratorError6 = true;
                              _iteratorError6 = _context13.t0;

                            case 19:
                              _context13.prev = 19;
                              _context13.prev = 20;

                              if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
                                _iterator6["return"]();
                              }

                            case 22:
                              _context13.prev = 22;

                              if (!_didIteratorError6) {
                                _context13.next = 25;
                                break;
                              }

                              throw _iteratorError6;

                            case 25:
                              return _context13.finish(22);

                            case 26:
                              return _context13.finish(19);

                            case 27:
                              if (fromSender === null) unreadMessages.push({
                                sender: to,
                                count: 1
                              });else fromSender.count += 1;
                              _context13.next = 30;
                              return regeneratorRuntime.awrap(User.updateOne({
                                _id: to
                              }, {
                                $set: {
                                  unreadMessages: unreadMessages
                                }
                              }));

                            case 30:
                              _context13.next = 32;
                              return regeneratorRuntime.awrap(Message.create({
                                sender: user._id,
                                receiver: to,
                                message: message,
                                messageTime: messageTime,
                                seen: false,
                                type: messageType
                              }));

                            case 32:
                              dbMessage = _context13.sent;
                              _context13.next = 35;
                              return regeneratorRuntime.awrap(Message.find({
                                $and: [{
                                  $or: [{
                                    sender: user
                                  }, {
                                    receiver: user
                                  }]
                                }, {
                                  $or: [{
                                    sender: to
                                  }, {
                                    receiver: to
                                  }]
                                }]
                              }).sort({
                                createdAt: -1
                              }));

                            case 35:
                              messages = _context13.sent;
                              //   await sendNotification({
                              //     type: "sendMessage",
                              //     sender: user,
                              //     receiver,
                              //     title: "sent message",
                              //     deviceToken: receiver.deviceToken,
                              //     body: `${user.name} sent you a message`,
                              //   });
                              io.emit("messages", {
                                success: true,
                                message: "Messages Retrieved Successfully",
                                data: {
                                  messages: messages
                                }
                              }); // io.emit("new-message", {
                              //   success: true,
                              //   message: "Messages Found Successfully",
                              //   data: { message: dbMessage },
                              // });

                              _context13.next = 42;
                              break;

                            case 39:
                              _context13.prev = 39;
                              _context13.t1 = _context13["catch"](1);
                              console.log(_context13.t1);

                            case 42:
                            case "end":
                              return _context13.stop();
                          }
                        }
                      }, null, null, [[1, 39], [11, 15, 19, 27], [20,, 22, 26]]);
                    }));

                  case 8:
                  case "end":
                    return _context14.stop();
                }
              }
            });
          });

        case 2:
        case "end":
          return _context15.stop();
      }
    }
  });
});
module.exports = {
  io: io
};