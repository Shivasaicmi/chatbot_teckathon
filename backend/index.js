import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {authenticationRouter} from "./Routes/Authentication.js";
import { validateUser } from "./middlewares/AuthenticationMiddleware.js";
import { validateToken } from "./jwtUtils/jwtUtils.js";
import { nanoid } from "nanoid";
import { RoomModel } from "./db_schemas/chat.js";
import "web-streams-polyfill/dist/polyfill.es6.js";
import GrievanceModel from "./db_schemas/grievanceModel.js";
dotenv.config();

const app = express();
import {Server } from 'socket.io';
import { chatBot } from "./AIBot/index.js";
const socketServer = new Server(8080,{
    cors:{
        origin:['http://127.0.0.1:3000','http://localhost:3000']
    }
});

const chatIo = socketServer.of('/chat');

chatIo.use((socket,next)=>{
    const token = socket.handshake.auth.token;

    if(!token){
        next(new Error('token is missing'));
        return;
    }

    const userDetails = validateToken(token);
    if(!userDetails){
        next(new Error('invalid token'));
        return;
    }

    socket.userEmail = userDetails.userEmail;
    socket.userName = userDetails.userName;
    socket.userLocation = 'hyderabad'
    next();

})



app.use(cors());
app.use(express.json());
const port = 5000;
mongoose.connect(process.env.mongodb_connection_url).then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
})

chatIo.on('connection',(socket)=>{
    socket.on('sendMessage',async (message,roomId,acknowledge)=>{
        const room =await RoomModel.findOne({roomId:roomId});
        console.log(room);
        if(room.users.length!=1){
            try{
                const response = await chatBot.getChatAgentResponse(message,roomId);
                const new_chatbot_message = {
                    type:'ai',
                    data:{content:response.output},
                }
                chatIo.to(roomId).emit('recieveMessage',new_chatbot_message);   
            }
            catch(error){
                acknowledge(null,new Error("Internal server error unable to send the message"));
            }
        }
        else{
            try{
                const new_chat = {
                    type:'admin',
                    data:{
                        content:message
                    }
                }
                const updated = await RoomModel.findByIdAndUpdate({roomId:roomId},
                    { "$push": { "messages": new_chat } });
                if(updated){
                    chatIo.to(roomId).emit('recieveMessage',new_chat); 
                }
            }
            catch{
                acknowledge(null,new Error("Internal server error unable to send the message"));

            }
        }
        
       
    });

    socket.on('createRoom',async (roomName,acknowledge)=>{
        const chatId = nanoid(15);
        const {userName,userEmail,userLocation} = socket;
        const context = `                            
            \n The current roomId is ${chatId}\n
            \n The current Human userEmail is ${userEmail}\n
            \n The current Human location is ${userLocation} \n
            \n The current grievanceName is ${roomName}_${userEmail.split('@')[0]}
        `
        const new_room = {
            roomId:chatId,
            roomName:roomName,
            userEmail:userEmail,
            users:[userName],
            messages:[
                {
                    type:'ai',
                    information:true,
                    data:{
                        content:context
                    }
                }
            ]
        }

        const room = await RoomModel.create(new_room);
        if(room){
            acknowledge({roomId:room.roomId,roomName:room.roomName},null);
        }
        else{
            acknowledge(null,new Error("unable to create a room"));
        }

    });

    socket.on('getMessagesofRoom',async (roomId,acknowledge)=>{
        try{
            const rooms = await RoomModel.findOne({roomId:roomId,users:{
                "$in":[socket.userName]
            }});
            console.log("found the room with this id");
            const messages = rooms.messages.filter((message)=> !message.information )
            if(rooms){
                socket.join(roomId);
                console.log("Joined the room ",roomId);
                acknowledge(messages,null);
                return;
            }
            else{
                acknowledge([],null);
            }
        }
        catch{
            acknowledge(null,new Error("cannot fetch the messages"));
        }
        
    })

    socket.on('joinRoom',async (roomId,acknowledge)=>{
        const resultRoom = await RoomModel.findOne({roomId:roomId});
        if(resultRoom){
           const updatedRoom = await RoomModel.findByIdAndUpdate(resultRoom._id,{
            "$push":{"users":socket.userName}
           });
           if(updatedRoom){
            acknowledge({
                roomId:updatedRoom.roomId,
                roomName:updatedRoom.roomName
            },null);
           }
           else{
            acknowledge(null,new Error("unable to join the Room"));
           }
        }
    });


    socket.on('getRoomsByUserName',async (acknowledge)=>{
        try{
            const result = await RoomModel.find({users:{ "$in":[socket.userName] }});
            if(result){
                const rooms = result.map((room)=>{
                    return {
                        roomId:room.roomId,
                        roomName:room.roomName
                    }
                });
                acknowledge(rooms,null);
            }
            else{
                acknowledge([],null);
            }
        }
        catch{
            acknowledge(null,new Error("cannot fetch the previous chats"));
        }
        
    })


});


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
    if(!!validateToken(token)){
        res.status(200).json({authenticated:true});
    }
    else{
        res.status(401).json({authenticated:false});
    }
});

app.get("/isAdmin",validateUser,(req,res)=>{
    console.log("validating the role");
    const {role} = req;
    if(role==='admin'){
        res.status(200).json({isAdmin:true});
    }
    else{
        res.status(200).json({isAdmin:false});
    }
});

app.get("/myGrievances",validateUser,async (req,res)=>{
    const {userEmail,role} = req;
    if(role==='admin'){
       const data = await GrievanceModel.find({email:userEmail,status:'active'});
       console.log("the grievances are ");
       console.log(data);
       res.status(200).json(data);
    }
    else{

        res.status(400).json("Not permitted");
    }
})

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

