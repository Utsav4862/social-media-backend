const express = require("express");

const router = express.Router();

router.use("/user", require("./userRoutes"));
router.use("/post", require("./postRoutes"));

module.exports = router;
