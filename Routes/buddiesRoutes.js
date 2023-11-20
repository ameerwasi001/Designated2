const express = require("express");
const buddiesController = require("../Controllers/buddiesController");
const authController = require("../Controllers/authControllers");

const router = express.Router();

router.post(
  "/rentBuddyReq",
  authController.protect,
  buddiesController.rentBuddyReq
);

module.exports = router;
