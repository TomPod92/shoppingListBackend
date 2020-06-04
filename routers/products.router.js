const express = require('express');
const Product = require('../models/Product.model');
const authMiddleware = require('../middleware/authMiddleware');

const router = new express.Router();

// POST /products
// Stwórz produkt
// private
router.post('/products', authMiddleware, async (req, res) => {
    const product = new Product({
        ...req.body,
        owner: req.user._id
    });

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
router.get('/products', async(req, res) => {
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
router.get('/products/:product_id', async (req, res) => {
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
router.patch('/products/:product_id', async (req, res) => {
    const product_id = req.params.product_id;
    const allowedUpdates = ['section', 'name', 'toBuy', 'shops'];
    const updates = Object.keys(req.body);

    const updatesAreValid = updates.every(current => allowedUpdates.includes(current));

    if(!updatesAreValid) {
        return res.status(400).send({ error: "Invalid updates" })
    }

    try {
        const product = await Product.findById(product_id);
        updates.forEach(current => product[current] = req.body[current]);
        product.save();

        // "findByIdAdnUpdate" omija productSchema i wykonuje operacje od razu na bazie danych, więcej lepiej użyć tego powyżej
        // const product = await Product.findByIdAndUpdate(product_id, req.body, { new: true, runValidators: true });

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
router.delete('/products/:product_id', async (req, res) => {
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

module.exports = router;