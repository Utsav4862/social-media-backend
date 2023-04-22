const multer = require("multer");
const { multerSt } = require("../middleware/multer");
const express = require("express");
const { auth } = require("../middleware/auth");
const {
  createPost,
  likePost,
  unLikePost,
} = require("../controller/postController");
const router = express.Router();

router.post("/create", auth, multerSt, createPost);
router.put("/like/:id", auth, likePost);
router.put("/unlike/:id", auth, unLikePost);

module.exports = router;
