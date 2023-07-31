const express = require("express");
require("dotenv").config({ path: ".env" });
require("./db");

const cors = require("cors");
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5550;
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
    parameterLimit: 10000,
    limit: "100mb",
  })
);

const routes = require("./routes/index");
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));
app.use("/", routes);
const server = app.listen(port);
