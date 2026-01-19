"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const db_1 = require("../lib/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("../lib/types");
const types_2 = require("../lib/types");
const router = (0, express_1.Router)();
router.get("/sa", (req, res) => {
    res.json({ msg: "Route at sa" });
});
// SignUP endPoint
router.post("/signup", async (req, res) => {
    try {
        const body = await req.body;
        const Paresedbody = await types_2.SingupInputs.safeParse(body);
        if (!Paresedbody.success) {
            res.status(401).json({ msg: "Invalid Signup Inputs" });
        }
        const { email, name } = body;
        const userExist = await db_1.prisma.user.findFirst({
            where: {
                email: body.email,
            }
        });
        if (userExist) {
            res.status(201).json({ msg: "User Alreaady exist" });
            return;
        }
        const hashPassword = await bcrypt_1.default.hash(body.password, 10);
        const newuser = await db_1.prisma.user.create({
            data: {
                email,
                name,
                //@ts-ignore
                password: hashPassword,
                created_at: body.created_at,
            }
        });
        // console.log(newuser);
        res.status(200).json({
            newuser,
            msg: "User Created SuccessFully.."
        });
    }
    catch (err) {
        console.log("Error", err);
        res.status(500).json({
            msg: "Internal Server error"
        });
    }
});
router.post("/signin", async (req, res) => {
    const body = await req.body;
    const Paresedbody = await types_1.SinginInputTypes.safeParse(body);
    if (!Paresedbody.success) {
        res.status(401).json({ msg: "Invalid Signup Inputs" });
        return;
    }
    console.log(Paresedbody);
    const user = await db_1.prisma.user.findFirst({
        where: {
            email: Paresedbody.data.email,
        }
    });
    //@ts-ignore
    const decodedpass = bcrypt_1.default.compare(Paresedbody.data.email, user?.password);
    if (!decodedpass || !user) {
        return res.status(400).json({ msg: "Invalid UserName or Password" });
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({
        token,
        user,
        msg: "Login Successfull"
    });
});
exports.AuthRouter = router;
