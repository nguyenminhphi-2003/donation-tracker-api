"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDonationById = exports.createDonation = exports.getAllDonations = void 0;
const donation_model_1 = __importDefault(require("../models/donation.model"));
const activity_model_1 = __importDefault(require("../models/activity.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const catchAsync_1 = __importDefault(require("../utilities/catchAsync"));
const appError_1 = __importDefault(require("../utilities/appError"));
const mongoose_1 = __importDefault(require("mongoose"));
// Check if the activity and user exist
const checkRequest = (activityId, userId, next) => __awaiter(void 0, void 0, void 0, function* () {
    const activity = yield activity_model_1.default.findById(activityId);
    if (!activity) {
        return next(new appError_1.default('No activity found with that ID', 404));
    }
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        return next(new appError_1.default('No user found with that ID', 404));
    }
    return { activity, user };
});
exports.getAllDonations = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const donations = yield donation_model_1.default.find();
    res.status(200).json({
        status: 'success',
        results: donations.length,
        data: {
            donations,
        },
    });
}));
exports.createDonation = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { activity, user, amount } = req.body;
    const { activity: checkedActivity } = yield checkRequest(activity, user, next);
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const donation = yield donation_model_1.default.create([Object.assign({}, req.body)], { session });
        checkedActivity.totalDonations += amount;
        yield checkedActivity.save({ session });
        yield session.commitTransaction();
        session.endSession();
        res.status(201).json({
            status: 'success',
            data: {
                donation,
            },
        });
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        return next(new appError_1.default('Transaction failed', 500));
    }
}));
exports.getDonationById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const donation = yield donation_model_1.default.findById(req.params.id);
    if (!donation) {
        return next(new appError_1.default('No donation found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            donation,
        },
    });
}));
