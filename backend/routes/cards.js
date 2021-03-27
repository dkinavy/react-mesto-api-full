const cardsRouter = require("express").Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

cardsRouter.get("/cards", getCards);
cardsRouter.post("/cards", createCard);
cardsRouter.delete("/cards/:_id", deleteCard);
cardsRouter.put("/cards/:_id/likes", likeCard);
cardsRouter.delete("/cards/:_id/likes", dislikeCard);

module.exports = cardsRouter;
