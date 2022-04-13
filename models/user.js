const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxlength: [40, "Name should be under 40 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      validate: [validator.isEmail, "Please enter email in correct format"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "password should be atleast 6 char"],
      select: false,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

//encrypt password before save - HOOKS
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// validate the password with passed on user password
userSchema.methods.isValidatedPassword = async function (usersendPassword) {
  return await bcrypt.compare(usersendPassword, this.password);
};

//create and return jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

module.exports = mongoose.model("User", userSchema);
