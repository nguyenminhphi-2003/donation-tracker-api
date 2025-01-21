"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const donationSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },
    activity: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Activity',
        required: [true, 'Activity is required'],
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
    },
});
donationSchema.pre(/^find/, function (next) {
    this
        .populate({
        path: 'user',
        select: 'firstName lastName',
    })
        .populate({
        path: 'activity',
        select: 'name',
    });
    next();
});
const Donation = (0, mongoose_1.model)('Donation', donationSchema);
exports.default = Donation;
