const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require("../controllers/users");
const users = require("express").Router();

users.get("/users", getUsers);
users.get("/users/:id", getUserById);
users.post("/users", createUser);
users.patch("/users/me", updateUser);
users.patch("/users/me/avatar", updateAvatar);

module.exports = users;
