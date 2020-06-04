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
    shops: {
        type: Array
    }
});

module.exports = Product;