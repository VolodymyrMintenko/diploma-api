const jwt = require("jsonwebtoken");

const messages = require("../utils/messages");
const response = require("../utils/response");

const getValidToken = token => {
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    return verified.id ? verified : null;
  } catch (e) {
    return null;
  }
};

const getToken = req => {
  const bearerHeader = req.headers["authorization"];

  if (!bearerHeader) {
    return null;
  }

  const bearer = bearerHeader.split(" ");
  return bearer[1];
};

const verifyLoginToken = (req, res, next, token) => {
  const verified = getValidToken(token);
  if (null !== verified) {
    next();
  } else {
    res.status(401).send(response.error(messages.accessDenied));
  }
};

const extractToken = verification => (...rest) => {
  const [req, res] = rest;
  const token = getToken(req);

  if (!token) {
    return res.status(401).send(response.error(messages.accessDenied));
  }

  verification(...rest, token);
};

module.exports.verifyLoginToken = extractToken(verifyLoginToken);
module.exports.getToken = getToken;
module.exports.getValidToken = getValidToken;
