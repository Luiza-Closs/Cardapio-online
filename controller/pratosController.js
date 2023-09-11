const express = require("express");
const Pratos = require("../models/users");

class PratosController {
  static async criarPrato(req, res) {
    const prato = new Pratos({
      nome: req.body.nome,
      image: req.file.filename,
      preco: req.body.preco,
      tempo: req.body.tempo,
      descricao: req.body.descricao,
    });
    await prato.save();

    return prato;
  }

  static async deletarPrato(req, res) {
    const id = req.params.id;
    const user = await Pratos.findByIdAndRemove(id);
    return user;
  }

  static async atualizarPrato(req, res) {
    let id = req.params.id;
    let new_image = "";

    if (req.file) {
      new_image = req.file.filename;
      try {
        fs.unlinkSync("./uploads/" + req.body.old_image);
      } catch (err) {
        console.log(err);
      }
    } else {
      new_image = req.body.old_image;
    }

    const updatedUser = await Pratos.findByIdAndUpdate(id, {
      nome: req.body.nome,
      img: new_image,
      preco: req.body.preco,
      tempo: req.body.tempo,
      descricao: req.body.descricao,
    }).exec();

    return updatedUser;
  }
}

module.exports = PratosController;
