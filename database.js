import mongoose from 'mongoose'; // Import the mongoose library for MongoDB interactions
import dotenv from 'dotenv'; // Import the dotenv library to load environment variables from a .env file

dotenv.config(); // Load environment variables from the .env file into process.env

const connectDB = async () => { // Define an asynchronous function to connect to the MongoDB database
    try {
        await mongoose.connect(process.env.MONGODB_URI); // Attempt to connect to the MongoDB database using the connection string from environment variables
        console.log("MongoDB connected successfully"); // Log a success message if the connection is successful    
    } catch (error) {
        console.error("MongoDB connection failed:", error.message); // Log an error message if the connection fails 
        process.exit(1); // Exit the process with a failure code 
    }
} 

export default connectDB; // Export the connectDB function as the default export of this module 
