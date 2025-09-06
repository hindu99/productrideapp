import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Middleware to authenticate and extract tenant ID
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
 

  // Handle no token
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    // Verify and decode token with your JWT secret from the env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // Example: decoded might contain tenantId, userId, role, etc.
    //This is getting used in createNonadminUserController
    req.tenantId = decoded.tenantId;
    req.role = decoded.role;
    req.userId=decoded.userId
    req.user = decoded; // save entire decoded info if needed


    next(); // pass control to next middleware/route
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export default authMiddleware;
