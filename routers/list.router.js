const express = require('express');
const ListItem = require('../models/ListItem.model');
const authMiddleware = require('../middleware/authMiddleware');

const router = new express.Router();

// POST /products
// Dodaj przedmiot do shopping listy
// private
router.post('/list', authMiddleware, async (req, res) => {
    const listItem = new ListItem({
        ...req.body,
        owner: req.user._id
    });

    try {
        await listItem.save();
        res.status(201).send(listItem);    
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});
//-------------------------------------------------------

module.exports = router;