const User = require('../models/user');

module.exports.getUsers = (req, res) => {
    User.find({})
      .then((users) => {
        if (!users) {
          return res.status(404).send({ message: 'Пользователь не найден' });
          }
          return res.status(200).send({ data: users });
      })
      .catch(err => res.status(500).send({ err }));
  };

  module.exports.getUserById = (req, res) => {
    User.findById(req.params._id)
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: 'Пользователь не найден' });
          }
          return res.status(200).send({ data: user });
      })
      .catch(err => res.status(500).send({ err }));
  };

  module.exports.createUser = (req, res) => {
    console.log(req.params._id);
    const {name, about, avatar} = req.body;
    User.create({ name, about, avatar})
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
          return res.status(400).send({ message: `Ошибка валидации: ${err}` });
        }
          res.status(500).send({ message: `Произошла ошибка: ${err}` })
          });
  };

  module.exports.updateUser = (req, res) => {
    const {name, about} = req.body
    User.findByIdAndUpdate(req.params._id, {name, about})
      .then(user => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
            return res.status(400).send({ message: `Ошибка валидации: ${err}` });
          }
            res.status(500).send({ message: `Произошла ошибка: ${err}` })
            });
    };

  module.exports.updateAvatar = (req, res) => {
      const {avatar} = req.body
      User.findByIdAndUpdate(req.params._id, {avatar})
      .then((user) => res.status(200).send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
            return res.status(400).send({ message: `Ошибка валидации: ${err}` });
          }
            res.status(500).send({ message: `Произошла ошибка: ${err}` })
            });
    };