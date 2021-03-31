const AuthorizationError = require("../errors/AuthorizationError");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate("user")
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  //data.card ??
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card: card }))
    .catch((err) => {
      // ValidationError - говорим что 400 бед реквест
      if (err.name === "ValidationError") {
        const r = new BadRequestError(
          "Некорректные данные при создании карточки"
        );
        next(r);

        //res.status(400).send({ message: err.message });
      }

      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => {
      if (!card) {
        //res.status(404).send({ message: "Не найдена карточка с таким ID" });
        const r = new NotFoundError("Нет карточки с таким идентификатором");
        next(r);
      } else if (card.owner.toString() !== req.user._id) {
        //res.status(403).send({ message: "Нельзя удалять чужие картинки" });
        const r = new ForbiddenError("Нельзя удалять чужие картинки");
        next(r);
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        //res.status(400).send({ message: "Неверный формат ID" });
        const r = new BadRequestError("Неверный формат ID");
        next(r);
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      if (!card) {
        //res.status(404).send({ message: "Не найдена карточка с таким ID" });
        const r = new NotFoundError(
          "Вам нравится карточка которой не существует"
        );
        next(r);
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        //res.status(400).send({ message: "Неверный формат ID" });
        const r = new BadRequestError("Неверный формат ID");
        next(r);
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (!card) {
        //res.status(404).send({ message: "Не найдена карточка с таким ID" });
        const r = new NotFoundError(
          "Вам не нравится карточка которой не существует"
        );
        next(r);
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        //res.status(400).send({ message: "Неверный формат ID" });
        const r = new BadRequestError("Неверный формат ID");
        next(r);
      }
      next(err);
    });
};
