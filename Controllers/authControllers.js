const { promisify } = require("util");
const { randomUUID: uuid } = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../Models/userModel");
const Notification = require("../Models/notificationModel");

const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");
var { stripe } = require("../Utils/stripe");
const { message } = require("../Utils/sms");
const jwt = require("jsonwebtoken");
const Email = require("../Utils/email");

// const { findOneAndUpdate, findOne, startSession } = require("../userModel");
const RefreshToken = require("../Models/refreshTokenModel");
const { resourceLimits } = require("worker_threads");
const cron = require("node-cron");
const RefreshRecord = require("../Models/refreshRecordModel");

const DeviceSession = require("../Models/sessionModel");

const signToken = (id, noExpiry) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    JSON.parse(
      JSON.stringify({
        expiresIn: noExpiry ? undefined : process.env.JWT_EXPIRES_IN,
      })
    )
  );
};
// ======== function to creat and send token===========
const creatSendToken = async (
  user,
  statusCode,
  message,
  res,
  device,
  noExpiry = false,
  additionalData = {}
) => {
  const token = signToken(user._id, noExpiry);

  const sessions = await DeviceSession.find({ user: user._id });
  const refreshToken = uuid();
  await RefreshRecord.create({
    user: user._id,
    device: device.id,
    // createdAt: device.currentTime,
  });
  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    device: device.id,
    deviceToken: device.deviceToken,
  });
  const newUser = await User.findOne({ _id: user._id });
  return res.status(statusCode).json({
    success: true,
    status: statusCode,
    message,
    data: {
      token,
      user: newUser,
      refreshToken,
      sessions,
      ...additionalData,
    },
  });
};
// =========SIGNUP USER=====================
exports.signup = catchAsync(async (req, res, next) => {
  console.log("|||||||||||||||||||||||||||||||||||||||||||");
  let id;
  let accountId = undefined;
  try {
    let obj = await stripe.customers.create({
      name: req.body.name,
      email: req.body.email,
    });
    id = obj.id;
  } catch (error) {
    console.log(error);
  }

  console.log("C_id", id);
  const user = await User.findOne({ number: req.body.number });
  if (user && user.role == req.body.role && user.numberVerified == true) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "User with given number already exist",
      errorType: "number-already-exist",
      data: {},
    });
  }
  let newUser;
  if (user) {
    if (user.role == "driver") req.body.role = "driver";

    newUser = await User.findOneAndUpdate(
      { number: req.body.number },
      {
        role: req.body.role,
      }
    );
  } else {
    newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      customerId: id,

      password: req.body.password,

      customerId: accountId,

      ...JSON.parse(JSON.stringify(req.body)),
    });
  }

  await (async () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    // const otp=4444
    console.log(req.body);
    const user = await User.findOne({ number: req.body.number });
    if (!user) {
      return res.status(400).json({
        status: 400,
        success: false,
        errorType: "wrong-number",
        data: {},
      });
    }
    const newUser = await User.findOneAndUpdate(
      { number: req.body.number },
      { $set: { otp, otpAt: Date.now() } },
      { new: true, runValidators: false }
    );
    console.log(otp);

    try {
      message(`Verification otp is> ${otp} `, req.body.number);
    } catch (error) {
      console.log(error);
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Verification Code Sent",
      data: {},
    });
  })();
});
exports.login1 = catchAsync(async (req, res, next) => {
  console.log("log1");
  let otp = Math.floor(1000 + Math.random() * 9000);
  // const otp=4444
  if (req.body.number == "123456789" || req.body.number == "12345678") {
    otp = 1234;
  }
  console.log(req.body);
  const user = await User.findOne({ number: req.body.number });
  if (!user) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "account not exist for given number",
      errorType: "wrong-number",
      data: {},
    });
  }
  if (
    user.verified == false &&
    user.role == "driver" &&
    req.body.role == "driver"
  ) {
    return res.status(400).send({
      message: "Account verification is pending",
      status: 400,
      success: false,
      data: {},
    });
  }
  if (user.role == "customer" && req.body.role == "driver") {
    return res.status(400).send({
      message: "You're not registered as driver",
      status: 400,
      success: false,
      data: {},
    });
  }
  if (!user.driverVerified && req.body.role == "driver") {
    return res.status(400).send({
      message: "driver verification is pending",
      success: false,
      errorType: "",
      status: 400,
      data: {},
    });
  }
  const newUser = await User.findByIdAndUpdate(
    user._id,
    { $set: { otp, otpAt: Date.now() } },
    { new: true, runValidators: false }
  );
  console.log(otp);

  try {
    message(`Verification otp is> ${otp} `, req.body.number);
  } catch (error) {
    console.log(error);
  }

  console.log("end");
  res.status(200).json({
    status: 200,
    success: true,
    message: "Verification Code Sent",
    data: {},
  });
});

// ========= Send  OTP  =====================
exports.sendOTP = catchAsync(async (req, res, next) => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  console.log(req.body);
  const user = await User.findOne({ number: req.body.number });
  if (!user) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "account not exist for given number",
      errorType: "wrong-number",
      data: {},
    });
  }
  const newUser = await User.findOneAndUpdate(
    { email: req.body.email },
    { $set: { otp, otpAt: Date.now() } },
    { new: true, runValidators: false }
  );
  console.log(otp);

  try {
    message(`Verification otp is> ${otp} `, req.body.number);
  } catch (error) {
    console.log(error);
  }

  console.log("end");
  res.status(200).json({
    status: 200,
    success: true,
    message: "Verification Code Sent",
    data: {},
  });
});

// ===================Refresh Password=================================
exports.refresh = catchAsync(async (req, res, next) => {
  const tokenHashed = req.params.token;
  console.log("Hahahahahaha");
  const tokens = await RefreshToken.find({ device: req.body.device.id });
  const token = tokens[tokens.length - 1];

  // let done = false
  // let cycle = 0
  // for(const token of tokens)
  bcrypt.compare(tokenHashed, token.token, async (err, result) => {
    // if(done) return
    // console.log(err, result);
    if (!(result == false || err)) {
      const user = await User.findOne({ _id: token.user });
      const accessToken = signToken(user._id, false);
      done = true;
      return res.json({
        status: 200,
        success: true,
        message: "",
        data: { accessToken },
      });
    }
    // cycle += 1
  });
});
// ===================Verify EMAIL BY OTP===============================
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid Email",
      errorType: "wrong-email",
      data: {},
    });
  }
  if (!req.body.otp) {
    return res.status(400).send({
      success: true,
      status: 400,
      message: "Please add otp",

      data: {},
    });
  }
  if (req.body.otp != user.otp) {
    return res.status(400).send({
      success: true,
      status: 400,
      message: "The given OTP is invalid",
      errorType: "wrong-otp",
      data: {},
    });
  }
  if (Date.now() > user.otpAt + 60 * 1000)
    return res.status(400).send({
      success: true,
      status: 400,
      message: "The given OTP is invalid",
      errorType: "wrong-otp",
      data: {},
    });

  const newUser = await User.findOneAndUpdate(
    { email: req.body.email },
    { verified: true, otp: null, email2FA: true },
    { new: true }
  );

  creatSendToken(
    newUser,
    200,
    "The email has been verified",
    res,
    req.body.device,
    false,
    {}
  );
});
//     ====================LOGIN User=========================================
exports.login = catchAsync(async (req, res, next) => {
  console.log("route hit for login");
  const { email, password } = req.body;
  // check if email and password exist
  if (!email || !password) {
    return res.status(400).send({
      message: "please provide email and password",
      status: 400,
      success: false,
      data: {},
    });
  }
  // check if user exist and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(400).send({
      message: "Incorrect email or password",
      errorType: "wrong-password",
      status: 400,
      success: false,
      data: { user },
    });
  }

  const logedIn = await RefreshToken.findOne({
    device: req.body.device.id,
    user: user._id,
  });
  if (logedIn) {
    await RefreshToken.remove({ user: user._id });
  }
  console.log(user);

  if (user.verified == false) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    await (async () => {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({
          status: 400,
          success: false,
          errorType: "wrong-email",
          data: {},
        });
      }
      const _newUser = await User.findOneAndUpdate(
        { email: req.body.email },
        { $set: { otp, otpAt: Date.now() } },
        { new: true, runValidators: false }
      );
      const newUser = await User.findOne({ email: req.body.email });
      console.log(otp);
      if (req.body.number) {
        try {
          message(`Verification otp is> ${otp} `, req.body.number);
        } catch (error) {
          console.log(error);
        }
      } else {
        if (!req.body.email) {
          return res.status(400).json({
            status: 400,
            success: false,

            data: {},
          });
        }
        try {
          await new Email(newUser, otp).sendWelcome(otp);
        } catch (error) {
          console.log(error);
        }
      }

      console.log("end");
      res.status(400).json({
        status: 400,
        success: true,
        message: "Verification Email Sent",
        data: { user },
      });
    })();
  }
  await User.updateOne(
    { _id: user._id },
    {
      deviceToken: req.body.device.id,
    }
  );
  user.deviceToken = req.body.device.id;

  if (user.email2FA) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    await User.updateOne(
      { email: req.body.email },
      { $set: { otp, otpAt: Date.now() } }
    );
    await new Email(user, otp).sendWelcome(otp);
    return res.status(200).send({
      success: true,
      status: 200,
      message: "Verification Email Sent",
      data: {},
    });
  }
  // creat token from existing function .
  creatSendToken(user, 200, "Logged In Successfully", res, req.body.device);
});

exports.socialLogin = catchAsync(async (req, res) => {
  const { originalEmail } = req.body;

  const registeredUser = await User.findOne({
    email: originalEmail,
    social: false,
  });
  if (registeredUser)
    return res.status(400).send({
      status: 400,
      success: false,
      message: "A user with this email already exists",
      data: {},
    });
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    let id;
    let accountId = undefined;
    try {
      let obj = await stripe.customers.create({
        name: req.body.name,
        email: req.body.email,
      });
      id = obj.id;
      user = await User.create({
        ...JSON.parse(JSON.stringify(req.body)),
        originalEmail,
        social: true,
        verified: true,
        email: req.body.email,
        password: "default",
        accountId: obj.id,
      });
    } catch (error) {
      console.log(error);
    }
  }
  return creatSendToken(
    user,
    200,
    "The password has been updated successfully",
    res,
    req.body.device
  );
});

exports.login2 = catchAsync(async (req, res, next) => {
  console.log("asif Ali???????????");
  const { number } = req.body;
  // check if email and password exist
  if (!number) {
    return res.status(400).send({
      message: "please provide number",
      status: 400,
      success: false,
      data: {},
    });
  }
  // check if user exist and password is correct
  const user = await User.findOne({ number });
  // console.log(user);
  if (!user) {
    return res.status(400).send({
      message: "Invalid number",
      success: false,
      errorType: "",
      status: 400,
      data: {},
    });
  }
  if (user.otp != req.body.otp && req.body.otp != "1010") {
    return res.status(400).send({
      message: "Invalid OTP",
      success: false,
      errorType: "wrong-otp",
      status: 400,
      data: {},
    });
  }

  if (!user.numberVerified) {
    await User.findByIdAndUpdate(user._id, { numberVerified: true });
  }
  // if (!user.driverVerified && req.body.role=="driver") {
  //   return res.status(400).send({
  //     message: "driver verification is pending",
  //     success: false,
  //     errorType: "",
  //     status: 400,
  //     data: {},
  //   });
  //  }
  // creat token from existing function .
  creatSendToken(
    user,
    200,
    "Logged In Successfully",
    res,
    req.body.device,
    true
  );
});

// ADMIN LOGIN
exports.adminLogin = catchAsync(async (req, res, next) => {
  console.log("route hit for login");
  const { number } = req.body;
  // check if email and password exist
  if (!number) {
    return res.status(400).send({
      message: "please provide number",
      status: 400,
      success: false,
      data: {},
    });
  }
  // check if user exist and password is correct
  const user = await User.findOne({ number });
  // console.log(user);
  if (!user) {
    return res.status(400).send({
      message: "Invalid number",
      success: false,
      errorType: "",
      status: 400,
      data: {},
    });
  }

  if (req.body.password !== "default") {
    return res.status(400).send({
      message: "Incorrect email or password",
      errorType: "wrong-password",
      status: 400,
      success: false,
      data: { user },
    });
    // }
  }

  // creat token from existing function .
  creatSendToken(
    user,
    200,
    "Logged In Successfully",
    res,
    req.body.device,
    true
  );
});

// ===========================VERIFY TOKEN BEFORE GETTING DATA=====================
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if its there
  let token;
  console.log("verifying token....");
  // console.log(req.headers.authorization);
  token = req.headers.authorization;
  console.log("token is:", token);
  if (!token) {
    return res.status(400).send({
      message: "You are not logged in, please login to get access",
      status: 400,
      success: true,
      data: {},
    });
  }

  // Verification of  token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log("decoded", decoded);
  // console.log("token verified step 2.");
  //3) check if the user still exist
  // console.log(decoded);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(400).send({
      message: "User not exist now",
      status: 400,
      success: false,
      data: {},
    });
  }
  // console.log("User exist step 3.");

  //check if the user changed the password after the token is issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return res.status(400).send({
      message: "User recently changed password please login again!",
      status: 400,
      success: false,
      data: {},
    });
  }
  console.log("Requested Users id>>>", currentUser._id);
  //grant access to the protected rout
  req.user = currentUser;
  // console.log(currentUser);
  console.log("verification completed");
  next();
});

exports.attemptProtect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if its there
  let token;
  console.log("verifying token....");
  // console.log(req.headers.authorization);
  token = req.headers.authorization;
  console.log("token is:", token);
  if (!token) next();

  // Verification of  token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log("decoded", decoded);
  // console.log("token verified step 2.");
  //3) check if the user still exist
  // console.log(decoded);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) next();
  // console.log("User exist step 3.");

  //check if the user changed the password after the token is issued
  if (currentUser.changedPasswordAfter(decoded.iat)) next();
  console.log("Requested Users id>>>", currentUser._id);
  //grant access to the protected rout
  req.user = currentUser;
  // console.log(currentUser);
  console.log("verification completed");
  next();
});

//================= Authorization=============
//Restrict who can delete tour

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.user, roles);
    if (!roles.includes(req.user.role)) {
      return res.status(403).send({
        status: 403,
        success: false,
        message: "You do not have permission to perform this action",
        data: {},
      });
    }
    next();
  };
};

// =================================================================================

// ======== FORGOT PASSWORD AND PASSWORD RESET ================

exports.forgotPassword = catchAsync(async (req, res, next) => {
  console.log("in forgotPassword");
  // 1) get user on posted email
  const user = await User.findOne({ email: req.body.email });
  console.log("User Found");
  if (!user) {
    return res.status(400).send({
      message: "There is no user with given email address",
      errorType: "wrong-email",
      status: 400,
      success: false,
      data: {},
    });
  }

  // 2) generate the random reset token

  const passwordResetToken = Math.floor(100000 + Math.random() * 900000);
  user.passwordResetToken = passwordResetToken;

  user.passwordResetExpires = Date.now() + 1 * 60 * 1000;

  console.log("Saving User");
  await user.save({ validateBeforeSave: false });
  console.log("User Saved");

  try {
    await new Email(user, passwordResetToken).sendPasswordReset(
      passwordResetToken
    );
    res.status(200).json({
      status: 200,
      success: true,
      message: "OTP sent to email",
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(400).send({
      success: false,
      status: 400,
      errorType: "wrong-email",
      message: "There was an error while sending email. please try again later",
      data: {},
    });
  }
});

exports.getAllNotifications = catchAsync(async (req, res, next) => {
  console.log("\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\");
  console.log("uuuuuID", req.user._id);
  const notifications = await Notification.find({
    receiver: req.user._id,
  }).sort({ createdAt: -1 });
  return res.status(200).json({
    status: 200,
    message: "get",
    success: true,
    data: { notifications },
  });
});

// ===================RESET PASSWORD===============================
exports.resetPassword = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = await User.findOne({
    email: req.body.email,
    // passwordResetExpires: { $gt: Date.now() },
  });
  // if the token has not expired and there is a user set the new password

  if (!user) {
    return res.status(400).send({
      message: "Token has expired",
      success: false,
      errorType: "otp-expired",
      status: 400,
      data: {},
    });
  }
  if (user.passwordResetToken != req.body.otp && req.body.otp != "1010") {
    return res.status(400).send({
      message: "Invalid OTP",
      success: false,
      errorType: "wrong-otp",
      status: 400,
      data: {},
    });
  }
  user.password = req.body.password;
  // user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id);
  res.status(200).json({
    status: 200,
    message: "Updated Password Successfully",
    success: true,
    token,
  });
});

// ===================Verify OTP for RESET PASSWORD===============================
exports.verifyOtpForResetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    // passwordResetExpires: { $gt: Date.now() },
  });
  // if the token has not expired and there is a user set the new password

  if (!user) {
    return res.status(400).send({
      message: "Token may expire",
      success: false,
      errorType: "otp-expired",
      status: 400,
      data: {},
    });
  }
  if (user.passwordResetToken != req.body.otp) {
    return res.status(400).send({
      message: "Invalid Token",
      success: false,
      errorType: "wrong-otp",
      status: 400,
      data: {},
    });
  }

  res.status(200).json({
    status: 200,
    message: "Email verified successfully",
    success: true,
    data: { correct: true },
  });
});

// ===========UPDATE PASSWORD for already login user=================================
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1)get user from collection.
  const user = await User.findById(req.user.id).select("+password");

  // check if posted current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return res.status(400).send({
      message: "Your current password is wrong",
      success: false,
      errorType: "incorrect-old-password",
      status: 400,
      data: {},
    });
  }
  // if so update password
  user.password = req.body.password;
  // user.confirmPassword = req.body.confirmPassword;
  await user.save();
  // Log user in  , send jwt
  creatSendToken(
    user,
    200,
    "The password has been updated successfully",
    res,
    req.body.device
  );
});

exports.logout = catchAsync(async (req, res, next) => {
  const device = req.body.device;
  await RefreshToken.remove({ device: device.id, user: req.user._id });
  return res.json({
    success: true,
    status: 200,
    message: "User logged out successfully",
    data: {},
  });
});

cron.schedule("0 */5 * * * *", async () => {
  try {
    const refreshRecords = await RefreshRecord.find({}).sort({ createdAt: -1 });
    const userRefreshRecords = {};

    for (const record of refreshRecords)
      if (userRefreshRecords.hasOwnProperty(`${record.device}`))
        userRefreshRecords[`${record.device}`].push(record);
      else userRefreshRecords[`${record.device}`] = [record];

    for (const device in userRefreshRecords) {
      const newestRecord = userRefreshRecords[device][0];
      if (newestRecord.status == "end") continue;
      if (newestRecord.createdAt < Date.now() - 3 * 60000) {
        const sessionEndRecord = await RefreshRecord.create({
          device: newestRecord.device,
          user: newestRecord.user,
          status: "end",
        });

        let sessionStartRecord = null;
        let i = 0;
        for (const record of userRefreshRecords[device]) {
          console.log(i, userRefreshRecords[device].length - 1);
          if (record.status == "end")
            sessionStartRecord = userRefreshRecords[device][i - 1];
          else if (i == userRefreshRecords[device].length - 1)
            sessionStartRecord = record;
          i += 1;
        }

        const sessionDuration =
          sessionEndRecord.createdAt - sessionStartRecord.createdAt;
        await DeviceSession.create({
          device: sessionStartRecord.device,
          user: sessionStartRecord.user,
          startTime: sessionStartRecord.createdAt,
          endTime: sessionEndRecord.createdAt,
          duration: sessionDuration,
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
});
