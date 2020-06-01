const mongoose = require('mongoose');
const db = process.env.MONGO_URI;

const User = require('./models/User.model'); // test
const Product = require('./models/Product.model'); // test

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        console.log('Shopping List MongoDB connected');
//----------------------------------------------------------

        const me = new User({
            name: 'Tomek',
            email: 'podsiadlik.tomek@gmail.com',
            password: '1234567'
            // age: 28
        });

        // const mleko = new Product({
        //     name: 'mleko',
        //     section: 'nabiał'
        // })
        // mleko.save();

        try {
            // me.save();
        } catch (error) {
            console.log(error)
        }
        //----------------------------------------------------------
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;