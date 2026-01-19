import express from 'express'
import { AuthRouter } from './routes/user';

import 'dotenv/config'
import { IncomeRouter } from './routes/income';
import { Expenserouter } from './routes/expense';
import { DashboardRoute } from './routes/dashboard';
console.log("DB:", process.env.DATABASE_URL)


const app = express();
const PORT = 3000;
app.use(express.json())



app.use("/api/auth",AuthRouter);
app.use("/api/v1/income",IncomeRouter);
app.use("/api/v1/expense",Expenserouter);
app.use("/dashboard",DashboardRoute);



app.listen(PORT,()=>{
    console.log(`App is running on PORT ${PORT}`);  
})