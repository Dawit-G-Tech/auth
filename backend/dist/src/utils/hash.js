"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
function getSaltRounds() {
    const raw = process.env.BCRYPT_SALT_ROUNDS;
    if (!raw)
        return 12;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 12;
}
async function hashPassword(password) {
    const saltRounds = getSaltRounds();
    return await bcrypt_1.default.hash(password, saltRounds);
}
async function comparePassword(password, hash) {
    return await bcrypt_1.default.compare(password, hash);
}
