import { Router } from "express";
import {prisma} from "../lib/db"
import bcrypt from "bcrypt"

const router = Router();


router.get("/sa",(req,res)=>{
    res.json({msg:"Route at sa"})
})

// SignUP endPoint
router.post("/signup",async (req,res)=>{
    try{

        const body = await req.body;
        // console.log(body);
        
        // zod verification 
        
        
        const userExist = await prisma.user.findFirst({
            where:{
                email:body.email,
            }
        })
        
        if(userExist){
            res.status(201).json({msg: "User Alreaady exist"})
            return;
        }

        const hashPassword =await  bcrypt.hash(body.password,10);
        
        const newuser = await prisma.user.create({
            data:{
                name:body.name,
                email:body.email,
                //@ts-ignore
                password:hashPassword,
                created_at: body.created_at,
                // updated_at:body.updated_at
            }
            
        }) 
        console.log(newuser);
        
        res.status(200).json({
            newuser,
            msg:"User Created SuccessFully.."})
    }catch(err){
        console.log("Error",err);
            res.status(500).json({
                msg:"Internal Server error"
            })
    }

    


})

router.post("/signin",async (req,res)=>{
    const body = await req.body;
    console.log(body);

    const user = await prisma.user.findFirst({
        where:{
            email:body.email,
            // name:body.name
        }
    })
    //@ts-ignore
    const decodedpass= await bcrypt.compare(body.password, user?.password);
    if(!decodedpass){
        return res.status(400).json({msg:"INvalid UserName or Password"});
    }



    res.json({
        user,
        msg:"Login Successfull"
    })

})



export const AuthRouter = router;