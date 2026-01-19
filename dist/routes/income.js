"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeRouter = void 0;
const express_1 = require("express");
const Middleware_1 = require("../Middleware");
const db_1 = require("../lib/db");
const router = (0, express_1.Router)();
// Add/Sub The Balance from the trasnfer table
router.post("/add", Middleware_1.AuthMiddlware, async (req, res) => {
    const userid = req.userId;
    console.log("usr id from middlware", userid);
    const payload = req.body;
    const { amount, type } = payload;
    const amountNumber = Number(amount);
    if (!amountNumber || amountNumber <= 0) {
        return res.status(400).json({ msg: "Invalid amount" });
    }
    if (amountNumber < 0) {
        res.json({
            msg: "Invalid amount "
        });
        return;
    }
    const balanceChange = amountNumber;
    const [transaction, UpdateUser] = await db_1.prisma.$transaction([
        db_1.prisma.transfers.create({
            data: {
                userid: userid,
                amount: amountNumber,
                note: type
            },
        }),
        db_1.prisma.user.update({
            where: { id: userid },
            data: {
                Balance: {
                    increment: balanceChange
                }
            }
        })
    ]);
    return res.status(200).json({
        msg: "transaction completed Succesfully",
        transaction,
        currentBalance: UpdateUser.Balance,
    });
});
// GET the Balance from User Account 
router.get("/get", Middleware_1.AuthMiddlware, async (req, res) => {
    const userid = req.userId;
    if (!userid) {
        return res.status(401).json({ msg: "Invlid UserId for Get" });
    }
    console.log("userId", userid);
    const balance = await db_1.prisma.user.findFirst({
        where: {
            id: userid,
        },
        select: {
            Balance: true,
            name: true,
            id: true,
            email: true,
        }
    });
    res.json({
        msg: "user Balanace",
        balance
    });
});
exports.IncomeRouter = router;
