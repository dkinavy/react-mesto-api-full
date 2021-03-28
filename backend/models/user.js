const mongoose = require("mongoose");
var validator = require("validator");
const BadRequestError = require("../errors/BadRequestError");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Введите корректный Email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 6,
  },

  name: {
    type: String,
    default: "Жак-Ив Кусто",
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: "Исследователь",
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: {
      validator(v) {
        return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(
          v
        );
      },
      message: "Введите корректный URL",
    },
  },
});

userSchema.statics.findByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        const r = new BadRequestError("Не найден такой пользователь");
        throw r;
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const r = new BadRequestError("Не найден такой пользователь");
          throw r;
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
