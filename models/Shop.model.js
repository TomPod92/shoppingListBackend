const mongoose = require('mongoose');

const Shop = mongoose.model('Shop', {
    name: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // nazwa modelu do którego chcemy stworzyć referencje
    }
});

module.exports = Shop;