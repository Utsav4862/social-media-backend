const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
app.use(express.json());
const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const { error } = require("console");
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
    const user =
      (await User.findOne({ email: emailOrUser })) ||
      (await User.findOne({ username: emailOrUser }));

    if (user) {
      const verifyPass = await bcrypt.compare(password, user.password);
      if (verifyPass) {
        const token = await jwt.sign({ user }, key);
        await res.send({ token });
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
    if (resp1 && resp2) res.send({ result: "Followed Successfully" });
  } catch (error) {
    throw new Error(error.message);
  }
};

const doUnFollow = async (req, res) => {
  try {
    const user = req.user;
    const unFollowerId = req.params.id;
    // console.log();
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
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { signUp, login, doFollow, doUnFollow };
