import jwt from 'jsonwebtoken'; // Importing jsonwebtoken module for generating and verifying JWT tokens

const auth = (req, res, next) => { // Middleware function to authenticate requests using JWT tokens
    const authorization = req.headers.authorization; // Retrieving the authorization header from the request headers
    if (!authorization || !authorization.startsWith('Bearer ')) { // Checking if the authorization header is missing or does not start with 'Bearer '
        return res.status(401).json({ // Returning a 401 Unauthorized response if the authorization header is missing or invalid
            message: 'Authentication token required' // Providing a message indicating that an authentication token is required
        });
    }
    const token = authorization.split(' ')[1]; // Extracting the token from the authorization header by splitting the string and taking the second part
    try { // Using a try-catch block to handle any errors that may occur during token verification
        if (!process.env.JWT_SECRET) { // Checking if the JWT_SECRET environment variable is not set, which is required for verifying the JWT token
            return res.status(401).json({ // Returning a 401 Unauthorized response if the JWT_SECRET is not configured
                message: 'Authentication is not configured' // Providing a message indicating that the authentication is not configured
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifying the token using the JWT_SECRET from the environment variables and decoding the payload
        req.user = decoded; // Attaching the decoded payload (which contains the user's id) to the request object for use in subsequent middleware or route handlers
        next(); // Calling the next middleware function in the stack to continue processing the request
    } catch (error) { // Catching any errors that occur during token verification (e.g., invalid or expired token)
        return res.status(401).json({ // Returning a 401 Unauthorized response if the token is invalid or expired
            message: 'Invalid or expired token' // Providing a message indicating that the token is invalid or expired
        });
    }
};

export default auth; // Exporting the auth middleware function to be used in other parts of the application, such as in route handlers that require authentication