"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("../../models/user.model");
const role_model_1 = require("../../models/role.model");
class UserService {
    static async getMe(userId) {
        const user = await user_model_1.User.findByPk(userId, { include: [role_model_1.Role] });
        if (!user)
            throw { status: 404, code: 'USER_NOT_FOUND', message: 'User not found.' };
        return { id: String(user.id), name: user.name, email: user.email, role: user.role?.name || 'user' };
    }
}
exports.UserService = UserService;
