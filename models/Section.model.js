const mongoose = require('mongoose');

const Section = mongoose.model('Section', {
    name: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    }
});

module.exports = Section;