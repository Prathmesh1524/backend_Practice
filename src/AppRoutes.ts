import express from 'express'
import { AuthRouter } from './routes/user';

import 'dotenv/config'
console.log("DB:", process.env.DATABASE_URL)


const app = express();
const PORT = 3000;
app.use(express.json())



app.use("/api/auth",AuthRouter)


app.listen(PORT,()=>{
    console.log(`App is running on PORT ${PORT}`);  
})