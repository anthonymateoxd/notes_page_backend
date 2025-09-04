import { TOKEN_SECRET } from '../config.js';
import jwt from 'jsonwebtoken';

export const authRequired = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    return res
      .status(401)
      .json({ message: 'Invalid Token, Authorization Denied' });

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token no Authorized' });
    req.user = user;
    next();
  });
};
