"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user.routes"));
const activity_routes_1 = __importDefault(require("./activity.routes"));
const donation_routes_1 = __importDefault(require("./donation.routes"));
const router = (0, express_1.Router)();
router.use('/users', user_routes_1.default);
router.use('/activities', activity_routes_1.default);
router.use('/donations', donation_routes_1.default);
exports.default = router;
