const User = require("../Model/User");
const Post = require("../model/Post");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const cloudinary = require("../cloudinary");


const createPost = async (req, res) => {
  try {
    const user = req.user;
    const { caption } = req.body;
    const image = req.file
    let result = await cloudinary.cloudinaryUpload(image.path);
    await unlinkAsync(image.path);
    let post = await Post.create({ image:result.secure_url, caption, user: user._id });

    res.send(post);
  } catch (error) {
    console.log(error.message);
  }
};

const likePost = async (req, res) => {
  try {
    const user = await req.user;
    let resp = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: { likes: user._id },
      },
      {
        new: true,
      }
    ).populate("user", "-password");

    if (resp) res.send(resp);
  } catch (error) {
    throw new Error(error.message);
  }
};

const unLikePost = async (req, res) => {
  try {
    const user = await req.user;

    let resp = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: user._id },
      },
      {
        new: true,
      }
    ).populate("user", "-password");

    if (resp) res.send(resp);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getFollowingUserPosts = async (req, res) => {
  try {
    let user = req.user;

    // console.log(user.following);
    let posts = await Post.find({
      $or: [{ user: { $in: user.following } }, { user: user._id }],
    })
      .populate("user", "-password")
      .sort({ createdAt: -1 });

    // console.log(posts);
    res.send(posts);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getMyPosts = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    let posts = await Post.find({ user: id }).sort({ createdAt: -1 });

    // console.log(posts);
    res.send(posts);
  } catch (error) {
    throw new Error(error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const user = req.user;

    // console.log(post);

    let delPost;
    // console.log(post.user);

    delPost = await Post.findByIdAndDelete(req.params.id, { new: true });

    console.log(delPost);
    if (delPost) {
      res.send({ success: "Post Deleted" });
    } else {
      res.send({ error: "Something went wrong" });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createPost,
  likePost,
  unLikePost,
  getFollowingUserPosts,
  getMyPosts,
  deletePost,
};
