const Card = require('../models/card');

const BadRequestError = 400;
const NotFoundError = 404;
const ServerError = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(ServerError).send({ message: `Произошла ошибка: ${err}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => { res.status(200).send({ card }); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequestError).send({ message: `Переданы некорректные данные при создании карточки: ${err}` });
      }
      res.status(ServerError).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NotFoundError).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequestError).send({ message: `Переданы некорректные данные для удаления карточки: ${err}` });
      }
      res.status(ServerError).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequestError).send({ message: `Переданы некорректные данные для постановки лайка: ${err}` });
      }
      res.status(ServerError).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadRequestError).send({ message: `Переданы некорректные данные для снятия лайка: ${err}` });
      }
      res.status(ServerError).send({ message: `Произошла ошибка: ${err}` });
    });
};
