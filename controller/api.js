const { getSign, verifyToken, getRefreshSign } = require('../jwt/jwt');
const { USERS, INFORMATION, REFRESHTOKENS } = require('../database/db');
const ACCESS_TOKEN_SECRET = '53i2F7HR9cZhwhmwv9KG';
const REFRESH_ACCESS_TOKEN_SECRET = '53i2F7HR9cZhwhahav9KG';

exports.getInformation = (req, res) => {
  try {
    const tokenWithBearer = req.headers['authorization'];
    if (!tokenWithBearer) {
      res.status(401).send('Access Token Required');
      return;
    }
    const token = tokenWithBearer.split(' ')[1];
    const valid = verifyToken(token, ACCESS_TOKEN_SECRET);
    if (valid) {
      const userInfo = INFORMATION.find(
        (userInfo) => userInfo.email === valid.email
      );
      res.status(200).send([userInfo]);

      return;
    }
  } catch (error) {
    console.log(error);
    res.status(403).send('Invalid Access Token');
  }
};

exports.getUsers = (req, res) => {
  try {
    const tokenWithBearer = req.headers['authorization'];
    if (!tokenWithBearer) {
      res.status(401).send('Access Token Required');
      return;
    }
    const token = tokenWithBearer.split(' ')[1];
    const valid = verifyToken(token, ACCESS_TOKEN_SECRET);
    const fullData = USERS.find((admin) => admin.email === valid.email);
    if (fullData.isAdmin === true) {
      res.status(200).send(USERS);
      return;
    } else {
      throw Error;
    }
  } catch (error) {
    res.status(403).send('Invalid Access Token');
  }
};
