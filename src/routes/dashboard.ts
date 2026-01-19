import { Router } from "express";
import { AuthMiddlware } from "../Middleware";
import { prisma } from "../lib/db";

const router = Router();

router.get("/alltransfers",AuthMiddlware, async (req, res) => {
    const userid= req.userId;
    console.log(userid);
    

    const allexpense = await prisma.transfers.findMany({
        where:{
            userid:userid,
        },
        select:{
            id:true,
            amount:true,
            note:true,
            created_at:true
        }
    })

    res.json({
        msg: "all expense endpoint",
        allexpense
    })
})

export const DashboardRoute = router;