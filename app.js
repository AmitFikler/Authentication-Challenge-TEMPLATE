const express = require('express');
const app = express();
const morgan = require('morgan');
const userRouter = require('./routers/users');
const apiRouter = require('./routers/api');
const jwt = require('jsonwebtoken');
const { USERS } = require('./database/db');
const ACCESS_TOKEN_SECRET = '53i2F7HR9cZhwhmwv9KG';

const optionsArr = [
  {
    method: 'post',
    path: '/users/register',
    description: 'Register, Required: email, name, password',
    example: {
      body: { email: 'user@email.com', name: 'user', password: 'password' },
    },
  },
  {
    method: 'post',
    path: '/users/login',
    description: 'Login, Required: valid email and password',
    example: { body: { email: 'user@email.com', password: 'password' } },
  },
  {
    method: 'post',
    path: '/users/token',
    description: 'Renew access token, Required: valid refresh token',
    example: { headers: { token: '*Refresh Token*' } },
  },
  {
    method: 'post',
    path: '/users/tokenValidate',
    description: 'Access Token Validation, Required: valid access token',
    example: { headers: { Authorization: 'Bearer *Access Token*' } },
  },
  {
    method: 'get',
    path: '/api/v1/information',
    description: "Access user's information, Required: valid access token",
    example: { headers: { Authorization: 'Bearer *Access Token*' } },
  },
  {
    method: 'post',
    path: '/users/logout',
    description: 'Logout, Required: access token',
    example: { body: { token: '*Refresh Token*' } },
  },
  {
    method: 'get',
    path: 'api/v1/users',
    description: 'Get users DB, Required: Valid access token of admin user',
    example: { headers: { authorization: 'Bearer *Access Token*' } },
  },
];

app.use(morgan('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use('/users', userRouter);
app.use('/api', apiRouter);
app.options('/', (req, res) => {
  const tokenWithBearer = req.headers['authorization'];
  if (!tokenWithBearer) {
    return res
      .status(200)
      .header({ Allow: 'OPTIONS, GET, POST' })
      .send([optionsArr[0], optionsArr[1]]);
  }
  const token = tokenWithBearer.split(' ')[1];
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res
        .status(200)
        .header({ Allow: 'OPTIONS, GET, POST' })
        .send([optionsArr[0], optionsArr[1], optionsArr[2]]);
    }
    const findAdmin = USERS.find((users) => users.email === user.email);
    if (findAdmin.isAdmin) {
      return res
        .status(200)
        .header({ Allow: 'OPTIONS, GET, POST' })
        .send(optionsArr);
    } else {
      return res
        .status(200)
        .header({ Allow: 'OPTIONS, GET, POST' })
        .send([
          optionsArr[0],
          optionsArr[1],
          optionsArr[2],
          optionsArr[3],
          optionsArr[4],
          optionsArr[5],
        ]);
    }
  });
});

module.exports = app;
