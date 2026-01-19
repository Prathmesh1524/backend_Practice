"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expenserouter = void 0;
const express_1 = require("express");
const Middleware_1 = require("../Middleware");
const db_1 = require("../lib/db");
const router = (0, express_1.Router)();
router.post("/spend", Middleware_1.AuthMiddlware, async (req, res) => {
    const userid = req.userId;
    console.log(userid);
    if (!userid) {
        return res.json("invlaid ID");
    }
    const payload = req.body;
    const { spentamount, type, } = payload;
    const amount = Number(spentamount);
    if (!amount || amount <= 0) {
        return res.status(400).json({ msg: "Invalid amount" });
    }
    try {
        const users = await db_1.prisma.user.findUnique({
            where: { id: userid },
            select: {
                Balance: true
            }
        });
        if (!users) {
            return res.status(400).json({ msg: "User not found.." });
        }
        if (users.Balance < amount) {
            return res.status(400).json({ msg: "Insufficient balance" });
        }
    }
    catch (err) {
        console.log(err);
        res.json({ msg: "Error which Fetching Balance of user" });
    }
    ;
    try {
        const [transaction, UpdateUser] = await db_1.prisma.$transaction([
            db_1.prisma.transfers.create({
                data: {
                    userid: userid,
                    amount: amount,
                    note: type
                },
            }),
            db_1.prisma.user.update({
                where: {
                    id: userid
                },
                data: {
                    Balance: {
                        decrement: amount
                    }
                }
            })
        ]);
        res.status(200).json({
            msg: "Debited Successfullyy.....",
            transaction,
            balace: UpdateUser.Balance
        });
    }
    catch (err) {
        console.log(err);
        res.json({
            msg: "we are facing interneal error"
        });
    }
});
// Here all the expenses are catched
exports.Expenserouter = router;
