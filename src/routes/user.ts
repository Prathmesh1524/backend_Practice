import { Router } from "express";
import {prisma} from "../lib/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { SinginInputTypes } from "../lib/types";
import { SingupInputs } from "../lib/types";

const router = Router();


router.get("/sa",(req,res)=>{
    res.json({msg:"Route at sa"})
})

// SignUP endPoint
router.post("/signup",async (req,res)=>{
    try{
        const body = await req.body;
        const Paresedbody = await SingupInputs.safeParse(body);

        if(!Paresedbody.success){
            res.status(401).json({msg:"Invalid Signup Inputs"})
        }
        
        const {email,name}= body;
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
                email,
                name,
                //@ts-ignore
                password:hashPassword,
                created_at: body.created_at,
            }    
        }) 
        // console.log(newuser);
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
    const Paresedbody= await SinginInputTypes.safeParse(body);

    if(!Paresedbody.success){
        res.status(401).json({msg:"Invalid Signup Inputs"});
        return;
    }
    console.log(Paresedbody);

    const user = await prisma.user.findFirst({
        where:{
            email:Paresedbody.data.email,
        }
    })
       
    //@ts-ignore
    const decodedpass=  bcrypt.compare(Paresedbody.data.email, user?.password);
    if(!decodedpass || !user){
        return res.status(400).json({msg:"Invalid UserName or Password"});
    }


    const token = jwt.sign({userId:user.id}, process.env.JWT_SECRET!)

    res.json({
        token,
        user,
        msg:"Login Successfull"
    })

})



export const AuthRouter = router;