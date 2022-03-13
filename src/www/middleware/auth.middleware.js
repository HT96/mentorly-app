const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    // get token form request header
    let token = req.headers['x-access-token'] || req.headers['authorization']; // express headers are auto converted to lowercase
    if ( !token) {
      throw new Error('Auth token is not supplied');
    }
    // remove Bearer from token
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    // verify token and save token payload in request
    req.sentinel = jwt.verify(token, config.get('JWT_SECRET'));
    next();
  } catch (e) {
    return res.status(401)
      .json({
        msg: e.message || 'Token is not valid'
      });
  }
};