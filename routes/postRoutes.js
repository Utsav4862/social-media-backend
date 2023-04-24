const multer = require("multer");
const { multerSt } = require("../middleware/multer");
const express = require("express");
const { auth } = require("../middleware/auth");
const {
  createPost,
  likePost,
  unLikePost,
  getFollowingUserPosts,
  getMyPosts,
  deletePost,
} = require("../controller/postController");
const router = express.Router();

router.post("/create", auth, multerSt, createPost);
router.put("/like/:id", auth, likePost);
router.put("/unlike/:id", auth, unLikePost);
router.get("/following", auth, getFollowingUserPosts);
router.get("/my", auth, getMyPosts);
router.delete("/:id", auth, deletePost);

module.exports = router;
