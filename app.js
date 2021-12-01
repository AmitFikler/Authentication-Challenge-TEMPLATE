const express = require('express');
const app = express();
const morgan = require('morgan');
const userRouter = require('./routers/users');
const apiRouter = require('./routers/api');

// const apiRoute = require('./routes/apiRoute');

app.use(morgan('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter);
app.use('/api', apiRouter);

module.exports = app;
