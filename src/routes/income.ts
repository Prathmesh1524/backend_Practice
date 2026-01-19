import { Router } from "express";
import { AuthMiddlware } from "../Middleware";
import {prisma } from "../lib/db"

const router = Router();



declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}



// Add/Sub The Balance from the trasnfer table
router.post("/add",AuthMiddlware,async (req,res)=>{
    const userid = req.userId!;   
    console.log("usr id from middlware",userid);
    
    const  payload = req.body;

    const {amount,type }= payload;
       const amountNumber = Number(amount);

      if (!amountNumber || amountNumber <= 0) {
        return res.status(400).json({ msg: "Invalid amount" });
      }
  
        if(amountNumber<0){
          res.json({
            msg:"Invalid amount "
          }) 
          return
        }
          const balanceChange = amountNumber
        
        

const [transaction,UpdateUser] = await prisma.$transaction([

    prisma.transfers.create({
      data:{
        userid:userid,
        amount:amountNumber,
        note:type
      },
    }),
    prisma.user.update({
      where:{id:userid},
      data:{
        Balance:{
          increment:balanceChange
        }
      }
    })
])
return res.status(200).json({

  msg:"transaction completed Succesfully",
  transaction,
  currentBalance: UpdateUser.Balance,
})
})


// GET the Balance from User Account 
router.get("/get",AuthMiddlware,async (req,res)=>{
  const userid = req.userId;
if(!userid){
  return res.status(401).json({msg:"Invlid UserId for Get"})
}
  console.log("userId",userid);
  
    const balance = await prisma.user.findFirst({
      where:{
        id:userid,
      },
      select:{
        Balance:true,
        name:true,
        id:true,
        email:true,
      }
    })
    
    res.json({
      msg:"user Balanace",
      balance
    })
  
})

export const IncomeRouter = router;