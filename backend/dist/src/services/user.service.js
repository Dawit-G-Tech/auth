"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const models_1 = require("../../models");
const { User, Role } = models_1.db;
class UserService {
    static async getMe(userId) {
        const user = await User.findByPk(userId, { include: [Role] });
        if (!user)
            throw { status: 404, code: 'USER_NOT_FOUND', message: 'User not found.' };
        return { id: String(user.id), name: user.name, email: user.email, role: user.role?.name || 'user' };
    }
}
exports.UserService = UserService;
