const mongoose = require("mongoose");

const pratoSchema = new mongoose.Schema({
  nome: { type: String },
  image: { type: String },
  preco: { type: String },
  tempo: { type: String },
  descricao: { type: String }
});

module.exports = mongoose.model("Pratos", pratoSchema);