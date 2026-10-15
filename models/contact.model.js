import mongoose from 'mongoose'; // Import the mongoose library for MongoDB interactions

const contactSchema = new mongoose.Schema( // Define a new Mongoose schema for the "Contact" collection in the MongoDB database
    {
        firstName: { // Define the "firstName" field in the schema 
            type: String, // Specify that the type of this field is a string
            required: [true, 'First name is required'], // Make this field required and provide a custom error message if it's missing 
            trim: true // Automatically remove whitespace from the beginning and end of the string
        },
        lastName: { // Define the "lastName" field in the schema
            type: String, // Specify that the type of this field is a string
            required: [true, 'Last name is required'], // Make this field required and provide a custom error message if it's missing
            trim: true // Automatically remove whitespace from the beginning and end of the string
        },
        email: { // Define the "email" field in the schema
            type: String, // Specify that the type of this field is a string
            required: [true, 'Email is required'], // Make this field required and provide a custom error message if it's missing
            trim: true, // Automatically remove whitespace from the beginning and end of the string
            lowercase: true, // Automatically convert the email to lowercase
        },
        message: { // Define the "message" field in the schema
            type: String, // Specify that the type of this field is a string
            required: [true, 'Message is required'], // Make this field required and provide a custom error message if it's missing
            trim: true // Automatically remove whitespace from the beginning and end of the string
        }
    },
    {
            timestamps: true // Automatically add "createdAt" and "updatedAt" fields to the schema, which will store the timestamps of when the document was created and last updated
    }
);

const Contact = mongoose.model('Contact', contactSchema); // Create a Mongoose model named "Contact" based on the defined schema, which will be used to interact with the "Contact" collection in the MongoDB database
export default Contact; // Export the "Contact" model so it can be imported and used in other parts of the application 