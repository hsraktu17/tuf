"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/api", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const banner = yield prisma.banner.create({
            data: {
                BannerText: body.BannerText,
                Link: body.Link,
                Timer: body.Timer,
            },
        });
        res.status(201).json({
            BannerText: banner.BannerText,
            Link: banner.Link,
            Timer: banner.Timer,
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "An error occurred while creating the banner." });
    }
}));
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
