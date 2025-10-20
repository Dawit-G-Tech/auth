"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const apiRouter = express_1.default.Router();
apiRouter.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});
apiRouter.use('/api/auth', auth_routes_1.default);
apiRouter.use('/api/users', user_routes_1.default);
app.use('/en', apiRouter);
app.use('/am', apiRouter);
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
