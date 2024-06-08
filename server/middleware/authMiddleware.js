import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader);

    if (!authHeader) {
      return res.status(403).json({ message: 'User is not logged in' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'User is not logged in' });
    }

    const decodedData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decodedData;

    next();
  } catch (e) {
    return res.status(403).json({ message: 'User is not logged in' });
  }
};

export const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: 'User is not logged in' });
    }

    if (!roles.includes(req.user.role[0])) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
