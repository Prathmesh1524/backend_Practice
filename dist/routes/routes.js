"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expenserouter = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/expenses", (req, res) => {
    res.json({
        msg: "all expense endpoint"
    });
});
exports.Expenserouter = router;
