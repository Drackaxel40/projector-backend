import crypto from 'crypto';

// Generate a CSRF token
export default function generateCSRFToken() {
    const expiration = Date.now() + 10 * 60 * 1000; // 10 minutes
    const data = expiration + process.env.CSRF_SECRET;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return `${expiration}:${hash}`;
};  
