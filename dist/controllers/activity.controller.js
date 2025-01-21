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
exports.deleteActivity = exports.updateActivity = exports.createActivity = exports.getActivityById = exports.getAllActivities = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const activity_model_1 = __importDefault(require("../models/activity.model"));
const catchAsync_1 = __importDefault(require("../utilities/catchAsync"));
const appError_1 = __importDefault(require("../utilities/appError"));
const checkUserExists = (user_id, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(user_id);
    if (!user) {
        return false;
    }
    return true;
});
exports.getAllActivities = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activities = yield activity_model_1.default.find();
    res.status(200).json({
        status: 'success',
        results: activities.length,
        data: {
            activities,
        },
    });
}));
exports.getActivityById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const activity = yield activity_model_1.default.findById(req.params.id);
    if (!activity) {
        return next(new appError_1.default('No activity found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            activity,
        },
    });
}));
exports.createActivity = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userCheck = yield checkUserExists(req.body.creator, next);
    if (!userCheck) {
        return next(new appError_1.default('User not found', 404));
    }
    const activity = yield activity_model_1.default.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            activity,
        },
    });
}));
exports.updateActivity = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userCheck = yield checkUserExists(req.body.creator, next);
    if (!userCheck) {
        return next(new appError_1.default('User not found', 404));
    }
    const activity = yield activity_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!activity) {
        return next(new appError_1.default('No activity found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            activity,
        },
    });
}));
exports.deleteActivity = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const activity = yield activity_model_1.default.findByIdAndDelete(req.params.id);
    if (!activity) {
        return next(new appError_1.default('No activity found with that ID', 404));
    }
    res.status(204).send();
}));
