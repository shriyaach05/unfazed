require('dotenv').config(); // Load environment variables from .env file

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000; // Use the PORT from environment variables or default to 5000

// Connect to MongoDB
connectDB().then( () => {
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
});