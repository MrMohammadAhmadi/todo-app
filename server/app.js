const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");

const todoRoutes = require("./routes/todoRoutes");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.use("/api/todo", todoRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Not Founded!", 404);
  throw error;
});
app.use((error, req, res, next) => {
  if (res.headerSet) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Error" });
});
mongoose
  .connect("mongodb://127.0.0.1:27017/taskListApp", { useNewUrlParser: true })
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
