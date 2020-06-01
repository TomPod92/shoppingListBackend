require('dotenv').config();

const express = require('express');
const connectDB = require('./dbConfig.js');
const User = require('./models/User.model');
const app = express();

// Połączenie z baza danych
connectDB();

// Middleware
app.use(express.json({extended: false}));

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => res.send('Shopping List API running...'));


app.post('/users', async (req, res) => {
    console.log('body: ', req.body)
    const user = new User(req.body);

    try {
        await user.save();
        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
});


app.listen(PORT, () => console.log(`Server for Shopping List started on port ${PORT}`));