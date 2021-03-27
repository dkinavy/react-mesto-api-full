const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.createUser = (req, res) => {
  const { email, password, name, about, avatar } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name, about, avatar }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      // ValidationError - говорим что 400 бед реквест
      if (err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
      } else {
        // иначе - говорим что 500 серверу плохо
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "Не найден пользователь с таким ID" });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "Неверный формат ID" });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { name, about })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "Не найден пользователь с таким ID" });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(400).send({ message: "Неверный формат ID" });
      } else {
        // иначе - говорим что 500 серверу плохо
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { avatar })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "Не найден пользователь с таким ID" });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(400).send({ message: "Неверный формат ID" });
      } else {
        // иначе - говорим что 500 серверу плохо
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findByCredentials(email, password)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: "Не найден пользователь с такими реквизитами" });
      } else {
        console.log(user);
        const token = jwt.sign({ _id: user._id }, "some-secret-key", {
          expiresIn: "7d",
        });
        res.send({ token, data: user });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(400).send({ message: "Неверный формат ID" });
      } else {
        // иначе - говорим что 500 серверу плохо
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.getMe = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "Не найден пользователь с таким ID" });
      } else {
        console.log(user);
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
      } else if (err.name === "CastError") {
        // console.log(user);
        res.status(400).send({ message: "Неверный формат ID" });
      } else {
        // иначе - говорим что 500 серверу плохо
        res.status(500).send({ message: err.message });
      }
    });
};
