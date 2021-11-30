const USERS = [];
// [...{email, name, password, isAdmin}...],
const INFORMATION = [];
// [...{email, info}...]
const REFRESHTOKENS = [];

exports.login = (req, res) => {
  res.send('hello');
};

exports.register = (req, res) => {
  const { email, user } = req.body;
  for (let userObj of USERS) {
    if (userObj.email === email) {
      res.status(409).send('user already exists');
      return;
    }
  }
  USERS.push(req.body);
  INFORMATION.push({ email: email, info: `${user} info` });
  res.status(201).send('Register Success');
};

exports.tokenValidate = (req, res) => {
  res.send('tokenValidate');
};
