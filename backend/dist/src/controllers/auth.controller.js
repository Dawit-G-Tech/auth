"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body || {};
        if (!name || !email || !password) {
            return next({ status: 400, code: 'VALIDATION_ERROR', message: 'Name, email and password are required.' });
        }
        const user = await auth_service_1.AuthService.register({ name, email, password });
        return res.status(201).json({ success: true, data: { user } });
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
