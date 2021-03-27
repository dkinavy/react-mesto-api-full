const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/users.js");
const cards = require("./routes/cards.js");
const bodyParser = require("body-parser");
const { login, createUser } = require("./controllers/users");
const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "604b6e80d05a8d5c18df12e7",
  };

  next();
});

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/", users);
app.use("/", cards);

app.use((req, res) => {
  res.status(404).send({ message: "Запрашиваемый ресурс не найден" });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
