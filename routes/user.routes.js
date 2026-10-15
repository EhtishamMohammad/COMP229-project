import express from "express"; // Importing express module to create a router for user-related routes
import bcrypt from "bcryptjs"; // Importing bcryptjs module for hashing passwords
import jwt from "jsonwebtoken"; // Importing jsonwebtoken module for generating and verifying JWT tokens
import User from "../models/user.model.js"; // Importing the User model to interact with the users collection in the database
import auth from "../middleware/auth.js"; // Importing the auth middleware to protect routes that require authentication

const router = express.Router(); // Creating a new router instance for user-related routes

// Register a new user 
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body; // Destructuring name, email, and password from the request body
        if (!name || !email || ! password) { // Checking if name, email, or password is missing
            return res.status(400).json({ // Returning a 400 Bad Request response if any of the required fields are missing
                message: "Name, email and password are required" // Providing a message indicating that all fields are required
            });
        }
        if (password.length < 8) { // Checking if the password length is less than 8 characters
            return res.status(400).json({ // Returning a 400 Bad Request response if the password is too short
                message: "Password must be at least 8 characters, numbers or symbols" // Providing a message indicating the password requirements
            });
        }
        const normalizedEmail = email.trim().toLowerCase(); // Normalizing the email by trimming whitespace and converting it to lowercase
        const existingUser = await User.findOne({ // Checking if a user with the same email already exists in the database
            email: normalizedEmail // Querying the database for a user with the normalized email
        });
        if (existingUser) { // If a user with the same email already exists, returning a 409 Conflict response
            return res.status(409).json({ // Returning a 409 Conflict response if the email is already in use
                message: "An account with this email exists already" // Providing a message indicating that the email is already in use
            });
        }
        const hashedPassword = await bcrypt.hash(password, 12); // Hashing the password using bcrypt with a salt round of 12 for security
        const user = await User.create({ // Creating a new user in the database with the provided name, normalized email, and hashed password
            name: name.trim(), // Trimming whitespace from the name before saving it to the database
            email: normalizedEmail, // Saving the normalized email to the database 
            password: hashedPassword // Saving the hashed password to the database
        });
        res.status(201).json({ // Returning a 201 Created response indicating that the user was successfully registered
            message: "Registration successful", // Providing a message indicating that the registration was successful 
            user: { // Returning the newly created user's id, name, and email in the response
                id: user.id, // Returning the user's id from the database
                name: user.name, // Returning the user's name from the database
                email: user.email // Returning the user's email from the database
            }
        }); 
    } catch (error) { // Catching any errors that occur during the registration process and returning an appropriate response
        if (error.code === 11000) { // Checking if the error code is 11000, which indicates a duplicate key error in MongoDB (i.e., the email already exists)
            return res.status(409).json({ // Returning a 409 Conflict response if the email is already in use
                message: "An account with this email already exists" // Providing a message indicating that the email is already in use
            });
        }
        res.status(500).json({ // Returning a 500 Internal Server Error response for any other errors that occur during the registration process
            message: "Registration failed, please retry" // Providing a message indicating that the registration failed and suggesting to retry
        }); 
    }
}); 

// Sign in
router.post('/login', async (req, res) => { // Handling user login by verifying the provided email and password, generating a JWT token upon successful authentication, and returning the token along with user information in the response.
    try {
        const { email, password } = req.body; // Destructuring email and password from the request body
        if (!email || !password) { // Checking if email or password is missing
            return res.status(400).json({ // Returning a 400 Bad Request response if email or password is missing
                message: 'Email and password are required'
            }); 
        }
        const user = await User.findOne({ // Finding a user in the database with the provided email (case-insensitive)
            email: email.trim().toLowerCase() // Normalizing the email by trimming whitespace and converting it to lowercase before querying the database
        }).select('+password') // Selecting the password field explicitly since it is not returned by default in the User model
        if (!user || !(await bcrypt.compare(password, user.password))) { // Checking if the user exists and if the provided password matches the hashed password in the database using bcrypt
            return res.status(401).json({ // Returning a 401 Unauthorized response if the user does not exist or the password is incorrect
                message: 'Invalid email or password' // Providing a message indicating that the email or password is invalid
            });
        }
        if (!process.env.JWT_SECRET) { // Checking if the JWT_SECRET environment variable is not set, which is required for signing the JWT token
            return res.status(500).json({ // Returning a 500 Internal Server Error response if the JWT_SECRET is not configured
                message: 'Authentication is not configured' // Providing a message indicating that the authentication is not configured 
            });
        }
        const token = jwt.sign( // Signing a JWT token with the user's id as the payload, using the JWT_SECRET from the environment variables, and setting an expiration time of 1 hour
            { userID: user._id.toString() }, // Setting the payload of the token to include the user's id as a string
            process.env.JWT_SECRET, // Using the JWT_SECRET from the environment variables to sign the token
            { expiresIn: '1h' } // Setting the token to expire in 1 hour
        );
        res.status(200).json({ // Returning a 200 OK response indicating that the login was successful, along with the generated token and user information
            message: "Login successful", // Providing a message indicating that the login was successful
            token, // Returning the generated JWT token in the response
            user: {
                id: user.id, // Returning the user's id from the database
                name: user.name, // Returning the user's name from the database
                email: user.email // Returning the user's email from the database
            }
        });
    } catch (error) { // Catching any errors that occur during the login process and returning an appropriate response
        console.error('Error during login:', error); // Logging the error to the console for debugging purposes
        
        res.status(500).json({ // Returning a 500 Internal Server Error response for any errors that occur during the login process
            message: 'Login failed', // Providing a message indicating that the login failed
            error: error.message // Providing the error message in the response for debugging purposes 
        });
    }
});

// example proteched endpoint
router.get('/me', auth, async(req, res) => { // Defining a protected route to retrieve the authenticated user's profile information, using the auth middleware to verify the JWT token
    try { // Using a try-catch block to handle any errors that may occur during the process of retrieving the user's profile information
        const user = await User.findById(req.user.userID); // Finding the user in the database by their id, which is extracted from the decoded JWT token and attached to the request object by the auth middleware
        if (!user) { // Checking if the user was not found in the database
            return res.status(404).json({ // Returning a 404 Not Found response if the user does not exist in the database
                message: 'User not found' // Providing a message indicating that the user was not found
            });
        }
        res.status(200).json({ // Returning a 200 OK response with the authenticated user's profile information
            id: user._id,
            name: user.name, // Returning the user's name from the database
            email: user.email // Returning the user's email from the database
        });
    } catch (error) {
        res.status(500).json({ // Returning a 500 Internal Server Error response for any errors that occur while retrieving the user's profile information
            message: 'Could not retrive profile'
        }); 
    }
});

export default router; // Exporting the router instance to be used in other parts of the application, allowing the user-related routes to be accessed and handled by the Express application.