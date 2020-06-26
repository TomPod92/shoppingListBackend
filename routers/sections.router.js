const express = require('express');
const Section = require('../models/Section.model');
const Product = require('../models/Product.model');
const authMiddleware = require('../middleware/authMiddleware');

const router = new express.Router();

// POST /sections
// Stwórz dział
// private
router.post('/sections', authMiddleware, async (req, res) => {
    const section = new Section({
        ...req.body,
        owner: req.user._id
    });

    try {
        await section.save();
        res.status(201).send(section);
    } catch (error) {
        console.error(error);
        if(error.code === 11000) {
            res.status(400).send("Ten dział został już dodany")
        }
        res.status(400).send(error)
    }
});
//-------------------------------------------------------
// GET /sections
// Pobierz wszystkie działy
// private
router.get('/sections', authMiddleware, async (req, res) => {
    try {
        const sections = await Section.find({
            owner: req.user._id
        });
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
router.delete('/sections/:section_id', authMiddleware, async (req, res) => {
    const section_id = req.params.section_id;

    try {
        const section = await Section.findOneAndDelete({
            _id: section_id,
            owner: req.user._id
        });

        await Product.deleteMany({ section: section.name });

        if(!section) {
            return res.status(404).send();
        }

        res.send(section);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

module.exports = router;