const express = require("express");
const groupsController = require("../Controllers/groupsControllers");
const authController = require("../Controllers/authControllers");

const router = express.Router();

router.post(
  "/createGroup",
  authController.protect,

  groupsController.createGroup
);
router.get(
  "/getGroups",
  authController.protect,

  groupsController.getGroups
);
router.post(
  "/joinGroup/:id",
  authController.protect,

  groupsController.joinGroup
);
module.exports = router;
