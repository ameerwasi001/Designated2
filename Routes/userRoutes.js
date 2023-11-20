const express = require("express");
const userController = require("../Controllers/userControllers");
const authController = require("../Controllers/authControllers");
const subscriptionController = require("../Controllers/subscriptionControllers");

const router = express.Router();



router.post("/signup", authController.signup);
router.post("/verify", authController.verifyEmail);

router.post("/login", authController.login);
router.post("/socialLogin", authController.socialLogin);
router.patch("/beABuddy", authController.protect, userController.beABuddy);

router.post("/sendOTP", authController.sendOTP);

router.post("/refresh/:token", authController.refresh);
router.post("/login1", authController.login1);
router.post("/login2", authController.login2);


router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword", authController.resetPassword);
router.post(
  "/verifyOTPResetPassword",
  authController.verifyOtpForResetPassword
);

// Protect all routes after this middleware
router.use(authController.protect);
router.get("/notifications", authController.getAllNotifications);

router.post("/logout", authController.logout);
router.patch("/updateMyPassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.post("/deleteMe", userController.deleteMe);
router.delete("/deleteAccount", userController.deleteAccount);
router.patch("/updateProfile", userController.updateProfile);

// router.use(authController.restrictTo("admin"));

router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
router.post("/subscribePlan", subscriptionController.upgradePlan);
router.post("/cancelSubscription", subscriptionController.cancelSubscription);


module.exports = router;
