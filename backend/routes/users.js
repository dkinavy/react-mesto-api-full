const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getMe,
} = require("../controllers/users");
const users = require("express").Router();
const { celebrate, Joi } = require("celebrate");

users.get("/users", getUsers);
users.get("/users/me", getMe);
users.get("/users/:id", getUserById);
// users.patch("/users/me", updateUser);
// users.patch("/users/me/avatar", updateAvatar);

users.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser
);

users.patch(
  "/users/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .pattern(/^(http|https):\/\/[^ "]+$/),
    }),
  }),
  updateAvatar
);

module.exports = users;
