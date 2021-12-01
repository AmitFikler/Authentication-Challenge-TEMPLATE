const bcrypt = require('bcrypt');
const { getSign, verifyToken, getRefreshSign } = require('../jwt/jwt');
const ACCESS_TOKEN_SECRET = '53i2F7HR9cZhwhmwv9KG';
const REFRESH_ACCESS_TOKEN_SECRET = '53i2F7HR9cZhwhahav9KG';

const USERS = [];
// [...{email, name, password, isAdmin}...],
const INFORMATION = [];
// [...{email, info}...]
const REFRESHTOKENS = [];

exports.login = (req, res) => {
  const { email, password } = req.body;
  // const realPassword = bcrypt.compare(password, 'bla');
  const isExists = USERS.find((userObj) => userObj.email === email);
  if (isExists === undefined) {
    res.status(404).send('cannot find user');
  } else {
    if (isExists.email === email && isExists.password === password) {
      res.status(200).send({
        accessToken: getSign(req.body, ACCESS_TOKEN_SECRET),
        refreshToken: getRefreshSign(req.body, REFRESH_ACCESS_TOKEN_SECRET),
        email: email,
        name: isExists.name,
        isAdmin: false,
      });
    } else if (isExists.email !== email && isExists.password === password) {
      res.status(403).send('User or Password incorrect');
    } else if (isExists.email === email && isExists.password !== password) {
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
  // const salt = 'bla';
  // const hashedPassword = await bcrypt.hash('' + password, salt);
  USERS.push({ email, name, password, isAdmin: false });
  INFORMATION.push({ email: email, info: `${name} info` });
  res.status(201).send('Register Success');
};

exports.tokenValidate = (req, res) => {
  console.log(
    verifyToken(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9.eyJlbWFpbCI6ImFtaXRAZ21haWwuY29tIiwicGFzc3dvcmQiOjEyMzQsImlhdCI6MTYzODM1NDk5N30.Q8rdkKiGlMALkvRlBizcSwdSmhRETk4Iq8YF_cLtPCU',
      REFRESH_ACCESS_TOKEN_SECRET
    )
  );
  res.send('hello');
};

exports.logout = (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).send('Refresh Token Required');
      return;
    }
    const valid = verifyToken(token, REFRESH_ACCESS_TOKEN_SECRET);
    if (valid) {
      res.status(200).send('User Logged Out Successfully');
      return;
    }
  } catch (error) {
    res.status(400).send('Invalid Refresh Token');
  }
};
