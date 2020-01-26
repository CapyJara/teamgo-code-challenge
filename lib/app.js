const express = require('express');
const app = express();
const checkConnection = require('./middleware/check-connection');
const cors = require('cors');

app.use(cors());
app.use(checkConnection());
app.use(require('morgan')('tiny', { skip: () => process.env.NODE_ENV === 'test' }));
app.use(express.json());

app.get('/api', (_, res) => res.status(200).send({
  message: 'Jared Myhrberg\'s Team-Go Code Challenge!',
}));

app.use('/api/v1/user', require('./routes/user-routes'));
app.use('/api/v1/event', require('./routes/event-routes'));
app.use('/api/v1/seed', require('./routes/seed-routes'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
