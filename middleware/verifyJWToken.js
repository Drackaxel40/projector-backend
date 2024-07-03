import jwt from 'jsonwebtoken';

export default function verifyJWToken(req, res, next) {
  // Token required in the header
  const token = req.header('Authorization');

  if (!token) {
    console.log('No token found in the header');
    return res.status(401).json({ error: 'Access denied' });
  }

  try {
    // Decode the token to get the salt
    const decodedUnverified = jwt.decode(token);

    // Check if we have the token and the salt in the token
    if (!decodedUnverified || !decodedUnverified.salt) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get the salt from the token
    const salt = decodedUnverified.salt;

    // Create a salted secret key
    const saltedSecretKey = process.env.JWT_SECRET_KEY + salt;

    // Verify the token with the salted secret key
    const decoded = jwt.verify(token, saltedSecretKey);

    // Add user to the request
    req.requestingUserUUID = decoded.userUUID;

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