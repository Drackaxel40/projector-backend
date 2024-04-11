import jwt from 'jsonwebtoken';

export default function verifyToken(req, res, next) {
  // Token required in the header
  const token = req.header('Authorization');

  // Allow access to login route without token
  if ((!token && req.path === '/login') || (!token && req.path === '/create')) {
    return next();
  }

  // Access denied if no token
  if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
      // Check if token is valid
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      
      // Add user to the request
      req.userId = decoded.userId;

      // Pass to the next middleware
      next();
    } catch (error) {
      // Access denied if token is invalid
      res.status(401).json({ error: 'Invalid token' });
    }
};