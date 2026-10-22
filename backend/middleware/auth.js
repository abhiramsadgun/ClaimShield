const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access Denied: No authentication token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'claimshield_jwt_super_secret_key_2026';
    
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Contains id, email, username
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid, expired, or corrupted authentication token.'
    });
  }
};

module.exports = { verifyToken };
