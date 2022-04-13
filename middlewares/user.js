const User = require("../models/user");
const jwt = require("jsonwebtoken");

const isTokenExpired = (token) => (Date.now() >= JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).exp * 1000)

exports.isLoggedIn = async (req, res, next) => {
  let token;

  if (req.header("Authorization")) {
    token = req.header("Authorization").replace("Bearer ", "");
  }

  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "Login first to get access" });
  }

  if(isTokenExpired(token)){
    return res
    .status(400)
    .json({ status: false, message: "JWT token is expired" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);

  next();
};

exports.customRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res
        .status(400)
        .json({ status: false, message:"You are not allowed for this resouce" })
    }
    next();
  };
};
