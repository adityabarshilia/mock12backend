const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String
},{versionKey: false, timestamps: true});

const User = model("user", UserSchema);

module.exports = User;
