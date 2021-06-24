const express = require('express');
const mongoose = require('mongoose');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const bodyParser = require('body-parser');

const app = express();

const { createUser, login } = require('./controllers/users');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const auth = require('./middlewares/auth');

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', createUser);
app.post('/signin', login);

app.use('/', auth, usersRoutes);
app.use('/', auth, cardsRoutes);

app.use('/', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

// app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
