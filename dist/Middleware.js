"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddlware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthMiddlware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "Unauthorized: No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("decoded token:", decoded);
        const userId = decoded.userid;
        if (!userId) {
            return res.status(403).json({ msg: "Invalid Token Payload" });
        }
        req.userId = userId;
        console.log("Middleware userId:", req.userId);
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Invalid token" });
    }
};
exports.AuthMiddlware = AuthMiddlware;
