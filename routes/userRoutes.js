const express = require("express");
const {
  signUp,
  login,
  doFollow,
  doUnFollow,
} = require("../controller/userController");
const { auth } = require("../middleware/auth");
// const { multerSt } = require("../middleware/multer");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.put("/follow/:id", auth, doFollow);
router.put("/unFollow/:id", auth, doUnFollow);

// router.post("/sendEmail", sendVerificationEmail);
// router.put("/updateImage", auth, multerSt, updateImage);
// router.post("/verify", verify);

module.exports = router;
