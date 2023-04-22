const User = require("../Model/User");
const Post = require("../model/Post");

const createPost = async (req, res) => {
  try {
    const user = req.user;
    const { caption } = req.body;
    const image =
      (await req.protocol) + "://" + req.get("host") + "/" + req.file.filename;

    let post = await Post.create({ image, caption, user: user._id });

    res.send(post);
  } catch (error) {
    console.log(error.message);
  }
};

const likePost = async (req, res) => {
  try {
    const user = await req.user;
    console.log(user);
    console.log(req.params.id);
    let resp = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: { likes: user._id },
      },
      {
        new: true,
      }
    );

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
    );

    if (resp) res.send(resp);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getFollowingUserPosts = async (req, res) => {
  try {
    const user = req.user;

    let posts = await Post.find({ user: { $in: user.following } });

    console.log(posts);
    res.send(posts);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getMyPosts = async (req, res) => {
  try {
    const user = req.user;

    let posts = await Post.find({ user: user._id });

    console.log(posts);
    res.send(posts);
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
};
