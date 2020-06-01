require('dotenv').config();

const express = require('express');
const connectDB = require('./dbConfig.js');

const User = require('./models/User.model');
const Product = require('./models/Product.model');

const app = express();

// Połączenie z baza danych
connectDB();

// Middleware
app.use(express.json({extended: false}));

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => res.send('Shopping List API running...'));

//-------------------------------------------------------
// POST /users
// Stwórz użytkownika
// public
app.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
});
//-------------------------------------------------------
// GET /users
// Pobierz wszystkich użytkowników
// private
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});

        res.send(users)
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
//-------------------------------------------------------
// GET /users/:user_id
// Pobierz użytkownika o danym ID
// private
app.get('/users/:user_id', async (req, res) => {
    const user_id = req.params.user_id;

    try {
        const user = await User.findById(user_id);

        if(!user) {
            return res.status(404).send();
        }

        res.send(user)
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
//-------------------------------------------------------
// PATCH /users/:user_id
// Edytuj użytkownika
// private
app.patch('/users/:user_id', async (req, res) => {
    const user_id = req.params.user_id;

    const allowedUpdates = ['name', 'email', 'password'];
    const updates = Object.keys(req.body);
    const updatesAreValid = updates.every(current => allowedUpdates.includes(current));

    if(!updatesAreValid) {
        return res.status(400).send({ error: "Invalid updates" })
    }

    try {
        const user = await User.findByIdAndUpdate(user_id, req.body, { new: true, runValidators: true }); 
        // "new" zwróci zedytowanego użytkownika zamiast tego z przed edycji
        // "runValifators" sprawi że sprawdzimy to co chcemy zmienić/ustawić

        if(!user) {
            return res.status(404).send(); // nie znaleziono użytkownika
        }

        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});
//-------------------------------------------------------
// POST /products
// Stwórz produkt
// private
app.post('/products', async (req, res) => {
    const product = new Product(req.body);

    try {
        await product.save();
        res.status(201).send(product);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});


//-------------------------------------------------------
// GET /products
// Pobierz wszystkie produkty
// private
app.get('/products', async(req, res) => {
    try {
        const products = await Product.find({});
        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
//-------------------------------------------------------
// GET /products/:product_id
// Pobierz produkt o danym ID
// private
app.get('/products/:product_id', async (req, res) => {
    const product_id = req.params.product_id;
    try {
        const product = await Product.findById(product_id);

        if(!product) {
            res.status(404).send();
        }

        res.send(product)
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
//-------------------------------------------------------

app.listen(PORT, () => console.log(`Server for Shopping List started on port ${PORT}`));