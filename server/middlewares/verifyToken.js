import jwt from 'jsonwebtoken'
import User from '../models/user.js';

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Unauthorized: Token missing'
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      '9XOHWYtF2uV9Ur858CIrT33MTAhPg0LFuAOixcbDgVPMmdYBQEKfjxADbRIR8tC'
    );

    const userData = await User.findById(decoded.id).select('-passwordHash');

    if (!userData) {
      return res.status(401).json({
        message: 'User not found'
      });
    }

    req.user = userData;
    next();

  } catch (error) {
    // 🔥 JWT specific handling
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'jwt expired'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'invalid token'
      });
    }

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export default verifyToken;
