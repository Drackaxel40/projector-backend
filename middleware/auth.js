import jwt from 'jsonwebtoken';

export default function verifyJWTToken(req, res, next) {
  // Token required in the header
  const token = req.header('Authorization');

  if (!token) {
    console.log('No token found in the header');
    return res.status(401).json({ error: 'Access denied' });
  }

  // Allow access to login route without token
  if ((!token && req.path === '/login') || (!token && req.path === '/create')) {
    return next();
  }


  try {
    // Check if token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Add user to the request
    req.userUUID = decoded.userUUID;

    next();

  } catch (error) {
    // Access denied if token is invalid or expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    } else {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
};