const express = require("express");
const router = express.Router();
const User = require("../models/users");
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
    const user = new User({
      nome: req.body.name,
      descricao: req.body.descricao,
      telefone: req.body.phone,
      image: req.file.filename,
      dataIn: req.body.dateIn,
      dataOut: req.body.dateOut,
      status: req.body.status,
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

/* Não está funcionando, pois quando implementa o código simplesmente morre...

router.post("/cadastro", upload, async (req, res) => {
  try {
    const cadastro = new Cadastro({
      email: req.body.email,
      senha: req.body.senha,
    });

    await cadastro.save();

    req.session.message = {
      type: "success",
      message: "Serviço adicionado com sucesso!",
    };
    res.redirect("/");
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

*/

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

/* Não está funcionando

router.get("/cadastro", (req, res) => {
  res.render("cadastro", { title: "Cadastro User" });
});

*/

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

router.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).exec();
    if (!user) {
      res.redirect("/");
    } else {
      res.render("edit_users", {
        title: "Editar serviço!",
        user: user,
      });
    }
  } catch (err) {
    res.redirect("/");
  }
});

router.post("/update/:id", upload, async (req, res) => {
  try {
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

    const updatedUser = await User.findByIdAndUpdate(id, {
      nome: req.body.name,
      descricao: req.body.descricao,
      telefone: req.body.phone,
      image: new_image,
      dataIn: req.body.dateIn,
      dataOut: req.body.dateOut,
      status: req.body.status,
    }).exec();

    if (!updatedUser) {
      res.json({ message: "Usuário não encontrado", type: "danger" });
    } else {
      req.session.message = {
        type: "success",
        message: "Serviço atualizado com sucesso!",
      };
      res.redirect("/");
    }
  } catch (err) {
    res.json({ message: err.message, type: "danger" });
  }
});

module.exports = router;
