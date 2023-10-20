import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {authenticationRouter} from "./Routes/Authentication.js";
import { validateUser } from "./middlewares/AuthenticationMiddleware.js";
import { validateToken } from "./jwtUtils/jwtUtils.js";
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());
const port = 5000;
mongoose.connect(process.env.mongodb_connection_url).then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
})

//routes
app.use('/authentication',authenticationRouter);

app.use('/istokenvalid',(req,res)=>{
    console.log("validating the token");
    const authHeader = req.header('authorization');
    let token = null;
    if(authHeader && authHeader.startsWith('Bearer')){
        token = authHeader.split(' ')[1];
    }
    if(!token){
        res.status(403).json({authenticated:false});
        return;
    }
    if(validateToken(token)){
        res.status(200).json({authenticated:true});
    }
    else{
        res.status(401).json({authenticated:false});
    }
});

app.get("/",validateUser,(req,res)=>{
    res.status(200).send(
        "welcome"
    )
});

app.listen(port,(err)=>{
    if(!err){
        console.log(`server has started on port http://localhost:${port}`);
    }
    else{
        console.log(`server has failed to start`);
    }
})

