import express from "express";
const authenticationRouter = express.Router();
import { UserModel } from "../db_schemas/user.js";
import { generateToken } from "../jwtUtils/jwtUtils.js";

async function findUser(userEmail){
    const data = await UserModel.findOne({userEmail:userEmail});
    if(!data){
        return null;
    }
    return data;
}


authenticationRouter.post("/login",async (req,res)=>{
    const {userEmail,userName,password} = req.body;
    try{
       const user = await findUser(userEmail);
       if(!user){
        res.status(404).json({message:"user not found"});
        return;
       }
       if(user.password!==password){
            res.status(403).json({message:"user credentials are wrong"});
            return;
       }
       const token = generateToken(userEmail,userName);
       res.status(200).json({token:token});
    }
    catch{
        res.status(500).json({message:"unable to authorize"});
    }
});

authenticationRouter.post("/register",async (req,res)=>{
    const {userEmail,userName,password} = req.body;
    const user = await findUser(userEmail);
    if(user){
        res.status(403).json({message:"user already exists"});
        return;
    }
    if(!(userEmail&&userName&&password&&userEmail.endsWith("@comakeit.com"))){
        res.status(403).json({message:"Invalid user credentials"});
        return;
    }
    try{
        const user = await UserModel.create({userName:userName,userEmail:userEmail,password:password});
        if(!user){
            throw new Error("cannot create the user");
        }
        const token = generateToken(userEmail,userName);
        res.status(200).json({token:token});
    }
    catch{
        res.status(500).json({message:"user cannot be created"});
    }
   
});

export {authenticationRouter};