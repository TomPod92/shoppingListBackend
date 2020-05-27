require('dotenv').config();

const express = require('express');
const connectDB = require('./dbConfig.js');
const app = express();

// Połączenie z baza danych
connectDB();

// Middleware
app.use(express.json({extended: false}));

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => res.send('Shopping List API running...'));
app.listen(PORT, () => console.log(`Server for Shopping List started on port ${PORT}`));