"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubCallback = exports.githubAuth = exports.googleCallback = exports.googleAuth = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const passport_1 = __importDefault(require("../config/passport"));
const jwt_1 = require("../utils/jwt");
const models_1 = require("../../models");
const { RefreshToken } = models_1.db;
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body || {};
        if (!name || !email || !password) {
            return next({ status: 400, code: 'VALIDATION_ERROR', message: 'Name, email and password are required.' });
        }
        const result = await auth_service_1.AuthService.register({ name, email, password });
        return res.status(201).json({ success: true, data: result });
    }
    catch (err) {
        return next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return next({ status: 400, code: 'VALIDATION_ERROR', message: 'Email and password are required.' });
        }
        const result = await auth_service_1.AuthService.login({ email, password });
        return res.json({ success: true, data: result });
    }
    catch (err) {
        return next(err);
    }
};
exports.login = login;
const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body || {};
        if (!refreshToken) {
            return next({ status: 400, code: 'VALIDATION_ERROR', message: 'refreshToken is required.' });
        }
        const result = await auth_service_1.AuthService.refresh(refreshToken);
        return res.json({ success: true, data: result });
    }
    catch (err) {
        return next(err);
    }
};
exports.refresh = refresh;
const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body || {};
        if (!refreshToken) {
            return next({ status: 400, code: 'VALIDATION_ERROR', message: 'refreshToken is required.' });
        }
        await auth_service_1.AuthService.logout(refreshToken);
        return res.json({ success: true, data: { loggedOut: true } });
    }
    catch (err) {
        return next(err);
    }
};
exports.logout = logout;
// Google OAuth routes
exports.googleAuth = passport_1.default.authenticate('google', {
    scope: ['profile', 'email']
});
exports.googleCallback = [
    passport_1.default.authenticate('google', { failureRedirect: '/sign-in?error=authentication_failed' }),
    async (req, res, next) => {
        try {
            console.log('Google callback - req.user:', req.user);
            console.log('Google callback - req.session:', req.session);
            const user = req.user;
            if (!user) {
                console.log('Google callback - No user found');
                return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/sign-in?error=authentication_failed`);
            }
            // Generate tokens for the user
            const roleName = user.role?.name || 'user';
            const { token: accessToken, expiresIn: accessTokenExpiresIn } = (0, jwt_1.signAccessToken)({
                id: String(user.id),
                email: user.email,
                role: roleName
            });
            const { token: refreshToken, expiresIn: refreshTokenExpiresIn } = (0, jwt_1.signRefreshToken)({
                id: String(user.id),
                email: user.email,
                role: roleName
            });
            // Save refresh token to database
            const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
            await RefreshToken.create({
                token: refreshToken,
                expiryDate: refreshTokenExpiry,
                userId: user.id
            });
            // Redirect to frontend with tokens
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const redirectUrl = `${frontendUrl}/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&user=${encodeURIComponent(JSON.stringify({
                id: String(user.id),
                name: user.name,
                email: user.email,
                role: roleName,
                avatar: user.avatar
            }))}`;
            res.redirect(redirectUrl);
        }
        catch (err) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/sign-in?error=authentication_failed`);
        }
    }
];
// GitHub OAuth routes
exports.githubAuth = passport_1.default.authenticate('github', {
    scope: ['user:email']
});
exports.githubCallback = [
    passport_1.default.authenticate('github', { failureRedirect: '/sign-in?error=authentication_failed' }),
    async (req, res, next) => {
        try {
            console.log('GitHub callback - req.user:', req.user);
            console.log('GitHub callback - req.session:', req.session);
            const user = req.user;
            if (!user) {
                console.log('GitHub callback - No user found');
                return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/sign-in?error=authentication_failed`);
            }
            // Generate tokens for the user
            const roleName = user.role?.name || 'user';
            const { token: accessToken, expiresIn: accessTokenExpiresIn } = (0, jwt_1.signAccessToken)({
                id: String(user.id),
                email: user.email,
                role: roleName
            });
            const { token: refreshToken, expiresIn: refreshTokenExpiresIn } = (0, jwt_1.signRefreshToken)({
                id: String(user.id),
                email: user.email,
                role: roleName
            });
            // Save refresh token to database
            const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
            await RefreshToken.create({
                token: refreshToken,
                expiryDate: refreshTokenExpiry,
                userId: user.id
            });
            // Redirect to frontend with tokens
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const redirectUrl = `${frontendUrl}/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&user=${encodeURIComponent(JSON.stringify({
                id: String(user.id),
                name: user.name,
                email: user.email,
                role: roleName,
                avatar: user.avatar
            }))}`;
            res.redirect(redirectUrl);
        }
        catch (err) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/sign-in?error=authentication_failed`);
        }
    }
];
