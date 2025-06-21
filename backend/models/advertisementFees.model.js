const mongoose = require('mongoose');

const advertisementFeesSchema = new mongoose.Schema({
    advetiseLocation: {
        type: String,
        required: true,
        enum: ['top', 'bottom', 'middle']
    },
    duration: {
        type: Number,
        required: true, 
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    pricePerDay: {
        type: Number,
        required: true,
        min: 0
    },
    transactionId:{
        type:String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the 'updatedAt' field before saving
advertisementFeesSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('AdvertisementFees', advertisementFeesSchema);