const mongoose = require("mongoose");

const db = () => {
  mongoose
    .connect(
      "mongodb+srv://root:admin@mvc.vgxxrmg.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewURLParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => console.log("MongoDB Atlas CONECTADO!"))
    .catch((err) => console.log(err));
};

module.exports = db;