const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const cors = require("cors");
const users = require("./routes/users.js");
const cards = require("./routes/cards.js");
const bodyParser = require("body-parser");
const auth = require("./middlewares/auth");
const { celebrate, Joi, isCelebrateError } = require("celebrate");
const { login, createUser } = require("./controllers/users");
const { PORT = 3001 } = process.env;
const { requestLogger, errorLogger } = require("./middlewares/logger");
const AuthorizationError = require("./errors/AuthorizationError.js");
const app = express();

const corsOptions = {
  origin: "http://mestoforday.nomoredomains.icu",
  credentials: true,
};

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use("*", cors(corsOptions));

app.use(requestLogger); // подключаем логгер запросов
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

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
    body: Joi.object()
      .keys({
        email: Joi.string()
          .required()
          .email()
          .message("Не похоже на почту чета совсем"),
        password: Joi.string().required().min(8),
      })
      .unknown(true),
  }),
  createUser
);
// Все что ниже потребует авторизацию
app.use(auth);

app.use("/", users);
app.use("/", cards);

app.use(errorLogger);

const errorHandling = (err, req, res, next) => {
  //Если у нас ошибка является ошибкой Celebrate
  if (isCelebrateError(err)) {
    //То достаем из деталей ошибки тело (details это Map)
    const errorBody = err.details.get("body");
    // Возвращаем юзеру только свое сообщение без "сикретной" инфы про то что кроме мыла надо еще пароль
    return res.send({
      message: errorBody.message,
    });
  }
  return next(err);
};
// И напишем
app.use(errorHandling);
// Вместо
// app.use(errors());

//финальный обработчик ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
