const express = require('express');
const ListItem = require('../models/ListItem.model');
const authMiddleware = require('../middleware/authMiddleware');

const router = new express.Router();

// POST /list
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
// GET /list
// Pobierz liste zakupów
// private
router.get('/list', authMiddleware, async (req, res) => {
    try {
        const list = await ListItem.find({
            owner: req.user._id
        });

        res.send(list);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
//-------------------------------------------------------
// DELETE /list
// Usuń przedmiot z shopping listy
// private
router.delete('/list/:listItem_id', authMiddleware, async (req, res) => {
    const listItem_id = req.params.listItem_id;
    try {
        const listItem = await ListItem.findOneAndDelete({
            _id: listItem_id,
            owner: req.user._id
        })

        if(!listItem) {
            return res.status(404).send();
        }

        res.send(listItem);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
//-------------------------------------------------------
// PATCH /list/:listItem_id
// Edytuj "bought" przedmiotu z shopping listy
// private
router.patch('/list/:listItem_id', authMiddleware, async (req, res) => {
    const listItem_id = req.params.listItem_id;

    try {
        const listItem = await ListItem.findOne({
            _id: listItem_id,
            owner: req.user._id
        });

        if(!listItem) {
            return res.status(404).send();
        }

        // Zmień "bought" na stan przeciwny i zapisz zmiany w bazie
        listItem.bought = !listItem.bought;
        listItem.save();

        res.send(listItem);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
//-------------------------------------------------------

module.exports = router;