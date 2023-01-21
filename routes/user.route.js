const express = require("express");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config.json");
const app = express.Router();
const argon2id = require("argon2");

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).send("User already exists");
    } else {
      const hash = await argon2id.hash(password);
      const user = await User.create({ name, email, password: hash });
      return res.status(201).send({ message: "User created", user });
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      if (!(await argon2id.verify(user.password, password))) {
        return res.status(401).send({ message: "Incorrect password" });
      }

      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          created: user.createdAt,
        },
        config.secret,
        {
          expiresIn: config.tokenLife,
        }
      );

      const response = {
        status: "Logged in",
        token: token,
      };

      res.status(200).send(response);
    } else {
      return res.status(401).send({ message: "User not found" });
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.get("/getProfile", (req, res) => {
  let { token } = req.headers;

  try {
    jwt.verify(token, config.secret, (err, verified) => {
      if (err) return res.status(401).send("Unauthorized");
      else {
        return res.status(200).send(verified);
      }
    });
  } catch (error) {
    return res.status(400).send(error);
  }
});

app.post("/calculate", (req, res) => {
  const { aia, years, roi } = req.body;
  try {
    let MaturityVal = Math.floor(
      aia * (((1 + roi / 100) ** years - 1) / (roi / 100))
    );
    res.send({MaturityVal});
  } catch (e) {
    res.send(e);
  }
});

module.exports = app;
