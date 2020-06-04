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
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // nazwa modelu do którego chcemy stworzyć referencje
    }
});

module.exports = Product;