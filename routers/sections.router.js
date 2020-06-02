const express = require('express');
const Section = require('../models/Section.model');

const router = new express.Router();

// POST /sections
// Stwórz dział
// private
router.post('/sections', async (req, res) => {
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
router.get('/sections', async (req, res) => {
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
router.delete('/sections/:section_id', async (req, res) => {
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

module.exports = router;