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
    // console.log(req.headers);
    // console.log(user);
    // console.log(req.params.id);
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

    let post = await Post.findOne({ _id: req.params.id });

    // console.log(post);

    let delPost;
    if (post.user == user._id) {
      delPost = await Post.findByIdAndDelete(req.params.id, { new: true });
    }

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
