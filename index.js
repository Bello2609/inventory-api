const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

//routes
const routes = require("./src/api/routes");
const { trusted } = require("mongoose");
const app = express();
app.use(cors());
app.set("view engine", "ejs");
app.use(morgan(":method :url :status :user-agent - :response-time ms"));
// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//routes
app.use("/api/v1", routes);
// Base route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    route: "Base Route",
    timestamp: Date.now(),
  });
});
// Undefined route
app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Undefined Route",
  });
});
module.exports = app;
