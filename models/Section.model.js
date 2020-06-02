const mongoose = require('mongoose');

const Section = mongoose.model('Section', {
    name: {
        type: String,
        required: true
    }
});

module.exports = Section;