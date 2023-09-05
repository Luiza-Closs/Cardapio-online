require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const db = require("./database/db");
const app = express();
const PORT = process.env.PORT || 4000;

db();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: true,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use(express.static("uploads"));

app.set("view engine", "ejs");

app.use("", require("./controller/routesController"));

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
