const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line no-useless-escape
const url = /^(https?:\/\/)?(www\.)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/gm;

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(url).required()
      .error(new Joi.ValidationError('Неверная ссылка')),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(url).required()
      .error(new Joi.ValidationError('Неверная ссылка')),
  }),
});
const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});
const validateSign = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  validateUser,
  validateAvatar,
  validateCard,
  validateId,
  validateSign,
};
