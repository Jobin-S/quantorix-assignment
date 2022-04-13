const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getLoggedInUserDetails,
  adminAllUser
  } = require("../controllers/userController");
const { isLoggedIn, customRole } = require("../middlewares/user");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/profile").get(isLoggedIn, getLoggedInUserDetails);
router.route("/admin/users").get(isLoggedIn, customRole("admin"), adminAllUser);

module.exports = router;
