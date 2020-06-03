require('dotenv').config();

const express = require('express');
const connectDB = require('./dbConfig.js');

const UsersRouter = require('./routers/users.router');
const ProductsRouter = require('./routers/products.router');
const SectionsRouter = require('./routers/sections.router');

const app = express();

// Połączenie z baza danych
connectDB();

// Middleware
app.use(express.json({extended: false}));

// rejestracja routerów
app.use(UsersRouter);
app.use(ProductsRouter);
app.use(SectionsRouter);

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => res.send('Shopping List API running...'));

app.listen(PORT, () => console.log(`Server for Shopping List started on port ${PORT}`));

const jwt = require('jsonwebtoken');

const MyFunction = () => {
    const token = jwt.sign({ user_id: 'abcd1234' }, process.env.JTW_SECRET, { expiresIn: '5 days' });
    console.log(token);

    const tokenIsValid = jwt.verify(token, process.env.JTW_SECRET);
    console.log(tokenIsValid);
};

// MyFunction();
