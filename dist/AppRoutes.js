"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("./routes/user");
require("dotenv/config");
const income_1 = require("./routes/income");
const expense_1 = require("./routes/expense");
const dashboard_1 = require("./routes/dashboard");
console.log("DB:", process.env.DATABASE_URL);
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use("/api/auth", user_1.AuthRouter);
app.use("/api/v1/income", income_1.IncomeRouter);
app.use("/api/v1/expense", expense_1.Expenserouter);
app.use("/dashboard", dashboard_1.DashboardRoute);
app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
});
