const User = require("../models/user");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({
      status: false,
      message: "Name, email and password are required",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
  });
  user.password = undefined;
  const token = user.getJwtToken();

  res.status(200).json({
    success: true,
    token,
    user,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // check for presence of email and password
  if (!email || !password) {
    return res.status(400).json({
      status: false,
      message: "Please provide email and password",
    });
  }

  // get user from DB
  const user = await User.findOne({ email }).select("+password");

  // if user not found in DB
  if (!user) {
    return res.status(400).json({
      status: false,
      message: "Email or password does not match or exist",
    });
  }

  // match the password
  const isPasswordCorrect = await user.isValidatedPassword(password);

  //if password do not match
  if (!isPasswordCorrect) {
    return res.status(400).json({
      status: false,
      message: "Email or password does not match or exist",
    });
  }

  // if all goes good and we send the token
  const token = user.getJwtToken();

  res.status(200).json({
    success: true,
    token,
    user,
  });
};

exports.getLoggedInUserDetails = async (req, res) => {
  //req.user will be added by middleware
  // find user by id
  const user = await User.findById(req.user.id);

  //send response and user data
  res.status(200).json({
    success: true,
    user,
  });
};

exports.adminAllUser = async (req, res) => {
  // select all users
  const users = await User.find();

  // send all users
  res.status(200).json({
    success: true,
    users,
  });
};
