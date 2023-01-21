const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/user.route");
const config = require("./config.json");
const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/", userRoute);
app.get("/", (req, res) => res.send("welcome"));

mongoose.connect("mongodb+srv://masthotel:masthotel@masthotel.orap6vu.mongodb.net/mock12?retryWrites=true&w=majority").then(() => {
  app.listen(config.port, () => {
    console.log(`Server started on ${config.port}`);
  });
});
