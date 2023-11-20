const express = require("express");
const userController = require("../Controllers/userControllers");
const authController = require("../Controllers/authControllers");
const interestController = require("../Controllers/interestControllers");
const router = express.Router();

router.post(
  "/addCategoryOrKeywordByAdmin",
  authController.protect,
  authController.restrictTo("admin"),
  interestController.addCategoryOrKeywordByAdmin
);
router.get(
  "/getCategoryOrKeyword",
  authController.protect,
  interestController.getCategoryOrKeyword
);
router.post(
  "/addCategory",
  authController.protect,

  interestController.addCategory
);

router.post(
  "/addInterests",
  authController.protect,

  interestController.addInterests
);
module.exports = router;
