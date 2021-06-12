const Card = require('../models/card');
const BadRequestError = 400;
const NotFoundError = 404;
const ServerError = 500;


module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
        if (!cards) {
        return res.status(NotFoundError).send({ message: 'Карточки не найдены' });
        }
        return res.status(200).send(cards);
    })
    .catch((err) => res.status(ServerError).send({ message: `Произошла ошибка: ${err}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.params._id })
    .then((card) => {res.status(200).send({ card })})
    .catch((err) => {
        if (err.name === 'ValidationError') {
            return res.status(BadRequestError).send({ message: `Ошибка валидации: ${err}` });
        }
            res.status(ServerError).send({ message: `Произошла ошибка: ${err}` })
            });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
  .then((card) => {
    if (!card) {
      return res.status(NotFoundError).send({ message: 'Карточка не найдена' });
    }
    return res.status(200).send({ data: card });
  })
  .catch((err) => res.status(ServerError).send({ message: `Произошла ошибка: ${err}` }));
};

module.exports.likeCard = (req, res) => {
    Card.findByIdAndUpdate(req.params.cardId,
        { $addToSet: { likes: req.params._id } }, // добавить _id в массив, если его там нет
        { new: true })
        .then((card) => {res.status(200).send({ data: card })})
        .catch(err => res.status(ServerError).send({ message: `Произошла ошибка: ${err}` }));
    
    };
  
  module.exports.dislikeCard = (req, res) => {
    Card.findByIdAndUpdate(req.params.cardId,
        { $pull: { likes: req.params._id } }, // убрать _id из массива
        { new: true })
        .then((card) => {res.status(200).send({ data: card })})
        .catch(err => res.status(ServerError).send({ message: `Произошла ошибка: ${err}` }));
    };