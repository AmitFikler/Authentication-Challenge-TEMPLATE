const express = require('express');
const app = express();
const morgan = require('morgan');

// const apiRoute = require('./routes/apiRoute');

app.use(morgan('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use('/api', apiRoute);

module.exports = app;
