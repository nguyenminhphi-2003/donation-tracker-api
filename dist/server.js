"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const port = process.env.PORT || 3000;
const DB = process.env
    .DATABASE_URL.replace('<db_username>', process.env.DATABASE_USERNAME)
    .replace('<db_password>', process.env.DATABASE_PASSWORD);
mongoose_1.default.connect(DB).then(() => console.log('Database connection successful!'));
app_1.default.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
