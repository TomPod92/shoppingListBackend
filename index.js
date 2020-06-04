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
// app.get('/', (req, res) => res.send('Shopping List API running...'));
app.listen(PORT, () => console.log(`Server for Shopping List started on port ${PORT}`));
// -------------------------------------------------------------------------------------------
// -------------------------------------------POPULATE----------------------------------------
// const Product = require('./models/Product.model');
// const User = require('./models/User.model');

// const main = async () => {
//     const product = await Product.findById('5ed8be85ffc6394de084fa2e');
//     await product.populate('owner').execPopulate()
//     console.log(product.owner)
//     // --------------------------------------------------------------------
//     const user =  await User.findById('5ed8bdabde83642d24db159b');
//     await user.populate('products').execPopulate();
//     console.log(user.products)
// }

// main();