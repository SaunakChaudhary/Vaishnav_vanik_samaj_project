const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true,
        trim: true
    },
    eventPhoto: {
        type: String,
        required: true
    },
    images1: [{
        type: String
    }],
    images2: [{
        type: String
    }],
    description: {
        type: String,
        required: true,
        trim: true
    },
    lastRegistrationDate: {
        type: Date,
        required: true
    },
    eventDateTime: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    feesPerPerson: {
        type: Number,
        required: true,
        min: 0
    },
    feesForExtraGuest: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);