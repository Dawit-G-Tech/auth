"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return next({ status: 401, code: 'UNAUTHORIZED', message: 'Access denied.' });
        }
        if (roles.length > 0 && !roles.includes(req.user.role)) {
            return next({ status: 403, code: 'FORBIDDEN', message: 'Access denied.' });
        }
        return next();
    };
}
exports.default = authorize;
