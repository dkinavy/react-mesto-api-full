const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getMe,
} = require("../controllers/users");
const users = require("express").Router();

users.get("/users", getUsers);
users.get("/users/me", getMe);
users.get("/users/:id", getUserById);
users.patch("/users/me", updateUser);
users.patch("/users/me/avatar", updateAvatar);

module.exports = users;
