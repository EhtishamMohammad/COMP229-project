import mongoose from 'mongoose';

const userSchema = new mongoose.Schema( // Define a new Mongoose schema for the "User" collection in the MongoDB database 
    {
        name: {
            type: String,
            required: [true, 'User name is required'], // Make this field required and provide a custom error message if it's missing
            trim: true
        },
        email: {
            type: String,
            required: [true, 'User email is required'], // Make this field required and provide a custom error message if it's missing
            trim: true,
            lowercase: true // Automatically convert the email to lowercase
        },
        password: {
            type: String,
            required: [true, 'User password is required'], // Make this field required and provide a custom error message if it's missing
            select: false // Exclude the password field from query results by default for security reasons
        }
    }
)

const User = mongoose.model('User', userSchema); // Create a Mongoose model named "User" based on the defined schema, which will be used to interact with the "User" collection in the MongoDB database
export default User; // Export the "User" model so it can be imported and used in other parts of the application