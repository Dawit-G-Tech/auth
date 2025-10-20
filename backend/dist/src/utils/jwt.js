"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
function getAccessConfig() {
    const secret = requireEnv('JWT_ACCESS_SECRET');
    const expiresRaw = process.env.ACCESS_TOKEN_EXPIRY || '15m';
    const expiresIn = expiresRaw;
    return { secret, expiresIn };
}
function getRefreshConfig() {
    const secret = requireEnv('JWT_REFRESH_SECRET');
    const expiresRaw = process.env.REFRESH_TOKEN_EXPIRY || '7d';
    const expiresIn = expiresRaw;
    return { secret, expiresIn };
}
function baseSignOptions(expiresIn) {
    return {
        algorithm: 'HS256',
        expiresIn,
    };
}
function signAccessToken(user) {
    const { secret, expiresIn } = getAccessConfig();
    const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };
    const token = jsonwebtoken_1.default.sign(payload, secret, { ...baseSignOptions(expiresIn), subject: user.id });
    return { token, expiresIn: String(expiresIn) };
}
function signRefreshToken(user) {
    const { secret, expiresIn } = getRefreshConfig();
    const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };
    const token = jsonwebtoken_1.default.sign(payload, secret, { ...baseSignOptions(expiresIn), subject: user.id });
    return { token, expiresIn: String(expiresIn) };
}
function verifyAccessToken(token) {
    const { secret } = getAccessConfig();
    const decoded = jsonwebtoken_1.default.verify(token, secret, { algorithms: ['HS256'] });
    return decoded;
}
function verifyRefreshToken(token) {
    const { secret } = getRefreshConfig();
    const decoded = jsonwebtoken_1.default.verify(token, secret, { algorithms: ['HS256'] });
    return decoded;
}
