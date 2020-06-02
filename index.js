require('dotenv').config();

const express = require('express');
const connectDB = require('./dbConfig.js');

const User = require('./models/User.model');
const Product = require('./models/Product.model');
const Section = require('./models/Section.model');

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
// DELETE /users/:user_id
// Usuń użytkownika o danym ID
// private
app.delete('/users/:user_id', async (req, res) => {
    const user_id = req.params.user_id;

    try {
        const user = await User.findByIdAndDelete(user_id);

        if(!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
//-------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
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
// PATCH /products/:product_id
// Edytuj produkt
// private
app.patch('/products/:product_id', async (req, res) => {
    const product_id = req.params.product_id;
    const allowedUpdates = ['section', 'name', 'toBuy', 'shops'];
    const updates = Object.keys(req.body);

    const updatesAreValid = updates.every(current => allowedUpdates.includes(current));

    if(!updatesAreValid) {
        return res.status(400).send({ error: "Invalid updates" })
    }

    try {
        const product = await Product.findByIdAndUpdate(product_id, req.body, { new: true, runValidators: true });

        if(!product) {
            return res.status(404).send();
        }

        res.send(product);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
//-------------------------------------------------------
// DELETE /products/:product_id
// Usuń produkt o danym ID
// private
app.delete('/products/:product_id', async (req, res) => {
    const product_id = req.params.product_id;

    try {
        const product = await Product.findByIdAndDelete(product_id);

        if(!product) {
            return res.status(404).send();
        }

        res.send(product);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
//-------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//-------------------------------------------------------
// POST /sections
// Stwórz dział
// private
app.post('/sections', async (req, res) => {
    const section = new Section(req.body);

    try {
        await section.save();
        res.status(201).send(section);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
});
//-------------------------------------------------------
// GET /sections
// Pobierz wszystkie działy
// private
app.get('/sections', async (req, res) => {
    try {
        const sections = await Section.find({});
        res.send(sections);
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }
});
//-------------------------------------------------------
// DELETE /section/:section_id
// Usuń dział o danym ID
// private
app.delete('/sections/:section_id', async (req, res) => {
    const section_id = req.params.section_id;

    try {
        const section = await Section.findByIdAndDelete(section_id);

        if(!section) {
            return res.status(404).send();
        }

        res.send(section);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
//-------------------------------------------------------

app.listen(PORT, () => console.log(`Server for Shopping List started on port ${PORT}`));