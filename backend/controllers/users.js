const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ConflictError = require("../errors/ConflictError");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { email, password, name, about, avatar } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name, about, avatar }))
    .catch((err) => {
      if (err.name === "MongoError" || err.code === 11000) {
        const r = new ConflictError("Такой пользователь уже есть");
        next(r);
      } else if (err.name === "ValidationError") {
        //res.status(400).send({ message: err.message });
        const r = new BadRequestError("Некорректные данные при регистрации");
        next(r);
      } else {
        next(err);
      }
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        // res.status(404).send({ message: "Не найден пользователь с таким ID" });
        const r = new NotFoundError("Не найден пользователь с таким ID");
        next(r);
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const r = new BadRequestError("Неверный формат ID");
        next(r);
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { about, name }, { new: true })
    .then((user) => {
      if (!user) {
        const r = new NotFoundError("Не найден пользователь с таким ID");
        next(r);
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const r = new BadRequestError("Недопустимые символы");
        next(r);
      } else if (err.name === "CastError") {
        const r = new BadRequestError("Неверный формат ID");
        next(r);
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        const r = new NotFoundError("Не найден пользователь с таким ID");
        next(r);
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const r = new BadRequestError("Недопустимые символы");
        next(r);
      } else if (err.name === "CastError") {
        const r = new BadRequestError("Неверный формат ID");
        next(r);
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "some-secret-key",
        {
          expiresIn: "7d",
        }
      );
      res.send({ token, data: user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        const r = new NotFoundError("Не найден пользователь с таким ID");
        next(r);
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      next(err);
    });
};
