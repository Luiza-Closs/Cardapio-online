const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const fs = require("fs").promises;

// upload imagem

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

// Insert an user into database route

router.post("/add", upload, async (req, res) => {
  try {
    const user = new User({
      nome: req.body.name,
      descricao: req.body.descricao,
      telefone: req.body.phone,
      image: req.file.filename,
      dataIn: req.body.dateIn,
      dataOut: req.body.dateOut,
    });

    await user.save();

    req.session.message = {
      type: "success",
      message: "Serviço adicionado com sucesso!",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

// Get all users route
router.get("/", async (req, res) => {
  try {
    const users = await User.find().exec();
    res.render("index", {
      title: "Início",
      users: users,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.get("/add", (req, res) => {
  res.render("add_users", { title: "Cadastro" });
});

// Deletar serviço

router.get("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndRemove(id);

/* Tentar arrumar o 'fs.unlinkSync'

    if (user && user.imagem !== "") {
      fs.unlinkSync("./uploads/" + user.imagem);
    }

*/
    req.session.message = {
      type: "success",
      message: "Serviço marcado como completo!",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

module.exports = router;
