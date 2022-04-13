const express = require("express");
require("dotenv").config();
const app = express();
const morgan = require("morgan");


//regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//morgan middleware
app.use(morgan("tiny"));

//import all routes here
const user = require("./routes/user.js");

//router middleware
app.use("/api/v1", user);



app.get("/", (req, res) => {
  res.send("<h1>Welcome to API</h1>");
});

// export app js
module.exports = app;
