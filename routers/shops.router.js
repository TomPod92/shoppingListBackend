const express = require('express');
const Shop = require('../models/Shop.model');
const authMiddleware = require('../middleware/authMiddleware');

const router = new express.Router();

// POST /shops
// Stwórz sklep
// private
router.post('/shops', authMiddleware, async (req, res) => {
    const shop = new Shop({
        ...req.body,
        owner: req.user._id
    });

    try {
        await shop.save();
        res.status(201).send(shop);
    } catch (error) {
        console.error(error);
        if(error.code === 11000) {
            res.status(400).send("Ten sklep został już dodany")
        }
        res.status(400).send(error)
    }
});
//-------------------------------------------------------
// GET /shops
// Pobierz wszystkie sklepy
// private
router.get('/shops', authMiddleware, async (req, res) => {
    try {
        const shops = await Shop.find({
            owner: req.user._id
        });
        res.send(shops);
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }
});
//-------------------------------------------------------
// DELETE /shops/:shop_id
// Usuń sklep o danym ID
// private
router.delete('/shops/:shop_id', authMiddleware, async (req, res) => {
    const shop_id = req.params.shop_id;

    try {
        const shop = await Shop.findOneAndDelete({
            _id: shop_id,
            owner: req.user._id
        });

        if(!shop) {
            return res.status(404).send();
        }

        res.send(shop);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

module.exports = router;