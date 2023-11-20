"use strict";

var express = require("express");

var userController = require("../Controllers/userControllers");

var authController = require("../Controllers/authControllers");

var subscriptionController = require("../Controllers/subscriptionControllers");

var router = express.Router();
router.get('/topScorers', userController.topScorers);
router.post("/signup", authController.signup);
router.post("/verify", authController.verifyEmail);
router.post("/login", authController.login);
router.post("/socialLogin", authController.login);
router.patch("/beABuddy", authController.protect, userController.beABuddy);
router.post("/sendOTP", authController.sendOTP);
router.post("/refresh/:token", authController.refresh);
router.post("/testLogin", authController.testLogin);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword", authController.resetPassword);
router.post("/verifyOTPResetPassword", authController.verifyOtpForResetPassword); // Protect all routes after this middleware

router.use(authController.protect);
router.post("/logout", authController.logout);
router.patch("/updateMyPassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);
router["delete"]("/deleteMe", userController.deleteMe);
router.patch("/updateProfile", userController.updateProfile); // router.use(authController.restrictTo("admin"));

router.route("/").get(userController.getAllUsers);
router.route("/:id").get(userController.getUser).patch(userController.updateUser)["delete"](userController.deleteUser);
router.post("/subscribePlan", subscriptionController.upgradePlan);
router.post("/cancelSubscription", subscriptionController.cancelSubscription);
module.exports = router;