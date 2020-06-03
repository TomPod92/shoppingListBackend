const express = require('express');
const User = require('../models/User.model');

const router = new express.Router();

//-------------------------------------------------------
// POST /users
// Stwórz użytkownika
// public
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});
//-------------------------------------------------------
// GET /users
// Zaloguj użytkownika
// private
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password); // moja własna metoda

        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});
//-------------------------------------------------------
// GET /users
// Pobierz wszystkich użytkowników
// private
router.get('/users', async (req, res) => {
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
router.get('/users/:user_id', async (req, res) => {
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
router.patch('/users/:user_id', async (req, res) => {
    const user_id = req.params.user_id;

    const allowedUpdates = ['name', 'email', 'password'];
    const updates = Object.keys(req.body);
    const updatesAreValid = updates.every(current => allowedUpdates.includes(current));

    if(!updatesAreValid) {
        return res.status(400).send({ error: "Invalid updates" })
    }

    try {
        const user = await User.findById(user_id);
        updates.forEach(current => user[current] = req.body[current]);
        await user.save();

        // "findByIdAdnUpdate" omija userSchema i wykonuje operacje od razu na bazie danych, więcej lepiej użyć tego powyżej

        // const user = await User.findByIdAndUpdate(user_id, req.body, { new: true, runValidators: true }); 
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
router.delete('/users/:user_id', async (req, res) => {
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

module.exports = router;