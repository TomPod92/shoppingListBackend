const mongoose = require('mongoose');

const Product = mongoose.model('Product', {
    section: {
        type: String,
        lowercase: true,
        required: true
    },
    name: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    shops: {
        type: Array
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // nazwa modelu do którego chcemy stworzyć referencje
    },
    toBuy: {
        type: Boolean,
        default: false
    },
    bought: {
        type: Boolean,
        default: false
    }
});

module.exports = Product;