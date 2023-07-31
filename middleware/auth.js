const key = process.env.JWT_KEY;
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    let token = await req.headers["authorization"].split(" ")[1];
    const decoded = jwt.verify(token, key);
    const user = await User.findOne({ _id: decoded.id });
    req.user = user;
    next();
  } catch (err) {
    console.log(err.message);
    res.send({
      error: "Unauthorized User!!!",
    });
  }
};

module.exports = { auth };
