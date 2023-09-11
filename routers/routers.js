const express = require("express");
const router = express.Router();
const Pratos = require("../models/users");
const PratosController = require("../controller/pratosController");
const multer = require("multer");
const fs = require("fs").promises;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

router.post("/add", upload, async (req, res) => {
  try {
    PratosController.criarPrato(req, res);
    req.session.message = {
      type: "alert",
      message: "Prato adicionado com sucesso!",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await Pratos.find().exec();
    res.render("main", {
      title: "Início",
      users: users,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.get("/add", (req, res) => {
  res.render("addPratos", { title: "Cadastro" });
});

router.get("/delete/:id", async (req, res) => {
  try {
    PratosController.deletarPrato(req, res);

    req.session.message = {
      type: "success",
      message: "Prato excluido do cardápio!",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

router.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Pratos.findById(id).exec();
    if (!user) {
      res.redirect("/");
    } else {
      res.render("editPratos", {
        title: "Editar cardapio!",
        user: user,
      });
    }
  } catch (err) {
    res.redirect("/");
  }
});

router.post("/update/:id", upload, async (req, res) => {
  try {
    const updatedUser = PratosController.atualizarPrato(req, res);
    if (!updatedUser) {
      res.json({ message: "Prato não encontrado", type: "danger" });
    } else {
      req.session.message = {
        type: "success",
        message: "Prato atualizado com sucesso!",
      };
      res.redirect("/");
    }
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

module.exports = router;
