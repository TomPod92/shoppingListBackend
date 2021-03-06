const express = require('express');
const bcrypt = require('bcryptjs');

const authMiddleware = require('../middleware/authMiddleware')
const User = require('../models/User.model');
const Product = require('../models/Product.model');

const router = new express.Router();

//-------------------------------------------------------
// POST /users
// Stwórz użytkownika
// public
router.post('/users', async (req, res) => {
    // Stwórz nowego użytkownika
    const user = new User(req.body);

    try {
        // Zapisz go w bazie danych
        await user.save();

        // Stwórz jwt token i zapisz go w bazie
        const token = await user.generateToken();

        // res.status(201).send({ user, token }); // stare --> tablica tokenów
        res.status(201).send({ user});
    } catch (error) {
        if(error.code === 11000) {
            res.status(400).send("Ten adres email jest już zajęty")
        }
        res.status(400).send("Błąd serwera, spróbuj później");
    }
});
//-------------------------------------------------------
// GET /users/login
// Zaloguj użytkownika
// public
router.post('/users/login', async (req, res) => {
    try {
        // Sprawdz czy użytkownik o danym email'u istnieje i zostało podane dobre hasło
        const user = await User.findByCredentials(req.body.email, req.body.password); // moja własna metoda

        // Stworz jwt token i zapisz go w bazie
        const token = await user.generateToken();

        res.send({ user });
        // res.send({ user, token });  // stare --> tablica tokenów
    } catch (error) {
        console.error(error);
        res.status(400).send("Zły login i/lub hasło");
    }
});
//-------------------------------------------------------
// GET /users/logout
// Wyloguj użytkownika
// private
router.post('/users/logout', authMiddleware, async (req, res) => {
    try {
        // Usuń token z "user"
        req.user.token = '';
        
        // Usuń dany token z tablicy tokenów zalogowanego użytkownika
        // req.user.tokens = req.user.tokens.filter(current =>  current.token !== req.token); // stare --> tablica tokenów

        // Zapisz zmiany w bazie danych
        await req.user.save();

        res.send();
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
//-------------------------------------------------------
// GET /users/me
// Pobierz profil zalogowanego użytkownika
// private
router.get('/users/me', authMiddleware, async (req, res) => {
    res.send(req.user)
});
//-------------------------------------------------------
// PATCH /users/me
// Edytuj użytkownika
// private
router.patch('/users/me', authMiddleware, async (req, res) => {
    // const user_id = req.params.user_id;
    let updates;

    if(req.body.oldPassword) {
        const isValid = await bcrypt.compare(req.body.oldPassword, req.user.password);
        
        if(!isValid) {
            return res.status(400).send("Niepoprawny adres email")
        }

        updates = ["password"];
    } else {
        updates = Object.keys(req.body);

    }

    const allowedUpdates = ['email', 'password'];
    const updatesAreValid = updates.every(current => allowedUpdates.includes(current));

    if(!updatesAreValid) {
        return res.status(400).send({ error: "Invalid updates" })
    }

    try {
        updates.forEach(current => req.user[current] = req.body[current]);
        await req.user.save();

        // "findByIdAdnUpdate" omija userSchema i wykonuje operacje od razu na bazie danych, więcej lepiej użyć tego powyżej
        // const user = await User.findByIdAndUpdate(user_id, req.body, { new: true, runValidators: true }); 
        // "new" zwróci zedytowanego użytkownika zamiast tego z przed edycji
        // "runValifators" sprawi że sprawdzimy to co chcemy zmienić/ustawić

        res.send(req.user);
    } catch (error) {
        console.error(error);
        if(error.code === 11000) {
            res.status(400).send("Ten adres email jest już zajęty")
        }
        res.status(400).send(error);
    }
});
//-------------------------------------------------------
// DELETE /users/me
// Usuń użytkownika o danym ID
// private
router.delete('/users/me', authMiddleware, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id); // Inny sposób
        await req.user.remove(); // usuń profil zalogowanego użytkownika
        await Product.deleteMany({ owner: req.user._id }); // usuń produkty zalogowanego użytkownika (inny sposób w user.model)

        res.send(req.user);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});


// NIEUŻYWANE W APLIKACJI
//-------------------------------------------------------
// GET /users
// Pobierz wszystkich użytkowników
// private
// router.get('/users', authMiddleware, async (req, res) => {
//     try {
//         const users = await User.find({});

//         res.send(users)
//     } catch (error) {
//         console.error(error);
//         res.status(500).send(error);
//     }
// });

//-------------------------------------------------------
// GET /users/:user_id
// Pobierz użytkownika o danym ID
// private
// router.get('/users/:user_id', async (req, res) => {
//     const user_id = req.params.user_id;

//     try {
//         const user = await User.findById(user_id);

//         if(!user) {
//             return res.status(404).send();
//         }

//         res.send(user)
//     } catch (error) {
//         console.error(error);
//         res.status(500).send(error);
//     }
// });

module.exports = router;