import jwt from 'jsonwebtoken';

export const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '24h' });
  return accessToken;
};
