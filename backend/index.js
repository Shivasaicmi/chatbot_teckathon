import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {authenticationRouter} from "./Routes/Authentication.js";
import { validateUser } from "./middlewares/AuthenticationMiddleware.js";
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());
const port = 5000;
mongoose.connect(process.env.mongodb_connection_url).then((connection)=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
})

//routes
app.use('/authentication',authenticationRouter);


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

