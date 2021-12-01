const { USERS, INFORMATION, REFRESHTOKENS } = require('../database/db');
const ACCESS_TOKEN_SECRET = '53i2F7HR9cZhwhmwv9KG';
const jwt = require('jsonwebtoken');
const REFRESH_ACCESS_TOKEN_SECRET = '53i2F7HR9cZhwhahav9KG';

exports.getInformation = (req, res) => {
  const tokenWithBearer = req.headers['authorization'];
  if (!tokenWithBearer) {
    res.status(401).send('Access Token Required');
    return;
  }
  const token = tokenWithBearer.split(' ')[1];
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).send('Invalid Access Token');
    }
    const userInfo = INFORMATION.find(
      (userInfo) => userInfo.email === user.email
    );
    console.log(userInfo);
    return res.status(200).send([userInfo]);
  });
};

exports.getUsers = (req, res) => {
  const tokenWithBearer = req.headers['authorization'];
  if (!tokenWithBearer) {
    res.status(401).send('Access Token Required');
    return;
  }
  const token = tokenWithBearer.split(' ')[1];
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid Access Token');
    }
    const findAdmin = USERS.find((users) => users.email === user.email);
    if (findAdmin.isAdmin) {
      return res.status(200).send(USERS);
    } else {
      return res.status(403).send('Invalid Access Token');
    }
  });
};
