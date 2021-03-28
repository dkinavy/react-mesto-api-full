const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/users.js");
const cards = require("./routes/cards.js");
const bodyParser = require("body-parser");
const auth = require("./middlewares/auth");
const { celebrate, Joi, errors } = require("celebrate");
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

// app.use((req, res, next) => {
//   req.user = {
//     _id: "604b6e80d05a8d5c18df12e7",
//   };

//   next();
// });

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser
);
// Все что ниже потребует авторизацию
app.use(auth);

app.use("/", users);
app.use("/", cards);

app.use(errors());

app.use("*", (req, res, next) => {
  next(new NotFoundError({ message: "Запрашиваемый ресурс не найден" }));
});
//финальный обработчик ошибок
app.use((err, _req, res, _next) => {
  const { status = 500, message } = err;
  res.status(status).send({
    message: status === 500 ? "Внутренняя ошибка сервера" : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
