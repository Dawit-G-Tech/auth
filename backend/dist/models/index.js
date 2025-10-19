"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const config_1 = require("../config");
const user_model_1 = require("./user.model");
const role_model_1 = require("./role.model");
const refreshToken_model_1 = require("./refreshToken.model");
const env = process.env.NODE_ENV || 'development';
const dbConfig = config_1.config[env];
exports.sequelize = new sequelize_typescript_1.Sequelize(dbConfig.url, {
    dialect: 'postgres',
    models: [user_model_1.User, role_model_1.Role, refreshToken_model_1.RefreshToken],
    logging: false,
});
exports.db = {
    sequelize: exports.sequelize,
    User: user_model_1.User,
    Role: role_model_1.Role,
    RefreshToken: refreshToken_model_1.RefreshToken,
};
