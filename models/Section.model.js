const mongoose = require('mongoose');

const Section = mongoose.model('Section', {
    name: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // nazwa modelu do którego chcemy stworzyć referencje
    }
});

module.exports = Section;