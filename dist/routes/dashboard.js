"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoute = void 0;
const express_1 = require("express");
const Middleware_1 = require("../Middleware");
const db_1 = require("../lib/db");
const router = (0, express_1.Router)();
router.get("/alltransfers", Middleware_1.AuthMiddlware, async (req, res) => {
    const userid = req.userId;
    console.log(userid);
    const allexpense = await db_1.prisma.transfers.findMany({
        where: {
            userid: userid,
        },
        select: {
            id: true,
            amount: true,
            note: true,
            created_at: true
        }
    });
    res.json({
        msg: "all expense endpoint",
        allexpense
    });
});
exports.DashboardRoute = router;
