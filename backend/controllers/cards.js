const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate("user")
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  // Да это просто чтобы не альттабать туда\сюда и не забыть что-то из списка что именно надо править ) Удалил ))
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
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

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: "Не найдена карточка с таким ID" });
      } else {
        res.send({ data: card });
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

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: "Не найдена карточка с таким ID" });
      } else {
        res.send({ data: card });
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

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: "Не найдена карточка с таким ID" });
      } else {
        res.send({ data: card });
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
