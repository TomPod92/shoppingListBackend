const mongoose = require('mongoose');

const Product = mongoose.model('Product', {
    section: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    toBuy: {
        type: Boolean,
        default: false
    },
    bought: {
        type: Boolean,
        default: false
    },
    shops: {
        type: Array
    }
});

module.exports = Product;