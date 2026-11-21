const express = require('express');
const cors = require('cors'); // Import the CORS middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors( {origin: 'http://localhost:5173' } ));
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
app.use(errorHandler);

module.exports = app;