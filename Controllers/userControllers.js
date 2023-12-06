const multer = require("multer");
const sharp = require("sharp");
const TxDeleter = require("../txDeleter");
const User = require("../Models/userModel");
const RiderResquest = require("../Models/rideRequestModel");
const Notification = require("../Models/notificationModel");

const RefreshToken = require("../Models/refreshTokenModel");
const Email = require("../Utils/email");
const catchAsync = require("./../Utils/catchAsync");
const AppError = require("./../Utils/appError");
const factory = require("./handlersFactory");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.beABuddy = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      occupation: req.body.occupation,
      language: req.body.language,
      location: req.body.location,
      description: req.body.description,
      image: req.body.image,
      specialSkills: req.body.specialSkills,
      aloneBuddy: true,
    },
    {
      new: true,
      runValidators: false,
    }
  );

  res.status(200).json({
    status: 200,
    success: true,
    data: {
      user: updatedUser,
    },
  });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 200,
    success: true,
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  console.log("deleteMe???????", req.body);
  await RiderResquest.findByIdAndDelete(req.body.id);
  await User.findByIdAndDelete(req.body.id);

  res.status(200).json({
    status: 200,
    message: "User deleted successfully",
    success: true,
    data: {},
  });
});

exports.topScorers = catchAsync(async (req, res, next) => {
  const users = await User.find({}).sort({ score: -1 });
  res.status(200).json({
    status: 200,
    success: true,
    message: "",
    data: { users },
  });
});

exports.updateProfile = catchAsync(async (req, res) => {
  const body = JSON.parse(JSON.stringify(req.body));
  // const user = await User.findByIdAndUpdate(
  //   req.user.id,
  //   { $set: { ...body } },
  //   { new: true }
  // );
  console.log(req.body.number, req.body);
  const user = await User.findOneAndUpdate(
    req.body.number ? { number: req.body.number } : { _id: req.user.id },
    // { $set: { ...Object.fromEntries(Object.entries(body).filter(([k]) => k != "id")) } },
    { $set: { ...body } },
    { new: true }
  );

  res.status(200).json({
    status: 200,
    message: "Profile Updated Successfully",
    success: true,
    data: { user },
  });
});

exports.deleteAccount = catchAsync(async (req, res) => {
  console.log("Delete Account", req.body);
  await RefreshToken.remove({ user: req.user._id });
  return res.json({
    success: true,
    status: 200,
    message: "User Deleted Successfully!",
    data: {},
  });
});

exports.contactAdmin = catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  await new Email({ email: "ameer.shah@txdynamics.io" }).sendToDoctor();
  res.status(200).json({
    status: 200,
    message: "Booked Coach Successfully",
    success: true,
    data: { user },
  });
});

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
