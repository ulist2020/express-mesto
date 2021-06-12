const express = require('express');
const mongoose = require('mongoose');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const bodyParser = require('body-parser');

const app = express();

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
.then (() => console.log("Mongo DB запустился"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', usersRoutes);
app.use('/', cardsRoutes);

app.use((req, res, next) => {
  req.user = {
    _id: '60c33d621d128a1c7491c859' 
  };

  next();
});

//app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
}) 