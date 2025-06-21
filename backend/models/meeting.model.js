const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    meetingDate: {
        type: Date,
        required: true
    },
    meetingTopic: {
        type: String,
        required: true
    },
    meetingTime: {
        type: String,
        required: true
    },
    meetingPlace: {
        type: String,
        required: true
    },
    uploadedFile: [{
        type: String,
        default: null
    }]
}, {
    timestamps: true
});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
