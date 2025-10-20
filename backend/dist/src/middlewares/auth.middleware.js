"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jwt_1 = require("../utils/jwt");
function authMiddleware(req, res, next) {
    try {
        const header = req.headers['authorization'];
        if (!header || !header.startsWith('Bearer ')) {
            return next({ status: 401, code: 'UNAUTHORIZED', message: 'Access denied.' });
        }
        const token = header.substring('Bearer '.length).trim();
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = { id: payload.userId, email: payload.email, role: payload.role };
        return next();
    }
    catch (err) {
        if (err?.name === 'TokenExpiredError') {
            return next({ status: 401, code: 'TOKEN_EXPIRED', message: 'Token has expired.' });
        }
        return next({ status: 401, code: 'INVALID_TOKEN', message: 'Invalid token.' });
    }
}
exports.default = authMiddleware;
