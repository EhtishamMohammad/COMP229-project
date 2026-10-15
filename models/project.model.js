import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema( // Define a new Mongoose schema for the "Project" collection in the MongoDB database
    {
        title: { // Define the "title" field in the schema
            type: String,
            required: [true, 'Project title is required'], // Make this field required and provide a custom error message if it's missing
            trim: true
        },
        completionDate: {
            type: String,
            required: [true, 'Project completion date is required'], // Make this field required and provide a custom error message if it's missing
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Project description is required'], // Make this field required and provide a custom error message if it's missing
            trim: true
        }
    },
    {
        timestamps: true
    }
)

const Project = mongoose.model('Project', projectSchema); // Create a Mongoose model named "Project" based on the defined schema, which will be used to interact with the "Project" collection in the MongoDB database
export default Project; // Export the "Project" model so it can be imported and used in other parts of the application