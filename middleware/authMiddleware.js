const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const authMiddleware = async (req, res, next) => {
    try {
        // Pobierz token z header'a zapytania i rozkoduj go
        const token = req.header('Authorization').replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JTW_SECRET);

        // Znajdz użytkownika o ID z tokena, który w tablicy "tokens" ma dany token
        const user = await User.findOne({ _id: decoded.user_id, 'tokens.token': token });

        // Jeżeli nie ma takiego użytkownika lub dany użytkownik nie posiada takiego tokena
        if(!user) {
            throw new Error();
        }

        // Dołącz znalezionego użytkownika oraz jego token do zapytani
        // W route'cie będziemy mieli dostęp do "req.user" i "req.token"
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Zaloguj się" });
    }
};

module.exports = authMiddleware;