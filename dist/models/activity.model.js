"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const activitySchema = new mongoose_1.Schema({
    creator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator is required'],
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    goalAmount: {
        type: Number,
        required: [true, 'Goal amount is required'],
    },
    totalDonations: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        required: [true, 'Status is required'],
    },
    end_at: {
        type: Date,
        required: [true, 'End date is required'],
    },
});
activitySchema.pre(/^find/, function (next) {
    this.populate({
        path: 'creator',
        select: 'firstName lastName',
    });
    next();
});
const Activity = (0, mongoose_1.model)('Activity', activitySchema);
exports.default = Activity;
