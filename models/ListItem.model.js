const mongoose = require('mongoose');

const ListItem = mongoose.model('ListItem', {
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
    bought: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // nazwa modelu do którego chcemy stworzyć referencje
    }
});

module.exports = ListItem;