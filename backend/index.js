import express from "express";
import cors from "cors";
import socket from 'socket.io';

const app = express();
app.use(cors());
app.use(express.json());
const port = 5000;

app.get("/",(req,res)=>{
    res.status(200).send(
        "welcome"
    )
})


app.listen(port,(err)=>{
    if(!err){
        console.log(`server has started on port http://localhost:${port}`);
    }
    else{
        console.log(`server has failed to start`);
    }
})

