"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_1 = __importDefault(require("./app"));
const models_1 = require("../models");
const PORT = process.env.PORT || 4000;
// Initialize database connection
const startServer = async () => {
    try {
        await models_1.sequelize.authenticate();
        console.log('Database connection established successfully.');
        // Sync database (create tables if they don't exist)
        await models_1.sequelize.sync({ alter: true });
        console.log('Database synchronized.');
        app_1.default.listen(PORT, () => {
            console.log(`Backend running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};
startServer();
