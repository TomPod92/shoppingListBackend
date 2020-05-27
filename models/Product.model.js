const mongoose = require('mongoose');

const Product = mongoose.model('Product', {
    section: {
        type: String
    },
    name: {
        type: String
    },
});

module.exports = Product;