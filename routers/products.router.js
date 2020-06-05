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
router.get('/products', authMiddleware, async(req, res) => {
    try {
        const products = await Product.find({
            owner: req.user._id
        });
        res.send(products);
        // ------- Inny sposób -------
        // await req.user.populate('products').execPopulate();
        // res.send(req.user.products);
        // ---------------------------
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
//-------------------------------------------------------
// GET /list
// Pobierz wszystkie produkty
// private
router.get('/list', authMiddleware, async(req, res) => {
    try {
        const list = await Product.find({
            owner: req.user._id,
            toBuy: true
        });
        res.send(list);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
//-------------------------------------------------------
// GET /products/:product_id
// Pobierz produkt o danym ID
// private
router.get('/products/:product_id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.product_id,
            owner: req.user._id
        });

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
router.patch('/products/:product_id', authMiddleware, async (req, res) => {
    const product_id = req.params.product_id;
    const allowedUpdates = ['section', 'name', 'shops', 'toBuy', 'bought'];
    const updates = Object.keys(req.body);

    const updatesAreValid = updates.every(current => allowedUpdates.includes(current));

    if(!updatesAreValid) {
        return res.status(400).send({ error: "Invalid updates" })
    }

    try {
        const product = await Product.findOne({
            _id: product_id,
            owner: req.user._id
        });

        if(!product) {
            return res.status(404).send();
        }

        updates.forEach(current => product[current] = req.body[current]);
        await product.save();
        // "findByIdAdnUpdate" omija productSchema i wykonuje operacje od razu na bazie danych, więcej lepiej użyć tego powyżej
        // const product = await Product.findByIdAndUpdate(product_id, req.body, { new: true, runValidators: true });

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
router.delete('/products/:product_id', authMiddleware, async (req, res) => {
    const product_id = req.params.product_id;

    try {
        const product = await Product.findOneAndDelete({
            _id: product_id,
            owner: req.user._id
        });

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
// DELETE /list
// Usuń kupione produkty z listy zakupów
// private
router.delete('/list', authMiddleware, async (req, res) => {
    const mode = req.body.mode;
    try {
        if(mode === 'bought') {
            await Product.updateMany({ owner: req.user._id, bought: true }, { bought: false, toBuy: false });
        } else if (mode === 'all') {
            await Product.updateMany({ owner: req.user._id }, { bought: false, toBuy: false });
        }

        res.send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

module.exports = router;