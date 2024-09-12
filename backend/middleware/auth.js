// Import the jsonwebtoken library for handling JWTs
const jwt = require('jsonwebtoken');

// Middleware function for authentication
const auth = (req, res, next) => {
  // Get the token from the Authorization header and remove the 'Bearer ' prefix
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // If there's no token, respond with a 401 status (unauthorized)
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    // Verify the token using the secret key from the environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user ID from the decoded token to the request object
    req.userId = decoded.id;
    console.log(`Authenticated user ID: ${req.userId}`)
    
    // Proceed to the next middleware function or route handler
    next();
  } catch (error) {
    // If token verification fails, respond with a 400 status (bad request)
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Export the auth function so it can be used in other parts of the application
module.exports = auth;
