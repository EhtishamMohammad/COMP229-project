import mongoose from 'mongoose';

const qualificationSchema = new mongoose.Schema( // Defining a new Mongoose schema for the "Qualification" model, which will represent the structure of the documents in the "Qualification" collection in the MongoDB database
    {
        title: { // Define the "title" field in the schema
            type: String,
            required: [true, 'Qualification title is required'], // Make this field required and provide a custom error message if it's missing
            trim: true
        },
        completionDate: {
            type: String,
            required: [true, 'Qualification completion date is required'], // Make this field required and provide a custom error message if it's missing
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Qualification description is required'], // Make this field required and provide a custom error message if it's missing
            trim: true
        } 
    },
    {
        timestamps: true // Automatically add "createdAt" and "updatedAt" fields to the schema, which will store the timestamps of when the document was created and last updated
    }
)

const Qualification = mongoose.model('Qualification', qualificationSchema); // Create a Mongoose model named "Qualification" based on the defined schema, which will be used to interact with the "Qualification" collection in the MongoDB database
export default Qualification; // Export the "Qualification" model so it can be imported and used in other parts of the application