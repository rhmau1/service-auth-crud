const jwt = require('jsonwebtoken');
const { client } = require('../utils/redis');
const { errorResponse } = require('../utils/response');

const signJwt = async (userId, role) => {
  const token = jwt.sign({ user_id: userId, role: role }, process.env.SECRET_KEY_JWT);
  return token;
};

const verifyJwtAdmin = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send(errorResponse(401, 'Unathorized'));
  }
  const parseToken = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY_JWT);
  if (parseToken.role != 'admin') {
    return res.status(403).send(errorResponse(403, 'Forbidden'));
  }
  const value = await client.get(`token:${parseToken.user_id}`);
  // console.log(value);
  if (value != token.split(' ')[1]) {
    return res.status(401).send(errorResponse(401, 'Token invalid'));
  } else {
    next();
  }
};

module.exports = { signJwt, verifyJwtAdmin };
