const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
app.use(express.json());
const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const { error, log } = require("console");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const cloudinary = require("../cloudinary");
const key = process.env.JWT_KEY;

const signUp = async (req, res) => {
  try {
    let emailExist = await User.exists({ email: req.body.email });
    let usernameExist = await User.exists({ username: req.body.username });
    const { name, email, password, username } = req.body;

    if (emailExist) {
      res.send({ error: "Email Already Exists !!! " });
      return;
    }

    if (usernameExist) {
      res.send({ error: "username Already Exists !!! " });
      return;
    }
    let encryptedPassword = await bcrypt.hash(password, 10);
    let user = await User.create({
      name,
      email,
      password: encryptedPassword,
      username,
    });

    res.send({ success: true, user: user });
  } catch (error) {
    throw new Error(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { emailOrUser, password } = req.body;
    let user =
      (await User.findOne({ email: emailOrUser })) ||
      (await User.findOne({ username: emailOrUser }));

    if (user) {
      const verifyPass = await bcrypt.compare(password, user.password);
      if (verifyPass) {
        // user = await user.populate("following follower", "-password");
        const token = await jwt.sign({ id: user._id }, key);
        await res.send({ token, user });
      } else {
        res.send({ error: "Password is Wrong" });
      }
    } else {
      res.send({ error: "User not Found" });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    let user = await req.user;
    // user = await User.findById(user._id);
    // console.log(user);
    res.send(user);
  } catch (error) {
    throw new Error(error.message);
  }
};

const doFollow = async (req, res) => {
  try {
    const user = req.user;
    const followerId = req.params.id;
  
    let resp1 = await User.findByIdAndUpdate(
      user._id,
      {
        $push: { following: followerId },
      },
      {
        new: true,
      }
    );

    let resp2 = await User.findByIdAndUpdate(
      followerId,
      {
        $push: { follower: user._id },
      },
      {
        new: true,
      }
    );
  
    
    if (resp1 && resp2) res.send({ result: "Followed successfully" });
    else res.send({ error: "error occured" });
  } catch (error) {
    throw new Error(error.message);
  }
};

const doUnFollow = async (req, res) => {
  try {
    const user = req.user;
    const unFollowerId = req.params.id;
 
    let resp1 = await User.findByIdAndUpdate(
      user._id,
      {
        $pull: { following: unFollowerId },
      },
      {
        new: true,
      }
    );

    let resp2 = await User.findByIdAndUpdate(
      unFollowerId,
      {
        $pull: { follower: user._id },
      },
      {
        new: true,
      }
    );

    if (resp1 && resp2) res.send({ result: "un-Followed Successfully" });
    else res.send({ error: "error occured" });
  } catch (error) {
    throw new Error(error.message);
  }
};

const getExactUser = async (req, res) => {
  try {
    const uname = req.params.uname;
    let user = await User.findOne({ username: uname }).select("-password");

    res.send(user);
  } catch (error) {
    throw new Error(error.message);
  }
};

const searchUser = async (req, res) => {
  try {
    const user = req.user;

    if (req.query.search == "") {
      res.send([]);
      return;
    }

    const keyword = req.query.search
      ? {
          $or: [
            { username: { $regex: req.query.search, $options: "i" } },
            {
              name: { $regex: req.query.search, $options: "i" },
            },
          ],
        }
      : {};

    const resp = await User.find(keyword);

    res.send(resp);
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkUsername = async (req, res) => {
  try {
    let uname = req.params.uname;
    let userExist = await User.exists({ username: uname });
    if (userExist) {
      res.send({ error: "username already exist" });
    } else {
      res.send({ success: true });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const userNameExist = async (req, res) => {
  try {
    const user = req.user;
    const newArr = [...user.following, user._id];

    let users = await User.find({
      username: { $ne: user.username },
    });

    let userExist = await User.find({
      $and: [{ _id: { $in: users } }, { username: { $eq: req.params.uname } }],
    });

    if (userExist.length !== 0) {
      res.send({ error: "username already exists" });
    } else {
      res.send({ success: true });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = req.user;

    const { name, username } = req.body;
    const image = req.file
    let result = await cloudinary.cloudinaryUpload(image.path);
    await unlinkAsync(image.path)
    let updateResult = await User.findByIdAndUpdate(
      user._id,
      {
        username: username,
        name: name,
      },
      {
        new: true,
      }
    );
 
    if (req.file) {
      updateResult = await User.findByIdAndUpdate(
        user._id,
        {
          profile_img: result.secure_url,
        },
        {
          new: true,
        }
      );
    }

    if (updateResult) {
      res.send({ result: "Profile Updated Successfully" });
    } else {
      res.send({ error: "Error occurred" });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
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
};
