const mongoose = require("mongoose");

const db = () => {
  mongoose
    .connect(
      process.env.DB_URI,
      {
        useNewURLParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("MongoDB Atlas CONECTADO!"))
    .catch((err) => console.log(err));
};

module.exports = db;