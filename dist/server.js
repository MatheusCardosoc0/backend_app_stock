"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Product_1 = __importDefault(require("./routes/Product"));
const Shelf_1 = __importDefault(require("./routes/Shelf"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    limits: { fileSize: 50 * 2024 * 1024 },
}));
app.use(Product_1.default);
app.use(Shelf_1.default);
app.listen({
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
}, () => console.log('server running in http://localhost:3333'));
