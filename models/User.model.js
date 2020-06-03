const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
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
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error("Age nie moze byc ujemne")
            }
        }
    }
});

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

const User = mongoose.model('User', userSchema);

module.exports = User;