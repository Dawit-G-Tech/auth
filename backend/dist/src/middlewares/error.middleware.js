"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const logger_1 = __importDefault(require("../utils/logger"));
function errorMiddleware(err, req, res, next) {
    const status = err.status || 500;
    const code = err.code || (status === 500 ? 'INTERNAL_ERROR' : 'ERROR');
    const message = err.message || 'Unexpected error.';
    if (status >= 500) {
        logger_1.default.error('Unhandled error', { code, err });
    }
    else {
        logger_1.default.warn('Handled error', { code, err });
    }
    res.status(status).json({
        success: false,
        error: {
            code,
            message,
            details: err.details,
        },
    });
}
exports.default = errorMiddleware;
