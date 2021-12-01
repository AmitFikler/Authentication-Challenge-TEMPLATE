const bcrypt = require('bcrypt');
const { USERS, INFORMATION, REFRESHTOKENS } = require('../database/db');
const ACCESS_TOKEN_SECRET = '53i2F7HR9cZhwhmwv9KG';
const REFRESH_ACCESS_TOKEN_SECRET = '53i2F7HR9cZhwhahav9KG';
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  let isAdmin = false;
  if (password === 'Rc123456!') {
    isAdmin = true;
  }
  const isExists = USERS.find((userObj) => userObj.email === email);
  if (isExists === undefined) {
    res.status(404).send('cannot find user');
  } else {
    console.log(isExists.password);
    const realPassword = await bcrypt.compare('' + password, isExists.password);
    console.log(realPassword);
    if (isExists.email === email && realPassword) {
      const refreshToken = jwt.sign(req.body, REFRESH_ACCESS_TOKEN_SECRET);
      REFRESHTOKENS.push(refreshToken);
      res.status(200).send({
        accessToken: jwt.sign(req.body, ACCESS_TOKEN_SECRET, {
          expiresIn: '10s',
        }),
        refreshToken: refreshToken,
        email: email,
        name: isExists.name,
        isAdmin: isAdmin,
      });
    } else if (isExists.email !== email && realPassword) {
      res.status(403).send('User or Password incorrect');
    } else if (isExists.email === email && realPassword) {
      res.status(403).send('User or Password incorrect');
    }
  }
};

exports.register = async (req, res) => {
  const { email, name, password } = req.body;
  for (let userObj of USERS) {
    if (userObj.email === email) {
      res.status(409).send('user already exists');
      return;
    }
  }
  const hashedPassword = await bcrypt.hash(String(password), 10);
  USERS.push({ email, name, password: hashedPassword, isAdmin: false });
  INFORMATION.push({ email: email, info: `${name} info` });
  res.status(201).send('Register Success');
};

exports.tokenValidate = (req, res) => {
  try {
    const tokenWithBearer = req.headers['authorization'];
    if (!tokenWithBearer) {
      res.status(401).send('Access Token Required');
      return;
    }
    const token = tokenWithBearer.split(' ')[1];
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        throw err;
      }
      res.status(200).send({ valid: true });
      return;
    });
  } catch (error) {
    console.log(error);
    res.status(403).send('Invalid Access Token');
  }
};

exports.logout = (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).send('Refresh Token Required');
      return;
    }
    jwt.verify(token, REFRESH_ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        throw err;
      }
      res.status(200).send('User Logged Out Successfully');
      return;
    });
  } catch (error) {
    res.status(400).send('Invalid Refresh Token');
  }
};

exports.getNewToken = (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(401).send('Refresh Token Required');
      return;
    }
    jwt.verify(token, REFRESH_ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        throw err;
      }
      const newAccessToken = jwt.sign(
        { email: user.email },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' }
      );
      console.log(newAccessToken);
      res.status(200).send({ accessToken: newAccessToken });
      return;
    });
  } catch (error) {
    res.status(403).send('Invalid Refresh Token');
  }
};
