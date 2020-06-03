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
