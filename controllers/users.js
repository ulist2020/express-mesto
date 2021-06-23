const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = 400;
const NotFoundError = 404;
const ServerError = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(ServerError).send({ message: `Произошла ошибка: ${err}` }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        return res.status(NotFoundError).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequestError).send({ message: `Ошибка валидации: ${err}` });
      }
      res.status(ServerError).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.createUser = (req, res) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequestError).send({ message: `Переданы некорректные данные при создании пользователя: ${err}` });
      } else {
        res.status(ServerError).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  if (
    !name || name.length < 2 || name.length > 30
    || !about || about.length < 2 || about.length > 30
  ) {
    res.status(BadRequestError).send({ message: 'Переданы некорректные данные при обновлении профиля' });
  } else {
    User.findByIdAndUpdate(req.user._id, { name, about })
      .then((user) => {
        if (!user) {
          res.status(NotFoundError).send({ message: 'Пользователь с указанным _id не найден' });
        }
        res.status(200).send({ data: user });
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(BadRequestError).send({ message: `Переданы некорректные данные при обновлении профиля: ${err}` });
        }
        res.status(ServerError).send({ message: `Произошла ошибка: ${err}` });
      });
  }
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(BadRequestError).send({ message: 'Переданы некорректные данные при обновлении аватара' });
  } else {
    User.findByIdAndUpdate(req.user._id, { avatar })
      .then((user) => {
        if (!user) {
          res.status(NotFoundError).send({ message: 'Пользователь с указанным _id не найден' });
        }
        res.status(200).send({ data: user });
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(BadRequestError).send({ message: `Переданы некорректные данные при обновлении аватара: ${err}` });
        }
        res.status(ServerError).send({ message: `Произошла ошибка: ${err}` });
      });
  }
};
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' }),
      });
    })
    .catch(() => {
      res.status(401).send({ message: 'Неправильные почта или пароль' });
    });
};
