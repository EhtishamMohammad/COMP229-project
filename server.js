/**
 * Midterm API Project - COMP229
 * Implement the six equipment API endpoints described in README.md.
 * Use the array index as the ID: index 0 is the first equipment item.
 * Add exactly two personalized items to the five supplied below.
 */
import express from 'express';

const app = express(); 
app.use(express.json());

let equipment = [
  // 5 items supplied in the assignment
  { name: 'USB Microphone', category: 'audio', brand: 'AudioLab', year: 2021, quantity: 5 }, // Array number 0
  { name: 'LED Panel', category: 'lighting', brand: 'BrightWorks', year: 2022, quantity: 4 }, // Array number 1
  { name: 'Network Switch', category: 'networking', brand: 'NetCore', year: 2020, quantity: 3 }, // Array number 2
  { name: 'Cable Tester', category: 'tools', brand: 'TestPro', year: 2019, quantity: 6 }, // Array number 3
  { name: 'Studio Headphones', category: 'audio', brand: 'SoundCraft', year: 2023, quantity: 8 }, // Array number 4
  // Here are 2 equipment items released from 1990 to 1999. Added by me.   
  { name: 'Sony PlayStation', category: 'gaming', brand: 'Sony', year: 1994, quantity: 2 }, // Array number 5
  { name: 'Nintendo 64', category: 'gaming', brand: 'Nintendo', year: 1996, quantity: 2 } //  Array number 6
];

function isValidIndex(id) {
  return /^\d+$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) < equipment.length; // Check if id is a non-negative integer and within the bounds of the equipment array
}

function isValidEquipment(item) { // Check if the item is a valid equipment object
  return item !== null && // Check if the item is not null
  typeof item === 'object' && // Check if the item is an object
  !Array.isArray(item) && // Check if the item is not an array
  typeof item.name === 'string' && // Check if the name property is a string
  item.name.trim() !== '' && // Check if the name property is not an empty string
  typeof item.category === 'string' && // Check if the category property is a string
  item.category.trim() !== '' && // Check if the category property is not an empty string
  typeof item.brand === 'string' && // Check if the brand property is a string
  item.brand.trim() !== '' && // Check if the brand property is not an empty string
  Number.isInteger(item.year) && // Check if the year property is an integer
  item.year > 0 && // Check if the year property is a positive integer
  Number.isInteger(item.quantity) && // Check if the quantity property is an integer
  item.quantity >= 0; // Check if the quantity property is a non-negative integer
}

app.get('/api/equipment', (req, res) => {
  // TODO: Return the full equipment array.
  res.status(200).json(equipment); // Return the full equipment array with a 200 OK status
});

// Keep the filter route before /:id.
app.get('/api/equipment/filter', (req, res) => {
  // TODO: Return equipment matching the category query.
  const category = req.query.category; // Get the category query parameter from the request
  if (typeof category !== 'string' || !category.trim()) { // Check if the category query parameter is a non-empty string
    return res.status(400).json({ // Return a 400 Bad Request status with an error message if the category query parameter is invalid
      error: 'Please provide a valid category query parameter.' // Error message for invalid category query parameter
    });
  }
  const filtered = equipment.filter(item => // Filter the equipment array to find items matching the category query parameter
    item.category.toLowerCase() === category.trim().toLowerCase() // Compare the category property of each item to the category query parameter, ignoring case and whitespace
  );
  res.status(200).json(filtered); // Return the filtered equipment array with a 200 OK status
});

app.get('/api/equipment/:id', (req, res) => {
  // TODO: Return the equipment at this array index.
  if (!isValidIndex(req.params.id)) { // Check if the id parameter is a valid index in the equipment array
    return res.status(404).json({ // Return a 404 Not Found status with an error message if the id parameter is invalid
      error: 'Equipment not found. Please provide a valid index.' // Error message for invalid id parameter
    });
  }
  res.status(200).json(equipment[Number(req.params.id)]); // Return the equipment item at the specified index with a 200 OK status
});

app.post('/api/equipment', (req, res) => { // Handle POST requests to add new equipment items
  // TODO: Add an equipment item to the array.
  if (!isValidEquipment(req.body)) { // Check if the request body is a valid equipment object
    return res.status(400).json({ // Return a 400 Bad Request status with an error message if the request body is invalid
      error: 'Invalid equipment data. Please provide a valid equipment object.' // Error message for invalid equipment data
    });
  }
  const newItem = { ... req.body }; // Create a new equipment item by copying the properties from the request body
  equipment.push(newItem); // Add the new equipment item to the equipment array
  res.status(201).json(newItem); // Return the newly added equipment item with a 201 Created status
});

app.put('/api/equipment/:id', (req, res) => { // Handle PUT requests to update existing equipment items
  // TODO: Update the equipment at this array index.
  if (!isValidIndex(req.params.id)) { // Check if the id parameter is a valid index in the equipment array
    return res.status(404).json({ // Return a 404 Not Found status with an error message if the id parameter is invalid
      error: 'Equipment not found. Please provide a valid index.' // Error message for invalid id parameter
    });
  }
  if (!isValidEquipment(req.body)) { // Check if the request body is a valid equipment object
    return res.status(400).json({ // Return a 400 Bad Request status with an error message if the request body is invalid
      error: 'Invalid equipment data. Please provide a valid equipment object.' // Error message for invalid equipment data
    }); 
  }
  const index = Number(req.params.id); // Convert the id parameter to a number to use as an index in the equipment array
  equipment[index] = { ... req.body }; // Update the equipment item at the specified index with the properties from the request body
  res.status(200).json(equipment[index]); // Return the updated equipment item with a 200 OK status
});

app.delete('/api/equipment/:id', (req, res) => { // Handle DELETE requests to remove equipment items
  // TODO: Remove the equipment at this array index.
  if (!isValidIndex(req.params.id)) { // Check if the id parameter is a valid index in the equipment array
    return res.status(404).json({ // Return a 404 Not Found status with an error message if the id parameter is invalid
      error: 'Equipment not found. Please provide a valid index.' // Error message for invalid id parameter
    });
  }
  const index = Number(req.params.id); // Convert the id parameter to a number to use as an index in the equipment array
  const deletedItem = equipment.splice(index, 1)[0]; // Remove the equipment item at the specified index from the equipment array and store it in deletedItem
  res.status(200).json(deletedItem); // Return the deleted equipment item with a 200 OK status
});

const PORT = process.env.PORT || 3000; // Set the port to the value of the PORT environment variable or default to 3000 if not set
app.listen(PORT, '127.0.0.1', err => { // Start the server and listen on the specified port and localhost address
  if (err) { // Check if there was an error starting the server
    console.error(`Cannot start on port ${PORT}: ${err.message}`); // Log an error message if the server cannot start on the specified port
    process.exitCode = 1; // Set the exit code to 1 to indicate an error occurred
    return; // Exit the function early if there was an error starting the server
  }
  console.log(`Server is running on http://localhost:${PORT}`); // Log a message indicating the server is running
});


