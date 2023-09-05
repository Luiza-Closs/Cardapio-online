const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nome: { type: String },
  descricao: { type: String },
  telefone: { type: String },
  image: { type: String },
  dataIn: { type: String },
  dataOut: { type: String },
  status: { type: String },

  /* Não está sendo usada 
  
  email: { type: String },
  senha: { type: String },

  */
});

module.exports = mongoose.model("User", userSchema);