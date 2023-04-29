const express = require("express");
const {
  signUp,
  login,
  doFollow,
  doUnFollow,
  searchUser,
  updateProfile,
  userNameExist,
  checkUsername,
  getCurrentUser,
  getExactUser,
} = require("../controller/userController");
const { auth } = require("../middleware/auth");
const { multerSt } = require("../middleware/multer");
// const { multerSt } = require("../middleware/multer");

const router = express.Router();

router.get("/", auth, getCurrentUser);
router.post("/signup", signUp);
router.post("/login", login);
router.put("/follow/:id", auth, doFollow);
router.put("/unfollow/:id", auth, doUnFollow);
router.get("/search/:uname", auth, getExactUser);
router.get("/searchUser", auth, searchUser);
router.post("/update", auth, multerSt, updateProfile);
router.get("/exist/:uname", auth, userNameExist);
router.get("/check/:uname", checkUsername);

// router.post("/sendEmail", sendVerificationEmail);
// router.put("/updateImage", auth, multerSt, updateImage);
// router.post("/verify", verify);

module.exports = router;
