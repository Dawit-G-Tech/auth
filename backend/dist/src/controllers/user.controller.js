"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = void 0;
const user_service_1 = require("../services/user.service");
const getMe = async (req, res, next) => {
    try {
        if (!req.user) {
            return next({ status: 401, code: 'UNAUTHORIZED', message: 'Access denied.' });
        }
        const user = await user_service_1.UserService.getMe(req.user.id);
        return res.json({ success: true, data: { user } });
    }
    catch (err) {
        return next(err);
    }
};
exports.getMe = getMe;
