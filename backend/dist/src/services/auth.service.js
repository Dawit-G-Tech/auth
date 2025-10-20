"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_model_1 = require("../../models/user.model");
const role_model_1 = require("../../models/role.model");
const refreshToken_model_1 = require("../../models/refreshToken.model");
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
function parseRefreshExpiryToDate() {
    const raw = process.env.REFRESH_TOKEN_EXPIRY || '7d';
    const now = Date.now();
    const match = /^([0-9]+)([smhd])$/.exec(raw);
    if (!match)
        return new Date(now + 7 * 24 * 60 * 60 * 1000);
    const value = Number(match[1]);
    const unit = match[2];
    const ms = unit === 's' ? value * 1000 : unit === 'm' ? value * 60 * 1000 : unit === 'h' ? value * 60 * 60 * 1000 : value * 24 * 60 * 60 * 1000;
    return new Date(now + ms);
}
class AuthService {
    static async register(input) {
        const existing = await user_model_1.User.findOne({ where: { email: input.email } });
        if (existing) {
            throw { status: 400, code: 'EMAIL_IN_USE', message: 'Email already in use.' };
        }
        const password = await (0, hash_1.hashPassword)(input.password);
        // default role: user
        const role = await role_model_1.Role.findOne({ where: { name: 'user' } });
        const user = await user_model_1.User.create({ name: input.name, email: input.email, password, roleId: role?.id });
        return { id: String(user.id), name: user.name, email: user.email };
    }
    static async login(input) {
        const user = await user_model_1.User.findOne({ where: { email: input.email }, include: [role_model_1.Role] });
        if (!user) {
            throw { status: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' };
        }
        const ok = await (0, hash_1.comparePassword)(input.password, user.password);
        if (!ok) {
            throw { status: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' };
        }
        const roleName = user.role?.name || 'user';
        const { token: accessToken, expiresIn: accessTokenExpiresIn } = (0, jwt_1.signAccessToken)({ id: String(user.id), email: user.email, role: roleName });
        const { token: refreshToken, expiresIn: refreshTokenExpiresIn } = (0, jwt_1.signRefreshToken)({ id: String(user.id), email: user.email, role: roleName });
        await refreshToken_model_1.RefreshToken.create({ token: refreshToken, expiryDate: parseRefreshExpiryToDate(), userId: user.id });
        return {
            user: { id: String(user.id), name: user.name, email: user.email, role: roleName },
            tokens: { accessToken, accessTokenExpiresIn, refreshToken, refreshTokenExpiresIn },
        };
    }
    static async refresh(refreshToken) {
        // verify signature
        const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        // verify presence in DB and not expired
        const existing = await refreshToken_model_1.RefreshToken.findOne({ where: { token: refreshToken } });
        if (!existing) {
            throw { status: 401, code: 'INVALID_TOKEN', message: 'Invalid token.' };
        }
        if (existing.expiryDate && existing.expiryDate.getTime() < Date.now()) {
            throw { status: 401, code: 'TOKEN_EXPIRED', message: 'Token has expired.' };
        }
        // issue new access token
        const { token: accessToken, expiresIn: accessTokenExpiresIn } = (0, jwt_1.signAccessToken)({ id: payload.userId, email: payload.email, role: payload.role });
        return { accessToken, accessTokenExpiresIn };
    }
    static async logout(refreshToken) {
        await refreshToken_model_1.RefreshToken.destroy({ where: { token: refreshToken } });
        return { success: true };
    }
}
exports.AuthService = AuthService;
