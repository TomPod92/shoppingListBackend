const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const Product = require('../models/Product.model'); 

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Niepoprawny email")
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minlength: 7,
        required: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error('Hasło nie powinno zawierać słowa "password"');
            }
        }  
    },
    token: {
        type: String
    },
    // stare --> tablica tokenów
    // tokens: [{ 
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }]
});

// Możemy tego użyć do wyszukania wszystkich produktów danego użtykownika: 
// -----> await User.findById('...').populate("products").execPopulate()
userSchema.virtual('products', { // jako pierwszy argument podajemy nazwę pola które chcemy stworzyć
    ref: "Product", // nazwa modelu do którego chcemy stworzyć referencje
    localField: '_id', // nazwa pola na modelu "User", które jest odzwierciedlone na modelu "Product" w polu "owner"
    foreignField: 'owner' // nazwa pola na ref'ie (tutaj "Product"), które ma odniesienie do modelu "User"
});

//----------------------------------------------------------------------------------
// Funkcja dostępna na instancji (pojedyńczym user'ze) --> user.generateToken()
userSchema.methods.generateToken = async function () {
    const user = this; // this - to będzie dokument z którym właśnie pracujemy
    const user_id = user._id.toString();

    // Stwórz i podpisz token
    const token = jwt.sign({ user_id }, process.env.JTW_SECRET, { expiresIn: '999years' });

    user.token = token
    // Dodaj stworzony token do tablicy "tokens" danego użytkownika
    // user.tokens = user.tokens.concat({ token }); // stare --> tablica tokenów

    // Zapisz zmiany w bazie danych
    await user.save();

    return token
};
//----------------------------------------------------------------------------------
// Za każdym razem jak zwrócimy "user" na frontend (czyli zrobimy "res.send(user)") zostanie wywowała ta funkcja
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    // Usuń "password" z obiektu który jest zwracany na frontend
    delete userObject.password;
    // Usuń "password" i "tokens" z obiektu który zwracany jest na frontend
    // delete userObject.tokens; // stare --> tablica tokenów

    return userObject;
};
//----------------------------------------------------------------------------------
// Funkcja dostępna na modelu --> User.findByCredentials()
userSchema.statics.findByCredentials = async (email, password) => {
    // znajdz użytkownika
    const user = await User.findOne({ email });
    // Sprawdz czy użytkownik o danym adresie email istnieje
    if(!user) {
        throw new Error('Brak użytkownika o takim adresie email');
    }

    // Porównaj podane hasło z za'hash'owanym hasłem z bazy dla użytkownika o danym adresie email
    const isValid = await bcrypt.compare(password, user.password);

    // Jeżeli hasło jest nieporawne
    if(!isValid) {
        throw new Error('Niepoprawne hasło');
    }

    return user;
};
//----------------------------------------------------------------------------------
// ------------- Hashowanie hasła ---------------
// odpali ta fukncję przed każdym zapisaniem użytkownika do bazy
userSchema.pre('save', async function(next) {
    const user = this; // this - to będzie dokument który właśnie zapisujemy

    // za każdym razem jak zmieni się hasło (przy tworzeniu użytkownika i update'owaniu hasła)
    if(user.isModified('password')) {
        const salt = bcrypt.genSaltSync(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

    next();
});

// // Odpali ta funckję za każdym razem jak usuniemy profil użytkownika (inny sposób w user.router)
// userSchema.pre('remove', async function () {
//     const user = this;
//     await Product.deleteMany({
//         owner: user._id
//     });

//     next();
// });
//----------------------------------------------------------------------------------
const User = mongoose.model('User', userSchema);

module.exports = User;