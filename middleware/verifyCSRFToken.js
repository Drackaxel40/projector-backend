import crypto from 'crypto';

// Verify a CSRF token
export default function verifyCSRFToken(req, res, next) {
  try {
    const token = req.header('CSRF-Token');

    // Access denied if no token
    if (!token){
        console.log("No CSRF token found");
        return res.status(401).json({ error: 'Access denied' });
    }

    // Check if token is valid
    const [expiration, hash] = token.split(':');
    const data = expiration + process.env.CSRF_SECRET;
    const hashVerify = crypto.createHash('sha256').update(data).digest('hex');

    // Access denied if token is invalid
    if (hash !== hashVerify){
        console.log("Invalid CSRF token");
        return res.status(401).json({ error: 'Invalid CSRF token' });
    }
     
    // Check if token is expired
    if (Date.now() > parseInt(expiration)){
        console.log("CSRF token expired");
        return res.status(401).json({ error: 'CSRF token expired' });
    }

    // Pass to the next middleware
    next();
  } catch (error) {
    console.log("An error occurred during CSRF token verification");
    res.status(500).json({ error: 'Server error' });
  }
}